const request = require("supertest");
const { app } = require("./app");
const { parse } = require("node-html-parser");

let agent;

beforeEach(() => {
  agent = request.agent(app);
});

describe("App unauthorized flow", () => {
  it("should show enter room and create room buttons when user goes to main page", (done) => {
    agent
      .get("/en")
      .expect(function (res) {
        expect(res.status).toEqual(200);
        const body = parse(res.text);
        expect(body.querySelector(".enter-room").textContent).toEqual(
          "Enter room"
        );
        expect(body.querySelector(".create").textContent).toEqual(
          "Create room"
        );
      })
      .end(done);
  });
  it("should redirect user when trying to enter room", (done) => {
    agent.get("/en/room").expect(302).expect("Location", "/en").end(done);
  });
  it("should show join room page", (done) => {
    agent
      .get("/en/join-room")
      .expect(function (res) {
        const body = parse(res.text);
        expect(
          body.querySelector(".heading").textContent
        ).toMatchInlineSnapshot(`"Secret santa - Join room"`);
      })
      .end(done);
  });
});

describe("App authorized flow", () => {
  it("should after creating room user ", (done) => {
    let cookie
    let cookie2
    let agent2 = request.agent(app)
    agent
      .post("/en/create-room")
      .send("room-name=a&user-name=a")
      .expect("HX-Location", "/en/room")
      .end(function (err, res) {
        if (res.headers["set-cookie"] && res.headers["set-cookie"][0])
          cookie = res.headers["set-cookie"][0];
        agent.get("/en/room").expect(200).set('Cookie', cookie).end(function () {
          agent2.post('/en/join-room').send('room-name=a&user-name=b').end(function(err, res) {
            if(res.headers['set-cookie'] && res.headers['set-cookie'][0]) {
              cookie2 = res.headers['set-cookie'][0]
            }
            agent2.get('/en/room').set('Cookie', cookie2).expect(200).end(done)
          })
        });

      });
  });
});
