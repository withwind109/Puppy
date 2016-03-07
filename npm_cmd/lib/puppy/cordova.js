/**
 * Created by cdtangchao on 2015/9/9.
 */
var exec = require('child_process').exec,
    shelljs = require('shelljs');

var PuppyTask = function () {
};

PuppyTask.prototype = new Task();

PuppyTask.prototype.run = function (puppy, argv) {
    var _this = this;

    exec();
};