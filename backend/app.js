const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const httpErrors = require('http-errors');
const httpCodes = require('http-status-codes');
const logger = require('morgan');
const path = require('path');
const appConfig = require('./helpers/config');
const renderer = require('./helpers/renderer')();
const indexRouter = require('./routes/index');
const cartRouter = require('./routes/cart');

module.exports = db => {
    const app = express();

    app.use(
        session({
            store: new FileStore({}),
            secret: appConfig.sessionSecret,
            resave: true,
            saveUninitialized: true,
        }),
    );

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/static', express.static(path.join(__dirname, '../static')));
    app.use('/dist', express.static(path.join(__dirname, '../frontend/dist')));
    app.use('/', indexRouter(renderer, db));
    app.use('/cart', cartRouter(renderer, db));
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(httpErrors(httpCodes.NOT_FOUND));
    });

    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = req.app.get('env') === 'development' ? err.message : 'Error occurred';
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || err.code || 500);
        res.end(JSON.stringify(res.locals));
    });

    return app;
};
