const express = require("express");
require("@kitajs/html/register");
const session = require("express-session");
const { Router } = require("express");
const homePageRouter = require("./pages/home");
const createRoomRouter = require("./pages/createRoom");
const roomRouter = require("./pages/room");
const joinRoomRouter = require("./pages/joinRoom");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "barbara straizand",
    httpOnly: true,
    secure: false,
    maxAge: null,
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
app.use(express.urlencoded());

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
