const { ObjectId } = require('mongodb');

class Checks {
    #database;

    constructor(database) {
        this.#database = database;
    }

    get checks() {
        return this.#database.collection('checks');
    }

    async get_by_user(user_id) {
        const result = await this.checks.aggregate([
            { $match: { userId: ObjectId(user_id) } },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'taskId',
                    foreignField: '_id',
                    as: 'task',
                },
            },
            { $unwind: '$task' },
        ]).toArray();
        return result;
    }

    async get(check_id) {
        const check = await this.checks.findOne({ _id: ObjectId(check_id) });
        return check;
    }

    async create(task_id, user_id) {
        const result = await this.checks.insertOne({
            taskId: ObjectId(task_id),
            userId: ObjectId(user_id),
            date: new Date(),
            status: 'В процессе',
        });
        return result.insertedId.toString();
    }
}

module.exports = Checks;
