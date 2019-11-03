import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    formControl: {
        margin: theme.spacing(3)
    },
    group: {
        margin: theme.spacing(1, 0)
    }
}));

export default function RadioSelectorList(props) {
    const classes = useStyles();
    const options = props.options;

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{props.title}</FormLabel>
                <RadioGroup
                    aria-label={props.label}
                    name={props.name}
                    className={classes.group}
                >
                    {options.map(value => {
                        const id = `id-${value}`;
                        let checked = false;
                        if (value === props.default) checked = true;
                        return (
                            <FormControlLabel
                                key={id}
                                control={<Radio />}
                                checked={checked}
                                label={value}
                                onClick={e => {
                                    props.onClick(value);
                                    e.stopPropagation();
                                }}
                            />
                        );
                    })}
                </RadioGroup>
            </FormControl>
        </div>
    );
}
