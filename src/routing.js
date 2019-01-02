export default class Routing{
    constructor(contentDiv, routes){
        this.contentDiv = contentDiv;
        this.routes = routes;
    }
    initialize(){
        const addressOrDefault = () => this.contentDiv.innerHTML = this.routes[window.location.hash.replace('#','')] || this.routes['/'];
        window.onpopstate = addressOrDefault.bind(this);
        addressOrDefault();
    }
    navigate(url){
        window.history.pushState({}, url, window.location.origin + '#' + url);
        this.contentDiv.innerHTML = this.routes[url];
    }
}