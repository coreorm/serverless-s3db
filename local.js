'use strict';

const conf = require('./conf/config.json');
const h = require('./handler');

// dao.findWithContent(conf.s3bucket, 'user', function (err, list) {
//     console.log(err, list);
// });

h.delete({
    query: {
        keys: 'user/a.json,user/b.json',
        // key: 'user/a'
    },
    headers: {'x-api-key': conf['x-api-key']}
}, null, function (err, d) {
    console.log(err, d);
});

// dao.save(conf.s3bucket, 'user/b.json', {
//     foo: 'bar',
//     a: 123
// }, function (err, resp) {
//     console.log(resp);
// });

// dao.fetchAll(conf.s3bucket, ['user/a.json', 'user/b.json'], function (err, objects) {
//     console.log(err, objects);
// });
