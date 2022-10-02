const { MongoClient } = require('mongodb');
const Checks = require('./checks');
const Tasks = require('./tasks');
const Users = require('./users');

class Database {
    #client;

    #database;

    constructor(uri) {
        this.#client = new MongoClient(uri);
        this.#database = this.#client.db('checkme');

        this.checks = new Checks(this.#database);
        this.tasks = new Tasks(this.#database);
        this.users = new Users(this.#database);
    }
}

module.exports = Database;
