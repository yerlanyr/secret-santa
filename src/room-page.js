export default () => customElements.define('room-page', class extends HTMLElement {
    connectedCallback(){
        this._updateRendering();
    }
    _updateRendering(){
        this.innerHTML = `
        <h1 class="heading">Secret santa - room</h1>
        <div class="container">
        <h2 class="subheading">Participants</h2>
        <ul>
            <li>Anita</li>
            <li>Uri</li>
            <li>Mariko</li>
            <li>Elise</li>
        </ul>
        <button class="button">Assign</button>
        <h2 class="message">You are making presents for <strong>Uri</strong></h2>
        </div>
        <a href="#/"> Go back to main page</a>
        `;
    }
});