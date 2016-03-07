/**
 * Created by cdtangchao on 2015/9/7.
 */
module.exports = [{
    title: 'start',
    name: 'start',
    summary: 'Starts a new Ionic project in the specified PATH',
    args: {
        '[options]': 'any flags for the command',
        '<PATH>': 'directory for the new project',
        '[template]': 'Template name, ex: tabs, sidemenu, blank\n' +
        'Codepen url, ex: http://codepen.io/ionic/pen/odqCz\n' +
        'Defaults to Ionic "tabs" starter template'
    },
    options: {
        '--appname|-a': 'Human readable name for the app (Use quotes around the name)',
        '--id|-i': 'Package name for <widget id> config, ex: com.mycompany.myapp',
        '--no-cordova|-w': {
            title: 'Create a basic structure without Cordova requirements',
            boolean: true
        },
        '--sass|-s': {
            title: 'Setup the project to use Sass CSS precompiling',
            boolean: true
        },
        '--list|-l': {
            title: 'List starter templates available',
            boolean: true
        },
        '--io-app-id': 'The Ionic.io app ID to use',
        '--template|-t': 'Project starter template',
        '--zip-file|-z': 'URL to download zipfile for starter template'
    },
    module: './puppy/start'
}
//{
//    title: 'platform',
//    name: 'platform',
//    alt: ['platforms'],
//    summary: 'Add platform target for building an app',
//    args: {
//        '[options]': '',
//        '<PLATFORM>': ''
//    },
//    options: {
//        '--noresources|-r': {
//            title: 'Do not add default icons and splash screen resources',
//            boolean: true
//        },
//        '--nosave|-e': {
//            title: 'Do not save the platform to the package.json file',
//            boolean: true
//        }
//    },
//    module: './ionic/cordova',
//    alt: ['platforms']
//}
];