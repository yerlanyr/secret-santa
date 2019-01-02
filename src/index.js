import './style.css';
import Router from './routing';
import mainPage from './main-page';
import createRoom from './create-room';
import roomPage from './room-page';
import joinRoom from './join-room';

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

mainPage(navigate);
createRoom(navigate);
roomPage();
joinRoom(navigate);
