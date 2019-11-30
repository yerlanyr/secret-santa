export const SECRET_SANTA = Symbol();
export const CREATE_ROOM = Symbol();
export const ROOM_NAME = Symbol();
export const THIS_NAME_IS_TAKEN = Symbol();
export const YOUR_NAME = Symbol();
export const GO_BACK_TO_MAIN_PAGE = Symbol();
export const JOIN_ROOM = Symbol();
export const THERE_IS_NO_SUCH_ROOM = Symbol();
export const EXIT_ROOM = Symbol();
export const ENTER_ROOM = Symbol();
export const PARTICIPANTS = Symbol();
export const YOU_ARE_MAKING_PRESENTS_FOR = Symbol();
export const ASSIGN = Symbol();

const resources = {
    [SECRET_SANTA]: {
        'ru' : 'Секретный санта',
        'en' : 'Secret santa'
    },
    [CREATE_ROOM]: {
        'ru' : 'Создать комнату',
        'en' : 'Create room'
    },
    [ROOM_NAME]: {
        'en' : 'Room name',
        'ru' : 'Имя комнаты'
    },
    [THIS_NAME_IS_TAKEN]: {
        'en' : 'This name is taken',
        'ru' : 'Такое имя занято'
    },
    [YOUR_NAME]: {
        'en' : 'Your name',
        'ru' : 'Твоё имя'
    },
    [GO_BACK_TO_MAIN_PAGE]: {
        'en' : 'Go back to main page',
        'ru' : 'Назад на главную'
    },
    [JOIN_ROOM]: {
        'en': 'Join room',
        'ru' : 'Присоединится к комнате'
    },
    [THERE_IS_NO_SUCH_ROOM]: {        
        'en': 'There is no such room',
        'ru' : 'Нет такой комнаты'
    },
    [EXIT_ROOM] : {        
        'en': 'Exit room',
        'ru' : 'Выйти из комнаты'
    },
    [ENTER_ROOM] : {
        'en': 'Enter room',
        'ru' : 'Войти в комнату'
    },
    [PARTICIPANTS] : {
        'en': 'Participants',
        'ru' : 'Участники'
    },
    [ASSIGN] : {
        'en' : 'Assign',
        'ru' : 'Назначить'
    },
    [YOU_ARE_MAKING_PRESENTS_FOR]: {
        'en' : 'You are making presents for',
        'ru' : 'Ты делаешь подарки для'
    }
};

export function i18n(lang, invariant){
    return resources[invariant][lang];
}