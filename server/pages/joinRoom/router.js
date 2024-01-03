require("@kitajs/html/register");
const { RoomNotExistsAlert } = require("./RoomNotExistsAlert");
const { Router } = require("express");
const { JoinRoom } = require("./JoinRoom");
const roomParticipantsUpdate = require("../../events/roomParticipantsUpdate");

const joinRoomRouter = new Router()

joinRoomRouter.post('/join-room/room-is-taken', (req, res) => {
  const lang = req.lang;
  const roomName = req.body["room-name"].trim();

  if (!req.isTaken(roomName)) {
    res.send(<RoomNotExistsAlert lang={lang} />);
    return;
  }
  res.send('')
  return;
})

joinRoomRouter.post("/join-room", (req, res) => {
  const lang = req.lang;
  const roomName = req.body["room-name"].trim();
  const userName = req.body["user-name"].trim();

  if (!(roomName in req.rooms)) {
    res.send(<JoinRoom lang={lang} />);
    return;
  }

  req.session.userName = userName;
  req.session.roomName = roomName;
  const room = req.rooms[roomName];
  const userNames = room.userNames;
  if (!userNames.includes(userName)) {
    userNames.push(req.body["user-name"]);
    roomParticipantsUpdate.emit(roomName)
  }

  res.set('HX-Location', '/' + lang + '/room')
  res.send('')
});

joinRoomRouter.get("/join-room", (req, res) => {
  const lang = req.lang;
  res.send(<JoinRoom lang={lang} />);
});

module.exports = joinRoomRouter