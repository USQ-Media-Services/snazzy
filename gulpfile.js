gulp = require('gulp');
plugins = require('gulp-load-plugins')();
fs = require('fs');
del = require('del');
path = require('path');
$ = require('cheerio');
icons = {};




modules = [
	'src/swiffy/runtime.js',
	'src/snazzy.js',
	'tmp/icons.js',
]


gulp.task('Start', function() {
	//del.sync(['dist', 'tmp'], {force: true})
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
	return gulp.src('docs')/*
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.concat('jaxxy.min.js'))
	.pipe(plugins.uglify())
	.pipe(plugins.sourcemaps.write('./'))
	.pipe(gulp.dest('dist'));*/
});

gulp.task('Concat files', ['Start', 'Process icons', 'Copy docs'], function() {
	return gulp.src(modules)
	.pipe(plugins.concat('snazzy.min.js'))
	//.pipe(plugins.uglify())
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
	
	return gulp
});