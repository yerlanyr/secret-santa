import { i18n, SECRET_SANTA, CREATE_ROOM, ROOM_NAME, GO_BACK_TO_MAIN_PAGE, THIS_NAME_IS_TAKEN, YOUR_NAME } from './resources';
export default (navigate, createRoom, isAvailable, store) => customElements.define('create-room', class extends HTMLElement {
    connectedCallback(){
        this.lang = store.getState().lang;
        this._updateRendering();
    }
    _updateRendering(){
        this.innerHTML = `
        <h1 class="heading">${i18n(this.lang, SECRET_SANTA)} - ${i18n(this.lang, CREATE_ROOM).toLowerCase()}</h1>
        <form class="form">
        <table class="form--table">
        <tr>
        <td><label for="room-name">${i18n(this.lang, ROOM_NAME)}: </label>
        </td>
        <td><input type="text" id="room-name" class="input room-name"/>
        <br>
        <span class="invalid-input-alert">${i18n(this.lang, THIS_NAME_IS_TAKEN)}</span>
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
        <td><input type="submit" class="button" value="${i18n(this.lang, CREATE_ROOM)}"/>
        </td>
        </tr>
        </table>
        <br/>
        
        </form>
        <a href="#/">${i18n(this.lang, GO_BACK_TO_MAIN_PAGE)}</a>`;
        let isNameTaken = false;
        this.querySelector('.form').addEventListener('submit', (evt) => {
            evt.preventDefault();       
            if(isNameTaken) return;
            createRoom(this.querySelector('#room-name').value.trim(), this.querySelector('#your-name').value.trim());
        });
        this.querySelector('.invalid-input-alert').style.visibility = 'hidden';
        this.querySelector('#room-name').addEventListener('keyup', (evt) => {
            isAvailable(this.querySelector('#room-name').value, answer => {
                if(answer == "taken"){
                    this.querySelector('.invalid-input-alert').style.visibility = 'visible';
                    isNameTaken = true;
                } else {
                    this.querySelector('.invalid-input-alert').style.visibility = 'hidden';
                    isNameTaken = false;
                }
            });
        });
    }
});