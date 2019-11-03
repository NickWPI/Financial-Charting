export default function() {
    let fontFamily = "Times New Roman, serif";
    let fontSize = 15;

    function labelText(selection) {
        let text = selection.append("text")
            .attr("class", "label-text")
            .attr("font-family", fontFamily)
            .attr("font-size", fontSize);
    }

    labelText.fontFamily = function(value) {
        if(value == undefined) {
            return fontFamily;
        }
        fontFamily = value;
        return labelText;
    }

    labelText.fontSize = function(value) {
        if(value == undefined) {
            return fontSize;
        }
        fontSize = value;
        return labelText;
    }

    return labelText;
}