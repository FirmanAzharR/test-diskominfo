require('dotenv').config();
const pgp = require('pg-promise')();

let instance = null;
let options = {
    host: process.env.POSTGRE_HOST,
    port: process.env.POSTGRE_PORT,
    database: process.env.POSTGRE_DATABASE,
    user: process.env.POSTGRE_USERNAME,
    password: process.env.POSTGRE_PASSWORD
}

class Postgres {
    constructor () {
        this._conn = pgp(options);
    }

    get conn () {
        return this._conn;
    }

    static getInstance () {
        if (!instance) {
            instance = new Postgres();
        }

        return instance;
    }
}

module.exports = Postgres;