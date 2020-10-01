require('dotenv').config();

const SECRET = process.env.SECRET_KEY || 'test';
const PORT = process.env.port

let DB_URI;

if (process.env.NODE_ENV === 'test') {
    DB_URI = 'carbon_footprint_test';
} else {
    DB_URI = process.env.DATABASE_URL || 'carbon_footprint';
}

console.log('Using databse', DB_URI);

module.exports = {
    SECRET,
    PORT,
    DB_URI,
};
