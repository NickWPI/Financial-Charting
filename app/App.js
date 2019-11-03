import React from "react";
import ReactDOM from "react-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import DialogContentText from "@material-ui/core/DialogContentText";
import IndicatorSelector from "./IndicatorSelector";
import RadioSelectorList from "./RadioSelectorList";

import CCSelectionMenu from "./CCSelectionMenu";

import ChartSurface from "./chart/components/ChartSurface";
import chartManager from "./chart/ChartManager";
import EventCapture from "./chart/components/EventCapture";
import chart from "./chart/Chart";
import lineGraph from "./chart/graphs/LineGraph";
import candlestickGraph from "./chart/graphs/CandlestickGraph";
import rsiLineGraph from "./chart/graphs/RSIGraph";
import barGraph from "./chart/graphs/BarGraph";
import yAxisGraph from "./chart/axes/YAxis";
import xAxisGraph from "./chart/axes/XAxis";
import ohlcLabel from "./chart/overlay/OHLCLabel";
import simpleLabel from "./chart/overlay/SimpleLabel";
import labelContainer from "./chart/overlay/LabelContainer";
import movingAverageLabel from "./chart/overlay/MovingAverageLabel";
import rsiLabel from "./chart/overlay/RSILabel";

import linearLayout from "./chart/layout/LinearLayout";

//import packer from "./utils/Pack";
import packer from "./chart/utils/Pack2";
import sma from "./chart/indicators/SMA";
import rsi from "./chart/indicators/RSI";

import rectangle from "./chart/overlay/toolbar/Rectangle";
import iconButton from "./chart/overlay/toolbar/IconSvgButton";

import { dataSource } from "./Cryptocurrency";
import { MovingAverageProperty, RSIProperty } from "./IndicatorProperties";

//import { scaleTime as d3ScaleTime } from "d3";

//import "./styles.css";

