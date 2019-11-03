import { plotDataProcessor, getClosestDateIndices  } from "./Utils/ChartUtils";
import { 
    extent as d3Extents,
    scaleLinear as d3ScaleLinear,
    scaleTime as d3ScaleTime,
    selectAll as d3SelectAll,
    select as d3Select
} from "d3";
import asyncQueue from "./utils/AsyncQueue";

class ChartManager {
    constructor(surface, props) {
        this.properties = {
            //use a singular x scale with range set to [height]
            xScale: d3ScaleLinear(),
            xAccessor: d => d.date,
            zoomMultiplier: 1.1
        };
        if(props != undefined) {
            this.properties = Object.assign(this.properties, props);
        }

        this.handlePan = this.handlePan.bind(this);
        this.handlePanEnd = this.handlePanEnd.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.surface = surface;
        this.surface.setOnPan(this.handlePan);
        this.surface.setOnPanEnd(this.handlePanEnd);
        this.surface.setOnZoom(this.handleZoom);
        this.surface.setOnMouseMove(this.handleMouseMove);
        this.surface.setOnMouseLeave(this.handleMouseLeave);
        //this.surface.setEventCapture(eventCapture());
        this._context = surface.getDrawContext();
        this.charts = [];
        this.shouldUpdate = false;
        this.loadingMoreData = false;

        this.loadingQueue = asyncQueue(1);
        this.blockUpdate = false;
    }

    resetProperties(props) {
        this.properties = props;
    }

    setProperties(props) {
        this.properties = Object.assign(this.properties, props);
    }

    addChart(chart, id) {
        if(id != undefined) {
            chart.properties.id = id;
        }
        this.charts.push(chart);
    }

