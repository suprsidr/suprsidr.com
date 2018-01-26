import plugins  from 'gulp-load-plugins';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import yaml     from 'js-yaml';
import yargs    from 'yargs';
import fs       from 'fs';
import childProcess from 'child_process';

// Load all Gulp plugins into one variable
const $ = plugins();

const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build', sass);

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series(sass,
    gulp.parallel(watch/*, () => {
      childProcess.spawn('node', ['./server/server'], {
        stdio: 'inherit'
      })
        .on('close', function () {
          // User closed the app. Kill the host process.
          process.exit();
        });
    }*/)
  )
);

// simple saa + watch
gulp.task('watch',
		gulp.series(sass, watch)
);

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('css/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/css'))
    .pipe(browser.reload({ stream: true }));
}


// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.assets);
  gulp.watch('css/scss/**/*.scss', sass);
}