const styles = {
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: "16px"
    },
    title: {
        flexGrow: 1
    },
    rightIcon: {
        marginLeft: "8px",
        marginRight: "8px"
    },
    toolbar: {
        paddingLeft: "8px",
        paddingRight: "8px"
    },
    tabs: {
        //"border" : "1px solid green"
    },
    tab: {
        width: 50,
        minWidth: 50
    },
    button: {
        paddingLeft: "16px",
        paddingRight: "16px"
    },
    divider: {
        position: "relative",
        height: "25px",
        "border-left": "1px solid white"
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.state = {
            indicatorOpen: false,
            dateOptionsOpen: false,
            currentDateRange: "7D",
            graphTypeOptionsOpen: false,
            searchDialogOpen: false,
            currentGraphType: "Candlestick",
            tradingPairString: "BTC-USD",
            //chart surface 
            width: 0,
            height: 0,
            ratio: 1
        };

        this.handleIndicatorOpen = this.handleIndicatorOpen.bind(this);
        this.handleIndicatorClose = this.handleIndicatorClose.bind(this);
        this.handleDateOptionsOpen = this.handleDateOptionsOpen.bind(this);
        this.handleDateOptionsClose = this.handleDateOptionsClose.bind(this);
        this.handleGraphTypeOptionsOpen = this.handleGraphTypeOptionsOpen.bind(
            this
        );
        this.handleGraphTypeOptionsClose = this.handleGraphTypeOptionsClose.bind(
            this
        );
        this.handleAddIndicator = this.handleAddIndicator.bind(this);
        this.handleRemoveIndicator = this.handleRemoveIndicator.bind(this);
        this.handleSearchDialogOpen = this.handleSearchDialogOpen.bind(this);
        this.handleSearchDialogClose = this.handleSearchDialogClose.bind(this);
        this.handleCryptocurrencySelected = this.handleCryptocurrencySelected.bind(
            this
        );

        this.loadChart = this.loadChart.bind(this);
        this.reloadChart = this.reloadChart.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);

        this.tradingPair = ["BTC", "USD"];

        this.mainChartYExtents = [];

        let smaCalculator = sma()
            .settings({ period: 50 })
        let rsiCalculator = rsi()
            .settings({ period: 14 });

        this.sma = smaCalculator;
        this.rsi = rsiCalculator;

        this.packer = packer()
            .add(smaCalculator, "sma50")
            .add(rsiCalculator, "rsi14");

        this.candlestickGraph = candlestickGraph().setProperties({
            yAccessor: d => ({
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close
            })
        });

        this.lineGraph = lineGraph().setProperties({
            yAccessor: d => d.close,
            color: "purple"
        });

        this.limit = 160;
        this.timeScale = "hour";
        this.aggregate = 3;
    }

    async loadChart() {
        console.log("height: " + this.appBar.offsetHeight);
        this.ratio = window.devicePixelRatio || 1;
        this.width = document.documentElement.clientWidth; 
        this.height = document.documentElement.clientHeight - this.appBar.offsetHeight;
        this.margin = {
            top: 0,
            left: 0,
            bottom: 30,
            right: 50
        }

        console.log(this.ratio);
        
        //update chart surface with calculated dimensions
        this.setState({
            width: this.width,
            height: this.height,
            ratio: this.ratio
        });

        this.isLoading = false;

        let tradingPair = this.tradingPair;

        console.log(this.packer.undefinedLength());

        //start setting up the data
        let initialData;
        try {
            initialData = await dataSource.getHistoricalCryptoPriceNoLimit(this.timeScale, 
                { fromCurrency: tradingPair[0], market: tradingPair[1], limit: this.limit + this.packer.undefinedLength()});
        }
        catch (error) {
            console.log(error);
        }

        let fullData2 = this.packer(initialData);

        this.rawData = initialData;

        this.fullData = fullData2.slice(this.packer.undefinedLength());

        //setup charts
        this.chartManager = chartManager(this.surface, {
            data: this.fullData,
            xScale: d3.scaleTime(),
            xAccessor: d => d.time,
            xExtents: d => d.time,
            width: this.width - this.margin.right,
            height: this.height - this.margin.bottom,
            margin: this.margin,
            onLoadMore: this.handleLoadMore
        });
        /*let graph = lineGraph().setProperties({
            yAccessor: d => d.close
        });*/
        let graph = candlestickGraph().setProperties({
            yAccessor: d => ({
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close
            })
        });
        let smaGraph = lineGraph().setProperties({
            yAccessor: this.sma.accessor()
        });
        let xAxis = xAxisGraph().setProperties({
            ticks: 3
        });
        let yAxis = yAxisGraph();
        let yAxisGridlines = yAxisGraph().setProperties({
            //use properties to pass in arguments
            orient: "left",
            tickSize: function(props) {
                const { xScale } = props;
                //should be negative number
                return xScale.range()[0] - xScale.range()[1];
            },
            tickFormat: "",
            tickStroke: "lightgrey",
            tickStrokeOpacity: 0.7,
            tickSizeOuter: 0
            //add more color properties
        });
        let xAxisGridlines = xAxisGraph().setProperties({
            tickSize: function(props) {
                const { yScale } = props;
                //should be negative number
                return yScale.range()[1] - yScale.range()[0];
            },
            tickFormat: "",
            tickStroke: "lightgrey",
            tickStrokeOpacity: 0.7,
            tickSizeOuter: 0
        });
        //make it so if width and height are not specified, inherit from parent
        //also allow a layout manager to independently manage dimensions
        let label = ohlcLabel().setProperties({
            //origin: [10, 20]
            /*button: {
                icon: svgIcon
                onClick: clickHandler
            }*/
        });
        let sLabel = simpleLabel().setProperties({
            //origin: [10, 50],
            labelText: "SMA(50, close)",
            valueText: "4253.24"
        });
        let tempMAProp = new MovingAverageProperty();
        tempMAProp.color = "green";
        tempMAProp.period = "50";
        tempMAProp.type = "Simple";
        let maLabel = movingAverageLabel().setProperties({
            accessor: this.sma.accessor(),
            field: "close",
            type: "simple",
            period: this.sma.settings().period,
            toolbar: [
                iconButton()
                    .width(20)
                    .height(20)
                    .icon("/icons/close.svg")
                    .onClick(e => this.handleRemoveIndicator(tempMAProp)),
                rectangle()
                    .width(12)
                    .height(10)
                    .stroke("grey")
                    .fill("green"),
            ]
        });
        let labelGroup = labelContainer().setProperties({
            origin: [10, 15],
            verticalRowSize: 35,
        }).addLabel(label).addLabel(maLabel, "sma50");

        let mainChart = chart()
            .addGraph(graph, 0)
            .addGraph(smaGraph, "sma50")
            .addGraph(yAxis, 2)
            //.addGraph(xAxis, 3)
            .addGraph(yAxisGridlines, 4)
            .addGraph(xAxisGridlines, 5)
           // .addGraph(label, 6)
            //.addGraph(sLabel, 7);
            .addGraph(labelGroup, "labelGroup");
        //.addGraph(xAxis, 1)
        //.addGraph(yAxis, 2)
        //temporary for testing purposes
        this.mainChartYExtents = [
            {
                calculator: d => [d.high, d.low]
            },
            {
                calculator: this.sma.accessor()
            }
        ];
        console.log(this.mainChartYExtents.map(d => d.calculator));
        mainChart.setProperties({
            origin: [0, 0],
            yExtents: this.mainChartYExtents.map(d => d.calculator),
        });
        
        let volumeGraph = barGraph().setProperties({
            yAccessor: d => ({
                open: d.open,
                close: d.close,
                volume: d.volume
            })
        })
        let volumeChart = chart()
            .addGraph(volumeGraph, 0);
        volumeChart.setProperties({
            origin: [0, (2/3) * this.height],
            //origin: [0, 100],
            //height: this.height,
            yExtents: d => d.volume,
        });

        let tempRSIProp = new RSIProperty();
        tempRSIProp.color = "green";
        tempRSIProp.period = "14";
        tempRSIProp.type = "rsi";
        let rLabel = rsiLabel().setProperties({
            origin: [10, 15],
            accessor: this.rsi.accessor(),
            field: "close",
            period: this.rsi.settings().period,
            toolbar: [
                iconButton()
                    .width(20)
                    .height(20)
                    .icon("/icons/close.svg")
                    .onClick(e => this.handleRemoveIndicator(tempRSIProp)),
                rectangle()
                    .width(12)
                    .height(10)
                    .stroke("grey")
                    .fill("green"),
            ]
        });
        let rsiGraph = rsiLineGraph().setProperties({
            yAccessor: this.rsi.accessor()
        });
        let rsiYAxis = yAxisGraph().setProperties({
            tickValues: [20, 80]
        })
        let rsiChart = chart().setProperties({
            yExtents: [0, 100]
        });
        rsiChart.addGraph(rsiGraph, 0)
            .addGraph(rsiYAxis, 1)
            .addGraph(xAxisGridlines, 2)
            .addGraph(rLabel, 3);

        //set at bottom
        let bottomAxisChart = chart()
            .addGraph(xAxis, 0)
           // .addGraph(xAxisGridlines, 1);

        this.linearLayout = linearLayout().setProperties({
            width: this.width - this.margin.right,
            height: this.height - this.margin.bottom
        });
        let mainChartLayout = linearLayout().setProperties({
            //width: this.width - this.margin.right,
            //height: this.height - this.margin.bottom
        })
            .addChart({areaName: "main", chart: mainChart, weight: 1})
            .addChart({areaName: "v", chart: volumeChart, weight: -1, anchorWeight: 0.66 });

        this.linearLayout.addLayout({ areaName: "main", layout: mainChartLayout, weight: 0.85 })
        this.linearLayout.addChart({ areaName: "rsi14", chart: rsiChart, weight: 0.15 });

        //mainChart.updateYScale();
        this.chartManager.addChart(mainChart, 0);
        this.chartManager.addChart(volumeChart, 1);
        this.chartManager.addChart(rsiChart, "rsi14");
        this.chartManager.addChart(bottomAxisChart, 3);

        //draw charts
        this.chartManager.resetChart();
        //this.chartManager.updateChart();
        this.chartManager.draw();
    }

    async reloadChart() {
        let tradingPair = this.tradingPair;

        //start setting up the data
        let initialData;
        try {
            initialData = await dataSource.getHistoricalCryptoPriceNoLimit(this.timeScale, 
                { fromCurrency: tradingPair[0], market: tradingPair[1], limit: this.limit + this.packer.undefinedLength()});
        }
        catch (error) {
            console.log(error);
        }

        let fullData2 = this.packer(initialData);
        this.rawData = initialData;

        this.fullData = fullData2.slice(this.packer.undefinedLength());

        this.chartManager.setProperties({
            data: this.fullData
        });

        this.chartManager.resetChart();
        this.chartManager.draw();
    }

    async updateChart() {
        let { packer, maxPeriod, chartManager, limit, tradingPair } = this;
        //crop data, if data is not long enough, load more
        maxPeriod = 100;
        limit = 365;
        let firstItem = chartManager.getFirstItem();
        let toTimestamp = Math.floor(firstItem.getTime() / 1000);

        let data;
        try {
            data = await dataSource.getHistoricalCryptoPriceNoLimit(this.timeScale, 
                { fromCurrency: tradingPair[0], market: tradingPair[1], toTimestamp: toTimestamp, limit: packer.undefinedLength()});
        }
        catch (error) {
            console.log(error);
        }
        let rawData = data.concat(this.fullData.slice(1));
        let fullData = packer(rawData);
        this.fullData = fullData.slice(packer.undefinedLength());

        chartManager.updateData(this.fullData);

        chartManager.updateChart();
        //chartManager.resetChart();
        chartManager.draw();
    }

    async componentDidMount() {
        this.loadChart();
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleLoadMore(start, end) {
        //console.log("END: " + end);
        if(this.isLoading) {
            //return;
        }
        this.isLoading = true;
        //this.forceUpdate();
        //calculate new end based on end of current data
        //let maxPeriod = getMaxUndefined([sma]);
        let limit = Math.abs(start - end);
        if(this.timeScale == "minute") {
            limit /= 60000;
        }
        else if(this.timeScale == "hour") {
            limit /= 3600000;
        }
        else if(this.timeScale == "day") {
            limit /= 86400000;
        }

       // await this.timeout(1000);
        limit = Math.ceil(limit);

        let tradingPair = this.tradingPair;

        let toTimestamp = Math.ceil(end.getTime() / 1000);
        //console.log(toTimestamp);
        let data;
        try {
            //console.log("start download");
            data = await dataSource.getHistoricalCryptoPriceNoLimit(this.timeScale, 
                { fromCurrency: tradingPair[0], market: tradingPair[1], toTimestamp: toTimestamp, 
                limit: limit + this.packer.undefinedLength()});
            //console.log("end download");
        }
        catch (error) {
            console.log(error);
        }

        //await this.timeout(1000);

        let fullData = this.packer(data);
        fullData = fullData.slice(this.packer.undefinedLength());
        this.rawData = data.concat(this.fullData.slice(1));
        //cut off the first piece of data?
        data = fullData.concat(this.fullData.slice(1));
        //this.rawData = data;
        this.fullData = data;
        //this.chartManager.fullData = data;
        this.fullData = this.chartManager.updateData(this.fullData);

        this.chartManager.updateChart();
        this.chartManager.draw();

        this.isLoading = false;
        //this.chartManager.setProperties({
            //: data
        //})
    }

    handleIndicatorOpen() {
        this.setState({
            indicatorOpen: true
        });
    }

    handleDateOptionsOpen() {
        this.setState({
            dateOptionsOpen: true
        });
    }

    handleIndicatorClose() {
        this.setState({
            indicatorOpen: false
        });
    }

    handleDateOptionsClose(value) {
        //reload chart
        if(value == "1H") {
            this.limit = 60;
            this.timeScale = "minute";
            this.aggregate = 1;
        }
        else if(value == "24H") {
            this.limit = 1440;
            this.timeScale = "minute";
            this.aggregate = 3;
        }
        else if(value == "7D") {
            this.limit = 168;
            this.timeScale = "hour";
            this.aggregate = 1;
        }
        else if(value == "1M") {
            this.limit = 30;
            this.timeScale = "day";
            this.aggregate = 1;
        }
        else if(value == "3M") {
            this.limit = 90;
            this.timeScale = "day";
            this.aggregate = 1;
        }
        else if(value == "1Y") {
            this.limit = 365;
            this.timeScale = "day";
            this.aggregate = 1;
        }
        else if(value == "5Y") {
            this.limit = 1825;
            this.timeScale = "day";
            this.aggregate = 4;
        }
        this.reloadChart();
        this.setState({
            currentDateRange: value,
            dateOptionsOpen: false
        });
    }

    handleGraphTypeOptionsOpen() {
        this.setState({
            graphTypeOptionsOpen: true
        });
    }

    handleGraphTypeOptionsClose(value) {
        this.setState({
            currentGraphType: value,
            graphTypeOptionsOpen: false
        });
        let graphType = value.toLowerCase();
        let mainChart = this.chartManager.getChart(0);
        if(graphType == "candlestick") {
            mainChart.addGraph(this.candlestickGraph, 0);
            //let mainGraph = mainChart.getGraph(0);
            //let candlestick = candlestickGraph().setProperties()
        }
        else if(graphType == "line") {
            mainChart.addGraph(this.lineGraph, 0);
        }
        //this.updateChart();
        this.chartManager.draw();
    }

    handleAddIndicator(parameters) {
        let name = parameters.formatName();
        let label = parameters.formatLabel();
        let type = parameters.formatType();
        let params = parameters.formatParameters();
        let areaName = parameters.getChartAreaName();
        if(type == "sma") {
            let smaCalculator = sma()
                .settings({ period: params.period })
                .accessor(d => d[name]);
            //console.log(smaCalculator.accessor());
            this.packer.add(smaCalculator, name);
            let smaGraph = lineGraph().setProperties({
                yAccessor: smaCalculator.accessor(),
                color: params.color
            });
            let mainChart = this.chartManager.getChart(0);
            mainChart.addGraph(smaGraph, name);
            this.mainChartYExtents.push({
                name: name,
                calculator: smaCalculator.accessor()
            });
            mainChart.setProperties({
                yExtents: this.mainChartYExtents.map(d => d.calculator)
            })
            let labelGroup = mainChart.getGraph("labelGroup");
            let maLabel = movingAverageLabel().setProperties({
                accessor: smaCalculator.accessor(),
                field: "close",
                type: "simple",
                period: params.period,
                toolbar: [
                    iconButton()
                        .width(20)
                        .height(20)
                        .icon("/icons/close.svg")
                        .onClick(e => this.handleRemoveIndicator(parameters)),
                    rectangle()
                        .width(12)
                        .height(10)
                        .stroke("grey")
                        .fill(params.color),
                ]
            });
            labelGroup.addLabel(maLabel, name);
            this.updateChart();
        }
        else if(type == "ema") {

        }
        else if(type == "rsi") {
            if(!this.packer.exists(name)) {
                let rsiCalculator = rsi()
                    .settings({ period: params.period })
                    .accessor(d => d[name]);
                this.packer.add(rsiCalculator, name);
                let rsiGraph = rsiLineGraph().setProperties({
                    yAccessor: rsiCalculator.accessor(),
                    color: params.color
                });
                let rsiChart = chart().setProperties({
                    yExtents: [0, 100]
                });
                let xAxisGridlines = xAxisGraph().setProperties({
                    tickSize: function(props) {
                        const { yScale } = props;
                        //should be negative number
                        return yScale.range()[1] - yScale.range()[0];
                    },
                    tickFormat: "",
                    tickStroke: "lightgrey",
                    tickStrokeOpacity: 0.7,
                    tickSizeOuter: 0
                });
                let rsiYAxis = yAxisGraph().setProperties({
                    tickValues: [20, 80]
                });
                let label = rsiLabel().setProperties({
                    origin: [10, 15],
                    accessor: rsiCalculator.accessor(),
                    field: "close",
                    period: rsiCalculator.settings().period,
                    toolbar: [
                        iconButton()
                            .width(20)
                            .height(20)
                            .icon("/icons/close.svg")
                            .onClick(e => this.handleRemoveIndicator(parameters)),
                        rectangle()
                            .width(12)
                            .height(10)
                            .stroke("grey")
                            .fill(params.color),
                    ]
                });
                rsiChart.addGraph(rsiGraph, "rsi")
                    .addGraph(xAxisGridlines, "xAxisGridlines")
                    .addGraph(rsiYAxis, "yAxis")
                    .addGraph(label, "label");
                this.linearLayout.addChart({ areaName: name, chart: rsiChart, weight: 0.15 });
                this.chartManager.addChart(rsiChart, name);
            }
            else {
                let rsiChart = this.chartManager.getChart(name);
                let rsiGraph = rsiChart.getGraph("rsi");
                let rsiCalculator = this.packer.get(name);
                rsiGraph.setProperties({
                    color: params.color
                });
                let label = rsiLabel().setProperties({
                    origin: [10, 15],
                    accessor: rsiCalculator.accessor(),
                    field: "close",
                    period: rsiCalculator.settings().period,
                    toolbar: [
                        iconButton()
                            .width(20)
                            .height(20)
                            .icon("/icons/close.svg")
                            .onClick(e => this.handleRemoveIndicator(parameters)),
                        rectangle()
                            .width(12)
                            .height(10)
                            .stroke("grey")
                            .fill(params.color),
                    ]
                });
                rsiChart.addGraph(label, "label");
            }
            this.updateChart();
        }
    }

    handleRemoveIndicator(parameters) {
        let name = parameters.formatName();
        let label = parameters.formatLabel();
        let type = parameters.formatType();
        let params = parameters.formatParameters();

        if(type == "sma") {
            //let calculator = this.packer.get(name);
            this.mainChartYExtents = this.mainChartYExtents.filter(d => d.name !== name);
            this.packer.remove(name);
            let mainChart = this.chartManager.getChart(0);
            mainChart.removeGraph(name);
            mainChart.setProperties({
                yExtents: this.mainChartYExtents.map(d => d.calculator)
            });
            let labelGroup = mainChart.getGraph("labelGroup");
            labelGroup.removeLabel(name);
            this.updateChart();
        }
        else if(type == "rsi") {
            this.packer.remove(name);
            this.chartManager.removeChart(name);
            this.linearLayout.removeChart(name);
            this.updateChart();
        }
    }

    handleSearchDialogOpen() {
        this.setState({
            searchDialogOpen: true
        });
    }

    handleSearchDialogClose() {
        this.setState({
            searchDialogOpen: false
        });
    }

    handleCryptocurrencySelected(name, symbolPair) {
        console.log(symbolPair);
        this.setState({
            tradingPairString: symbolPair
        })
        this.tradingPair = symbolPair.split("-");
        this.reloadChart();
        //instead of reloading the chart, just load new data
        //and reset the chartmanager
    }

    render() {
        return (
            <div className={this.classes.root}>
                <AppBar position="static" ref={e => this.appBar = e}>
                    <Toolbar variant="dense" className={this.classes.toolbar}>
                        <Button
                            style={{ color: "white" }}
                            className={this.classes.button}
                            onClick={this.handleIndicatorOpen}
                        >
                            <AddCircleIcon />
                        </Button>
                        <div className={this.classes.divider} />
                        <Button
                            style={{ color: "white" }}
                            className={this.classes.button}
                            onClick={this.handleDateOptionsOpen}
                        >
                            {this.state.currentDateRange}
                            <ArrowDropDownIcon />
                        </Button>
                        <div className={this.classes.divider} />
                        <Button
                            style={{ color: "white" }}
                            className={this.classes.button}
                            onClick={this.handleGraphTypeOptionsOpen}
                        >
                            {this.state.currentGraphType}
                            <ArrowDropDownIcon />
                        </Button>
                        <div className={this.classes.divider} />
                        <Button
                            style={{ color: "white" }}
                            className={this.classes.button}
                            onClick={this.handleSearchDialogOpen}
                        >
                            <SearchIcon /> 
                            {this.state.tradingPairString}          
                        </Button>
                    </Toolbar>
                </AppBar>
                {/*insert chart ui overlay here*/}
                <IndicatorSelector
                    open={this.state.indicatorOpen}
                    onClose={this.handleIndicatorClose}
                    handleAddIndicator={this.handleAddIndicator}
                />
                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.dateOptionsOpen}
                    onClose={e =>
                        this.handleDateOptionsClose(this.state.currentDateRange)
                    }
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogContent>
                        <RadioSelectorList
                            title="Select Date Range"
                            options={["1H", "24H", "7D", "1M", "3M", "1Y", "5Y"]}
                            default={this.state.currentDateRange}
                            onClick={this.handleDateOptionsClose}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    //maxWidth="xs"
                    open={this.state.graphTypeOptionsOpen}
                    onClose={e =>
                        this.handleGraphTypeOptionsClose(this.state.currentGraphType)
                    }
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogContent>
                        <RadioSelectorList
                            title="Select Graph Type"
                            options={["Candlestick", "Line"]}
                            default={this.state.currentGraphType}
                            onClick={this.handleGraphTypeOptionsClose}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog
                    fullScreen
                    open={this.state.searchDialogOpen}
                    onClose={e => this.handleSearchDialogClose()}
                    aria-labelledby="max-width-dialog-title"
                >
                    <CCSelectionMenu
                        onClose={e => this.handleSearchDialogClose()}
                        onCryptocurrencySelected={(primary, secondary) =>
                            this.handleCryptocurrencySelected(primary, secondary)
                        }
                    />
                </Dialog>
                <ChartSurface
                    ref={e => (this.surface = e)}
                    width={this.state.width}
                    height={this.state.height}
                    ratio={this.state.ratio}
                    zIndex="100"/>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);

//let StyledApp = withStyles(styles)(App);

/*const rootElement = document.getElementById("root");
ReactDOM.render(<StyledApp />, rootElement);*/
