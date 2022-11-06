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
  console.log(req.body.username);
  var query = "SELECT UserID, LoginName, IsAdmin, Vouchers FROM [dbo].[User] WHERE LoginName = '" + username + "' AND PasswordHash ='" + password + "';";
  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query(query, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log(data);
      if (data.recordset.length > 0) {
        console.log("Login Success")
        res.cookie("user_id", data.recordset[0].UserID, { maxAge: 600000 });
        res.cookie("username", data.recordset[0].LoginName, { maxAge: 600000 });
        res.cookie("isAdmin", data.recordset[0].IsAdmin, { maxAge: 600000 });
        res.cookie("vouchers", data.recordset[0].Vouchers, { maxAge: 600000 });
        res.json({ data: data.recordset });
      }
      else {
        res.send(400);
      }

    });
  });
});

app.get("/retrieve_class", (req, res) => {
  sql.connect(config, function (err) {
    query = " SELECT [ClassID], [ClassName], [MaxVacancies], [CurrVacancies], [StartDate], [EndDate], [Coach] FROM[dbo].[ClassTable]";
    console.log("Retrieving data");
    if (err) {
      console.log(err);
    }

    var request = new sql.Request();
    request.query(query, function (err, data) {

      if (err) {
        console.log(err)
      }
      res.send(200, data.recordset);
      sql.close();
    });
  });
});


app.get("/update_vacancies", (req, res) => {
  var classid = req.query.classid;
  var vacancies = req.query.vacancies;
  query = "UPDATE [dbo].[ClassTable] SET CurrVacancies = " + vacancies + " WHERE ClassID = " + classid;

  sql.connect(config, function (err) {
    console.log("Updating class vacancies");

    if (err) {
      console.log(err);
    }
    else {
      var request = new sql.Request();
      request.query(query, function (err, data) {

        if (err) {
          console.log(err)
          res.send(500);
          sql.close();
        }
        else {
          res.send(200);
          sql.close();
        }
      });
    }
  });
});

app.get("/update_vouchers", (req, res) => {
    var userid = req.query.userid;
    var vouchers = req.query.vouchers;
    query = " UPDATE [dbo].[User] SET vouchers = " + vouchers + " WHERE UserID = " + userid;

    sql.connect(config, function (err) {
      console.log("Updating user vouchers");

      if (err) {
        console.log(err);
      }
      else {
        var request = new sql.Request();
        request.query(query, function (err, data) {
  
          if (err) {
            console.log(err)
            res.send(500);
            sql.close();
          }
          else {
            res.send(200);
            sql.close();
          }
        });
      }
    });
});

app.get("/insert_class", (req, res) => {
  var table = "[dbo].[ClassTable]";
  var ClassName = req.query.ClassName
  var MaxVacancies = req.query.MaxVacancies;
  var CurrVacancies = MaxVacancies;
  var StartDate = req.query.StartDate;
  var EndDate = req.query.EndDate;
  var Coach = req.query.Coach;
  var query = "INSERT INTO " + table + " (ClassName, MaxVacancies, CurrVacancies, StartDate, EndDate, Coach) VALUES ('" + ClassName + "', '" + MaxVacancies + "', '" + CurrVacancies + "', '" + StartDate + "', '" + EndDate + "', '" + Coach + "');";
  console.log(query);

  sql.connect(config, function (err) {
    console.log("test");
    if (err) {
      console.log(err);
    }
    else {
      var request = new sql.Request();
      request.query(query, function (err, data) {

        if (err) {
          console.log(err)
          res.send(500);
          sql.close();
        }
        else {
          res.send(200);
          sql.close();
        }
      });
    }
  });
});

app.get('/reset_cookies', (req, res) => {
  var userid = req.query.userid;
  var query = "SELECT UserID, LoginName, IsAdmin, Vouchers FROM [dbo].[User] WHERE UserID = " + userid ;
  console.log(query);
  sql.connect(config, function (err) {
    var request = new sql.Request();
    request.query(query, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log(data);
      if (data.recordset.length > 0) {
        console.log("Reseting cookies Success")
        res.cookie("user_id", data.recordset[0].UserID, { maxAge: 600000 });
        res.cookie("username", data.recordset[0].LoginName, { maxAge: 600000 });
        res.cookie("isAdmin", data.recordset[0].IsAdmin, { maxAge: 600000 });
        res.cookie("vouchers", data.recordset[0].Vouchers, { maxAge: 600000 });
        res.json({ data: data.recordset });
      }
      else {
        res.send(400);
      }

    });
  });
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
