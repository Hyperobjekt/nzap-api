module.exports = function () {
    const express = require('express');
    const path = require('path');

    const API_VERSION = process.env.API_VERSION || 'v1';


    // Defining the App
    const app = express();
    // const Sentry = require('@sentry/node');
    // if (process.env.NODE_ENV === 'production') Sentry.init({ dsn: process.env.SENTRY_DSN });
    // if (process.env.NODE_ENV === 'production') app.use(Sentry.Handlers.requestHandler());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, x-access-token');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header('X-powered-by', 'Hyperobjekt');
        if ('OPTIONS' === req.method) {
            res.status(204).send();
        } else {
            next();
        }
    });

    // Required in the app.js file to post JSON
    const bodyParser = require('body-parser');
    app.use(bodyParser.json({ limit: '50mb', extended: true }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

    // Make sure the favicon file is saved in as /public/images/favicon.ico
    const favicon = require('serve-favicon');
    app.use(favicon(path.join(__dirname, '/assets', 'images', 'favicon.ico')));

    app.use((req, res, next) => {
        req.schema = require(`./api/${API_VERSION}/schemas`);
        next();
    });

    /**
     * NZAP API Version 1.0
    //  * ------------------------*/
    app.use(`/api/${API_VERSION}/`, require(`./api/${API_VERSION}/routes`));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        res.status = 404;
        res.send({ url: req.url, error: 'Page Not Found' });
        next();
    });

    return app;
};
