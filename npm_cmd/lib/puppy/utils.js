/**
 * Created by cdtangchao on 2015/9/7.
 */
var Q = require('q'),
    path = require('path');

var Utils = module.exports;
Utils.preprocessCliOptions = function (argv) {
    try {
        var options = {};

        options.appDirectory = argv[1];

        // Grab the name of the app from -a or  --app. Defaults to appDirectory if none provided
        options.appName = argv.appname || argv['app-name'] || argv.a;
        if (!options.appName) {
            var appNameSplit = options.appDirectory.split('/');
            appNameSplit = appNameSplit[appNameSplit.length - 1].split('\\');
            options.appName = appNameSplit[appNameSplit.length - 1];
        }

        // get a packge name, like com.ionic.myapp
        options.packageName = argv.id || argv.i;
        options.ionicAppId = argv['io-app-id'];
        options.isCordovaProject = (argv.cordova !== false && !(argv.w || argv['no-cordova']));
        // options.isCordovaProject = (argv.cordova !== false && !argv.w);

        // start project template can come from cmd line args -t, --template, or the 3rd arg, and defaults to tabs
        options.template = (argv.template || argv.t || argv[2] || 'tabs');

        // figure out the full path
        options.targetPath = Utils.getProjectDirectory(options);

        return options;
    } catch (ex) {
        console.error('There was an error parsing out options from the Command Line');
    }
};

Utils.getProjectDirectory = function (appDirectory) {
    return path.resolve(appDirectory);
};

Utils.fetchArchive = function (fetchUrl, archiveUrl) {
    var os = require('os');
    var fs = require('fs');
    var path = require('path');
    var unzip = require('unzip');
    var q = Q.defer();

    var tmpFolder = os.tmpdir();
    var tempZipFilePath = path.join(tmpFolder, 'ionic-starter-' + new Date().getTime() + '.zip');

    var unzipRepo = function unzipRepo(fileName) {
        var readStream = fs.createReadStream(fileName);
        readStream.on('error', function (err) {
            //events.emit('verbose', ('unzipRepo readStream: ' + err).error );
            console.error(('unzipRepo readStream: ' + err).error);
            q.reject(err);
        });

        var writeStream = unzip.Extract({path: fetchUrl});
        writeStream.on('close', function () {
            q.resolve();
        });
        writeStream.on('error', function (err) {
            console.error(('unzipRepo writeStream: ' + err).error);
            //events.emit('verbose', ('unzipRepo writeStream: ' + err).error );
            q.reject(err);
        });
        readStream.pipe(writeStream);
    };

    var proxy = process.env.PROXY || process.env.http_proxy || null;
    var request = require('request');
    request({url: archiveUrl, rejectUnauthorized: false, encoding: null, proxy: proxy},
        function (err, res, body) {
            if (err) {
                console.error('Error fetching:' + archiveUrl + ' error:' + err);
                q.reject(err);
                return;
            }
            if (!res) {
                console.error('Invalid response:' + archiveUrl);
                q.reject('Unable to fetch response: ' + archiveUrl);
                return;
            }
            if (res.statusCode !== 200) {
                if (res.statusCode === 404 || res.statusCode === 406) {
                    console.error('Not found:' + archiveUrl + '(' + res.statusCode + ')');
                    console.error('Please verify the url and try again.');
                } else {
                    console.error('Invalid response status:' + archiveUrl + '(' + res.statusCode + ')');
                }
                q.reject(res);
                return;
            }
            try {
                fs.writeFileSync(tempZipFilePath, body);
                unzipRepo(tempZipFilePath);
            } catch (e) {
                //events.emit('verbose', 'fetchArchive request write: ' + e);
                q.reject(e);
            }
        }).on('response', function (res) {
            // var ProgressBar = require('progress');
            //var bar = Multibar.newBar('[:bar]  :percent  :etas', {
            //    complete: '=',
            //    incomplete: ' ',
            //    width: 30,
            //    total: parseInt(res.headers['content-length'], 10)
            //});

            res.on('data', function (chunk) {
                try {
                    //bar.tick(chunk.length);
                    console.log(chunk.length);
                } catch (e) {
                }
            });
        });

    return q.promise;
};