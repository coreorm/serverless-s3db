# s3 as a db storage (NOSQL)

Build with serviceless, or use lib/dao.js for just low level CRUD

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
```
