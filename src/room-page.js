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
    _updateRendering({room, roomName, userName}){
        const participants = room.userNames;
        const admin = room.adminName === userName;
        const recipient = room.generatedIndexes ? room.userNames[room.generatedIndexes[room.userNames.indexOf(userName)]] : undefined;
        this.innerHTML = `
        <h1 class="heading">Secret santa - room</h1>
        <div class="container">
        <div>Room name: ${roomName}</div>
        <div>Your name: ${userName}</div>
        <h2 class="subheading">Participants</h2>
        <ul>
            ${participants && participants.map(userName => userName === room.adminName ? `<li><i>${userName}</i></li>` : `<li>${userName}</li>`).join('')}
        </ul>
        ${admin && !recipient ? `<button class="button" id="assign"> Assign </button>`: ''}
        ${recipient && `<h2 class="message">You are making presents for <strong>${recipient}</strong></h2>` || ''}
        </div>
        <a href="#/"> Go back to main page</a>
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