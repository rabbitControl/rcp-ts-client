var config = require('./config');
var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

//default config
var conf = config.default;

if (process.argv.length > 2)
{
    conf = config[process.argv[process.argv.length - 1]];
}

if (conf !== undefined)
{
    console.log("deploying to: " + conf.host);
    
    ftpDeploy
        .deploy(conf)
        .then(res => console.log("finished:", res))
        .catch(err => console.log(err));
}
else
{
    console.error("no such config: " + process.argv[process.argv.length - 1]);
}

