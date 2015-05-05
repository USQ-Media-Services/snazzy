gulp = require('gulp');
plugins = require('gulp-load-plugins')();
fs = require('fs');
del = require('del');
path = require('path');




modules = [
	'modules/base.js',
	'modules/get.js',
	'modules/post.js',
]


buildOrder = [
	'Start',
	'Process files',
]

gulp.task('Start', function() {
	del.sync(['dist'], {force: true})
	return gulp		
});

gulp.task('build', buildOrder, function() {
	return gulp		
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build'], function () {
	gulp.watch('modules/**/*', ['build']);
});

gulp.task('Process files', function() {
	return gulp.src(modules)
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.concat('jaxxy.min.js'))
	.pipe(plugins.uglify())
	.pipe(plugins.sourcemaps.write('./'))
	.pipe(gulp.dest('dist'));
});