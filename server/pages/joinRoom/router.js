require("@kitajs/html/register");
const Layout = require("../../components/Layout");
const {
  i18n,
  SECRET_SANTA,
  JOIN_ROOM,
  ROOM_NAME,
  YOUR_NAME,
  GO_BACK_TO_MAIN_PAGE,
} = require("../../i18n");
const { RoomNotExistsAlert } = require("./RoomNotExistsAlert");
const { Router } = require("express");

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
  }

  res.set('HX-Location', '/' + lang + '/room')
  res.send('')
});

const JoinRoom = ({ lang }) => {
  return (
    <Layout>
      <h1 class="heading">
        {i18n(lang, SECRET_SANTA)} - {i18n(lang, JOIN_ROOM)}
      </h1>
      <form class="form" hx-post>
        <table class="form--table">
          <tr>
            <td>
              <label for="room-name">{i18n(lang, ROOM_NAME)}: </label>
            </td>
            <td class="error">
              <input
                type="text"
                id="room-name"
                name="room-name"
                class="input room-name"
                hx-target="#room-is-taken-alert"
                hx-trigger="change, keyup delay:300"
                hx-post={`/${lang}/join-room/room-is-taken`}
              />
              <br />
              <div id="room-is-taken-alert"></div>
            </td>
          </tr>
          <tr>
            <td>
              <label for="your-name">{i18n(lang, YOUR_NAME)}: </label>
            </td>
            <td>
              <input
                type="text"
                id="your-name"
                name="user-name"
                class="input your-name"
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="submit"
                class="button"
                value={i18n(lang, JOIN_ROOM)}
              />
            </td>
          </tr>
        </table>
        <br />
      </form>
      <a href="/" hx-boost="true">{i18n(lang, GO_BACK_TO_MAIN_PAGE)}</a>
    </Layout>
  );
};

joinRoomRouter.get("/join-room", (req, res) => {
  const lang = req.lang;
  res.send(<JoinRoom lang={lang} />);
});

module.exports = joinRoomRouter