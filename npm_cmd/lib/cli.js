/**
 * Created by cdtangchao on 2015/9/7
 */
var taskHelper = {};
taskHelper.tasks = require('./process-tasks');

taskHelper.getTaskByName = function (taskName) {
    for (var i = 0; i < this.tasks.length; i++) {
        var item = this.tasks[i];
        if (item.name == taskName) {
            return item;
        }
    }
};

taskHelper.buildingTask = function (taskName) {
    if (taskName == '') {
        return false;
    }

    return this.getTaskByName(taskName);
};

taskHelper.lookupTask = function lookupTask(module) {
    try {
        return require(module).PuppyTask;
    } catch (ex) {
        throw ex;
    }
};

taskHelper.printAvailableTasks = function () {
    process.stderr.write('\nUsage: puppy task args\n\n=======================\n\n');

    if (process.argv.length > 2) {
        process.stderr.write((process.argv[2] + ' is not a valid task\n\n').bold.red);
    }

    process.stderr.write('Available tasks: '.bold);
    process.stderr.write('(use --help or -h for more info)\n\n');

    for (var i = 0; i < TASKS.length; i++) {
        var task = TASKS[i];
        if (task.summary) {
            var name = '   ' + task.name + '  ';
            var dots = '';
            while ((name + dots).length < 20) {
                dots += '.';
            }
            process.stderr.write(name.green.bold + dots.grey + '  ' + task.summary.bold + '\n');
        }
    }

    process.stderr.write('\n');
};

var Cli = module.exports;
Cli.run = function run(argv) {
    var argv = argv.slice(2);

    var taskSetting = taskHelper.buildingTask(argv[0]);
    if (!taskSetting) {
        return taskHelper.printAvailableTasks();
    }

    var taskModule = taskHelper.lookupTask(taskSetting.module);
    var taskInstance = new taskModule();
    var promise = taskInstance.run(Cli, argv);
};

Cli.fail = function (error) {
    console.error(error);
};