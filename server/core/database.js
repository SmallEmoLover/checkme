const { MongoClient, ObjectId } = require("mongodb");

class Database {
    #client;
    #database;

    constructor(uri) {
        this.#client = new MongoClient(uri);
        this.#database = this.#client.db('checkme');
    }

    async create_task(name, criterions, answer_format, description) {
        const tasks = this.#database.collection('tasks');
        const result = await tasks.insertOne({
            name: name,
            criterions: criterions,
            answerFormat: answer_format,
            description: description
        });
        return result.insertedId.toString();
    }

    async create_task_check(task_id, user_id) {
        const checks = this.#database.collection('checks');
        const result = await checks.insertOne({
            taskId: ObjectId(task_id),
            userId: ObjectId(user_id),
            date: new Date(),
            status: 'В процессе'
        });
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

    async delete_task(task_id) {
        const tasks = this.#database.collection('tasks');
        const checks = this.#database.collection('checks');
        let id = ObjectId(task_id);
        await tasks.deleteOne({ _id: id });
        await checks.deleteMany({ taskId: id })
    }

    async create_user(username, name, surname, password) {
        const users = this.#database.collection('users');
        const result = await users.insertOne({
            username: username,
            name: name,
            surname: surname,
            password: password
        });
        return result.insertedId.toString();
    }

    async find_user(username) {
        const users = this.#database.collection('users');
        const user = await users.findOne({username: username});
        return user;
    }

    async get_user_checks(user_id) {
        const checks = this.#database.collection('checks');
        const result = await checks.aggregate([
            { $match: { userId: ObjectId(user_id) } },
            { $lookup: {
                from: "tasks",
                localField: "taskId",
                foreignField: "_id",
                as: "task"
            }},
            { $unwind: "$task" }
        ]).toArray();
        return result;
    }
}

module.exports = Database;
