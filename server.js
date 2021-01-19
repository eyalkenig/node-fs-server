const express = require('express');
const app = express();
var path = require('path');
var fs = require('fs');
app.use(express.static(path.join(__dirname, 'public')));
var bodyParser = require('body-parser');
const port = process.env.PORT || 4123;
const infoLogLevel = 'info';
const debugLogLevel = 'debug';
const logLevel = process.env.LOG_LEVEL || infoLogLevel;
var jsonParser = bodyParser.json();

function ensureExists(path, mask, cb) {
    fs.mkdirSync(path, { recursive: true }, function(err) {
        if (err) {
            if (err.code == 'EEXIST') {
                cb(null);
            }
            else {
                cb(err);
            }
        }
        cb(null);
    });
}
function getFilePath(path) {
    if (path.indexOf('/') != 0) {
        return '/' + path
    }
    return path
}
function getFullPath(path) {
    return __dirname + path
}
function isExists(path) {
    return fs.existsSync(getFullPath(path));
}
function log(level, message) {
    if (logLevel !== debugLogLevel && level === debugLogLevel) {
        return;
    }
    console.log(message)
}
app.get('/read', (req, res) => {
    log(infoLogLevel, '[GET] read query: ' + req.query);

    let status = 200;
    let response = {};
    var filePath = getFilePath(req.query.file_path);
    let fullPath = getFullPath(filePath);
    const exists = isExists(fullPath);
    if (exists) {
        let rawData = fs.readFileSync(fullPath);
        let content = JSON.parse(rawData);
        response = content;
        log(infoLogLevel, '[OK] 200');
    } else {
        status = 404
        response = { error: 'file not found: ' + req.query.file_path }
        log(infoLogLevel, '[ERROR] 404 - ' + response.error);
    }
    log(debugLogLevel, response);

    res.status(status).send(response);
    log(debugLogLevel, '');
});
app.get('/exists', (req, res) => {
    log(infoLogLevel, '[GET] exists - query: ' + req.query);

    var filePath = getFilePath(req.query.file_path);
    const status = 200;
    const response = isExists(getFullPath(filePath));

    log(infoLogLevel, '[OK] 200');
    log(debugLogLevel, response);

    res.status(status).send(response);
    log(debugLogLevel, '')
});
app.post('/save', jsonParser, (req, res) => {
    log(infoLogLevel, '[POST] save - query: ' + req.query);
    log(debugLogLevel, 'body:');
    log(debugLogLevel, req.body);

    const status = 200;

    var filePath = getFilePath(req.query.file_path);
    ensureExists(__dirname + path.dirname(filePath), 0777, function(err) {
        if (err) {
            log(infoLogLevel, 'failed to create folder: ' + filePath)
        }
    });

    var fileContent = JSON.stringify(req.body);

    var stream = fs.createWriteStream(getFullPath(filePath));
    stream.once('open', function () {
        stream.write(fileContent);
        stream.end();
    });

    const response = req.body;

    log(infoLogLevel, '[OK] 200');
    log(debugLogLevel, response);

    res.status(status).send(response);
    log(debugLogLevel, '')
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});