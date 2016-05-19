var program = require('commander');
var fs = require('fs');
var path = require('path');
var co = require('co');
var OSS = require('ali-oss');

var configFile = "osspublish.json";

var stroageConfigFile = ".ossstorage.json"

function saveConfig(config) {
    fs.writeFileSync(configFile, JSON.stringify(config));
}

function loadConfig() {
    return JSON.parse(fs.readFileSync(configFile));
}

function loadStorageConfig() {
    return JSON.parse(fs.readFileSync(stroageConfigFile));
}

function saveStorageConfig(config) {
    fs.writeFileSync(stroageConfigFile, JSON.stringify(config));
}


var init = program.command("init <name>");
init.action(function (name) {
    var config = { name: name };
    saveConfig(config);
});

var upgrade = program.command('upgrade <version> [localfilepath]')

upgrade.action(function (version, localfilepath) {
    if (localfilepath && !fs.existsSync(localfilepath)) {
        console.log(`File ${localfilepath} not existed`);
        return;
    }
    var config = loadConfig();
    config.version = version;
    
    if(localfilepath){
        config.localfilepath = localfilepath;
    }else if(!config.localfilepath){
        console.log("You must set a localfilepath");
        return;
    }
    config.filename = path.basename(config.localfilepath);
    saveConfig(config);
});

var storage = program.command('storage <region> <key> <secret> <bucket> <root>');
storage.action(function (region, key, secret, bucket, root) {
    var config = {
        region: region,
        key: key,
        secret: secret,
        bucket: bucket,
        root: root
    };
    saveStorageConfig(config);
});


var upload = program.command('upload');
upload.option("-k,--key <accessKeyId>","accessKeyId")
    .option("-s,--secret <accessKeySecret>","accessKeySecret");

upload.action(function () {
   
    var storageConfig = loadStorageConfig();
    var options = {
        region: storageConfig.region,
        accessKeyId: upload.key ||  storageConfig.key,
        accessKeySecret:upload.secret ||  storageConfig.secret,
        bucket: storageConfig.bucket
    };
    
    var client = new OSS(options);
    
    var config = loadConfig();
    
    var targetFolder =  path.join(storageConfig.root,config.name);
    var versionFolder = path.join(targetFolder,config.version);
    var versionFilePath = path.join(versionFolder,config.filename);
    var globalFilePath = path.join(targetFolder,config.filename);
    
    var newConfig = {
      name:config.name,
      version:config.version,
      filename:config.filename
    };
    var newConfigKey = path.join(targetFolder,'publish.json'); 
    
    co(function* () { 
        
        var stream = fs.createReadStream(config.localfilepath);
        var result = yield client.putStream(versionFilePath, stream);
        console.log(`Upload sucess,you can download it use \n\t${result.url}`);
        var copyResult = yield client.copy(globalFilePath,versionFilePath);
        var globalUrl = copyResult.res.requestUrls[0];
        console.log(`Copy success,you can download it use \n\t${globalUrl}`);
        
        var configResult = yield client.put(newConfigKey,new Buffer(JSON.stringify(newConfig)));
        console.log(`Config updated,and you can access it use \n\t${configResult.url}`);
    }).catch(function (err) {
        console.log(err);
    });
});



program.parse(process.argv);

