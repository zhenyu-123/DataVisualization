var pkg = require('./package.json');
var del = require('del');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var replace = require('gulp-replace');
var header = require('gulp-header');

// 定义任务
var destDir = './dist' // 构建的目标目录
,note = [// 注释
  '/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.license %> License By <%= pkg.homepage %> */\n <%= js %>'
  ,{pkg: pkg, js: ';'}
]
,task = {
  minjs: function(){// 压缩 JS
    var src = [
      './src/**/*.js'
      ,'!./src/config.js'// ! 表示不压缩该文件
    ];
    
    return gulp.src(src).pipe(uglify())// 使用压缩工具
     .pipe(header.apply(null, note))
    .pipe(gulp.dest(destDir));
  }
  
  ,mincss: function(){// 压缩 CSS
    var src = [
      './src/**/*.css'
    ]
     ,noteNew = JSON.parse(JSON.stringify(note));
    noteNew[1].js = '';
    
    return gulp.src(src).pipe(minify({
      compatibility: 'ie7'
    })).pipe(header.apply(null, noteNew))
    .pipe(gulp.dest(destDir));
  }
  
  ,mv: function(){// 复制文件夹
    gulp.src('./src/config.js')
    .pipe(gulp.dest(destDir));
    
    return gulp.src('./src/views/**/*')
    .pipe(gulp.dest(destDir + '/views'));
  }
};

// 清理工作
gulp.task('clear', function(cb) {
  return del(['./dist/*'], cb);
});

// 构建入口
gulp.task('default', ['clear', 'src'], function(){
  for(var key in task){
    task[key]();
  }
});