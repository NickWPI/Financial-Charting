import React from "react";
import EventCapture from "./EventCapture";

export default class ChartSurface extends React.Component {
    constructor(props) {
        super(props);
        this.setDrawContext = this.setDrawContext.bind(this);
        this.setAxesSVG = this.setAxesSVG.bind(this);
        this.setOverlaySVG = this.setOverlaySVG.bind(this);
        this.setEventCaptureNode = this.setEventCaptureNode.bind(this);

        this.setOnPan = this.setOnPan.bind(this);
        this.setOnMouseLeave = this.setOnMouseLeave.bind(this);

        //this.clear = this.clear.bind(this);

        this.state = {};
    }

    /*clear() {
        let context = getDrawContext();
        context.clearRect(0, 0, this.props.width, this.props.height);
        this.axesSVG
    }*/

    setEventCapture(eventCapture) {
        this.eventCapture = eventCapture;
    }

    getEventCapture() {
        return this.eventCapture;
    }

    setEventCaptureNode(value) {
        this.captureNode = value;
    }

    getEventCaptureNode() {
        return this.captureNode;
    }

    setDrawContext(canvasNode) {
        this.drawContext = canvasNode.getContext("2d");
        //this.drawContext.scale(this.props.ratio, this.props.ratio);
    }

    getDrawContext() {
        return this.drawContext;
    }

    setAxesSVG(svg) {
        this.axesSVG = svg;
    }

    getAxesSVG() {
        return this.axesSVG;
    }

    setOverlaySVG(svg) {
        this.overlaySVG = svg;
    }

    getOverlaySVG() {
        return this.overlaySVG;
    }

    setOnPan(onPan) {
        this.setState({
            onPan: onPan
        });
    }

    setOnPanEnd(onPanEnd) {
        this.setState({
            onPanEnd: onPanEnd
        });
    }

    setOnZoom(onZoom) {
        this.setState({
            onZoom: onZoom
        })
    }

    setOnMouseMove(onMouseMove) {
        this.setState({
            onMouseMove: onMouseMove
        })
    }

    setOnMouseLeave(onMouseLeave) {
        this.setState({
            onMouseLeave: onMouseLeave
        })
    }

    componentDidUpdate() {
        this.drawContext.setTransform(1, 0, 0, 1, 0, 0);
        this.drawContext.scale(this.props.ratio, this.props.ratio);
    }

    render() {
        const { height, width, zIndex, ratio } = this.props;
        //use margins for clipping the canvas

        //for event capture
        const { xScale } = this.props;

        return (
            // style={{ position: "relative", width, height }}
            <div style={{ position: "relative", width, height, zIndex: zIndex }}>
                {/*<EventCapture
                    width={width * ratio}
                    height={height * ratio}
                    zIndex={zIndex + 10}
                    onPan={this.state.onPan}
                    onPanEnd={this.state.onPanEnd}
                    onZoom={this.state.onZoom}
                    onMouseMove={this.state.onMouseMove}/>
                {/*<svg
                    width={width * ratio}
                    height={height * ratio}
                    style={{
                        position: "absolute",
                        width: width,
                        height: height,
                        zIndex: zIndex + 10
                    }}
                >
                    <rect 
                        ref={this.setEventCaptureNode}
                        width={width}
                        height={height}
                        style={{ opacity: 0 }}
                        {...eventHandlers}
                    />
                </svg>*/}
                <svg
                    id="axes"
                    ref={this.setAxesSVG}
                    width={width}
                    height={height}
                    //viewBox={"0 0 " + (width * ratio) + " " + (height * ratio)}
                    style={{
                        position: "absolute",
                        zIndex: zIndex + 2,
                        cursor: "pointer"
                    }}
                />
                <canvas
                    id="draw"
                    ref={this.setDrawContext}
                    width={width * ratio}
                    height={height * ratio}
                    style={{
                        position: "absolute",
                        width: width,
                        height: height,
                        zIndex: zIndex + 5,
                        pointerEvents: "none"
                    }}
                />
                <svg
                    id="overlay"
                    //ref={this.setOverlaySVG}
                    width={width * ratio}
                    height={height * ratio}
                    style={{
                        position: "absolute",
                        width: width,
                        height: height,
                        zIndex: zIndex + 7,
                        cursor: "pointer"
                    }}
                >
                    <EventCapture
                        width={width * ratio}
                        height={height * ratio}
                        //zIndex={zIndex + 10}
                        onPan={this.state.onPan}
                        onPanEnd={this.state.onPanEnd}
                        onZoom={this.state.onZoom}
                        onMouseMove={this.state.onMouseMove}
                        onMouseLeave={this.state.onMouseLeave}/>

                    <g ref={this.setOverlaySVG}/>
                </svg>
            </div>
        );
    }
}
