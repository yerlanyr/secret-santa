const express = require("express");
require("@kitajs/html/register");
const Layout = require("./components/Layout");
const {
  i18n,
  SECRET_SANTA,
  JOIN_ROOM,
  ROOM_NAME,
  YOUR_NAME,
  GO_BACK_TO_MAIN_PAGE,
  PARTICIPANTS,
  YOU_ARE_MAKING_PRESENTS_FOR,
  ASSIGN,
} = require("./i18n");
const session = require("express-session");
const { RoomTakenAlert } = require("./components/RoomTakenAlert");
const { RoomNotExistsAlert } = require("./components/RoomNotExistsAlert");
const { CreateRoom } = require("./components/CreateRoom");
const { LangComponent } = require("./components/LangComponent");
const { MainPageButtons } = require("./components/MainPageButtons");
const { Router } = require("express");

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
app.use(express.urlencoded());

const appRouter = new Router();

appRouter.get("/", (req, res) => {
  const lang = req.lang;
  const isLoggedIn = req.session.roomName !== undefined;
  res.send(
    <Layout>
      <LangComponent lang={lang} />
      <h1 class="heading">{i18n(lang, SECRET_SANTA)}</h1>
      <MainPageButtons isLoggedIn={isLoggedIn} lang={lang} />
    </Layout>
  );
});
const rooms = {};
const isTaken = (roomName) =>
  rooms[roomName] &&
  new Date().getTime() - rooms[roomName].createDate.getTime() <=
    24 * 60 * 60 * 1000;
const createNewRoom = (adminName) => ({
  createDate: new Date(),
  adminName,
  userNames: [adminName],
  generatedIndexes: undefined,
});

appRouter.post("/create-room", (req, res) => {
  const lang = req.lang;

  if (req.headers["hx-target"] === "room-is-taken-alert") {
    if (isTaken(req.body["room-name"])) {
      res.send(<RoomTakenAlert lang={lang} />);
    } else {
      res.send("");
    }
    return;
  }

  if (isTaken(req.body["room-name"])) {
    res.send(<CreateRoom lang={lang} roomIsTaken />);
    return;
  }

  rooms[req.body["room-name"]] = createNewRoom(req.body["user-name"]);
  req.session.userName = req.body["user-name"];
  req.session.roomName = req.body["room-name"];

  res.redirect("/" + lang + "/room");
});

appRouter.get("/exit-room", (req, res) => {
  const lang = req.lang;
  req.session.userName = undefined;
  req.session.roomName = undefined;
  res.redirect("/" + lang);
});

appRouter.get("/create-room", (req, res) => {
  const lang = req.lang;
  res.send(<CreateRoom lang={lang} />);
});

appRouter.post("/join-room", (req, res) => {
  const lang = req.lang;
  if (req.headers["hx-request"]) {
    if (req.headers["hx-target"] === "room-is-taken-alert") {
      if (!isTaken(req.body["room-name"])) {
        res.send(<RoomNotExistsAlert lang={lang} />);
      }
      return;
    }

    res.send("");
  }

  if (!(req.body["room-name"] in rooms)) {
    res.send(<JoinRoom lang={lang} />);
    return;
  }

  const userName = req.body["user-name"];
  req.session.userName = userName;
  const roomName = req.body["room-name"];
  req.session.roomName = roomName;
  const room = rooms[roomName];
  const userNames = room.userNames;
  if (!userNames.includes(userName)) {
    userNames.push(req.body["user-name"]);
  }

  res.redirect("/" + lang + "/room");
});

const JoinRoom = ({ lang }) => {
  return (
    <Layout>
      <h1 class="heading">
        {i18n(lang, SECRET_SANTA)} - {i18n(lang, JOIN_ROOM)}
      </h1>
      <form class="form" method="post">
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
                hx-trigger="change"
                hx-post={`/${lang}/join-room`}
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
      <a href="/">{i18n(lang, GO_BACK_TO_MAIN_PAGE)}</a>
    </Layout>
  );
};

appRouter.get("/join-room", (req, res) => {
  const lang = req.lang;
  res.send(<JoinRoom lang={lang} />);
});

appRouter.post("/room", (req, res) => {
  const roomName = req.session.roomName;
  const isLoggedIn = roomName !== undefined;

  if (!isLoggedIn || !(roomName in rooms)) {
    res.redirect("/" + lang);
  }
  const generate = function (n) {
    const arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    for (var i = 0; i < n - 1; i++) {
      const swapWith = i + 1 + ~~(Math.random() * (n - i - 1));
      const temp = arr[i];
      arr[i] = arr[swapWith];
      arr[swapWith] = temp;
    }
    return arr;
  };
  rooms[roomName].generatedIndexes = generate(rooms[roomName].userNames.length);
  res.send("");
});

appRouter.get("/room", (req, res) => {
  const roomName = req.session.roomName;
  const isLoggedIn = roomName !== undefined;
  const lang = req.lang;

  if (!isLoggedIn || !(roomName in rooms)) {
    res.redirect("/" + lang);
  }

  const room = rooms[req.session.roomName];
  const participants = room.userNames;
  const userName = req.session.userName;
  const admin = room.adminName === userName;

  let recipient;
  if (room.generatedIndexes) {
    const userIndex = participants.indexOf(userName);
    const recipientIndex = room.generatedIndexes[userIndex];
    recipient = participants[recipientIndex];
  }
  if (req.headers["hx-request"]) {
    if (req.headers["hx-target"] === "participants") {
      return res.send(
        <>
          {(participants ?? []).map((userName) =>
            userName === room.adminName ? (
              <li>
                <i>{userName}</i>
              </li>
            ) : (
              <li>{userName}</li>
            )
          )}
        </>
      );
    }

    if (req.headers["hx-target"] === "recipient") {
      return res.send(
        <>
          {recipient && (
            <h2 class="message">
              {i18n(lang, YOU_ARE_MAKING_PRESENTS_FOR)}{" "}
              <strong>{recipient}</strong>
            </h2>
          )}
        </>
      );
    }
    res.send('')
    return;
  }
  res.send(
    <Layout>
      <h1 class="heading">
        {i18n(lang, SECRET_SANTA)} - {i18n(lang, ROOM_NAME)} : {roomName}
      </h1>
      <div class="container">
        <div>
          {i18n(lang, YOUR_NAME)}: {userName}
        </div>
        <h2 class="subheading">{i18n(lang, PARTICIPANTS)}</h2>
        <ul
          hx-trigger="every 2s"
          hx-get=""
          id="participants"
          hx-target="#participants"
        >
          {(participants ?? []).map((userName) =>
            userName === room.adminName ? (
              <li>
                <i>{userName}</i>
              </li>
            ) : (
              <li>{userName}</li>
            )
          )}
        </ul>
        {admin && !recipient && (
          <button class="button" id="assign" hx-post="" hx-swap="outerHTML">
            {" "}
            {i18n(lang, ASSIGN)}{" "}
          </button>
        )}
        <div
          id="recipient"
          hx-get=""
          hx-target="#recipient"
          hx-trigger="every 2s"
        >
          {recipient && (
            <h2 class="message">
              {i18n(lang, YOU_ARE_MAKING_PRESENTS_FOR)}{" "}
              <strong>{recipient}</strong>
            </h2>
          )}
        </div>
      </div>
      <a href={"/" + lang + "/"}>{i18n(lang, GO_BACK_TO_MAIN_PAGE)}</a>
    </Layout>
  );
});

app.use(
  "/:lang((ru|en)?)",
  (req, res, next) => {
    req.lang = req.params.lang ?? "ru";
    next();
  },
  appRouter
);
app.listen(3000);
