const Layout = require("../components/Layout");
const {
  i18n,
  SECRET_SANTA,
  ROOM_NAME,
  YOUR_NAME,
  GO_BACK_TO_MAIN_PAGE,
  PARTICIPANTS,
  YOU_ARE_MAKING_PRESENTS_FOR,
  ASSIGN,
} = require("../i18n");
const { Router } = require("express");

const roomRouter = new Router()

roomRouter.post("/room/assign", (req, res) => {
  const lang = req.lang;
  const roomName = req.session.roomName;
  const isLoggedIn = roomName !== undefined;

  if (!isLoggedIn || !(roomName in req.rooms)) {
    res.redirect("/" + lang);
  }
  const generate = function (n) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(i);
    for (let i = 0; i < n - 1; i++) {
      const swapWith = i + 1 + ~~(Math.random() * (n - i - 1));
      const temp = arr[i];
      arr[i] = arr[swapWith];
      arr[swapWith] = temp;
    }
    return arr;
  };
  req.rooms[roomName].generatedIndexes = generate(req.rooms[roomName].userNames.length);
  res.send("");
});

roomRouter.get("/room/participants", (req, res) => {
  const room = req.rooms[req.session.roomName];
  if(!room) {
    req.session.roomName = undefined
    req.session.userName = undefined
    res.set('HX-Location', '/')
    res.send('')
    return;
  }
  const participants = room.userNames;

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
});

roomRouter.get("/room/recipient", (req, res) => {
  const room = req.rooms[req.session.roomName];
  if(!room) {
    res.send('')
    return
  }
  const participants = room.userNames;
  const userName = req.session.userName;

  let recipient;
  if (room.generatedIndexes) {
    const userIndex = participants.indexOf(userName);
    const recipientIndex = room.generatedIndexes[userIndex];
    recipient = participants[recipientIndex];
  }

  return res.send(
    <>
      {recipient && (
        <h2 class="message">
          {i18n(req.lang, YOU_ARE_MAKING_PRESENTS_FOR)}{" "}
          <strong>{recipient}</strong>
        </h2>
      )}
    </>
  );
});

roomRouter.get("/room", (req, res) => {
  const roomName = req.session.roomName;
  const isLoggedIn = roomName !== undefined;
  const lang = req.lang;

  if (!isLoggedIn || !(roomName in req.rooms)) {
    res.redirect("/" + lang);
  }

  const room = req.rooms[req.session.roomName];
  const userName = req.session.userName;
  const admin = room.adminName === userName;

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
          hx-trigger="load, every 2s"
          hx-get={"/" + lang + "/room/participants"}
          id="participants"
          hx-target="#participants"
        >
        </ul>
        {admin && !room.generatedIndexes && (
          <button class="button" hx-post={'/' + lang + "/room/assign"} hx-swap="outerHTML">
            {i18n(lang, ASSIGN)}
          </button>
        )}
        <div
          id="recipient"
          hx-get={"/" + lang + "/room/recipient"}
          hx-trigger="load, every 2s"
        >
        </div>
      </div>
      <a hx-boost="true" href={"/" + lang + "/"}>{i18n(lang, GO_BACK_TO_MAIN_PAGE)}</a>
    </Layout>
  );
});

module.exports = roomRouter