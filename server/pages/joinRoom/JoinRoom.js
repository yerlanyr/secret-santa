const Layout = require("../../components/Layout");
const {
  i18n,
  SECRET_SANTA,
  JOIN_ROOM,
  ROOM_NAME,
  YOUR_NAME,
  GO_BACK_TO_MAIN_PAGE,
  THIS_ROOM_ALREADY_PLAYED_OUT,
} = require("../../i18n");

const JoinRoom = ({ lang, isAssigned }) => {
  return (
    <Layout>
      <h1 class="heading">
        {i18n(lang, SECRET_SANTA)} - {i18n(lang, JOIN_ROOM)}
      </h1>
      <form
        class="form"
        hx-post
        hx-swap="none"
        hx-disabled-elt="input[type=submit]"
      >
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
                hx-trigger="change, changed, keyup delay:300, consume"
                hx-swap="innerHTML"
                hx-post={`/${lang}/join-room/room-is-taken`}
              />
              <br />
              <div id="room-is-taken-alert">
                {isAssigned && i18n(lang, THIS_ROOM_ALREADY_PLAYED_OUT)}
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
      <a href="/" hx-boost="true">
        {i18n(lang, GO_BACK_TO_MAIN_PAGE)}
      </a>
    </Layout>
  );
};
exports.JoinRoom = JoinRoom;
