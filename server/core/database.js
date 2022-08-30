const { MongoClient } = require("mongodb");
var ObjectId = require('mongodb').ObjectId;

class Database {
    #client;
    #database;

    constructor(uri) {
        this.#client = new MongoClient(uri);
        this.#database = this.#client.db('checkme');
    }

    async create_task_check(task_id) {
        const checks = this.#database.collection('checks');
        const result = await checks.insertOne({
            taskId: ObjectId(task_id),
            result: 'В процессе'
        });
        console.log(result.insertedId);
        return result.insertedId.toString();
    }
    
    async get_check_results(check_id) {
        const checks = this.#database.collection('checks');
        const check = await checks.findOne({_id: ObjectId(check_id)});
        return check;
    }

    async get_all_tasks() {
        const tasks = this.#database.collection('tasks');
        const result = await tasks.find({}).toArray();
        return result;
    }

    async get_task(task_id) {
        const tasks = this.#database.collection('tasks');
        const task = await tasks.findOne({_id: ObjectId(task_id)});
        return task;
    }

    //TODO: Implement in grader
    async set_check_results(check_id, results) {
        const checks = this.#database.collection('checks');
        await checks.updateOne(
            {_id: ObjectId(check_id)}, 
            {
                $set: {result: results}
            }
        );
    }
}

module.exports = Database;
