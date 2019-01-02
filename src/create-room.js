export default (navigate, createRoom, isAvailable) => customElements.define('create-room', class extends HTMLElement {
    connectedCallback(){
        this._updateRendering();
    }
    _updateRendering(){
        this.innerHTML = `
        <h1 class="heading">Secret santa - create room</h1>
        <form class="form">
        <table class="form--table">
        <tr>
        <td><label for="room-name">Room name: </label>
        </td>
        <td><input type="text" id="room-name" class="input room-name"/>
        <br>
        <span class="invalid-input-alert">This name is taken</span>
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
        <td><input type="submit" class="button" value="Create room"/>
        </td>
        </tr>
        </table>
        <br/>
        
        </form>
        <a href="#/"> Go back to main page</a>`;
        let isNameTaken = false;
        this.querySelector('.form').addEventListener('submit', (evt) => {
            evt.preventDefault();       
            if(isNameTaken) return;
            createRoom(this.querySelector('#room-name').value, this.querySelector('#your-name').value);
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