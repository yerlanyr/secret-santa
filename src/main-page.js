export default (navigate) => customElements.define('main-page', class extends HTMLElement {
    connectedCallback(){
        this._updateRendering();
        
    }
    _click(s, f) {
        this.querySelector(s).addEventListener('click', f);
    }
    _updateRendering(){
        this.innerHTML = `
        <h1 class="heading">Secret santa</h1>
        <div class="main-page--buttons">
        <button class="button create">create</button>
        <button class="button join">join</button>
    </div>
        `;
        this._click('.create', () => {
            navigate('/create')
        });
        this._click('.join', () => {
            navigate('/join');
        });
    }
});