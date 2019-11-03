import { labelText } from "./LabelText";

export default function() {
    let labelText = "";
    let valueText = "";
    let labelFill = "black";
    let valueFill = "black";
    let fontFamily = "Times New Roman, serif";
    let fontSize = 15;

    function textLabel(selection) {
        let text = selection.append("tspan")
            //.attr("font-family", fontFamily)
            .attr("font-size", fontSize);
        text.append("tspan")
            .attr("fill", labelFill)
            .text(`${labelText}: `);
        text.append("tspan")
            .attr("fill", valueFill)
            .text(`${valueText}`);
    }

    textLabel.valueLayout = function(value) {
        return textLabel;
    }

    textLabel.labelText = function(value) {
        if(value == undefined) {
            return labelText;
        }
        
        labelText = value;
        return textLabel;
    }

    textLabel.valueText = function(value) {
        if(value == undefined) {
            return valueText;
        }
        
        valueText = value;
        return textLabel;
    }

    textLabel.labelFill = function(value) {
        if(value == undefined) {
            return labelFill;
        }
        
        labelFill = value;
        return textLabel;
    }

    textLabel.valueFill = function(value) {
        if(value == undefined) {
            return valueFill;
        }
        
        valueFill = value;
        return textLabel;
    }

    textLabel.fontSize = function(value) {
        if(value == undefined) {
            return fontSize;
        }
        
        fontSize = value;
        return textLabel;
    }

    textLabel.fontFamily = function(value) {
        if(value == undefined) {
            return fontFamily;
        }
        
        fontFamily = value;
        return textLabel;
    }

    return textLabel;
}