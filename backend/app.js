const express = require('express');
const httpErrors = require('http-errors');
const httpCodes = require('http-status-codes');
const logger = require('morgan');
const path = require('path');

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/dist', express.static(path.join(__dirname, '../frontend/dist')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(httpErrors(httpCodes.NOT_FOUND));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = req.app.get('env') === 'development' ? err.message : 'Error occured';
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || err.code || 500);
    res.end(JSON.stringify(res.locals));
});

module.exports = app;
