const Layout = require("../../components/Layout");
const roomParticipantsUpdate = require("../../events/roomParticipantsUpdate");
const EventEmitter = require("events");
const {
  i18n,
  SECRET_SANTA,
  ROOM_NAME,
  YOUR_NAME,
  GO_BACK_TO_MAIN_PAGE,
  PARTICIPANTS,
  YOU_ARE_MAKING_PRESENTS_FOR,
  ASSIGN,
} = require("../../i18n");
const { Router } = require("express");

const roomRouter = new Router();
const roomAssigned = new EventEmitter();
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
  req.rooms[roomName].generatedIndexes = generate(
    req.rooms[roomName].userNames.length
  );
  roomAssigned.emit(roomName);
  res.send("");
});

roomRouter.get("/room/update-participants", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  const roomName = req.session.roomName;

  const callback = () => {
    res.write(
      <>
        {"data: "}
        <ParticipantListItems req={req} />
        {"\n\n"}
      </>
    );
  };
  roomParticipantsUpdate.addListener(roomName, callback);

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("2 client dropped me");
    roomParticipantsUpdate.removeListener(roomName, callback);
    res.end();
  });
});

roomRouter.get("/room/update-recipient", (req, res) => {
  if (!req.rooms[req.session.roomName]) {
    res.send("");
    return;
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  const roomName = req.session.roomName;

  const callback = () => {
    res.write("data: ${JSON.stringify({ num: counter })}\n\n");
    return res.write(
      <>
        {"data:"}<Recipient req={req} />{"\n\n"}
      </>
    );
  };
  roomAssigned.addListener(roomName, callback);

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    roomAssigned.removeListener(roomName, callback);
    res.end();
  });
});

function Recipient({req}) {
  const roomName = req.session.roomName;
  const room = req.rooms[roomName];
  const participants = room.userNames;
  const userName = req.session.userName;
  let recipient;
  if (room.generatedIndexes) {
    const userIndex = participants.indexOf(userName);
    const recipientIndex = room.generatedIndexes[userIndex];
    recipient = participants[recipientIndex];
  }
  return !!recipient && (
    <h2 class="message">
      {i18n(req.lang, YOU_ARE_MAKING_PRESENTS_FOR)}{" "}
      <strong>{recipient}</strong>
    </h2>
  )
}

function ParticipantListItems({req}) {
  const roomName = req.session.roomName;
  const room = req.rooms[roomName];
  const participants = room.userNames;
  return <>{(participants ?? []).map((userName) =>
    userName === room.adminName ? (
      <li>
        <i>{userName}</i>
      </li>
    ) : (
      <li>{userName}</li>
    )
  )}
  </>
}

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
          hx-ext="sse"
          sse-connect={"/" + lang + "/room/update-participants"}
          sse-swap="message"
        >
          <ParticipantListItems req={req} />
        </ul>
        {admin && !room.generatedIndexes && (
          <button
            class="button"
            hx-post={"/" + lang + "/room/assign"}
            hx-swap="outerHTML"
          >
            {i18n(lang, ASSIGN)}
          </button>
        )}
        <div
          hx-ext="sse"
          sse-connect={"/" + lang + "/room/update-recipient"}
          sse-swap="message"
        >
        </div>
      </div>
      <a hx-boost="true" href={"/" + lang + "/"}>
        {i18n(lang, GO_BACK_TO_MAIN_PAGE)}
      </a>
    </Layout>
  );
});

module.exports = roomRouter;
