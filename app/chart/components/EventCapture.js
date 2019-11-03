import React from "react";
import {
    select as d3Select,
    event as d3Event,
    mouse as d3Mouse
} from "d3-selection";

function mousePosition(e, defaultRect) {
    const container = e.currentTarget;
    const rect = defaultRect || container.getBoundingClientRect(),
        x = e.clientX - rect.left - container.clientLeft,
        y = e.clientY - rect.top - container.clientTop,
        xy = [Math.round(x), Math.round(y)];
    return xy;
}

//EventCapture is based off from react-stockcharts
export default class EventCapture extends React.Component {
    constructor(props) {
        super(props);
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
        if(onMouseEnter != undefined) {
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
        if(onMouseLeave != undefined) {
            onMouseLeave(event);
        }
    }

    handleMouseMove() {
		const event = d3Event;

		const { onMouseMove/*, mouseMove */} = this.props;

		if (/*this.mouseInteraction*/
				/*&& mouseMove
				&& */!this.state.panning) {

            const position = d3Mouse(this.captureNode);
            
            //console.log("mouse move");

            if(onMouseMove != undefined) {
                onMouseMove(event, position);
            }
		}
    }

    handleClick(event) {
		const position = mousePosition(event);
		const { onClick, onDoubleClick } = this.props;

		if (!this.panHappened) {
			if (this.clicked) {
                if(onDoubleClick != undefined) {
                    onDoubleClick(position, event);
                }
                console.log("double clicked");
				this.clicked = false;
			} else {
                if(onClick != undefined) {
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
        if(event.button !== 0) {
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

        if(this.props.onPan != undefined) {
            this.props.onPan(event, position, dx, dy);
        }
    }

    handlePanEnd() {
        const event = d3Event;

        const { onPanEnd } = this.props;

        if(this.state.panStart != undefined) {
            d3Select(this.captureNode)
                .on("mousemove", this.mouseInside ? this.handleMouseMove : nul)
                .on("mouseup", null)
                .on("touchmove", null)
                .on("touchend", null);

            if(this.panHappened) {  
                const { dx, dy, lastMousePosition } = this;

                delete this.dx;
                delete this.dy;
                //onPanEnd
                if(onPanEnd != undefined) {
                    onPanEnd(event, lastMousePosition, dx, dy);
                }
            }

            this.setState({
                panning: false,
                panStart: null,
            });
        }
    }

    render() {
        const { width, height, zIndex } = this.props;

        const eventHandlers = {
            onClick: e => this.handleClick(e),
            onMouseDown: e => this.handleMouseDown(e),
            onWheel: e => this.handleWheel(e),
        };

        //move this inside the axesSVG
        return (
            <rect
                ref={this.setEventCaptureNode}
                width={width}
                height={height}
                style={{ opacity: 0, cursor: "crosshair"}}
                {...eventHandlers}
            />
        );
    }
}