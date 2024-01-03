const express = require("express");
require("@kitajs/html/register");
const session = require("express-session");
const { Router } = require("express");
const homePageRouter = require("./pages/home/router");
const createRoomRouter = require("./pages/createRoom/router");
const roomRouter = require("./pages/room/router");
const joinRoomRouter = require("./pages/joinRoom/router");

const app = express();

if(!process.env.SESSION_SECRET) {
  if(process.env.NODE_ENV === 'production') {
    throw Error('Session secret env variable is not set')
  }
  
  console.warn('Session secret env variable is not set')
  process.env.SESSION_SECRET = 'Default session secret'
}


app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    httpOnly: true,
    secure: false,
    maxAge: null,
    resave: false,
    saveUninitialized: false
  })
);

const rooms = {};
app.use((req, res, next) => {
  req.rooms = rooms;
  req.isTaken = (roomName) =>
    rooms[roomName] &&
    new Date().getTime() - rooms[roomName].createDate.getTime() <=
      24 * 60 * 60 * 1000;
  req.createNewRoom = (adminName) => ({
    createDate: new Date(),
    adminName,
    userNames: [adminName],
    generatedIndexes: undefined,
  });
  next();
});

app.use(express.urlencoded({
  extended: false
}));

const appRouter = new Router();

appRouter.use("/", homePageRouter);
appRouter.use("/", createRoomRouter);
appRouter.use('/', roomRouter)
appRouter.use('/', joinRoomRouter)

app.use(
  "/:lang((ru|en)?)",
  (req, res, next) => {
    req.lang = req.params.lang ?? "ru";
    next();
  },
  appRouter
);
app.listen(3000);
