var config = require('./config');
var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

ftpDeploy
    .deploy(config)
    .then(res => console.log("finished:", res))
    .catch(err => console.log(err));
