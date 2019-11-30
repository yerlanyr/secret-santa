export default (store) => customElements.define('langs-el', class extends HTMLElement {
    connectedCallback(){
        const ur = () => this._updateRendering(store.getState(), (lang) => store.dispatch({type: 'SET_LANG', payload: lang}));
        store.subscribe(() => {
            ur();
        });
        ur();
    }
    _updateRendering({lang}, setLang){
        this.innerHTML = `<div class="langs"><span id="langs--link_ru" class="langs--link ${lang == 'ru' ? 'langs--link_active' : ''}">ru</span><span id="langs--link_en" class="langs--link ${lang == 'en' ? 'langs--link_active' : ''}">en</span></div>`;
        this.querySelector('#langs--link_ru').addEventListener('click', () => { setLang('ru'); });
        this.querySelector('#langs--link_en').addEventListener('click', () => { setLang('en'); });
    }
});