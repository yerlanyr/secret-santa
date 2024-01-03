const { Router } = require("express");
const { RoomTakenAlert } = require("../components/RoomTakenAlert");
const { CreateRoom } = require("../components/CreateRoom");

const createRoomRouter = new Router()

createRoomRouter.post('/create-room', (req, res) => {
  const lang = req.lang;

  if (req.headers["hx-target"] === "room-is-taken-alert") {
    if (req.isTaken(req.body["room-name"])) {
      res.send(<RoomTakenAlert lang={lang} />);
    } else {
      res.send("");
    }
    return;
  }

  if (req.isTaken(req.body["room-name"])) {
    res.send(<CreateRoom lang={lang} roomIsTaken />);
    return;
  }

  req.rooms[req.body["room-name"]] = req.createNewRoom(req.body["user-name"]);
  req.session.userName = req.body["user-name"];
  req.session.roomName = req.body["room-name"];

  res.set('HX-Location',  "/" + lang + "/room")
  res.send('');
});

createRoomRouter.get("/create-room", (req, res) => {
  const lang = req.lang;
  res.send(<CreateRoom lang={lang} />);
});

module.exports = createRoomRouter