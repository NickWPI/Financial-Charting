export default class Graph {
    constructor() {
        this.properties = {};
    }
    
    setProperties(props) {
        this.properties = Object.assign(this.properties, props);
        return this;
    }
}