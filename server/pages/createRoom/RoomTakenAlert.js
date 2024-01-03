const { i18n, THIS_NAME_IS_TAKEN } = require("../../i18n");

function RoomTakenAlert({ lang }) {
  return (
    <span class="invalid-input-alert">{i18n(lang, THIS_NAME_IS_TAKEN)}</span>
  );
}
exports.RoomTakenAlert = RoomTakenAlert;
