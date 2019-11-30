import { i18n, SECRET_SANTA, ENTER_ROOM, EXIT_ROOM, CREATE_ROOM, JOIN_ROOM } from './resources';

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
    _updateRendering({roomName, lang}){
        this.innerHTML = `
        <langs-el></langs-el>
        <h1 class="heading">${i18n(lang, SECRET_SANTA)}</h1>
        <div class="main-page--buttons">
        ${roomName ? `<button class="button enter-room">${i18n(lang, ENTER_ROOM)}</button><button class="button exit-room">${i18n(lang, EXIT_ROOM)}</button>`: `<button class="button create">${i18n(lang, CREATE_ROOM)}</button>
        <button class="button join">${i18n(lang, JOIN_ROOM)}</button>`}
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