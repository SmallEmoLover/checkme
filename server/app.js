const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const formidable = require('formidable');
const fs = require('node:fs');
const mv = require('mv');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Database = require('./core/database/database');
const { add_authorization } = require('./middleware/auth_middleware');
const utils = require('./core/utils');
require('dotenv').config();

const port = 9999;

const database = new Database(process.env.MONGODB_URL);

const app = express();
app.use(express.json());
app.use(cors());

const authorize = add_authorization(database, process.env.AUTHORIZATION_SECRET);

/**
 * Run OS Python script what run units
 */
function solve_task(check_id, task_id, answers) {
    console.log(`Run task ${task_id} with answers: ${answers}`);
    const pyChecker = spawn('python3', ['./core/check_solution.py', check_id, task_id, ...answers]);
    pyChecker.stdout.on('data', (data) => {
        console.log(`[PY]: ${check_id}: ${data}`);
    });
    pyChecker.stderr.on('data', (data) => {
        console.log(`[PY ERROR]: ${check_id}: ${data}`);
    });
}

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
    const { task_id } = request.params;
    const form = formidable();

    const check_id = await database.checks.create(task_id, request.auth_user._id);

    form.parse(request, async (_, fields, files) => {
        const answers = [];
        let index = 0;
        while (true) {
            if (fields[`${index}`]) {
                answers.push(fields[`${index}`]);
                index += 1;
            } else if (files[`${index}`]) {
                answers.push(files[`${index}`].filepath);
                index += 1;
            } else {
                break;
            }
        }
        response.send(JSON.stringify({ checkId: check_id }));
        solve_task(check_id, task_id, answers);
    });
}));

/**
 * GET-endpoint to get check with check_id results
 * @name /results/:check_id
 * @function
 * @returns sends check results
 */
app.get('/results/:check_id', authorize, utils.runRouteAsync(async (request, response) => {
    const results = await database.checks.get(request.params.check_id);
    response.send(JSON.stringify(results));
}));

/**
 * GET-endpoint to get all available tasks
 * @name /tasks
 * @function
 * @returns sends list with tasks
 */
app.get('/tasks', authorize, utils.runRouteAsync(async (request, response) => {
    const tasks = await database.tasks.get_all();
    response.send(JSON.stringify(tasks));
}));

/**
 * POST-endpoint to create a new task
 * @name /task/new
 * @function
 * @returns sends created task id to sender
 */
app.post('/task/new', authorize, utils.runRouteAsync(async (request, response) => {
    const form = formidable();

    form.parse(request, async (_, fields, files) => {
        const criterions = JSON.parse(fields.criterions);
        const answer_format = JSON.parse(fields.answerFormat);
        for (const criterion of Object.values(criterions)) {
            if (criterion.test && !files[criterion.test]) {
                response.status(406).send();
                return;
            }
        }

        const taskId = await database.tasks.create(
            fields.name,
            criterions,
            answer_format,
            fields.description,
        );
        console.log(`Created new task ${taskId}`);

        const onFileMoveError = (error) => {
            if (error) {
                console.log(error);
                response.status(500).send();
            }
        };

        const filesDir = `/tasks/${taskId}`;
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir);
        }

        Object.values(files).forEach((file) => {
            mv(file.filepath, `${filesDir}/${file.originalFilename}`, onFileMoveError);
        });

        ['beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach((testName) => {
            if (files[testName]) {
                mv(`${filesDir}/${fields[testName]}`, `${filesDir}/${testName}.py`, onFileMoveError);
            }
        });

        // TODO: Store additional name in DB
        if (fields.additional_files) {
            mv(`${filesDir}/${fields.additional_files}`, `${filesDir}/additional.zip`, onFileMoveError);
        }

        response.send(JSON.stringify({ taskId }));
    });
}));

/**
 * GET-endpoint to get all checks for specified user
 * @name /results
 * @function
 * @returns sends all checks to specified user
 */
app.get('/results', authorize, utils.runRouteAsync(async (request, response) => {
    const results = await database.checks.get_by_user(request.auth_user._id);
    response.send(JSON.stringify(results));
}));

/**
 * GET-endpoint to get all checks
 * @name /history
 * @function
 * @returns sends all checks to specified user
 */
