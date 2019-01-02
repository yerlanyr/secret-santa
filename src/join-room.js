export default (navigate, joinRoom, store, isAvailable) => customElements.define('join-room', class extends HTMLElement {
    connectedCallback(){
        this._updateRendering();
    }
    _updateRendering(){
        this.innerHTML = `<h1 class="heading">Secret santa - join room</h1>
        <form class="form">
        <table class="form--table">
        <tr>
        <td><label for="room-name">Room name: </label>
        </td>
        <td><input type="text" id="room-name" class="input room-name"/>
        <br>
        <span class="invalid-input-alert">There is no such room</span>
        </td>
        </tr>
        <tr>
        <td><label for="your-name">Your name: </label>
        </td>
        <td><input type="text" id="your-name" class="input your-name"/>
        </td>
        </tr>
        <tr>
        <td>
        </td>
        <td><input type="submit" class="button" value="Join room"/>
        </td>
        </tr>
        </table>
        <br/>
        
        </form>
        <a href="#/"> Go back to main page</a>
        `;
        this.querySelector('.form').addEventListener('submit', (evt) => {
            joinRoom(this.querySelector('.room-name').value, this.querySelector('.your-name').value);
            evt.preventDefault();
        });
        let isNameTaken = false;
        this.querySelector('.invalid-input-alert').style.visibility = 'hidden';
        this.querySelector('#room-name').addEventListener('keyup', (evt) => {
            isAvailable(this.querySelector('#room-name').value, answer => {
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