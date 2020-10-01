/** Express app for Carbon Footprint. */

const express = require('express');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const morgan = require('morgan');

app.use(morgan('tiny'));

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const carbonRoutes = require('./routes/carbon');
const actionRoutes = require('./routes/action');

app.use('/users', userRoutes);
app.use('/carbon', carbonRoutes);
app.use('/', authRoutes);
app.use('/takeaction', actionRoutes)


/** 404 Handler */

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
});

/** general error handler */

app.use((err, req, res, next) => {
    if (err.stack) console.log(err.stack);
    res.status(err.status || 500);
    return res.json({
        error: err,
        message: err.message,
    });
});

module.exports = app;
