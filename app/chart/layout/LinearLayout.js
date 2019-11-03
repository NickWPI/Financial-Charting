//height manager for chart based on weights
class LinearLayout {
    constructor(chartManager, properties) {
        this.chartManager = chartManager;
        this.properties = {
            origin: [0, 0]
        };
        this.properties = Object.assign({}, this.properties, properties);
        this.charts = {};
    }

    setProperties(properties) {
        this.properties = Object.assign({}, this.properties, properties);
        return this;
    }

    addLayout(parameters) {
        const { layout, weight, anchor, areaName } = parameters;
        this.charts[areaName] = { 
            isLayout: true, 
            weight: weight, 
            anchor: anchor, 
            layout: layout
        }

        this.updateLayout();

        return this;
    }

    addChart(parameters) {
        const { chart, weight, anchor, anchorWeight, areaName } = parameters;
        this.charts[areaName] = { 
            isLayout: false, 
            weight: weight, 
            anchor: anchor, 
            anchorWeight: anchorWeight,
            chart: chart
        }

        this.updateLayout();

        return this;
    }

    removeChart(name, searchChildren) {
        /*for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];
            if(chart.properties.id == id) {
                //get the x axis
                if(i == this.charts.length - 1) {
                    /*let xAxis = chart.getGraph("xAxis");
                    if(this.charts.length > 1) {
                        let secondLast = this.charts[this.charts.length - 2];
                        secondLast.addGraph(xAxis);
                        chart.removeGraph(xAxis);
                    }*/
                /*}

                delete chart.weight;
                delete chart.anchor;
                delete chart.areaName;
                this.charts.splice(i, 1);

                this.updateLayout();
                break;
            }
        }*/
        delete this.charts[name];
        this.updateLayout();
        return this;
    }

    removeLayout(name, searchChildren) {

    }

    updateLayout() {
        //console.log(this.charts);
        let currentY = 0;
        let totalWeights = 0;
        const entries = Object.entries(this.charts)
        for (const [name, chartArea] of entries) {
            //let chart = this.charts[i];
            //if it has an anchor then it wont factor
            //in to the total height
            const { anchor, anchorWeight, weight } = chartArea;
            if(anchor == undefined && anchorWeight == undefined && weight >= 0) {
                totalWeights += weight;
            }
        }
        let { height, width, spacing } = this.properties;
        for (const [name, chartArea] of entries) {
            const { anchor, anchorWeight, weight } = chartArea;
            
            let yPosition = 0; //chartArea.anchor == undefined ? currentY : chartArea.anchor;
            if(anchor == undefined && anchorWeight == undefined) {
                yPosition = currentY;
            }
            else {
                if(anchor != undefined) {
                    yPosition = anchor;
                }
                if(anchorWeight != undefined) {
                    yPosition = anchorWeight * height;
                }
            }

            let chartHeight = undefined;
            if(weight == undefined || weight >= 0) {
                chartHeight = Math.round((weight / totalWeights) * height);
            }
            else {
                chartHeight = height - yPosition;
            }

            let range = [chartHeight + yPosition, yPosition /*+ (yPosition == 0 ? 0 : spacing)*/];
            //console.log([0, range[1]]);
            //console.log(range);
            if(chartArea.anchor == undefined) {
                currentY += chartHeight /*+ offset*/;
            }
            if(chartArea.isLayout) {
                let layout = chartArea.layout;
                layout.setProperties({
                    origin: [0, range[1]],
                    width: width,
                    height: range[0]
                });
                layout.updateLayout();
            }
            else {
                let chart = chartArea.chart;
                chart.setProperties({
                    origin: [0, range[1]],
                    width: width,
                    height: range[0]
                });
            }
            //activate listener
            /*this.onLayoutChangedListeners.map(function(listener) {
                listener(this, name, chart);
            }.bind(this));*/
        }
        //get the lowest chart and make sure the x axis is placed there
    }
}

export default function() {
    return new LinearLayout();
}