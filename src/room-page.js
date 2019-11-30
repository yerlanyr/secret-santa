import { i18n, ASSIGN, SECRET_SANTA, JOIN_ROOM, ROOM_NAME, THERE_IS_NO_SUCH_ROOM, YOUR_NAME, GO_BACK_TO_MAIN_PAGE, PARTICIPANTS, YOU_ARE_MAKING_PRESENTS_FOR } from './resources';

export default (store,assignRecipients, navigate) => customElements.define('room-page', class extends HTMLElement {
    connectedCallback(){
        if(!store.getState().roomName) navigate('/');
        this._updateRendering(store.getState());
        this._unsubscribe = store.subscribe(() => {
            this._updateRendering(store.getState());
        });
    }
    disconnectedCallback(){
        this._unsubscribe && this._unsubscribe();
    }
    _updateRendering({room, roomName, userName, lang}){
        const participants = room.userNames;
        const admin = room.adminName === userName;
        const recipient = room.generatedIndexes ? room.userNames[room.generatedIndexes[room.userNames.indexOf(userName)]] : undefined;
        this.innerHTML = `
        <h1 class="heading">${i18n(lang, SECRET_SANTA)} - ${i18n(lang, ROOM_NAME)} : ${roomName}</h1>
        <div class="container">
        <div>${i18n(lang, YOUR_NAME)}: ${userName}</div>
        <h2 class="subheading">${i18n(lang, PARTICIPANTS)}</h2>
        <ul>
            ${participants && participants.map(userName => userName === room.adminName ? `<li><i>${userName}</i></li>` : `<li>${userName}</li>`).join('')}
        </ul>
        ${admin && !recipient ? `<button class="button" id="assign"> ${i18n(lang, ASSIGN)} </button>`: ''}
        ${recipient && `<h2 class="message">${i18n(lang, YOU_ARE_MAKING_PRESENTS_FOR)} <strong>${recipient}</strong></h2>` || ''}
        </div>
        <a href="#/">${i18n(lang, GO_BACK_TO_MAIN_PAGE)}</a>
        `;
        this.querySelector('#assign') && this.querySelector('#assign').addEventListener('click', () => {
            assignRecipients((room) => {
                if(room.error){
                    alert(room.error); return;
                }
            });
        });
    }
});