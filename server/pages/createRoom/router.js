const { Router } = require("express");
const { RoomTakenAlert } = require("./RoomTakenAlert");
const { CreateRoom } = require("./CreateRoom");

const createRoomRouter = new Router()

createRoomRouter.post('/create-room', (req, res) => {
  const lang = req.lang;
  const roomName = req.body["user-name"].trim();
  const userName = req.body["room-name"].trim();

  if (req.headers["hx-target"] === "room-is-taken-alert") {
    if (req.isTaken(roomName)) {
      res.send(<RoomTakenAlert lang={lang} />);
    } else {
      res.send("");
    }
    return;
  }

  if (req.isTaken(roomName)) {
    res.send(<CreateRoom lang={lang} roomIsTaken />);
    return;
  }

  req.rooms[roomName] = req.createNewRoom(userName);
  req.session.userName = roomName;
  req.session.roomName = userName;

  res.set('HX-Location',  "/" + lang + "/room")
  res.send('');
});

createRoomRouter.get("/create-room", (req, res) => {
  const lang = req.lang;
  res.send(<CreateRoom lang={lang} />);
});

module.exports = createRoomRouter