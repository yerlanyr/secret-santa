const Layout = require("./Layout");
const { RoomTakenAlert } = require("./RoomTakenAlert");
const { i18n, CREATE_ROOM, SECRET_SANTA, ROOM_NAME, YOUR_NAME, GO_BACK_TO_MAIN_PAGE } = require("../i18n.js");

function CreateRoom({ lang, roomIsTaken }) {
  return (
    <Layout>
      <h1 class="heading">
        {i18n(lang, SECRET_SANTA)} - {i18n(lang, CREATE_ROOM).toLowerCase()}
      </h1>
      <form class="form" method="POST" target="">
        <table class="form--table">
          <tr>
            <td>
              <label for="room-name">{i18n(lang, ROOM_NAME)}: </label>
            </td>
            <td>
              <input
                type="text"
                id="room-name"
                name="room-name"
                class="input room-name"
                hx-target="#room-is-taken-alert"
                hx-trigger="change"
                hx-post={`/${lang}/create-room`} />
              <br />
              <div id="room-is-taken-alert">
                {roomIsTaken && <RoomTakenAlert />}
              </div>
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
                class="input your-name"
                name="user-name" />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="submit"
                class="button"
                value={i18n(lang, CREATE_ROOM)} />
            </td>
          </tr>
        </table>
        <br />
      </form>
      <a href="/">{i18n(lang, GO_BACK_TO_MAIN_PAGE)}</a>
    </Layout>
  );
}
exports.CreateRoom = CreateRoom;
