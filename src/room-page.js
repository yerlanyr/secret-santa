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
    _updateRendering({admin, recipient,participants, roomName, userName}){
        this.innerHTML = `
        <h1 class="heading">Secret santa - room</h1>
        <div class="container">
        <div>Room name: ${roomName}</div>
        <div>Your name: ${userName}</div>
        ${admin ? `<h2 class="subheading">Participants</h2>
        <ul>
            ${participants && participants.map(({userName}) => `<li>${userName}</li>`).join('')  || ''}
        </ul>` : !recipient ? `<h2 class="message">Waiting for admin to assign a recipient for you</h2>` : ''}
        ${admin && `<button class="button" id="assign">${!recipient ? 'Assign' : 'Reassign'}</button>` || ''}
        ${recipient && `<h2 class="message">You are making presents for <strong>${recipient}</strong></h2>` || ''}
        </div>
        <a href="#/"> Go back to main page</a>
        `;
        this.querySelector('#assign') && this.querySelector('#assign').addEventListener('click', () => {
            assignRecipients(() => {});
        });
    }
});