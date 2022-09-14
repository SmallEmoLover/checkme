const express = require('express');
const cors = require('cors');
const utils = require('./core/utils');
const { add_authorization } = require('./middleware/auth_middleware');
const Database = require('./core/database');
const { spawn } = require('child_process');
const formidable = require('formidable');
const fs = require('node:fs');
const mv = require('mv');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = 9999;

const database = new Database(process.env.MONGODB_URL);

const app = express();
app.use(express.json());
app.use(cors());

const authorize = add_authorization(database, process.env.AUTHORIZATION_SECRET);

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
app.post('/check/:task_id', authorize, utils.runRouteAsync(async (request, response) => {
    const task_id = request.params.task_id;
    const form = formidable();

    let check_id = await database.create_task_check(task_id, request.auth_user._id);
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
app.get('/results/:check_id', authorize, utils.runRouteAsync(async (request, response) => {
    const results = await database.get_check_results(request.params.check_id);
    response.send(JSON.stringify(results));
}));

/**
 * GET-endpoint to get all available tasks
 * @name /tasks
 * @function
 * @returns sends list with tasks
 */
app.get('/tasks', authorize, utils.runRouteAsync(async (request, response) => {
    const tasks = await database.get_all_tasks();
    response.send(JSON.stringify(tasks));
}))

/**
 * POST-endpoint to create a new task
 * @name /task/new
 * @function
 * @returns sends created task id to sender
 */
app.post('/task/new', authorize, utils.runRouteAsync(async (request, response) => {
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
            mv(file.filepath, `${filesDir}/${filename}`, (error) => {
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
 * GET-endpoint to get all checks for specified user
 * @name /results
 * @function
 * @returns sends all checks to specified user
 */
 app.get('/results', authorize, utils.runRouteAsync(async (request, response) => {
    const results = await database.get_user_checks(request.auth_user._id);
    response.send(JSON.stringify(results));
}))

/**
 * GET-endpoint to get task with task_id
 * @name /task/:task_id
 * @function
 * @returns sends task with specified id
 */
app.get('/task/:task_id', authorize, utils.runRouteAsync(async (request, response) => {
    const task = await database.get_task(request.params.task_id);
    response.send(JSON.stringify(task));
}))

app.post('/sign_up', utils.runRouteAsync(async (request, response) => {
    if (await database.find_user(request.body.username)) {
        response.status(401).send(JSON.stringify({error: 'Пользователь с таким логином уже существует'}));
        return;
    }

    const password_hash = await argon2.hash(request.body.password);

    await database.create_user(
        request.body.username,
        request.body.name,
        request.body.surname,
        password_hash
    );

    const user_data = {
        username: request.body.username,
        name: request.body.name,
        surname: request.body.surname
    }

    const token = jwt.sign({user_data}, process.env.AUTHORIZATION_SECRET);

    response.send(JSON.stringify({...user_data, token: token}));
}))

app.post('/sign_in', utils.runRouteAsync(async (request, response) => {
    const user = await database.find_user(request.body.username);
    if (!user) {
        response.status(401).send(JSON.stringify({error: 'Пользователя с таким логином не существует'}));
        return;
    }

    if (!await argon2.verify(user.password, request.body.password)) {
        response.status(401).send(JSON.stringify({error: 'Неверный пароль'}));
        return
    }

    const user_data = {
        username: user.username,
        name: user.name,
        surname: user.surname
    }

    const token = jwt.sign({user_data}, process.env.AUTHORIZATION_SECRET);

    response.send(JSON.stringify({...user_data, token: token}));
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
