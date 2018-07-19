var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var fs = require("fs");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var upload = multer({
  dest: __dirname + '/public/uploads/',
  limits: { fieldSize: 25 * 1024 * 1024 }
});
var type = upload.single('upl');
app.post('/pngUpload', type, function (req, res) {
  //  console.log(req.body.file);
  console.log("IN");
  fs.writeFile("uploads/" + Date.now().toString() + '.png', req.body.file, 'base64', function (err) {
    console.log('err', err);
  });
  console.log('success');

});
app.post('/jpgUpload', type, function (req, res) {
  //  console.log(req.body.file);
  console.log("IN");
  fs.writeFile("uploads/" + Date.now().toString() + '.jpg', req.body.file, 'base64', function (err) {
    console.log('err', err);
  });
  console.log('success');

});

app.get('/test', type, function (req, res) {
  res.send("test");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
