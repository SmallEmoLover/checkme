//TODO: Replace with real database connector when figure out what DB we use.

let checks = new Map();
let idGenerator = makeIdGenerator();

function create_task_check(task_id) {
    let id = idGenerator.next().value;
    checks.set(id, {task_id: task_id, result: 'in progress'});

    return id;
}

function set_check_results(check_id, results) {
    checks.set(check_id, results);
}

function get_check_results(check_id) {
    return checks.get(check_id);
}

function get_all_tasks() {
    return [
        {id: 1, name: 'Git'},
        {id: 2, name: 'Jenkins'}
    ]
}

function get_task(task_id) {
    if (task_id === 1) {
        return {
            name: 'Git',
            arguments: [
                'Git link',
                'Your surname'
            ]
        }
    } else {
        return {
            name: 'Jenkins',
            arguments: [
                'Job name',
            ]
        }
    }
}

function *makeIdGenerator() {
    for (i = 1; ; i++) {
        yield i;
    }
}

module.exports.create_task_check = create_task_check;
module.exports.set_check_results = set_check_results;
module.exports.get_check_results = get_check_results;
module.exports.get_all_tasks = get_all_tasks;
module.exports.get_task = get_task;
