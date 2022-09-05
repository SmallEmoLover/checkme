const express = require('express');
const cors = require('cors');
const utils = require('./core/utils');
const Database = require('./core/database');
const { spawn } = require('child_process');
const formidable = require('formidable');
const fs = require('node:fs');

const port = 9999;

const database = new Database('mongodb://127.0.0.1:27017/?retryWrites=true&w=majority');

const app = express();
app.use(express.json());
app.use(cors());

/**
 * GET-endpoint to check server availability
 * @name /ping
 * @function
 * @returns sends pong to sender
 */
app.get('/ping', (_, response) => {
    response.send('pong');
});

/**
 * POST-endpoint to start to check task with task_id and sent arguments
 * @name /check/:task_id
 * @function
 * @returns sends created check id to sender
 */
app.post('/check/:task_id', utils.runRouteAsync(async (request, response) => {
    const task_id = request.params.task_id;
    const form = formidable();

    let check_id = await database.create_task_check(task_id, arguments);
    response.send(JSON.stringify({checkId: check_id}));

    form.parse(request, async (_, fields, files) => {
        const arguments = [];
        let index = 0;
        while (true) {
            if (fields[`${index}`]) {
                arguments.push(fields[`${index}`])
                index++;
                continue;
            };
            if (files[`${index}`]) {
                arguments.push(files[`${index}`].filepath)
                index++;
                continue;
            }
            break;
        }
        solve_task(check_id, task_id, arguments);
    })
}));

/**
 * GET-endpoint to get check with check_id results
 * @name /results/:check_id
 * @function
 * @returns sends check results
 */
app.get('/results/:check_id', utils.runRouteAsync(async (request, response) => {
    const results = await database.get_check_results(request.params.check_id);
    response.send(JSON.stringify(results));
}));

/**
 * GET-endpoint to get all available tasks
 * @name /tasks
 * @function
 * @returns sends list with tasks
 */
app.get('/tasks', utils.runRouteAsync(async (_, response) => {
    const tasks = await database.get_all_tasks();
    response.send(JSON.stringify(tasks));
}))

/**
 * POST-endpoint to create a new task
 * @name /task/new
 * @function
 * @returns sends created task id to sender
 */
app.post('/task/new', utils.runRouteAsync(async (request, response) => {
    const form = formidable();

    form.parse(request, async (_, fields, files) => {
        const criterions = JSON.parse(fields['criterions']);
        const answer_format = JSON.parse(fields['answerFormat']);
        const filenames = [];
        for (criterion of Object.values(criterions)) {
            if (criterion.test) {
                if (files[criterion.test]) {
                    filenames.push(criterion.test);
                } else {
                    response.status(406).send();
                    return;
                }
            }
        }

        const taskId = await database.create_task(
            fields['name'],
            criterions,
            answer_format,
            fields['description']
        );
        console.log(`Created new task ${taskId}`);

        const filesDir = `/tasks/${taskId}`
        if (!fs.existsSync(filesDir)){
            fs.mkdirSync(filesDir);
        }
        for (filename of filenames) {
            const file = files[filename];
            fs.rename(file.filepath, `${filesDir}/${filename}`, (error) => {
                if (error) {
                    console.log(error);
                    response.status(500).send();
                }
            });
        }

        response.send(JSON.stringify({taskId: taskId}));
    })
}))

/**
 * GET-endpoint to get task with task_id
 * @name /task/:task_id
 * @function
 * @returns sends task with specified id
 */
app.get('/task/:task_id', utils.runRouteAsync(async (request, response) => {
    const task = await database.get_task(request.params.task_id);
    response.send(JSON.stringify(task));
}))

app.listen(port, () => {
    console.log(`App listening at the ${port} port`);
});

function solve_task(check_id, task_id, arguments) {
    console.log(`Run task ${task_id} with arguments: ${arguments}`);
    const pyChecker = spawn('python3', ['./core/check_solution.py', check_id, task_id, ...arguments]);
    pyChecker.stdout.on('data', (data) => {
        console.log(`[PY]: ${check_id}: ${data}`)
    })
    pyChecker.stderr.on('data', (data) => {
        console.log(`[PY ERROR]: ${check_id}: ${data}`)
    })
}
