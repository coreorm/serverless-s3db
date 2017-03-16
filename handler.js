'use strict';


const dao = require('./lib/dao');
const conf = require('./conf/config.json');
const auth = (event, cb) => {
    const apiKey = conf['x-api-key'];
    const reqApiKey = event.headers['x-api-key'];
    if (reqApiKey !== apiKey) {
        const response = {
            statusCode: 503,
            message: 'FAIL',
            body: 'Auth error',
        };
        cb(null, response);
    }
};

module.exports.list = (event, context, callback) => {
    auth(event, callback);
    const response = {
        statusCode: 200,
        message: 'SUCCESS',
        body: '',
    };

    const startTime = Date.now();

    dao.find(conf.s3bucket, '', '', function (err, data) {
        response.body = {
            err,
            data,
            event,
            processed: Date.now() - startTime
        };
        callback(null, response);
    });
};

module.exports.fetch = (event, context, callback) => {
    auth(event, callback);
    const response = {
        statusCode: 200,
        message: 'SUCCESS',
        body: '',
    };

    const startTime = Date.now();
    const obj = event.body;

    try {
        if (typeof obj !== 'object') {
            throw 'Invalid data received';
        }

        if (typeof obj.prefix !== 'string') {
            obj.prefix = null;
        }

        if (typeof obj.keyword !== 'string') {
            obj.keyword = '';
        }

        if (obj.keys) {
            dao.fetchAll(conf.s3bucket, obj.keys, function (err, data) {
                if (err) {
                    throw err;
                }
                response.body = {
                    data,
                    processed: Date.now() - startTime
                };
                callback(null, response);
            });
        } else {
            dao.findWithContent(conf.s3bucket, obj.keyword, obj.prefix, function (err, data) {
                if (err) {
                    throw err;
                }
                response.body = {
                    data,
                    processed: Date.now() - startTime
                };
                callback(null, response);
            });
        }

    } catch (e) {
        response.statusCode = 503;
        response.message = 'ERROR';
        response.body = e.toString();
        response.processed = Date.now() - startTime;
        callback(null, response);
    }
};

module.exports.get = (event, context, callback) => {
    auth(event, callback);
    const response = {
        statusCode: 200,
        body: '',
    };

    const startTime = Date.now();
    const obj = event.body;

    try {
        if (typeof obj !== 'object') {
            throw 'Invalid data received';
        }

        if (!obj.key) {
            throw 'Please provide item key';
        }

        dao.fetchOne(conf.s3bucket, obj.key, function (err, data) {
            if (err) {
                response.statusCode = 404;
                response.body = null;
                response.message = err.message;
                callback(null, response);
            }
            response.body = {
                data,
                processed: Date.now() - startTime
            };
            callback(null, response);
        });

    } catch (e) {
        response.statusCode = 503;
        response.message = 'ERROR';
        response.body = e.toString();
        response.processed = Date.now() - startTime;
        callback(null, response);
    }
};

module.exports.save = (event, context, callback) => {
    auth(event, callback);
    const response = {
        statusCode: 200,
        message: 'SUCCESS',
        body: '',
    };

    const startTime = Date.now();
    const obj = event.body;

    try {
        if (typeof obj !== 'object') {
            throw 'Invalid data received';
        }

        if (!obj.key) {
            throw 'Please provide item key';
        }

        if (!obj.value) {
            throw 'Please provide item value';
        }

        dao.save(conf.s3bucket, obj.key, obj.value, function (err, data) {
            if (err) {
                throw err;
            }
            response.body = {
                data,
                processed: Date.now() - startTime
            };
            callback(null, response);
        });

    } catch (e) {
        response.statusCode = 503;
        response.message = 'ERROR';
        response.body = e.toString();
        response.processed = Date.now() - startTime;
        callback(null, response);
    }
};

module.exports.delete = (event, context, callback) => {
    auth(event, callback);
    const response = {
        statusCode: 200,
        message: 'SUCCESS',
        body: '',
    };

    const startTime = Date.now();
    const obj = event.query;

    try {
        if (typeof obj !== 'object') {
            throw 'Invalid data received';
        }

        if (typeof obj.key === 'string') {
            dao.deleteOne(conf.s3bucket, obj.key, function (err, data) {
                if (err) {
                    throw err;
                }
                response.body = {
                    data,
                    processed: Date.now() - startTime
                };
                callback(null, response);
            })
        } else if (typeof obj.keys === 'object' && obj.keys instanceof Array) {
            dao.deleteOne(conf.s3bucket, obj.key, function (err, data) {
                if (err) {
                    throw err;
                }
                response.body = {
                    data,
                    processed: Date.now() - startTime
                };
                callback(null, response);
            })
        } else {
            callback(new Error('please provide key or keys'), null);
        }

    } catch (e) {
        response.statusCode = 503;
        response.message = 'ERROR';
        response.body = e.toString();
        response.processed = Date.now() - startTime;
        callback(null, response);
    }
};
