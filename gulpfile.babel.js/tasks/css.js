import config from '../config'

import gulp from 'gulp'
import gulpif from 'gulp-if'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import handleErrors from '../lib/handleErrors'
import autoprefixer from 'gulp-autoprefixer'
import path from 'path'
import cssnano from 'gulp-cssnano'
import combineMq from 'gulp-combine-mq'
import replace from 'gulp-replace'

const configCss = config.tasks.css
const paths = {
  src: path.join(config.root.src, configCss.src, '/**/main.{' + configCss.extensions + '}'),
  dest: path.join(config.root.dest, configCss.dest)
}

function cssTask () {
  if (!configCss) return

  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(gulpif(global.production, replace('// @import "custom-classes";', '@import "custom-classes";')))
    .pipe(sass(configCss.sass))
    .on('error', handleErrors)
    .pipe(autoprefixer(configCss.autoprefixer))
    .pipe(gulpif(global.production, cssnano({autoprefixer: false})))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(combineMq({
      beautify: false
    }))
    .pipe(gulp.dest(path.join(global.production ? config.root.dist : '', paths.dest)))
    .pipe(gulpif(!global.production, browserSync.stream()))
}

gulp.task('css', cssTask)

export default cssTask
