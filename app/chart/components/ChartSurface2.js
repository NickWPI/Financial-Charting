import React from "react";
import EventCapture from "./EventCapture";

export default class ChartSurface extends React.Component {
    constructor(props) {
        super(props);
        this.setDrawContext = this.setDrawContext.bind(this);
        this.setAxesSVG = this.setAxesSVG.bind(this);
        this.setOverlaySVG = this.setOverlaySVG.bind(this);

        this.setEventCaptureNode = this.setEventCaptureNode.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handlePan = this.handlePan.bind(this);
        this.handlePanEnd = this.handlePanEnd.bind(this);

        this.handleEnter = this.handleEnter.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.captureNode = {};
        this.state = {
            panning: false,
        };
    }

    /*clear() {
        let context = getDrawContext();
        context.clearRect(0, 0, this.props.width, this.props.height);
        this.axesSVG
    }*/

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

    setEventCaptureNode(value) {
        this.captureNode = value;
    }

    componentDidMount() {
        if (this.captureNode != undefined) {
            d3Select(this.captureNode)
                .on("mouseenter", this.handleEnter)
                .on("mouseleave", this.handleLeave);
        }
    }

    componentDidUpdate() {
        this.drawContext.setTransform(1, 0, 0, 1, 0, 0);
        this.drawContext.scale(this.props.ratio, this.props.ratio);
        this.componentDidMount();
    }

    componentWillUnmount() {
        if (this.captureNode) {
            d3Select(this.captureNode)
                .on("mouseenter", null)
                .on("mouseleave", null)
                .on("mousemove", null);
        }
    }

    handleEnter() {
        const event = d3Event;

        const { onMouseEnter } = this.props;
        //console.log("enter");
        this.mouseInside = true;
        if (!this.state.panning
				/*&& !this.state.dragInProgress*/) {
            //console.log("registered");
            d3Select(this.captureNode)
                .on("mousemove", this.handleMouseMove);
        }
        if (onMouseEnter != undefined) {
            onMouseEnter(event);
        }
    }

    handleLeave(event) {
        const { onMouseLeave } = this.props;
        this.mouseInside = false;
        if (!this.state.panning
				/*&& !this.state.dragInProgress*/) {
            d3Select(this.captureNode)
                .on("mousemove", null);
        }
        if (onMouseLeave != undefined) {
            onMouseLeave(event);
        }
    }

    handleMouseMove() {
        const event = d3Event;

        const { onMouseMove/*, mouseMove */ } = this.props;

        if (/*this.mouseInteraction*/
				/*&& mouseMove
				&& */!this.state.panning) {

            const position = d3Mouse(this.captureNode);

            //console.log("mouse move");

            if (onMouseMove != undefined) {
                onMouseMove(event, position);
            }
        }
    }

    handleClick(event) {
        const position = mousePosition(event);
        const { onClick, onDoubleClick } = this.props;

        if (!this.panHappened) {
            if (this.clicked) {
                if (onDoubleClick != undefined) {
                    onDoubleClick(position, event);
                }
                console.log("double clicked");
                this.clicked = false;
            } else {
                if (onClick != undefined) {
                    onClick(position, event);
                }
                console.log("clicked");
                this.clicked = true;
                setTimeout(() => {
                    if (this.clicked) {
                        this.clicked = false;
                    }
                }, 400);
            }
        }
    }

    handleWheel(event) {
        const { onZoom } = this.props;
        const { panning } = this.state;

        const yZoom = Math.abs(event.deltaY) > Math.abs(event.deltaX) && Math.abs(event.deltaY) > 0;
        const position = mousePosition(event);
        //event.preventDefault();

        if (onZoom != undefined && yZoom && !panning) {
            const zoomDir = event.deltaY > 0 ? 1 : -1;
            onZoom(event, position, zoomDir);
        }
    }

    handleMouseDown(event) {
        if (event.button !== 0) {
            return;
        }

        const { xScale, onMouseDown } = this.props;

        this.panHappened = false;

        const currentPosition = mousePosition(event);

        //handle panning
        this.setState({
            panning: true,
            panStart: {
                panOrigin: currentPosition,
                initialXScale: xScale
            }
        });

        d3Select(this.captureNode)
            .on("mousemove", this.handlePan)
            .on("mouseup", this.handlePanEnd);

        event.preventDefault();
    }

    handlePan() {
        const event = d3Event;

        const { panOrigin } = this.state.panStart;

        const position = d3Mouse(this.captureNode);
        this.lastMousePosition = position;
        this.panHappened = true;

        const dx = position[0] - panOrigin[0];
        const dy = position[1] - panOrigin[1];
        this.dx = dx;
        this.dy = dy;

        if (this.props.onPan != undefined) {
            this.props.onPan(event, position, dx, dy);
        }
    }

    handlePanEnd() {
        const event = d3Event;

        const { onPanEnd } = this.props;

        if (this.state.panStart != undefined) {
            d3Select(this.captureNode)
                .on("mousemove", this.mouseInside ? this.handleMouseMove : nul)
                .on("mouseup", null)
                .on("touchmove", null)
                .on("touchend", null);

            if (this.panHappened) {
                const { dx, dy, lastMousePosition } = this;

                delete this.dx;
                delete this.dy;
                //onPanEnd
                if (onPanEnd != undefined) {
                    onPanEnd(event, lastMousePosition, dx, dy);
                }
            }

            this.setState({
                panning: false,
                panStart: null,
            });
        }
    }

    /*componentDidUpdate() {
        this.drawContext.setTransform(1, 0, 0, 1, 0, 0);
        this.drawContext.scale(this.props.ratio, this.props.ratio);
    }*/

    render() {
        const { height, width, zIndex, ratio } = this.props;
        //use margins for clipping the canvas

        const eventHandlers = {
            onClick: e => this.handleClick(e),
            onMouseDown: e => this.handleMouseDown(e),
            onWheel: e => this.handleWheel(e),
            /*onMouseDown: this.handleMouseDown,
            onClick: this.handleClick,
            onContextMenu: this.handleRightClick,
            onTouchStart: this.handleTouchStart,
            onTouchMove: this.handleTouchMove,*/
        };

        //for event capture
        const { xScale } = this.props;

        return (
            // style={{ position: "relative", width, height }}
            <div style={{ position: "relative", width, height, zIndex: zIndex }}>
                <svg
                    width={width}
                    height={height}
                    style={{
                        position: "absolute",
                        width: width,
                        height: height,
                        zIndex: zIndex + 10,
                        //cursor: "crosshair"
                    }}
                >
                    <rect
                        ref={this.setEventCaptureNode}
                        width={width}
                        height={height}
                        style={{ opacity: 0, cursor: "crosshair" }}
                        {...eventHandlers}
                    />
                    {/*<rect
                    x={40}
                    y={20}
                    width={50}
                    height={50}
                    style={{
                        fill: "black",
                        cursor: "crosshair"
                }}/>*/}
                </svg>
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
                    ref={this.setOverlaySVG}
                    width={width * ratio}
                    height={height * ratio}
                    style={{
                        position: "absolute",
                        width: width,
                        height: height,
                        zIndex: zIndex + 7,
                        cursor: "pointer"
                    }}
                />
            </div>
        );
    }
}
