import Graph from "../Graph"

class LabelContainer extends Graph {
    constructor() {
        super();
        this.setProperties({
            layout: "vertical",
            verticalRowSize: 13,
            origin: [0, 0]
        });
        this.labels = [];
    }

    addLabel(label, id) {
        this.labels.push(label);
        if(id != undefined) {
            label.setProperties({
                id: id
            })
        }
        return this;
    }

    removeLabel(id) {
        this.labels = this.labels.filter(d => d.properties.id !== id);
        return this;
    }

    removeLabelByLabel(labelName) {
        this.labels = this.labels.filter(d => d.labelText() !== labelName);
        return this;
    }

    removeLabelByValue(labelValue) {
        this.labels = this.labels.filter(d => d.labelValue() !== labelValue);
        return this;
    }

    draw(surface, chartProps) {
        let svgTarget = surface.getOverlaySVG();

        const {
            accessor,
            plotData: data
        } = this.properties;
        let { origin, verticalRowSize } = this.properties;
        let { origin: chartOrigin } = chartProps;

        /*let currentItem = chartProps.currentItem;
        let currentData;
        if(currentItem == undefined || accessor(currentItem) == undefined) {
            //use latest data as backup
            currentItem = data[data.length - 1];
        }
        if(currentItem != undefined && accessor(currentItem) != undefined) {
            currentData = accessor(currentItem);
        }*/

        this.labels.map(function(label, index) {
            //get values
            let { accessor } = label;
    
            //adjust position
            let [x, y] = origin;
            let labelOrigin = [0 + x, ((verticalRowSize / 2) * index) + y];
            //set properties
            let newProps = {
                origin: labelOrigin,
                plotData: data
            };
            label.setProperties(newProps);
            //draw
            label.draw(surface, chartProps);
        }.bind(this));
    }
}

export default function() {
    return new LabelContainer();
}