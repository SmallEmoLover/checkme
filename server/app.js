const express = require('express');
const cors = require('cors');
const database = require('./core/database');
const utils = require('./core/utils');

const port = 9999;

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
 * POST-endpoint to start a task with task_id check with sent arguments
 * @name /check/:task_id
 * @function
 * @returns sends created check id to sender
 */
app.post('/check/:task_id(\\d+)', utils.runRouteAsync(async (request, response) => {
    let task_id = Number(request.params.task_id);
    let check_id = await database.create_task_check(task_id);
    let results = solve_task(task_id, request.body.arguments);
    database.set_check_results(check_id, results);
    response.send(JSON.stringify({checkId: check_id}))
}));

/**
 * GET-endpoint to get check with check_id results
 * @name /results/:check_id
 * @function
 * @returns sends check results
 */
app.get('/results/:check_id(\\d+)', utils.runRouteAsync(async (request, response) => {
    let check_id = Number(request.params.check_id);
    const results = await database.get_check_results(check_id);
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
 * GET-endpoint to get task with task_id
 * @name /task/:task_id
 * @function
 * @returns sends task with specified id
 */
 app.get('/task/:task_id(\\d+)', utils.runRouteAsync(async (request, response) => {
    let task_id = Number(request.params.task_id);
    const task = await database.get_task(task_id);
    response.send(JSON.stringify(task));
}))

app.listen(port, () => {
    console.log(`App listening at the ${port} port`);
});

// TODO: Placeholder, replace with python scrypt executions later 
function solve_task(task_id, arguments) {
    console.log(`Solving task with arguments: ${arguments}`);
    return {task_id: task_id, result: 'checked'};
}
