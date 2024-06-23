const { ObjectId } = require('mongodb');

class Tasks {
    #database;

    constructor(database) {
        this.#database = database;
    }

    get tasks() {
        return this.#database.collection('tasks');
    }

    async get(task_id) {
        const task = await this.tasks.findOne(
            { _id: ObjectId(task_id) },
        );
        return task;
    }

    async delete(task_id) {
        const checks = this.#database.collection('checks');
        const id = ObjectId(task_id);
        await this.tasks.deleteOne({ _id: id });
        await checks.deleteMany({ taskId: id });
    }

    async get_all() {
        const tasks = this.#database.collection('tasks');
        const result = await tasks.find(
            {},
            {
                projection: {
                    name: true,
                },
            },
        ).toArray();
        return result;
    }

    async create(name, criterions, answer_format, description, dbType) {
        const tasks = this.#database.collection('tasks');
        const result = await tasks.insertOne({
            name,
            criterions,
            answerFormat: answer_format,
            description,
            dbType,
        });
        return result.insertedId.toString();
    }
}

module.exports = Tasks;
