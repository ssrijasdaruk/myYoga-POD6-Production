var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

var sql = require("mssql");

var config =
{
  server: 'myyoga-pod6-server.database.windows.net',
  user: 'myyoga-pod6-server-admin',
  password: "!Abcd1234",
  database: 'myyogapod6-database',
  ssl: true,
  port: 1433,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustedConnection: true,
  }
};

app.post('/signin', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var query = "SELECT UserID, LoginName, IsAdmin FROM [dbo].[User] WHERE LoginName = '" + username + "' AND PasswordHash ='" + password + "';";
  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query(query, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log(data);
      if (data.recordset.length > 0) {
        console.log("Login Success")
        res.cookie("userID", data.recordset[0].UserID);
        res.json({ data: data.recordset });
      }
      else {
        res.send(400);
      }

    });
  });
});

app.get("/retrieve", (req, res) => {
  sql.connect(config, function (err) {

    if (err) {
      console.log(err);
    }

    var request = new sql.Request();
    request.query('SELECT TOP (1000) [ID] ,[Message] FROM [dbo].[Testing_Table]', function (err, data) {

      if (err) {
        console.log(err)
      }
      res.send(200, data.recordset.length);
      sql.close();
    });
  });
});

module.exports = app;
