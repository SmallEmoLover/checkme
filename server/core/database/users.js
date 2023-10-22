const { ObjectId } = require('mongodb');

class Users {
    #database;

    constructor(database) {
        this.#database = database;
    }

    get users() {
        return this.#database.collection('users');
    }

    async create(username, name, surname, password) {
        const result = await this.users.insertOne({
            username,
            name,
            surname,
            password,
        });
        return result.insertedId.toString();
    }

    async set_groups(id, groups) {
        await this.users.updateOne(
            { _id: ObjectId(id) },
            {
                $set: {
                    groups,
                },
            },
        );
    }

    async get(username) {
        const user = await this.users.findOne({ username });
        return user;
    }

    async get_all() {
        const result = await this.users.find(
            {},
            {
                projection: {
                    password: false,
                },
            },
        ).toArray();
        return result;
    }

    async get_groups() {
        const result = new Set();
        const users_groups = await this.users.find(
            {},
            {
                projection: {
                    groups: true,
                },
            },
        ).toArray();

        users_groups.forEach((user) => {
            user.groups?.forEach((group) => {
                result.add(group);
            });
        });

        return Array.from(result);
    }
}

module.exports = Users;
