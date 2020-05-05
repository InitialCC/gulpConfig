'use strict';
/*
插件导入
*/


const gulp = require('gulp'),
	sass = require('gulp-sass'),
	jsmin = require('gulp-jsmin'),
	cssmin = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	plumber = require('gulp-plumber'),
	fileinclude = require('gulp-file-include'),
	pump = require('pump'),
	concat = require('gulp-concat'); // 合并css

/*
 *browserSync插件 浏览器无刷新监控
 * 监控指定项目 	baseDir: './app'
 * 监控项目下的其他文件 files；
 */
var path = './app';
gulp.task('server', function (done) {

	var files = [
		'./**/*.html',
		'./**/**/*.css'
	];
	browserSync.init(files, {
		server: {
			baseDir: path
		}
	});
	done();
})

/*
 * 编译scss文件生成css插件
 * 目录结构:
 * 目标scss文件 return gulp.src('./app/sass/*.scss')
 * 生成指定css文件到具体位置（包括css文件夹，app为项目位置） .pipe(gulp.dest('./app/css'));
 * 监控报错文件：.pipe(plumber()) 
 */

gulp.task('sass', function (cb) {
	pump([gulp.src(path + '/sass/*.scss'),
	plumber(),
	sass.sync().on('error', sass.logError),
	gulp.dest(path + '/css')],
		cb())
});
// return gulp.src(path + '/sass/*.scss')
// 		.pipe(plumber())
// 		.pipe(sass.sync().on('error', sass.logError))
// 		.pipe(gulp.dest(path + '/css'));

/*
 * 监控scss插件
 * 目录结构:gulp.watch('./app/sass/*.scss', ['sass']);
 */
gulp.task('watch', function (done) {
	gulp.watch(path + '/sass/*.scss', gulp.series('sass'));
	done()
});
/*
 * css最小化插件
 * 目录结构:
 * 指定目标css文件:gulp.src('./app/css/*.css') 
 * 生成目标文件: .pipe(gulp.dest('./appcssmin/'));
 */

gulp.task('testCssmin', function (cb) {
	pump([gulp.src(path + '/css/*.css'),
	cssmin(),
	gulp.dest('./dist/css')
	], cb())
});

/*
 *	build插件 
 *	目录结构: 
 *	page/include/*.html 模块html
 *	page/*.html
 *	dest('./app/') 生成指定html
 *	模板导入举例: @@include('include/header.html')
 */

// 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
gulp.task('htmlBuild', function (cb) {
	pump([gulp.src(['app/page/**/*.html', '!app/page/include/**.html']),
	fileinclude({
		prefix: '@@',
		basepath: '@file'
	}),
	gulp.dest(path),
	gulp.dest('./dist/')
	], cb())
})




/*
 *js生成插件
 *多个文件:['src/js/index.js','src/js/detail.js']) //多个文件以数组形式传入
 *生成到目录结构 ./dist
 */

gulp.task('jsmin', function (cb) {
	pump([gulp.src(path + '/js/*.js'),
	jsmin(),
	gulp.dest('./dist/js'),
	rename({
		suffix: '.min'
	})

	], cb)
});

/*
默认调用插件方法
 */

gulp.task('build', gulp.series('testCssmin', 'htmlBuild', 'jsmin'), function () {

});


gulp.task('default', gulp.series('server', 'sass', 'watch'), function () {
	console.info(111);
})
