const SECRET_SANTA = Symbol();
exports.SECRET_SANTA = SECRET_SANTA;
const CREATE_ROOM = Symbol();
exports.CREATE_ROOM = CREATE_ROOM;
const ROOM_NAME = Symbol();
exports.ROOM_NAME = ROOM_NAME;
const THIS_NAME_IS_TAKEN = Symbol();
exports.THIS_NAME_IS_TAKEN = THIS_NAME_IS_TAKEN;
const YOUR_NAME = Symbol();
exports.YOUR_NAME = YOUR_NAME;
const GO_BACK_TO_MAIN_PAGE = Symbol();
exports.GO_BACK_TO_MAIN_PAGE = GO_BACK_TO_MAIN_PAGE;
const JOIN_ROOM = Symbol();
exports.JOIN_ROOM = JOIN_ROOM;
const THERE_IS_NO_SUCH_ROOM = Symbol();
exports.THERE_IS_NO_SUCH_ROOM = THERE_IS_NO_SUCH_ROOM;
const EXIT_ROOM = Symbol();
exports.EXIT_ROOM = EXIT_ROOM;
const ENTER_ROOM = Symbol();
exports.ENTER_ROOM = ENTER_ROOM;
const PARTICIPANTS = Symbol();
exports.PARTICIPANTS = PARTICIPANTS;
const YOU_ARE_MAKING_PRESENTS_FOR = Symbol();
exports.YOU_ARE_MAKING_PRESENTS_FOR = YOU_ARE_MAKING_PRESENTS_FOR;
const ASSIGN = Symbol();
exports.ASSIGN = ASSIGN;
const THIS_ROOM_ALREADY_PLAYED_OUT = Symbol();
exports.THIS_ROOM_ALREADY_PLAYED_OUT = THIS_ROOM_ALREADY_PLAYED_OUT

const resources = {
  [SECRET_SANTA]: {
    ru: "Секретный санта",
    en: "Secret santa",
  },
  [CREATE_ROOM]: {
    ru: "Создать комнату",
    en: "Create room",
  },
  [ROOM_NAME]: {
    en: "Room name",
    ru: "Имя комнаты",
  },
  [THIS_NAME_IS_TAKEN]: {
    en: "This name is taken",
    ru: "Такое имя занято",
  },
  [YOUR_NAME]: {
    en: "Your name",
    ru: "Твоё имя",
  },
  [GO_BACK_TO_MAIN_PAGE]: {
    en: "Go back to main page",
    ru: "Назад на главную",
  },
  [JOIN_ROOM]: {
    en: "Join room",
    ru: "Присоединится к комнате",
  },
  [THERE_IS_NO_SUCH_ROOM]: {
    en: "There is no such room",
    ru: "Нет такой комнаты",
  },
  [EXIT_ROOM]: {
    en: "Exit room",
    ru: "Выйти из комнаты",
  },
  [ENTER_ROOM]: {
    en: "Enter room",
    ru: "Войти в комнату",
  },
  [PARTICIPANTS]: {
    en: "Participants",
    ru: "Участники",
  },
  [ASSIGN]: {
    en: "Assign",
    ru: "Назначить",
  },
  [YOU_ARE_MAKING_PRESENTS_FOR]: {
    en: "You are making presents for",
    ru: "Ты делаешь подарки для",
  },
  [THIS_ROOM_ALREADY_PLAYED_OUT]: {
    en: "This room already assigned Secret Santas, this user name is new",
    ru: "Эта комната уже разыграла Секретного Санту, это имя пользователя новое"
  }
};

exports.i18n = function i18n(lang, invariant) {
  return resources[invariant][lang];
};
