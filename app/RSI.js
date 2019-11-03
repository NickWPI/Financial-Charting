import React from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ColorPicker from "./ColorPicker";
import SvgIcon from "@material-ui/core/SvgIcon";
import RadioSelectorList from "./RadioSelectorList";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import PropTypes from "prop-types";

const styles = {
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: "white"
    },
    textField: {
        textAlign: "right"
    },
    firstListItem: {
        paddingTop: "8px",
        paddingBottom: "16px"
    },
    listItem: {
        paddingTop: "16px",
        paddingBottom: "16px"
    }
};

class RSI extends React.Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.state = {
            colorPickerOpen: false,
            color: "#009688"
        };

        this.props.parameters.setColor("#009688");
        this.props.parameters.setPeriod(50);

        this.handleClickColorPickerOpen = this.handleClickColorPickerOpen.bind(
            this
        );
        this.handleColorPickerClose = this.handleColorPickerClose.bind(this);
        this.handlePeriodTextFieldChange = this.handlePeriodTextFieldChange.bind(
            this
        );
    }

    handleClickColorPickerOpen() {
        this.setState({
            colorPickerOpen: true
        });
    }

    handleColorPickerClose(newColor) {
        this.setState({
            colorPickerOpen: false,
            color: newColor
        });
        this.props.parameters.setColor(newColor);
    }

    handlePeriodTextFieldChange(e) {
        let value = Math.abs(e.target.value) > 999 ? 999 : Math.abs(e.target.value);
        value = value === 0 ? 1 : value;
        this.props.parameters.setPeriod(value);
    }

    render() {
        return (
            <List>
                <div>
                    <ListItem dense className={this.classes.firstListItem}>
                        <ListItemText
                            id={"labelId"}
                            primary="Period" /*primary={`Line item ${value + 1}`}*/
                        />
                        <ListItemSecondaryAction>
                            <TextField
                                className={this.classes.textField}
                                type="number"
                                defaultValue="50"
                                onChange={this.handlePeriodTextFieldChange}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: 999,
                                        style: { textAlign: "center" }
                                    }
                                }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem dense className={this.classes.listItem}>
                        <ListItemText
                            id={"labelId"}
                            primary="Color" /*primary={`Line item ${value + 1}`}*/
                        />
                        <ListItemSecondaryAction>
                            <Button onClick={this.handleClickColorPickerOpen}>
                                <SvgIcon>
                                    <path
                                        fill={this.state.color}
                                        d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,19C10.1,19 8.3,18.2 7.1,16.9C5.9,15.6 5,13.9 5,12C5,10.1 5.8,8.3 7.1,7.1C8.4,5.9 10.1,5 12,5C13.9,5 15.7,5.8 16.9,7.1C18.1,8.4 19,10.1 19,12C19,13.9 18.2,15.7 16.9,16.9C15.6,18.1 13.9,19 12,19Z"
                                    />
                                </SvgIcon>
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <Dialog
                        open={this.state.colorPickerOpen}
                        onClose={e => this.handleColorPickerClose(this.state.color)}
                        aria-labelledby="max-width-dialog-title"
                    >
                        <DialogContent>
                            <ColorPicker handleChange={this.handleColorPickerClose} />
                        </DialogContent>
                    </Dialog>
                </div>
            </List>
        );
    }
}

RSI.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RSI);