app.get('/history/:page', authorize, utils.runRouteAsync(async (request, response) => {
    if (request.auth_user.username !== 'admin') {
        response.status(401).send('У вас нет прав на это действие');
        return;
    }

    const results = await database.checks.get_all(request.params.page);
    response.send(JSON.stringify(results));
}));

/**
 * GET-endpoint to get task with task_id
 * @name /task/:task_id
 * @function
 * @returns sends task with specified id
 */
app.get('/task/:task_id', authorize, utils.runRouteAsync(async (request, response) => {
    const task = await database.tasks.get(request.params.task_id);
    response.send(JSON.stringify(task));
}));

/**
 * DELETE-endpoint to delete task with task_id
 * @name /task/:task_id
 * @function
 * @returns deletion status
 */
app.delete('/task/:task_id', authorize, utils.runRouteAsync(async (request, response) => {
    if (request.auth_user.username !== 'admin') {
        response.status(401).send('У вас нет прав на это действие');
        return;
    }

    await database.tasks.delete(request.params.task_id);
    response.send(JSON.stringify({ status: 'complete' }));
}));

/**
 * POST-endpoint to sign up an user
 * @name /sign_up
 * @function
 * @returns authorization token, if user creation succeded
 */
app.post('/sign_up', utils.runRouteAsync(async (request, response) => {
    if (await database.users.get(request.body.username)) {
        response.status(401).send(JSON.stringify({ error: 'Пользователь с таким логином уже существует' }));
        return;
    }

    const password_hash = await argon2.hash(request.body.password);

    await database.users.create(
        request.body.username,
        request.body.name,
        request.body.surname,
        password_hash,
    );

    const user_data = {
        username: request.body.username,
        name: request.body.name,
        surname: request.body.surname,
    };

    const token = jwt.sign({ user_data }, process.env.AUTHORIZATION_SECRET);

    response.send(JSON.stringify({ ...user_data, token }));
}));

/**
 * POST-endpoint to sign in an user
 * @name /sign_in
 * @function
 * @returns authorization token, if logpass correct
 */
app.post('/sign_in', utils.runRouteAsync(async (request, response) => {
    const user = await database.users.get(request.body.username);
    if (!user) {
        response.status(401).send(JSON.stringify({ error: 'Пользователя с таким логином не существует' }));
        return;
    }

    if (!await argon2.verify(user.password, request.body.password)) {
        response.status(401).send(JSON.stringify({ error: 'Неверный пароль' }));
        return;
    }

    const user_data = {
        username: user.username,
        name: user.name,
        surname: user.surname,
    };

    const token = jwt.sign({ user_data }, process.env.AUTHORIZATION_SECRET);

    response.send(JSON.stringify({ ...user_data, token }));
}));

/**
 * POST-endpoint to assign group to user
 * @name /set_user_group
 * @function
 * @returns status if assigment succeded
 */
app.post('/set_user_group', authorize, utils.runRouteAsync(async (request, response) => {
    if (request.auth_user.username !== 'admin') {
        response.status(401).send('У вас нет прав на это действие');
        return;
    }

    await database.users.set_groups(
        request.body.user_id,
        request.body.groups,
    );

    response.send(JSON.stringify({ status: 'complete' }));
}));

/**
 * GET-endpoint what fetches users data
 * @name /users
 * @function
 * @returns list with users
 */
app.get('/users', authorize, utils.runRouteAsync(async (request, response) => {
    if (request.auth_user.username !== 'admin') {
        response.status(401).send('У вас нет прав на это действие');
        return;
    }

    const results = await database.users.get_all();
    response.send(JSON.stringify(results));
}));

/**
 * GET-endpoint what fetches groups list
 * @name /groups
 * @function
 * @returns list with groups
 */
app.get('/groups', authorize, utils.runRouteAsync(async (request, response) => {
    if (request.auth_user.username !== 'admin') {
        response.status(401).send('У вас нет прав на это действие');
        return;
    }

    const results = await database.users.get_groups();
    response.send(JSON.stringify(results));
}));

app.listen(port, () => {
    console.log(`App listening at the ${port} port`);
});
