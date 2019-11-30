import { i18n, SECRET_SANTA, JOIN_ROOM, ROOM_NAME, THERE_IS_NO_SUCH_ROOM, YOUR_NAME, GO_BACK_TO_MAIN_PAGE } from './resources';
export default (navigate, joinRoom, store, isAvailable) => customElements.define('join-room', class extends HTMLElement {
    connectedCallback(){
        this.lang = store.getState().lang;
        this._updateRendering();
    }
    _updateRendering(){
        this.innerHTML = `<h1 class="heading">${i18n(this.lang, SECRET_SANTA)} - ${i18n(this.lang, JOIN_ROOM)}</h1>
        <form class="form">
        <table class="form--table">
        <tr>
        <td><label for="room-name">${i18n(this.lang, ROOM_NAME)}: </label>
        </td>
        <td><input type="text" id="room-name" class="input room-name"/>
        <br>
        <span class="invalid-input-alert">${i18n(this.lang, THERE_IS_NO_SUCH_ROOM)}</span>
        </td>
        </tr>
        <tr>
        <td><label for="your-name">${i18n(this.lang, YOUR_NAME)}: </label>
        </td>
        <td><input type="text" id="your-name" class="input your-name"/>
        </td>
        </tr>
        <tr>
        <td>
        </td>
        <td><input type="submit" class="button" value="${i18n(this.lang, JOIN_ROOM)}"/>
        </td>
        </tr>
        </table>
        <br/>
        
        </form>
        <a href="#/">${i18n(this.lang, GO_BACK_TO_MAIN_PAGE)}</a>
        `;
        this.querySelector('.form').addEventListener('submit', (evt) => {
            joinRoom(this.querySelector('.room-name').value, this.querySelector('.your-name').value);
            evt.preventDefault();
        });
        let isNameTaken = false;
        this.querySelector('.invalid-input-alert').style.visibility = 'hidden';
        this.querySelector('#room-name').addEventListener('keyup', (evt) => {
            isAvailable(evt.target.value, answer => {
                if(answer === "taken"){
                    this.querySelector('.invalid-input-alert').style.visibility = 'hidden';
                    isNameTaken = true;
                } else {
                    this.querySelector('.invalid-input-alert').style.visibility = 'visible';
                    isNameTaken = false;
                }
            });
        });
    }
});