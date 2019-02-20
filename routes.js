const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database");
const User = require("./models/User");
const Jogs = require("./models/Joggings");

const routes = new express.Router();

const saltRounds = 10;


routes.get("/", function(req, res) {
  if (req.cookies.userId) {
    console.log(req.cookies.userId);
    
    res.redirect("/times");
  } else {
    
    res.redirect("/sign-in");
  }
});


routes.get("/create-account", function(req, res) {
  res.render("create-account.html");
});


routes.post("/create-account", function(req, res) {
  const form = req.body;





  const passwordHash = bcrypt.hashSync(form.password, saltRounds);


  const userId = User.insert(form.name, form.email, passwordHash);
  res.cookie("userId", userId);


  res.redirect("/times/new");
});


routes.get("/sign-in", function(req, res) {
  res.render("sign-in.html");
});

routes.post("/sign-in", function(req, res) {
  const form = req.body;
  const get_user_id = db.prepare(
    `SELECT id as the_user_id from user WHERE email = ?`
  );
  the_user_id = get_user_id.get(form.email);

  console.log(
    "LOOK HERE TO SEE THE USER ID PLEASE...",
    the_user_id.the_user_id
  );

  const user = User.findByEmail(form.email);

  if (user) {
    console.log({ form, user });
    if (bcrypt.compareSync(form.password, user.passwordHash)) {

      res.cookie("userId", the_user_id.the_user_id);

      res.redirect("/times");
    } else {

      res.render("sign-in.html", {
        errorMessage: "Email address and password do not match"
      });
    }
  } else {

    res.render("sign-in.html", {
      errorMessage: "No user with that email exists"
    });
  }
});


routes.get("/sign-out", function(req, res) {

  res.clearCookie("userId");

  res.redirect("/sign-in");
});


routes.get("/delete-account", function(req, res) {
  const accountId = req.cookies.userId;
  console.log("delete user", accountId);
  Jogs.deleteAccountById(accountId);
  User.deleteAccountById(accountId);

  res.redirect("/sign-in");
});


