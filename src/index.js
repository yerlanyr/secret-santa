import './style.css';
import Router from './routing';
import mainPage from './main-page';
import createRoom from './create-room';
import roomPage from './room-page';
import joinRoom from './join-room';
import io from 'socket.io-client'; 
import {createStore} from 'redux';
let defaultState = {
    room: {userNames: []}
};

const store = createStore((state = defaultState, action) => {
    switch(action.type){
        case 'SET_ROOM': return {...state, room: action.room};
        case 'SET_ROOM_NAME': return {...state, roomName: action.roomName};
        case 'SET_USER_NAME': return {...state, userName: action.userName};
        case 'SET_ADMIN_TRUE': return {...state, admin: true};
        case 'SET_RECIPIENT': return {...state, recipient: action.recipient};
        case 'EXIT_ROOM': return defaultState;
        default : return state;
    }
},
    localStorage.getItem('redux') ? JSON.parse(localStorage.getItem('redux')) : undefined,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
    localStorage.setItem('redux', JSON.stringify(store.getState()));
});
const socket = io('/');
if(store.getState().roomName){
    socket.emit('get-room', store.getState().roomName, (room) => {
        store.dispatch({type: 'SET_ROOM', room});
    });
}
socket.on('set-room', (room, f) => {
    store.dispatch({type: 'SET_ROOM', room});
});
const isAvailable = (name, f) => { socket.emit('is-name-taken', name, f); }
const contentDiv = document.getElementById('content');
const routes = {
    '/create' : '<create-room></create-room>',
    '/join' : '<join-room></join-room>',
    '/' : '<main-page></main-page>',
    '/room' : '<room-page></room-page>'
};
const router = new Router(contentDiv, routes);
router.initialize();
const navigate = router.navigate.bind(router);

const createRoomRequest = (roomName, userName) => {
    socket.emit('create-room', roomName, userName, (room) => {
        if(room.error){
            alert(room.error); return;
        }
        store.dispatch({type: 'SET_ROOM', room});
        store.dispatch({type: 'SET_ROOM_NAME', roomName});
        store.dispatch({type: 'SET_USER_NAME', userName});
        navigate('/room');
    });
}

const joinRoomRequest = (roomName, userName) => {
    socket.emit('join-room', roomName, userName, (room) => {
        if(room.error){
            alert(room.error); return;
        }
        store.dispatch({type: 'SET_ROOM', room});
        store.dispatch({type: 'SET_ROOM_NAME', roomName});
        store.dispatch({type: 'SET_USER_NAME', userName});
        navigate('/room');
    });
}
const assignRecipients = (f) => {
    socket.emit('assign-recipients', store.getState().roomName, f);
};

mainPage(navigate, store);
createRoom(navigate, createRoomRequest, isAvailable, store);
roomPage(store, assignRecipients, navigate);
joinRoom(navigate, joinRoomRequest, store, isAvailable);
