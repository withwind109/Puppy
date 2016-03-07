/**
 * Created by cdtangchao on 2015/9/9.
 */
require('shelljs/global');

var Task = require('./task').Task,
    IonicCordova = require('./cordova').IonicTask,
    IonicStats = require('./stats').IonicStats,
    fs = require('fs'),
    ioLib = require('ionic-app-lib').ioConfig,
    path = require('path'),
    bower = require('./bower');

var PuppyTask = function () {
};

PuppyTask.prototype.installBowerComponent = function installBowerComponent(componentName) {
    var bowerInstallCommand = 'bower install --save-dev ' + componentName;

    var result = exec(bowerInstallCommand);

    if (result.code != 0) {
        //Error happened, report it.
        var errorMessage = 'Failed to find the bower component "'.error.bold + componentName.verbose + '"'.error.bold + '.\nAre you sure it exists?'.error.bold;
        this.ionic.fail(errorMessage, 'add');
    } else {
        var message = 'Bower component installed - ' + componentName;
        console.log(message.green)
    }
}

PuppyTask.prototype.uninstallBowerComponent = function uninstallBowerComponent(componentName) {
    var bowerUninstallCommand = 'bower uninstall --save-dev ' + componentName;

    var result = exec(bowerUninstallCommand);

    if (result.code != 0) {
        var errorMessage = 'Failed to find the bower component "'.error.bold + componentName.verbose + '"'.error.bold + '.\nAre you sure it exists?'.error.bold;
        this.ionic.fail(errorMessage, 'add')
    } else {
        var message = 'Bower component removed - ' + componentName;
        console.log(message.red);
    }
}

PuppyTask.prototype.listComponents = function listComponents() {
    try {
        var bowerJson = require(path.join(process.cwd(), 'bower.json'));
        console.log('Ions, bower components, or addons installed: '.info)
        for (var bowerCompIndex in bowerJson.devDependencies) {
            console.log(bowerCompIndex.green);
        }
    }catch(ex) {
        console.log('This command can only be used when in an Ionic project directory'.red.bold);
    }
}

PuppyTask.prototype.run = function(puppy, argv) {
    var _this = this;

    var action = argv[0];
    var platformName = argv[1];
    var ioSet = false;

    try {
        switch (action) {
            case 'add':
                ioSet = true;
                this.installBowerComponent(platformName);
                break;
            case 'remove':
            case 'rm':
                this.uninstallBowerComponent(platformName);
                break;
            case 'list':
            case 'ls':
            case '':
                this.listComponents();
                break;
        }
    } catch (error) {
        var errorMessage = error.message ? error.message : error;
        this.ionic.fail(errorMessage, 'service')
    }

    // Inject the component into our index.html, if necessary, and save the app_id
    ioLib.injectIoComponent(ioSet, componentName);
    ioLib.warnMissingData();
}