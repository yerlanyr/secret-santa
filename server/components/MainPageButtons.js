const { i18n, ENTER_ROOM, EXIT_ROOM, CREATE_ROOM } = require("../i18n");

function MainPageButtons({ isLoggedIn, lang }) {
  return <div class="main-page--buttons">
    {isLoggedIn ? (
      <>
        <a class="button enter-room" href={"/" + lang + "/room"}>
          {i18n(lang, ENTER_ROOM)}
        </a>
        <a class="button exit-room" href={"/" + lang + "/exit-room"}>
          {i18n(lang, EXIT_ROOM)}
        </a>
      </>
    ) : (
      <>
        <a class="button enter-room" href={"/" + lang + "/join-room"}>
          {i18n(lang, ENTER_ROOM)}
        </a>
        <a class="button create" href={"/" + lang + "/create-room"}>
          {i18n(lang, CREATE_ROOM)}
        </a>
      </>
    )}
  </div>;
}
exports.MainPageButtons = MainPageButtons;
