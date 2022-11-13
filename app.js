// importing the express module
import express from "express";

// initializing the express app
const app = express();
// importing the body-parser module
import body from "body-parser";

// importing the ejs module
import ejs from "ejs";

// importing the mongoose module
import mongoose from "mongoose";

// importing the alert module
import { alert } from "node-popup";

app.use(body.urlencoded({ extended: true }));
// setting the template engine to use the ejs
app.set("view engine", "ejs");

// using the express.statcic() function to connect public folder
app.use(express.static("public"));

// Data base connection
mongoose.connect("mongodb://0.0.0.0:27017/cableconnectionDB");

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  username: String,
  password: String,
});

const registerSchema = new mongoose.Schema({
  requestid: String,
  date: Date,
  username: String,
  address: String,
  // password: String,
});

const connectionSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
});

const connectionModel = mongoose.model("connection", connectionSchema);

const adminModel = mongoose.model("admin", adminSchema);
// get request for home page
app.get("/", (req, res) => {
  res.render("index");
});

const userModel = mongoose.model("user", userSchema);

const registerModel = mongoose.model("register", registerSchema);
// get request for details page
app.get("/details", (req, res) => {
  res.render("details");
});

// get request for admin page
app.get("/admin", (req, res) => {
  res.render("admin");
});

// get request for register page
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.get("/userlogin", (req, res) => {
  res.render("userlogin");
});

app.get("/acceptorreject", (req, res) => {
  userModel.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("acceptorreject", { users: users });
    }
  });
});

app.get("/request", (req, res) => {
  var r = Math.random() * 1000000;
  var reqid = Math.ceil(r);
  res.render("request", { requestid: reqid });
});

app.get("/cancelreq", (req, res) => {
  registerModel.find(function (err, registers) {
    if (err) {
      console.log(err);
    } else {
      res.render("cancelreq", { registers: registers });
    }
  });
});

app.get("/viewallrequest", (req, res) => {
  registerModel.find(function (err, registers) {
    if (err) {
      console.log(err);
    } else {
      res.render("viewallrequest", {
        registers: registers,
      });
    }
  });
});

app.post("/cancelreq", (req, res) => {
  const checkElid = req.body.checkedElid;
  registerModel.findByIdAndRemove(checkElid, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/cancelreq");
    }
  });
});

app.post("/request", (req, res) => {
  const reqid = req.body.reqid;
  const date = req.body.reqdate;
  const username = req.body.username;
  const address = req.body.address;
  const newReq = new registerModel({
    requestid: reqid,
    date: date,
    username: username,
    address: address,
  });

  newReq.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("submitted");
    }
  });
});

app.post("/reject", (req, res) => {
  const checkedItemId = req.body.checkbox;
  userModel.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("acceptorreject");
    }
  });
});

app.post("/userlogin", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  userModel.findOne({ email: email }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      if (email) {
        if (users.password === password) {
          res.render("userhome");
        }
      }
    }
  });
  // res.render("userhome");
});

app.get("/viewrequests", (req, res) => {
  userModel.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("viewrequests", {
        users: users,
      });
    }
  });
});

app.get("/allconnections", (req, res) => {
  connectionModel.find(function (err, connections) {
    if (err) {
      console.log(err);
    } else {
      res.render("allconnections", {
        connections: connections,
      });
    }
  });
});

app.post("/admin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // const newAdmin = new adminModel(
  //     {
  //         username: username,
  //         password: password
  //     }
  // );

  adminModel.findOne({ username: username }, function (err, foundOne) {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        if (foundOne.password === password) {
          res.render("adminhome");
        }
      }
    }
  });
});

app.post("/register", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new userModel({
    fname: fname,
    lname: lname,
    email: email,
    username: username,
    password: password,
  });

  userModel.findOne({ email: email }, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      if (users) {
        console.log("allready");
      } else {
        newUser.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            res.render("success");
          }
        });
      }
    }
  });
});

app.post("/connections", (req, res) => {
  var fname = req.body.userfname;
  var lname = req.body.userlname;
  var email = req.body.useremail;
  
  const newConnection = new connectionModel({
    fname: fname,
    lname: lname,
    email: email,
  });
  newConnection.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("acceptorreject")
    }
  });
});

// opening the server
app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
