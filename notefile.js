// https://github.com/JCMais/node-libcurl/blob/master/examples/post-data.js
// curl -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"file":"bar.txt", "note": "aaaaaaahhh!!"}' http://localhost:1972
var exports = module.exports = {},
    notefile = require('lib/util.js'),
    readline = require('readline'),
    Getopt = require('node-getopt'),
    file, note, getopt, opt, rl;

getopt = new Getopt([
    ['' , 'add-notefile=FILE(,S)', 'Add a new notefile(s)'],
    ['' , 'add-noteserver=SERVER(,S)', 'Add a new noteserver(s)'],
    ['n' , 'notefile=FILE', 'When piping from STDIN the notefile to write to MUST be specified.'],
    ['' , 'remove-notefile[=FILE(,S)]', 'Remove a notefile(s)'],
    ['' , 'remove-noteserver[=SERVER(,S)]', 'Remove a noteserver(s)'],
    ['h', 'help', 'display this help']
]).bindHelp();

// `parseSystem` is alias  of parse(process.argv.slice(2)).
opt = getopt.parseSystem();

if ((file = opt.options['add-notefile'])) {
    notefile.addNotefile(file);
} else if ((file = opt.options['add-noteserver'])) {
    notefile.addNoteserver(file);
}
// The value of --remove-notefile is optional so we must check for !== undefined.
else if ((file = opt.options['remove-notefile']) !== undefined) {
    notefile.removeNotefile(file);
}
// The value of --remove-notefile is optional so we must check for !== undefined.
else if ((file = opt.options['remove-noteserver']) !== undefined) {
    notefile.removeNoteserver(file);
} else {
    note = opt.argv[0] || '';

    if (!note) {
        //throw new Error('You did not pass a note!');
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });

        rl.on('line', function (line) {
            note += line + '\n';
        });

        rl.on('close', function () {
            notefile.makeRequest(note, opt.options['notefile']);
        });
    } else {
        notefile.makeRequest(note);
    }
}
