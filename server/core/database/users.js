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
            username: username,
            name: name,
            surname: surname,
            password: password
        });
        return result.insertedId.toString();
    }

    async get(username) {
        const user = await this.users.findOne({username: username});
        return user;
    }
}

module.exports = Users;