routes.get("/times", function(req, res) {
  const loggedInUser = User.findById(req.cookies.userId);
  const numberOfJogs = db.prepare(
    `SELECT count(*) as jogs_data from jogs WHERE user_id = ?`
  );
  jogs_data = numberOfJogs.get(req.cookies.userId);
  if (jogs_data.jogs_data < 3) {
    console.log("NOT ENOUGH JOGS...A MINIMUM OF 3 ARE REQUIRED");
    res.redirect("/times/new");
  }


  const get_user_id = db.prepare(
    `SELECT id as the_user_id from user WHERE email = ?`
  );
  the_user_id = get_user_id.get(req.cookies.userId);


  const distance = db.prepare(
    `SELECT SUM(distance) As totaldistance FROM jogs WHERE user_id = ?`
  );
  const totalDistance = distance.get(req.cookies.userId);

  const duration = db.prepare(
    `SELECT SUM(duration) As totalduration FROM jogs WHERE user_id = ?`
  );
  const totalDuration = duration.get(req.cookies.userId);
  const avgSpeed = totalDistance.totaldistance / totalDuration.totalduration;

  const numOfJogsCompleted = db.prepare(
    `SELECT COUNT(*) AS number_of_jogs FROM jogs WHERE user_id = ?`
  );
  number_of_jogs = numOfJogsCompleted.get(req.cookies.userId);

  const times_distance = db.prepare(
    `SELECT distance As new_distance FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 3`
  );

  const times_distance2 = db.prepare(
    `SELECT distance As new_distance2 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1`
  );

  const times_distance3 = db.prepare(
    `SELECT distance As new_distance3 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 2`
  );


  console.log(times_distance);
  const new_distance = times_distance.get(req.cookies.userId);
  const new_distance2 = times_distance2.get(req.cookies.userId);
  const new_distance3 = times_distance3.get(req.cookies.userId);


  const time_duration = db.prepare(
    `SELECT duration As new_duration FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1`
  );
  const time_duration2 = db.prepare(
    `SELECT duration As new_duration2 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1`
  );
  const time_duration3 = db.prepare(
    `SELECT duration As new_duration3 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 2`
  );


  const new_duration = time_duration.get(req.cookies.userId);
  const new_duration2 = time_duration2.get(req.cookies.userId);
  const new_duration3 = time_duration3.get(req.cookies.userId);


  const time_avg_speed = new_distance.new_distance / new_duration.new_duration;
  const time_avg_speed2 =
    new_distance2.new_distance2 / new_duration2.new_duration2;
  const time_avg_speed3 =
    new_distance3.new_distance3 / new_duration3.new_duration3;


  
  const time_id_1 = db.prepare(
    `SELECT id as time_id FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 `
  );
  const time_id_2 = db.prepare(
    `SELECT id as time_id_2 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1`
  );
  const time_id_3 = db.prepare(
    `SELECT id as time_id_3 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 2 `
  );

  const time_id = time_id_1.get(req.cookies.userId);
  const time_id_2 = time_id_2.get(req.cookies.userId);
  const time_id_3 = time_id_3.get(req.cookies.userId);


  const date_1 = db.prepare(
    `SELECT date as new_date FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 `
  );
  const date_2 = db.prepare(
    `SELECT date as new_date_2 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1 `
  );
  const date_3 = db.prepare(
    `SELECT date as new_date_3 FROM jogs WHERE user_id = ? ORDER BY id DESC LIMIT 1  OFFSET 2 `
  );


  const new_date = date_1.get(req.cookies.userId);
  const new_date_2 = date_2.get(req.cookies.userId);
  const new_date_3 = date_3.get(req.cookies.userId);
  const parse_date_1 = new Date(new_date.new_date).toUTCString();
  const parse_date_2 = new Date(new_date_2.new_date_2).toUTCString();
  const parse_date_3 = new Date(new_date_3.new_date_3).toUTCString();
  the_parsed_date_1 = parse_date_1.toString();
  the_parsed_date_2 = parse_date_2.toString();
  the_parsed_date_3 = parse_date_3.toString();

  res.render("list-times.html", {
    user: loggedInUser,
    stats: {
      totalDistance: totalDistance.totaldistance,
      totalDuration: totalDuration.totalduration,
      avgSpeed: avgSpeed.toFixed(2),
      number_of_jogs: number_of_jogs.number_of_jogs
    },

    times: [
      {
        id: time_id.time_id,
        startTime: the_parsed_date_1,
        new_duration: new_duration.new_duration,
        new_distance: new_distance.new_distance,
        avgSpeed: time_avg_speed.toFixed(2)
      },
      {
        id: time_id_2.time_id_2,
        startTime: the_parsed_date_2,
        new_duration2: new_duration2.new_duration2,
        new_distance2: new_distance2.new_distance2,
        avgSpeed: time_avg_speed2.toFixed(2)
      },
      {
        id: time_id_3.time_id_3,
        startTime: the_parsed_date_3,
        new_duration3: new_duration3.new_duration3,
        new_distance3: new_distance3.new_distance3,
        avgSpeed: time_avg_speed3.toFixed(2)
      }
    ]
  });
});

// show the create time form
routes.get("/times/new", function(req, res) {
  // this is hugely insecure. why?
  const loggedInUser = User.findById(req.cookies.userId);

  res.render("create-time.html", {
    user: loggedInUser
  });
});

// handle the create time form
routes.post("/times/new", function(req, res) {
  const form = req.body;

  const timesId = Jogs.insert(
    form.startTime,
    form.distance,
    form.duration,
    req.cookies.userId
  );
  console.log("create time", form);
  res.cookie("timesId", timesId);
  res.redirect("/times");
});

// show the edit time form for a specific time
routes.get("/times/:id", function(req, res) {
  const timeId = req.params.id;
  console.log("get time", timeId);

  
  const jogs = Jogs.findById(timeId);
  const loggedInUser = User.findById(req.cookies.userId);
  const jogTime = {
    id: timeId,
    startTime: Jogs.startTime,
    duration: Jogs.duration,
    distance: Jogs.distance
  };

  res.render("edit-time.html", { jogs, time: jogTime, user: loggedInUser });

  console.log("yoooo THIS IS JOG TIME B ", jogTime);
});

// handle the edit time form
routes.post("/times/:id", function(req, res) {
  const timeId = req.params.id;
  const form = req.body;

  console.log("Time editted: ", timeId, form)

  
  Jogs.updateJogById(form.startTime, form.distance, form.duration, timeId);
  res.redirect("/times");
});

// handle deleteing the time
routes.get("/times/:id/delete", function(req, res) {
  const timeId = req.params.id;
  console.log("time deleted:", timeId);

  
  Jogs.deleteTimeById(timeId);
  res.redirect("/times");
});

routes.get("/accounts", function(req, res) {
  const loggedInUser = User.findById(req.cookies.userId);
  res.render("./accounts.html", {
    user: loggedInUser
  });

  res.status(200);
});
module.exports = routes;