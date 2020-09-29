const db = require('../db');
const axios = require('axios');
let xmlParser = require('xml2json');
require('dotenv').config();

const BASE_URL = 'https://apis.berkeley.edu/coolclimate/footprint-defaults';

/**
 * Related functions for carbon footprint results
 */

class Carbon {
    /** Retreive carbon footprint calculations  */

    static async getResult(data) {
        const result = await axios.get(`${BASE_URL}`, {
            headers: {
                app_id: process.env.secret_id,
                app_key: process.env.secret_key,
            },
            params: data,
        });
        let resultJson = xmlParser.toJson(result.data);
        return resultJson;
    }

    /** Save carbon footprint results  */

    static async saveResult(data, username) {
        const result = await db.query(
            `SELECT * FROM users
            WHERE username=$1`,
            [username]
        );
        const user = result.rows[0];
        if (!user) {
            const error = new Error(`User doesn't exist`);
            error.status = 404;
            throw error;
        }

        const carbon_result = await db.query(
            `INSERT INTO results (user_id, food, housing, transport, total)
            VALUES($1, $2, $3, $4, $5)
            RETURNING user_id, id, food, housing, transport, total`,
            [user.id, data.food, data.housing, data.transport, data.total]
        );
        const res = carbon_result.rows[0];
        return res;
    }

    /** Saves carbon footprint to user's database  */

    static async userResult(username) {
        const result = await db.query(
            `SELECT * FROM users
            WHERE username=$1`,
            [username]
        );
        const user = result.rows[0];
        if (!user) {
            const error = new Error(`User doesn't exist`);
            error.status = 404;
            throw error;
        }
        const user_result = await db.query(
            `SELECT * FROM results
            WHERE user_id=$1`,
            [user.id]
        );
        const res = user_result.rows;
        return res;
    }

    /** Delete carbon footprint from user results database */

    static async removeResult(id) {
        const result = await db.query(
            `DELETE FROM results
            WHERE id=$1
            RETURNING id`,
            [id]
        );
        if (result.rows.length === 0) {
            let notFound = new Error(`Result does not exist`);
            notFound.status = 404;
            throw notFound;
        }
    }

    /** Add carbon footprint reduction action to database */

    static async addAction(data, id) {
        const result = await db.query(
            `SELECT * FROM results
            WHERE id=$1`,
            [id]
        );
        const res = result.rows[0];
        if (!res) {
            const error = new Error(`Result doesn't exist`);
            error.status = 404;
            throw error;
        }
        const action_result = await db.query(
            `INSERT INTO takeaction
            (results_id, 
            public_transport, 
            carpool, 
            low_carbon_diet, 
            organic, 
            fridge, 
            green_electricity)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING(results_id, 
                public_transport, 
                carpool, 
                low_carbon_diet, 
                organic, 
                fridge, 
                green_electricity)
            `,
            [
                id,
                data.public_transport,
                data.carpool,
                data.low_carbon_diet,
                data.organic,
                data.fridge,
                data.green_electricity,
            ]
        );
        const action_res = action_result.rows[0];
        return action_res;
    }
}

module.exports = Carbon;
