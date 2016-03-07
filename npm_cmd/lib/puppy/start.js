/**
 * Created by cdtangchao on 2015/9/7
 */
var fs = require('fs'),
    Task = require('./task').Task,
    utils = require('./utils'),
    shelljs = require('shelljs/global'),
    shellConfig = require('shelljs').config,
    Q = require('q'),
    prompt = require('prompt');

shellConfig.silent = true;

var PuppyTask = function () {
};

PuppyTask.prototype = new Task();
PuppyTask.prototype.run = function (puppy, argv) {
    var _this = this;

    if (argv.length < 2) {
        return puppy.fail('Invalid command');
    }

    var options = this.processOptions(argv),
        promptPromise;

    if (fs.existsSync(options.targetPath)) {
        promptPromise = this.promptForOverwrite(options.targetPath);
    }
    else {
        promptPromise = Q(true);
    }

    return promptPromise.then(function (promptToContinue) {
        if (!promptToContinue) {
            console.log('Puppy start cancelled by user');
            return;
        }

        _this.startApp(options);
    }).then(function () {
        return _this.loadApp(options);
    }).catch(function (err) {
        console.error(err);
    });
};

PuppyTask.prototype.processOptions = function (argv) {
    try {
        var options = {};

        //获取app路径
        options.appDirectory = argv[1];

        //获取app名称
        var appNameSplit = options.appDirectory.split('/');
        appNameSplit = appNameSplit[appNameSplit.length - 1].split('\\');
        options.appName = appNameSplit[appNameSplit.length - 1];

        options.template = argv[2] || 'default';

        //目标的path
        options.targetPath = utils.getProjectDirectory(options.appDirectory);

        return options;
    } catch (ex) {
        console.error('There was an error parsing out options from the Command Line');
    }
};

PuppyTask.prototype.promptForOverwrite = function (targetPath) {
    var q = Q.defer();

    console.log('The directory' + targetPath + 'already exists,Would you like to overwirte');

    var promptProperties = {
        areYouSure: {
            name: 'areYouSure',
            description: '(y/n):',
            required: true
        }
    };

    //prompt.override = argv;
    prompt.message = '';
    prompt.delimiter = '';
    prompt.start();

    prompt.get({properties: promptProperties}, function (err, promptResult) {
        if (err && err.message !== 'canceled') {
            q.reject(err);
            return err;
        } else if (err && err.message == 'canceled') {
            return q.resolve(false);
        }

        var areYouSure = promptResult.areYouSure.toLowerCase().trim();
        if (areYouSure == 'yes' || areYouSure == 'y') {
            rm('-rf', targetPath);
            q.resolve(true);
        } else {
            q.resolve(false);
        }
    });

    return q.promise;
};

PuppyTask.prototype.startApp = function (options) {
    console.log('Creating Puppy app in folder ' + options.targetPath + ' based on ' + options.template + ' template');

    if (!fs.existsSync(options.targetPath)) {
        fs.mkdirSync(options.targetPath);
    }
    //var templateUrl = 'http://127.0.0.1/' + options.template + '.zip';
};

PuppyTask.prototype.loadApp = function (options) {
    return this.fetchZip({
        targetPath: options.targetPath,
        fetchUrl: 'http://127.0.0.1/' + options.template + '.zip'
    });
};

PuppyTask.prototype.fetchZip = function (options) {
    var q = Q.defer();
    console.log('Fetching ZIP from url:', options.fetchUrl, 'to: ', options.targetPath);

    utils.fetchArchive(options.targetPath, options.fetchUrl).then(function () {
        try {
            // Move the content of this repo into the www folder
            //cp('-Rf', options.targetPath+'/.', 'www');

            // Clean up start template folder
            //rm('-rf', options.targetPath);
            cd(options.targetPath);
            q.resolve();
        } catch (e) {
            console.error(e);
            q.reject(e);
        }
    }).catch(function (err) {
        console.log(err);
        console.log('Please verify you are using a valid URL or a valid ionic starter.');
        console.log('View available starter templates: `ionic templates`');
    });

    return q.promise;
};

exports.PuppyTask = PuppyTask;