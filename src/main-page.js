export default (navigate, store) => customElements.define('main-page', class extends HTMLElement {
    connectedCallback(){
        this._updateRendering(store.getState());
        this._unsubscribe = store.subscribe(() => {
            this._updateRendering(store.getState());
        });
    }
    disconnectedCallback(){
        this._unsubscribe();
    }
    _click(s, f) {
        this.querySelector(s) && this.querySelector(s).addEventListener('click', f);
    }
    _updateRendering({roomName}){
        this.innerHTML = `
        <h1 class="heading">Secret santa</h1>
        <div class="main-page--buttons">
        ${roomName ? `<button class="button enter-room">enter room</button><button class="button exit-room">exit room</button>`: `<button class="button create">create</button>
        <button class="button join">join</button>`}
    </div>
        `;
        this._click('.create', () => {
            navigate('/create')
        });
        this._click('.join', () => {
            navigate('/join');
        });
        this._click('.enter-room', () => {
            navigate('/room');
        })
        this._click('.exit-room', () => {
            store.dispatch({type: 'EXIT_ROOM'});
        })
    }
});