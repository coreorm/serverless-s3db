'use strict';

const AWS = require('aws\-sdk');
const s3 = new AWS.S3();

/**
 * list items in bucket
 * @param bucket
 * @param keyword
 * @param prefix
 * @param cb
 */
const find = (bucket, keyword, prefix, cb) => {
    try {
        let params = {
            Bucket: bucket
        };
        if (prefix) {
            params.Prefix = prefix;
        }

        s3.listObjectsV2(params, function (err, data) {
            let list = [];
            // console.log(data);
            if (data != null && typeof data === 'object' && data.hasOwnProperty('Contents') && typeof data.Contents === 'object') {

                if (keyword.length > 0) {
                    for (let k in data.Contents) {
                        if (data.Contents[k].Key.indexOf(keyword) >= 0) {
                            list.push(data.Contents[k]);
                        }
                    }
                } else {
                    list = data.Contents;
                }

                return cb(null, list);
            } else {
                cb(new Error('invalid data', null));
            }

            cb(err, list);
        });
    } catch (e) {
        cb(e, null);
    }
};

/**
 * save one object
 * @param bucket
 * @param name
 * @param value
 * @param cb
 */
const save = (bucket, name, value, cb) => {
    try {
        s3.putObject({
            Bucket: bucket,
            Key: name,
            Body: JSON.stringify(value)
        }, function (err, data) {
            cb(err, data);
        });
    } catch (e) {
        cb(e, null);
    }
};

/**
 * fetch single one
 * @param bucket
 * @param name
 * @param cb
 */
const fetchOne = (bucket, name, cb) => {
    try {
        s3.getObject({
            Bucket: bucket,
            Key: name
        }, function (err, data) {
            // verify data
            let src = null;
            if (data != null && typeof data === 'object' && data.hasOwnProperty('Body')) {
                const resp = data.Body.toString();
                if (resp.length > 0) {
                    src = JSON.parse(resp);
                }
            }
            cb(err, src);
        });
    } catch (e) {
        cb(e, null);
    }
};

/**
 * fetch all objects by keys
 * @param bucket
 * @param keys
 * @param cb
 */
const fetchAll = (bucket, keys, cb) => {
    try {
        if (keys.length === 0 || !keys) {
            cb(new Error('please provide array of object keys to fetch'));
        }

        const waterfall = require('async').waterfall;
        let funcs = [];
        let objects = {};

        for (let k in keys) {
            funcs.push(function (cb2) {
                fetchOne(bucket, keys[k], function (err, data) {
                    if (!err) {
                        // so we only add when valid, but ignore erros
                        objects[keys[k]] = data;
                    }
                    cb2();
                });
            });
        }
        waterfall(funcs, function (err, data) {
            cb(err, objects);
        });
    } catch (e) {
        cb(e, null);
    }
};

/**
 * delete one item
 * @param bucket
 * @param key
 * @param cb
 */
const deleteOne = (bucket, key, cb) => {
    try {
        s3.deleteObject({
            Bucket: bucket,
            Key: key
        }, function (err, data) {
            cb(err, data);
        });
    } catch (e) {
        cb(e, null);
    }
};

/**
 * delete multiple items
 * @param bucket
 * @param keys ['key1', 'key2']
 * @param cb
 */
const deleteMany = (bucket, keys, cb) => {
    let items = [];
    keys.forEach(function (item) {
        items.push({
            Key: item
        });
    });
    try {
        s3.deleteObject({
            Bucket: bucket,
            Objects: items
        }, function (err, data) {
            cb(err, data);
        });
    } catch (e) {
        cb(e, null);
    }
};

/**
 * list items based on criteria and also retrieve data at the same time (async)
 * @param bucket
 * @param keyword
 * @param path
 * @param cb
 */
const findWithContent = (bucket, keyword, path, cb) => {
    try {
        find(bucket, keyword, path, function (err, data) {
            let keys = [];
            if (data != null && typeof data === 'object') {
                for (let k in data) {
                    keys.push(data[k].Key);
                }
            }

            if (keys.length === 0) {
                return cb(null, {});
            }

            fetchAll(bucket, keys, cb);
        });
    } catch (e) {
        cb(e, null);
    }
};

module.exports = {
    find,
    save,
    fetchOne,
    fetchAll,
    findWithContent,
    deleteOne,
    deleteMany
};
