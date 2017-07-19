const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

const serverWatchFiles = [
    'server.js',
    'app/**/*',
];

const frontWatchFiles = [
    './public/**/*',
];

gulp.task('sass', () => {
    gulp.src('./front/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass:watch', () => {
    gulp.watch('./front/scss/**/*.scss', ['sass'], browserSync.reload);
});

gulp.task('browser-sync', () => {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: frontWatchFiles,
        port: 4000,
        reloadDelay: 2000,
        // browser: ['google-chrome'],
    });
});

gulp.task('nodemon', (cb) => {
    let called = false;
    return nodemon({
        // nodemon our expressjs server
        script: 'index.js',
        ignore: [
            'gulpfile.js',
            'node_modules/**',
            'public/uploads/**',
            'public/lib/**',
        ],
        // watch core server file(s) that require server restart on change
        watch: serverWatchFiles,
    })
    .on('start', () => {
        // ensure start only got called once
        if (!called) {
            cb();
            called = true;
            gulp.start('browser-sync');
        }
    })
    .on('restart', () => {
        browserSync.reload();
    });
});

gulp.task('default', ['sass:watch', 'nodemon'], () => {
    // browserSync.reload();
});
