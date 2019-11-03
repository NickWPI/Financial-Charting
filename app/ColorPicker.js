import React from "react";
import { CirclePicker } from "react-color";

export default class ColorPicker extends React.Component {
    render() {
        return (
            <CirclePicker
                onChange={(color, event) => this.props.handleChange(color.hex)}
            />
        );
    }
}
