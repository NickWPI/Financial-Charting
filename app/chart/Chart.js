import { isNumericalExtents } from "./Utils/ChartUtils";
import { 
    extent as d3Extents,
    scaleLinear as d3ScaleLinear,
    scaleTime as d3ScaleTime
} from "d3";

function setYRange(yScale, y, height, rangeRound, padding) {
    if(rangeRound) {
        if(padding == undefined) {
            padding = [0];
        }
        yScale.rangeRound([height - padding /* + y*/, y + padding]);
    }
    else {
        if(padding == undefined) {
            padding = 0;
        }
        yScale.range([height - padding /* + y*/, y + padding]);
    }
}

//yExtents = [d => [d.high, d.low], ema.accessor(), rsi.accessor()];
function calculateYExtents(yExtents, plotData) {
    let yExtentFunc = function(array, extents) {
        let result = [];
        array.forEach(function(item) {
            //if array of extents
            if(Array.isArray(extents)) {            
                extents.forEach(function(extent) {
                    result = result.concat(extent(item));
                });
            }
            else {
                result = result.concat(extents(item));
            }
        })
        return result;
    }
    //yDomainPadding
    //if y padding is a function, then use
    //let paddingValue = padding(low, high);
    let calculatedYExtent = d3Extents(yExtentFunc(plotData, yExtents));
    return calculatedYExtent;
}

function setXRange(xScale, x, width, rangeRound, padding) {
    if(rangeRound) {
        if(padding == undefined) {
            padding = [0];
        }
        xScale.rangeRound([x + padding, width - padding]);
    }
    else {
        if(padding == undefined) {
            padding = 0;
        }
        xScale.range([x + padding, width - padding]);
    }
}

const eventTypes = {
    PROPERTIES_UPDATED: "updateproperties",
    GRAPH_ADDED: "addgraph",
    GRAPH_REMOVED: "removegraph",
    SCALES_UPDATED: "updatescales",
    DRAW: "draw"
}

class Chart {
    constructor() {
        this.properties = {
            origin: [0, 0],
            yPadding: 0,
            yDomainPadding: 0.075,
            xPadding: 0,
            xScale: d3ScaleTime(),
            xAccessor: d => d.date,
            yScale: d3ScaleLinear(),
            yScaleRangeRound: false,
            yPanEnabled: false
        }
        this.graphs = [];
        //put xScale and yScale inside here?
        this.updatedProperties = {};
        this.eventHandlers = [];
    }

    addEventHandler(eventType, eventHandler) {
        let handler = {
            type: eventType,
            eventHandler: eventHandler
        };
        this.eventHandlers.push(handler);
    }

    removeEventHandler(eventType) {
        this.eventHandlers = this.eventHandlers.filter(d => d.type !== eventType);
    }

    getEventHandlers(eventType) {
        return this.eventHandlers.filter(d => d.type === eventType);
    }

    triggerEvent(eventType, eventData) {
        let handlers = this.eventHandlers.filter(d => d.type === eventType);
        for(let i = 0; i < handlers.length; i++) {
            let eventHandler = handlers[i].eventHandler;
            eventHandler(eventData);
        }
    }

    resetProperties(props) {
        this.properties = props;
        this.triggerEvent(eventTypes.PROPERTIES_UPDATED, this.properties);
        return this;
    }

    setProperties(props) {
        this.properties = Object.assign({}, this.properties, props);
        this.triggerEvent(eventTypes.PROPERTIES_UPDATED, this.properties);
        return this;
    }

    updateYScale() {
        const { 
            origin,
            height,
            yPadding,
            yExtents, 
            yScale, 
            yScaleRangeRound,
            yExtentsCalculator,
            xAccessor,
            plotData,
            fullData
        } = this.properties;
    
        //get domain
        let domain;
        if(yExtentsCalculator != undefined) {
            let useFullData = fullData == undefined ? plotData : fullData;
            domain = yExtentsCalculator(xAccessor, plotData, useFullData);
        }
        else if(yExtents != undefined && isNumericalExtents(yExtents)) {
            domain = yExtents;
        }
        else if(yExtents != undefined) {
            domain = calculateYExtents(yExtents, plotData);
        }

        this.yScale = yScale.copy();
    
        //get range
        if(height != undefined && isNumericalExtents(origin)) {
            setYRange(this.yScale, origin[1], height, yScaleRangeRound, yPadding);
        }
    
        if(domain != undefined) {
            let [start, end] = domain;
            this.yScale.domain([start, end]);
        }
    
        return this;
    }

    updateXScale() {
        //just update the x range here because
        //the x extents are managed by ChartManager
        const { 
            origin,
            width,
            xPadding,
            xScale, 
            xScaleRangeRound,
        } = this.properties;
    
        this.xScale = xScale.copy();

        setXRange(this.xScale, origin[0], width, xScaleRangeRound, xPadding);
        return this;
    }

    //maybe put the parameters as properties
    updateScales() {
        this.updateXScale();
        this.updateYScale();
        this.triggerEvent(eventTypes.SCALES_UPDATED, {
            xScale: this.xScale,
            yScale: this.yScale
        });
        return this;
    }

    resetScales() {
        //delete initial x scale in the chartmanager,
        //should not be exposed to chart
        delete this.initialXScale;
        delete this.xScale;
    }

    addGraph(graph, id) {
        let replaced = false;
        let graphId = undefined;
        if(id != undefined || graph.properties.id != undefined) {
            if(id != undefined) {
                graphId = id;
            }
            else {
                graphId = graph.properties.id;
            }
        }

        if(graphId != undefined) {
            for(let i = 0; i < this.graphs.length; i++) {
                let currentGraph = this.graphs[i];
                if(currentGraph.properties.id != undefined
                    && currentGraph.properties.id == id) {
                    this.graphs[i] = graph;
                    this.triggerEvent(eventTypes.GRAPH_ADDED, graph);
                    replaced = true;
                    break;
                }
            }
            
            graph.properties.id = graphId;
        }

        if(!replaced) {
            this.graphs.push(graph);
            this.triggerEvent(eventTypes.GRAPH_ADDED, graph);
        }
        return this;
    }

    getGraph(id) {
        if(id == undefined) {
            return this.graphs[0];
        }
        else {
            for(let i = 0; i < this.graphs.length; i++) {
                let graph = this.graphs[i];
                if(graph.properties.id != undefined
                    && graph.properties.id == id) {
                    return graph;
                }
            }
        }
    }

    removeGraph(id) {
        for(let i = 0; i < this.graphs.length; i++) {
            let graph = this.graphs[i];
            if(graph.properties.id != undefined
                && graph.properties.id == id) {
                this.graphs.splice(i, 1);
                this.triggerEvent(eventTypes.GRAPH_REMOVED, graph);
                break;
            }
        }
        return this;
    }

    //pass surface as parameter
    draw(surface) {
        for(let i = 0; i < this.graphs.length; i++) {
            let graph = this.graphs[i];
            let { xAccessor, plotData } = this.properties;
            graph.properties.xScale = this.xScale;
            graph.properties.yScale = this.yScale;
            graph.properties.xAccessor = xAccessor;
            graph.properties.plotData = plotData;
            graph.draw(surface, this.properties);
        }
        this.triggerEvent(eventTypes.DRAW, { graphs: this.graphs });
    }
}

export default function() {
    return new Chart();
}