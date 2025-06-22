var exec = require('child_process').exec;

module.exports = function(segs, done) {
	if (segs.length < 1) done(null);
	var cmd = 'sudo ' + segs.join(' '),
		sudo = exec(cmd);

	sudo.on('error', done);
	sudo.on('exit', done);
	sudo.on('close', done);

	process.stdin.pipe(sudo.stdin);
	sudo.stdout.pipe(process.stdout);

	//sudo.stderr.pipe(process.stderr);
	sudo.stderr.on('data', function(chunk) {
		if (chunk.toString() === 'Sorry, try again.\n') return;
		process.stdout.write(chunk);
	});
}