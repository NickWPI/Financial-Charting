import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Slide from "@material-ui/core/Slide";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MovingAverage from "./MovingAverage";
import RSI from "./RSI";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { MovingAverageProperty, RSIProperty } from "./IndicatorProperties";

const styles = {
    appBar: {
        position: "relative"
    },
    title: {
        marginLeft: "16px",
        flex: 1
    }
};

class IndicatorSelector extends React.Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.indicatorSettings = {};
        this.indicatorSettings["Moving Average"] = MovingAverage;
        this.indicatorSettings["Relative Strength Index"] = RSI;

        this.indicatorProperties = {};
        this.indicatorProperties["Moving Average"] = () => {
            return new MovingAverageProperty();
        };
        this.indicatorProperties["Relative Strength Index"] = () => {
            return new RSIProperty();
        };

        let open = props.open !== undefined ? props.open : false;
        this.state = {
            open: open,
            indicatorOpen: false,
            currentIndicator: "",
            currentParameters: {},
            CurrentIndicatorUI: function () {
                return <div />;
            }
        };

        this.handleClickIndicatorOpen = this.handleClickIndicatorOpen.bind(this);
        this.handleIndicatorClose = this.handleIndicatorClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAddIndicator = this.handleAddIndicator.bind(this);
    }

    handleClickIndicatorOpen(indicatorName) {
        this.setState({
            currentIndicator: indicatorName,
            indicatorOpen: true,
            currentParameters: this.indicatorProperties[indicatorName](),
            CurrentIndicatorUI: this.indicatorSettings[indicatorName]
        });
    }

    handleIndicatorClose() {
        this.setState({
            indicatorOpen: false
        });
    }

    handleClickOpen() {
        this.setState({
            open: true
        });
    }

    handleClose() {
        this.setState({
            open: false
        });
        this.props.onClose();
    }

    handleAddIndicator() {
        this.handleIndicatorClose();
        this.handleClose();
        this.props.handleAddIndicator(this.state.currentParameters);
        console.log(this.state.currentParameters);
    }

    render() {
        return (
            <div>
                <Dialog
                    width="sm"
                    fullScreen
                    open={this.props.open}
                    onClose={this.handleClose}
                >
                    <AppBar className={this.classes.appBar}>
                        <Toolbar variant="dense">
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleClose}
                                aria-label="Close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={this.classes.title}>
                                Indicators
              </Typography>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <ListItem
                            button
                            onClick={() => {
                                this.handleClickIndicatorOpen("Moving Average");
                            }}
                        >
                            <ListItemText primary="Moving Average" />
                        </ListItem>
                        <Divider />
                        <ListItem
                            button
                            onClick={() => {
                                this.handleClickIndicatorOpen("Relative Strength Index");
                            }}
                        >
                            <ListItemText primary="Relative Strength Index" />
                        </ListItem>
                        <Divider />
                    </List>
                </Dialog>
                <Dialog
                    fullScreen
                    open={this.state.indicatorOpen}
                    onClose={this.handleClose}
                >
                    <AppBar className={this.classes.appBar}>
                        <Toolbar variant="dense">
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleIndicatorClose}
                                aria-label="Close"
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h6" className={this.classes.title}>
                                {this.state.currentIndicator}
                            </Typography>
                            <Button color="inherit" onClick={this.handleAddIndicator}>
                                Add
              </Button>
                        </Toolbar>
                    </AppBar>
                    <this.state.CurrentIndicatorUI
                        parameters={this.state.currentParameters}
                    />
                </Dialog>
            </div>
        );
    }
}

IndicatorSelector.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IndicatorSelector);
