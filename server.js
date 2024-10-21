require("dotenv").config();
var express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
var express = require("express");
const path = require('path');
const cricLive = require("cric-live");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const home = require("./controllers/homecontroller");
const video = require("./controllers/videocontroller");
const contest = require("./controllers/contestsController");
const teamdata = require("./controllers/getplayerscontroller");
const auth = require("./controllers/user_controller");
const team = require("./controllers/teamcontroller");
const payments = require("./controllers/payment");
const teamstandingsA = require("./updating/updatestandings.js");
const updatedata = require("./updating/updatedata.js");
const transaction = require("./controllers/transaction");
const matches = require("./updating/matchDB-controller.js");
const fMatches = require("./controllers/fMatchDB-controller");
const addLiveCommentary = require("./updating/firebase.js");
const teamstandings = require("./updating/updateteam.js");
const addlivescoresnew = require("./updating/addlivescoresdetails.js");
const addlivenew = require("./updating/addlivedetails.js");
const addingteam = require("./updating/addplayer.js");
const addingteame = require("./controllers/teamcreatecontroller");
const addIds = require("./updating/addMatchIds.js");
const getkeys = require("./utils/crickeys");
const { checkloggedinuser } = require("./utils/checkUser.js");
const player = require("./routes/playerDetails");
const series = require("./routes/series");
var fs = require('fs');
const { updateBalls } = require("./updating/updateBalls.js");
// Environment variables
/* Requiring body-parser package
to fetch the data that is entered
by the user in the HTML form. */

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the Fantasy Sports application",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust the path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerDocs, null, 2));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Allowing app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*", credentials: false }));
app.use('/images', express.static(path.join('images')));
app.use("/auth", auth);
app.use("/", player);
app.use("/", series);
app.use("/payment", checkloggedinuser, payments);
app.use("/", checkloggedinuser, home);
app.use("/", checkloggedinuser, contest);
app.use("/", checkloggedinuser, teamdata);
app.use("/", checkloggedinuser, team);
app.use("/", checkloggedinuser, updatedata);
app.use("/", checkloggedinuser, video);
//app.use("/", transaction);
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.uri || 'mongodb://localhost:27017/dreameleven',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log(`Error!${error}`);
    }
    else {
      console.log('connected to database')
    }
  }
);
const api_key =
  "s16rcBDzWjgNhJXPEUV9HA3QMSfvpen2GyL7a4F8ubdwICk5KOHPT32vI5b6cSxs8JpUhirCOjqogGwk";
// ...

// Remove the error.log file every twenty-first day of the month.
//addLiveCommentary.addLivecommentary();
cron.schedule("0 * * * *", async function () {
  await transaction.startTransaction();
});
cron.schedule("* * * * *", async function () {
  await addLiveCommentary.addLivecommentary();
});
cron.schedule("* * * * *", async function () {
  await updateBalls();
});
cron.schedule("*/2 * * * *", async function () {
  await teamstandings.addTeamstandingstodb();
});
cron.schedule("*/3 * * * *", async function () {
  await addlivescoresnew.addLivematchtodb();
});
cron.schedule("*/5 * * * *", async function () {
  await addlivenew.addLivematchtodb();
});
cron.schedule("0 22 * * *", async function () {
  await matches.addMatchtoDb();
  await addingteam.addPlayers();
});
cron.schedule("0 */20 * * *", async function () {
  await addingteame.addteamPlayers();
});
cron.schedule("0 */1 * * *", async function () {
  await addIds.addMatchIds();
});
// updateBalls();
// addlivenew.addLivematchtodb();
// addlivescoresnew.addLivematchtodb();
// addIds.addMatchIds();
// teamstandings.addTeamstandingstodb();
// addingteame.addteamPlayers();
// matches.addMatchtoDb()
// teamstandingsA.addTeamstandingstodb()
// addingteam.addPlayers();
// transaction.startTransaction();
// addLiveCommentary.addLivecommentary();
// updateBalls()
const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
  console.warn(`App listening on http://localhost:${PORT}`);
});
