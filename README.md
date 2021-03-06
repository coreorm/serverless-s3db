# s3 as a db storage (NOSQL)

Build with serviceless, or use lib/dao.js for just low level CRUD

# Basic API key auth
setup `x-api-key` in `conf/config.js` and send it in the request header to authenticate.

# Configuration
Configure your own server.yml to ensure the access is all good before deploying.
Also in `conf/config.js` rename the bucket to the one you would like to use.

# APIs
```
  GET - /list
  lists all items
  
  POST - /fetch
  fetch by keyword + prefix (optional) or keys
  {
  	"keyword": "xxx",
  	"keys": ["path/key1", "path/key2"],
  	"prefix": "path/path2/path3..."
  }
  
  POST - /save
  save one item - must provide key and value
  {
  	"key": "path/foo.json",
  	"value": {<any kind of data>}
  }
  
  POST - /get
  retrieve one item - must provide key
  {
  	"key": "path/foo.json"
  }
  
  DELETE - /delete
  delete one or multiple items
  use ?key=key1 or ?keys=key1,key2,key3... (comma separated)
```
  
# DAO Apis

```
/**
 * list items in bucket
 * @param bucket
 * @param keyword
 * @param prefix
 * @param cb
 */
find = (bucket, keyword, prefix, cb)
 
/**
 * save one object
 * @param bucket
 * @param name
 * @param value
 * @param cb
 */ 
save = (bucket, name, value, cb)

/**
 * fetch single one
 * @param bucket
 * @param name
 * @param cb
 */
fetchOne = (bucket, name, cb)

/**
 * fetch all objects by keys
 * @param bucket
 * @param keys
 * @param cb
 */
fetchAll = (bucket, keys, cb)

/**
 * list items based on criteria and also retrieve data at the same time (async)
 * @param bucket
 * @param keyword
 * @param path
 * @param cb
 */
findWithContent = (bucket, keyword, path, cb)

/**
 * delete multiple items
 * @param bucket
 * @param keys ['key1', 'key2']
 * @param cb
 */
deleteMany = (bucket, keys, cb)

/**
 * delete one item
 * @param bucket
 * @param key
 * @param cb
 */
deleteOne = (bucket, key, cb)
```
