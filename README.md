# node-fs-server
simple node file system http server
```
npm run server
```

endpoints
```
[GET] http://localhost:4123/read?file_path=some-path/to-file
```
```
[GET] http://localhost:4123/exists?file_path=some-path/to-file
```
```
[POST] http://localhost:4123/save?file_path=some-path/to-file
{
    "a": 1
}
```
