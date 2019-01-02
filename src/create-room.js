export default (navigate) => customElements.define('create-room', class extends HTMLElement {
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
        this.querySelector('.form').addEventListener('submit', (evt) => {
            navigate('/room');
            evt.preventDefault();
        });
    }
});