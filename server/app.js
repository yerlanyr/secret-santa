const express = require("express");
const session = require("express-session");
const sqlite = require('better-sqlite3')
const { Router } = require("express");
const homePageRouter = require("./pages/home/router");
const createRoomRouter = require("./pages/createRoom/router");
const roomRouter = require("./pages/room/router");
const joinRoomRouter = require("./pages/joinRoom/router");
const { MemoryStore } = require("express-session");
const SqliteStore = require('better-sqlite3-session-store')(session)

require("@kitajs/html/register");

const db = new sqlite("sessions.db");
const roomsDb = new sqlite('rooms.db')
roomsDb.exec(`CREATE TABLE IF NOT EXISTS rooms (
  roomId TEXT NOT NULL PRIMARY KEY,
  roomObject TEXT NOT NULL
)`)
const app = express();
exports.app = app;
if (!process.env.SESSION_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw Error("Session secret env variable is not set");
  }

  console.warn("Session secret env variable is not set");
  process.env.SESSION_SECRET = "Default session secret";
}
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: null,
    resave: false,
    saveUninitialized: false,
    store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000
        }
      }),
  })
);
const rooms = {
  get(roomId) {
    const row = roomsDb.prepare('SELECT * FROM rooms WHERE roomId=?').get(roomId)
    if(row) {
      return JSON.parse(row.roomObject)
    }
  },
  set(roomId, roomObject) {
    const preparedSql = roomsDb.prepare('INSERT OR REPLACE INTO rooms(roomId, roomObject) VALUES (?, ?)')
    preparedSql.bind(roomId, JSON.stringify(roomObject))
    preparedSql.run()
  }
};
app.use((req, res, next) => {
  req.rooms = rooms;
  req.isTaken = (roomName) => {
    const room = rooms.get(roomName)
    if(!room) {
      return false
    }
    return new Date().getTime() - room.createDate <=
      24 * 60 * 60 * 1000
  };
  req.createNewRoom = (adminName) => ({
    createDate: new Date().getTime(),
    adminName,
    userNames: [adminName],
    generatedIndexes: undefined,
  });
  next();
});
app.use(
  express.urlencoded({
    extended: false,
  })
);
const appRouter = new Router();
appRouter.use("/", homePageRouter);
appRouter.use("/", createRoomRouter);
appRouter.use("/", roomRouter);
appRouter.use("/", joinRoomRouter);
app.use(
  "/:lang((ru|en)?)",
  (req, res, next) => {
    req.lang = req.params.lang ?? "ru";
    next();
  },
  appRouter
);
