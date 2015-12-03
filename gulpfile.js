/*
	Docs: https://lor.usq.edu.au/usq/items/8ca53a7e-7c8d-430a-b75b-5de785b62d90/0/docs/index.html
	Lib: https://lor.usq.edu.au/usq/items/8ca53a7e-7c8d-430a-b75b-5de785b62d90/0/snazzy.min.js
*/

gulp = require('gulp');
plugins = require('gulp-load-plugins')();
fs = require('fs');
del = require('del');
path = require('path');
sugar = require('sugar');
$ = require('cheerio');
icons = {};



modules = [
	'src/swiffy/runtime.js',
	'src/snazzy.js',
	'tmp/requestAnimationFrame.min.js',
	'tmp/icons.js',
]


gulp.task('Start', function() {
	del.sync(['dist', 'tmp'], {force: true})
	return gulp;
});

gulp.task('Process icons', function() {
	var files = fs.readdirSync('icons');

	for(var i in files) {
		var n = files[i].replace('.html', '').replace(/\[|\]/g, ''),
			page = $(fs.readFileSync('icons/' + files[i]).toString()),
			scriptTag = page.find('script');
			
			//console.log(scriptTag.replace('swiffyobject =', ''));
			
			var t = scriptTag[1].children[0].data.replace('swiffyobject =', '').trim();
			var canvas = page.find('div');



		icons[n] = {
			name: n,
			swiffyobject: JSON.parse(t.substr(0, t.length-1)),
			width: canvas.css('width').replace('px',''),
			height: canvas.css('height').replace('px','')
		}
	}
	return plugins.file('icons.js', '(function(){snazzy.icons = ' + JSON.stringify(icons) + '}())', {src:true}).pipe(gulp.dest(process.cwd() + '/tmp'));
});

gulp.task('Copy docs', function() {
	return gulp.src('docs/**/*')/*
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.concat('jaxxy.min.js'))
	.pipe(plugins.uglify())
	.pipe(plugins.sourcemaps.write('./'))*/
	.pipe(gulp.dest('dist/docs'));
});

gulp.task('Concat files', ['Start', 'Process icons', 'Copy docs'], function() {
	return gulp.src(modules)
	.pipe(plugins.concat('snazzy.min.js'))
	.pipe(plugins.uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('Cleanup', ['Concat files'], function() {
	del.sync(['tmp'], {force: true})
	return gulp;
});






// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build'], function () {
	gulp.watch(['src/**/*', '/icons/**/*'], ['build']);
});




// The same as the default, but without the watch
gulp.task('build', ['Cleanup'], function() {
	fs.writeFileSync('dist/snazzy.min.js', '/*\n\tSnazzy: The Animated Icon Library\n\tBuild date: ' + new Date().getTime() + ' (' + Date.create().format('{Dow} {dd}/{MM}/{yyyy} @ {HH}:{mm}') + ')\n*/\n\n' + fs.readFileSync('dist/snazzy.min.js').toString());
	fs.writeFileSync('dist/docs/index.html', fs.readFileSync('dist/docs/index.html').toString().replace('../dist/', '../'));
	return gulp
});