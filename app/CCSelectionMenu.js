import React from "react";
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

import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { FixedSizeList } from "react-window";

import ccDataFetcher from "./CCData";

const styles = {
    root: {
        overflow: "hidden"
    },
    appBar: {
        position: "relative"
    },
    title: {
        marginLeft: "16px",
        flex: 1
    },
    search: {
        position: "relative",
        //borderRadius: theme.shape.borderRadius,
        //backgroundColor: fade(theme.palette.common.white, 0.15),
        /*"&:hover": {
          backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),*/
        marginLeft: 0,
        width: "100%"
        /*[theme.breakpoints.up("sm")]: {
          marginLeft: theme.spacing(3),
          width: "auto"
        }*/
    },
    searchIcon: {
        width: "56px", //theme.spacing(7),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputRoot: {
        color: "inherit"
    },
    inputInput: {
        //padding: theme.spacing(1, 1, 1, 7),
        //transition: theme.transitions.create("width"),
        width: "100%"
        /*[theme.breakpoints.up("md")]: {
          width: 200
        }*/
    },
    list: {
        width: "100%",
        maxWidth: 360
    }
};

function Row(props) {
    const { index, style, data } = props;
    let primaryText = data.ccDisplayList[index].primary;
    let secondaryText = data.ccDisplayList[index].secondary;
    let { onClick } = data;

    return (
        <ListItem button style={style} key={index}>
            <ListItemText
                primary={primaryText}
                secondary={secondaryText}
                onClick={e => {
                    onClick(e, primaryText, secondaryText);
                }}
            />
        </ListItem>
    );
}

class CCSelectionMenu extends React.Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;

        this.handleSearchChanged = this.handleSearchChanged.bind(this);
        this.handleRowClicked = this.handleRowClicked.bind(this);

        this.state = {
            ccDisplayList: []
        };
        //prefetch all the cc lists
        //this.ccList = [];
        //this.ccPairList = {};

        /*window.addEventListener(
          "focus",
          function(event) {
            this.forceUpdate();
          }.bind(this),
          false
        );*/

        let loadData = async function (root) {
            try {
                let data = await ccDataFetcher()();
                root.ccList = data.ccList;
                root.ccPairList = data.ccPairs;
                console.log("loaded");
            } catch (error) {
                console.log(error);
            }
        };
        loadData(this);
    }

    handleRowClicked(event, primaryText, secondaryText) {
        let { onCryptocurrencySelected, onClose } = this.props;
        if (onCryptocurrencySelected !== undefined) {
            onCryptocurrencySelected(primaryText, secondaryText);
        }
        if (onClose !== undefined) {
            onClose();
        }
    }

    handleSearchChanged(event) {
        let displayList = [];
        if (event.target.value !== "") {
            let value = event.target.value;
            let searchString = value.toLowerCase(); //.replace("-", "");
            //let searchString = value.split("-")[0];
            //console.log("search: " + searchString);
            for (let i = 0; i < this.ccList.length; i++) {
                let { coinName: name, symbol } = this.ccList[i];
                //console.log(name.toLowerCase());
                if (
                    name.toLowerCase().includes(searchString.toLowerCase()) ||
                    symbol.toLowerCase().includes(searchString.toLowerCase())
                ) {
                    /*if (name === "Bitcoin") {
                      console.log("found: " + symbol);
                      //displayList.unshift({primary: name, secondary:symbol});
                    }*/
                    //displayList.push({primary: name, secondary:symbol});
                    let pairs = this.ccPairList[symbol];
                    for (let key in pairs) {
                        if (pairs[key].toLowerCase().includes(searchString))
                            if (pairs[key] === symbol) continue;
                        //if(pairs[key].toLowerCase().contains
                        let pairString = symbol + "-" + pairs[key];
                        //if (pairs[key].toLowerCase().includes(searchString.toLowerCase())) {
                        displayList.push({ primary: name, secondary: pairString });
                        //}
                    }
                } else if (searchString.toLowerCase().includes(symbol.toLowerCase())) {
                    let pairs = this.ccPairList[symbol];
                    for (let key in pairs) {
                        //if(pairs[key].toLowerCase().contains
                        let pairString = symbol + "-" + pairs[key];
                        //if (pairs[key].toLowerCase().includes(searchString.toLowerCase())) {
                        if (pairString.toLowerCase().includes(searchString))
                            displayList.push({ primary: name, secondary: pairString });
                        //}
                    }
                }
            }
            //reorder the display list based on market cap
            this.setState({
                ccDisplayList: displayList
            });
        }
        /*console.log(
          displayList.map(d => {
            return "1: " + d.primary + " 2:" + d.secondary;
          })
        );*/
    }

    componentDidMount() {
        this.setState({
            appBarHeight: this.appBar.offsetHeight
        });
    }

    render() {
        let appBarHeight =
            this.state.appBarHeight === undefined ? 0 : this.state.appBarHeight;
        let listHeight = window.innerHeight - appBarHeight;

        //const ListElement =  e => React.cloneElement(e, {ccDisplayList: this.state.ccDisplayList});
        return (
            <div>
                <AppBar
                    ref={e => {
                        this.appBar = e;
                    }}
                    className={this.classes.appBar}
                >
                    <Toolbar variant="dense">
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={this.props.onClose}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <div className={this.classes.search}>
                            <div className={this.classes.searchIcon}>
                                {/*<SearchIcon />*/}
                            </div>
                            <InputBase
                                onChange={this.handleSearchChanged}
                                placeholder="Search…"
                                classes={{
                                    root: this.classes.inputRoot,
                                    input: this.classes.inputInput
                                }}
                                inputProps={{ "aria-label": "search" }}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
                <FixedSizeList
                    height={listHeight}
                    itemSize={46}
                    itemCount={this.state.ccDisplayList.length}
                    itemData={{
                        ccDisplayList: this.state.ccDisplayList,
                        onClick: this.handleRowClicked
                    }}
                >
                    {Row}
                </FixedSizeList>
            </div>
        );
    }
}

CCSelectionMenu.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CCSelectionMenu);
