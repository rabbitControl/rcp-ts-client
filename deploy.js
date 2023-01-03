var config = require('./config');
var FtpDeploy = require("ftp-deploy");
var fs = require('fs')

var ftpDeploy = new FtpDeploy();

//default config
var conf = config.default;

if (process.argv.length > 2)
{
    conf = config[process.argv[process.argv.length - 1]];
}

if (conf !== undefined)
{
    if (conf.includeClient === true)
    {
        if (fs.existsSync("client.zip"))
        {
            // include client.zip - move it into build/
            fs.renameSync("client.zip", "build/client.zip", function (err)
            {
                if (err)
                {
                    console.error("could not move client.zip into build folder");
                    throw err;
                }
            });
        }
        else if (!fs.existsSync("build/client.zip"))
        {
            console.log("could not find client.zip");
        }
    }
    else
    {
        // make sure not to include client.zip
        try {
            fs.unlinkSync("build/client.zip");
        }
        catch (err)
        {
            // could not delete, ok - nop
        }
    }

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