    getChart(id) {
        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];
            if(chart.properties.id != undefined
                && chart.properties.id == id) {
                return chart;
            }
        }
    }

    removeChart(id) {
        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];
            if(chart.properties.id != undefined
                && chart.properties.id == id) {
                this.charts.splice(i, 1);
                break;
            }
        }
    }

    svg(value) {
        if(value == undefined) {
            return this._svgTarget;
        }
        this._svgTarget = value;
        return this;
    }

    context(value) {
        if(value == undefined) {
            return this._context;
        }
        this._context = value;
        return this;
    }

    addEventHandler(name, eventHandler) {

    }

    removeEventHandler(name) {

    }

    //get chart based on position
    getCurrentCharts(position) {
        let currentCharts = this.charts.filter(function(chart) {
            let { origin, width, height } = chart.properties;
            let [x, y] = origin;
            if(position[0] <= width && position[0] >= x) {
                if(position[1] <= height && position[1] >= y) {
                    return true;
                }
            }
            return false;
        });

        return currentCharts;
    }

    getFirstItem() {
        let { xAccessor } = this.properties;
        let { fullData } = this;
        return xAccessor(fullData[0]);
    }

    //get current data item
    getCurrentItem(position) {
        let currentCharts = this.getCurrentCharts(position);
        if(currentCharts.length > 0) {
            let chart = currentCharts[0];
            let { xAccessor, plotData } = chart.properties;
            if(plotData.length == 0) {
                return;
            }
            let { xScale } = chart;
            let value = xScale.invert(position[0]);
            let itemIndex = getClosestDateIndices(plotData, value, xAccessor);
            let item = plotData[itemIndex.left];
            return item;
        }
    }

    handleZoom(event, position, zoomDirection) {
        const { xAccessor } = this.properties;
        const { fullData } = this;
        const {
            zoomAnchor,
            zoomMultiplier
        } = this.properties;

        let item = this.getCurrentItem(position);
        //console.log(item);

        let newDomain = undefined;
        let xScale = undefined;
        if(this.charts.length > 0) {
            //just grab the first chart since the domains are
            //the same on all charts
            let chart = this.charts[0];
            xScale = chart.xScale;
            //have different options for zoom anchor but use mouse based for now
            const cx = position[0];
            const c = zoomDirection > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;
            newDomain = xScale.range().map(x => cx + (x - cx) * c).map(xScale.invert);
        }
        if(xScale != undefined && newDomain != undefined) {
            let updatedScale = xScale.copy().domain(newDomain);
            let [start, end] = newDomain;

            this.plotData = plotDataProcessor(fullData, xAccessor, start, end);

            for(let i = 0; i < this.charts.length; i++) {
                let chart = this.charts[i];
                chart.setProperties({
                    xScale: updatedScale,
                    xAccessor: xAccessor,
                    plotData: this.plotData,
                    fullData: this.fullData,
                    //do not use current item when zooming
                    currentItem: undefined,
                    currentCharts: undefined,
                    mousePosition: undefined
                });
                const { width, height } = this.properties;
                //pass them on if only one chart exists
                if(chart.properties.width == undefined) {
                    chart.setProperties({
                        width: width
                    });
                }
                if(chart.properties.height == undefined) {
                    chart.setProperties({
                        height: height
                    });
                }
                chart.updateScales(xAccessor, this.plotData, this.fullData);
            }

            //store domain
            let firstItem = xAccessor(this.fullData[0]);
            let startTime = newDomain[0]; // - preloadLength use loading threshold
            //to prevent the same data to only be loaded once
            let { onLoadMore } = this.properties;
            let loadMore = true;
            if(firstItem > this.firstItem) {
                loadMore = false;
            }
            if(this.firstItem == undefined && startTime < firstItem) {
                if(onLoadMore != undefined) {
                    this.firstItem = startTime;
                    this.loadingQueue.push(onLoadMore, [startTime, firstItem]);
                }
            }
            else if(this.firstItem != undefined && startTime < this.firstItem) {
                firstItem = this.firstItem;
                if(onLoadMore != undefined) {
                    this.firstItem = startTime;
                    this.loadingQueue.push(onLoadMore, [startTime, firstItem]);
                }
            }

            this.draw();
        }
    }

    handlePan(event, position, dx, dy) {
        const { xAccessor } = this.properties;
        const { fullData } = this;

        let newDomain = undefined;
        let xScale = undefined;
        if(this.charts.length > 0) {
            //just grab the first chart since the domains are
            //the same on all charts
            let chart = this.charts[0];
            //set initialXScale at the beginning of the pan
            if(chart.initialXScale == undefined) {
                chart.initialXScale = chart.xScale.copy();
            }
            xScale = chart.initialXScale; 
            newDomain = xScale.range().map(x => x - dx).map(xScale.invert);
        }
        if(xScale != undefined && newDomain != undefined) {
            let updatedScale = xScale.copy().domain(newDomain);
            let [start, end] = newDomain;

            this.plotData = plotDataProcessor(fullData, xAccessor, start, end);

            for(let i = 0; i < this.charts.length; i++) {
                let chart = this.charts[i];
                chart.setProperties({
                    xScale: updatedScale,
                    xAccessor: xAccessor,
                    plotData: this.plotData,
                    fullData: this.fullData,
                    //do not use current item when panning
                    currentItem: undefined,
                    currentCharts: undefined,
                    mousePosition: undefined
                });
                const { width, height } = this.properties;
                //pass them on if only one chart exists
                if(chart.properties.width == undefined) {
                    chart.setProperties({
                        width: width
                    });
                }
                if(chart.properties.height == undefined) {
                    chart.setProperties({
                        height: height
                    });
                }
                chart.updateScales(xAccessor, this.plotData, this.fullData);
            }

            /*let firstItem = xAccessor(this.fullData[0]);
            let startTime = newDomain[0];
            let { onLoadMore } = this.properties;
            //incorporate a loading threshold
            let domainLength = newDomain[1] - newDomain[0];
            //let domainThreshold = domainLength * dataPreloadThresholdMultiplier;
            if(startTime < firstItem) {
                if(onLoadMore != undefined) {
                    onLoadMore(startTime, firstItem);
                }
            }*/

            this.draw();
        }
    }

    handlePanEnd() {
        const { xAccessor } = this.properties;
        //reset the scale
        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];
            delete chart.initialXScale;
        }

        //double check the load again in case
        //the previous loading didnt go through due to 
        //loading in progress
        if(this.charts.length > 0) {
            let chart = this.charts[0];
            let domain = chart.xScale.domain();

            let firstItem = xAccessor(this.fullData[0]);
            let startTime = domain[0];
            let { onLoadMore } = this.properties;
            //incorporate a loading threshold
            let domainLength = domain[1] - domain[0];
            //let domainThreshold = domainLength * dataPreloadThresholdMultiplier;
            let loadMore = true;
            if(firstItem > this.firstItem) {
                loadMore = false;
            }
            if(this.firstItem == undefined && startTime < firstItem) {
                if(onLoadMore != undefined) {
                    this.firstItem = startTime;
                    this.loadingQueue.push(onLoadMore, [startTime, firstItem]);
                }
            }
            else if(this.firstItem != undefined && startTime < this.firstItem) {
                firstItem = this.firstItem;
                if(onLoadMore != undefined) {
                    this.firstItem = startTime; 
                    this.loadingQueue.push(onLoadMore, [startTime, firstItem]);
                }
            }
        }

        this.draw();
    }

    handleMouseMove(event, position) {
        let item = this.getCurrentItem(position);
        let currentCharts = this.getCurrentCharts(position);

        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];

            chart.setProperties({
                currentItem: item,
                currentCharts: currentCharts,
                mousePosition: position
            });
        }

        this.draw();
    }

    handleMouseLeave(event) {
        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];

            chart.setProperties({
                currentItem: undefined,
                currentCharts: undefined,
                mousePosition: undefined
            });
        }

        this.draw();
    }

    //reset back to initial chart state
    resetChart() {
        this.loadingQueue.drain();

        let props = this.properties;
        //extract all the props that need
        //to be passed on to each chart
        const {
            xScale,
            xAccessor,
            data,
            xExtents
        } = props;

        //extract start and end from extents
        let extents;
        if(typeof xExtents == "function") {
            extents = d3Extents(data, xExtents);
        }
        else {
            extents = xExtents;
        }

        const [start, end] = extents;
        let plotData = plotDataProcessor(data, xAccessor, start, end);

        this.xScale = xScale.copy();
        this.xScale.domain([start, end]);
        this.fullData = data;
        this.plotData = plotData; //plotData
        //console.log(this.fullData);
        this.firstItem = undefined;

        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];

            //set the x scales here
            //let { xScale } = chart.properties;;
            //xScale.domain([start, end]);

            chart.setProperties({
                xScale: this.xScale,
                //set extents instead of scale
                xExtents: [start, end],
                xAccessor: xAccessor,
                plotData: this.plotData,
                fullData: this.fullData
            });

            const { width, height } = this.properties;
            //pass them on if only one chart exists
            if(chart.properties.width == undefined) {
                chart.setProperties({
                    width: width
                });
            }
            if(chart.properties.height == undefined) {
                chart.setProperties({
                    height: height
                });
            }
            chart.updateScales(xAccessor, this.plotData, this.fullData);
        }

        //the ranges are still not set
    }

    updateData(newData) {
        //remove duplicates
        let { xAccessor } = this.properties;
        let existingData = {};
        newData = newData.filter(function(data, index) {
            let item = xAccessor(data);
            if(existingData.hasOwnProperty(item)) {
                return false;
            }
            existingData[item] = true;
            return true;
        });
        this.fullData = newData;
        return this.fullData;
    }

    //to be improved later (allow for continuously updating data)
    updateChart() {
        const { xAccessor, data } = this.properties;
        const { fullData } = this;

        //if the full data first item is shorter than this.firstItem, then shorten it
        /*let startDate = xAccessor(fullData[0]);
        if(startDate > this.firstItem) {
            this.firstItem = startDate;
        }*/

        let xScale = undefined;
        if(this.charts.length > 0) {
            let chart = this.charts[0];
            xScale = chart.xScale;
        }
        if(xScale == undefined) {
            return;
        }
        const [start, end] = xScale.domain();
        //this.fullData = data;
        this.plotData = plotDataProcessor(fullData, xAccessor, start, end);

        let xScaleCopy = xScale.copy();

        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];

            //set the x scales here
            //let { xScale } = chart.properties;;
            //xScale.domain([start, end]);

            chart.setProperties({
                xScale: xScaleCopy,
                //set extents instead of scale
                xExtents: [start, end],
                xAccessor: xAccessor,
                plotData: this.plotData,
                fullData: this.fullData
            });

            const { width, height } = this.properties;
            //pass them on if only one chart exists
            if(chart.properties.width == undefined) {
                chart.setProperties({
                    width: width
                });
            }
            if(chart.properties.height == undefined) {
                chart.setProperties({
                    height: height
                });
            }
            chart.updateScales(xAccessor, this.plotData, this.fullData);
        }
    }

    clear() {
        let { width, height, margin } = this.properties;
        this._context.clearRect(0, 0, width + margin.right, height + margin.bottom);
        let svg = this.surface.getAxesSVG();
        d3Select(svg).selectAll("*").remove();
        let svg2 = this.surface.getOverlaySVG();
        d3Select(svg2).selectAll("*").remove();
    }

    draw() {
        this.clear();

        for(let i = 0; i < this.charts.length; i++) {
            let chart = this.charts[i];
            chart.draw(this.surface);
        }
    }
}

export default function(surface, props) {
    return new ChartManager(surface, props);
}