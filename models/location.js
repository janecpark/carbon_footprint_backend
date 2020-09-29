const db = require('../db');
const axios = require('axios');
let xmlParser = require('xml2json');
require('dotenv').config();

const BASE_URL = 'http://www.mapquestapi.com/search/v4/place';

/**
 * Function for getting location
 */

class Location {
    static async getLocation(data) {
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
}

module.exports = Location;
