import './style.css';
import Router from './routing';
import mainPage from './main-page';
import createRoom from './create-room';
import roomPage from './room-page';
import joinRoom from './join-room';
import io from 'socket.io-client';
import {createStore} from 'redux';
let defaultState = {};
if(process.env.NODE_ENV === 'development'){
   /* defaultState = {
        participants: [{userName:'user'},{userName:'user1'}],
        //roomName: 'myRoom',
        userName: 'mariko',
        recipient: 'Indira',
        admin: false
    };*/
}
const store = createStore((state = defaultState, action) => {
    switch(action.type){
        case 'SET_PARTICIPANTS': return {...state, participants: action.participants};
        case 'SET_ROOM_NAME': return {...state, roomName: action.roomName};
        case 'SET_USER_NAME': return {...state, userName: action.userName};
        case 'SET_ADMIN_TRUE': return {...state, admin: true};
        case 'SET_RECIPIENT': return {...state, recipient: action.recipient};
        default : return state;
    }
},  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const socket = io('/');
socket.on('assign-recipient', (recipient) => {
    store.dispatch({type: 'SET_RECIPIENT', recipient});
});
const isAvailable = (name, f) => { socket.emit('is-name-taken', name, f); }
socket.on('set-participants', (participants) => {
    store.dispatch({type: 'SET_PARTICIPANTS', participants});
})
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
    socket.emit('create-room', roomName, userName, (data) => {
        store.dispatch({type: 'SET_PARTICIPANTS', participants: data});
        store.dispatch({type: 'SET_ROOM_NAME', roomName});
        store.dispatch({type: 'SET_USER_NAME', userName});
        store.dispatch({type: 'SET_ADMIN_TRUE'});
        navigate('/room');
    });
}

const joinRoomRequest = (roomName, userName) => {
    socket.emit('join-room', roomName, userName, (data) => {
        store.dispatch({type: 'SET_PARTICIPANTS', participants: data});
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
