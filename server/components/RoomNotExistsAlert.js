const { i18n, THERE_IS_NO_SUCH_ROOM } = require("../i18n");

function RoomNotExistsAlert({ lang }) {
  return (
    <span class="invalid-input-alert">{i18n(lang, THERE_IS_NO_SUCH_ROOM)}</span>
  );
}
exports.RoomNotExistsAlert = RoomNotExistsAlert;
