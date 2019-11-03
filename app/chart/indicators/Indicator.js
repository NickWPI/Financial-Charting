export default function() {
    let accessor = d => d;
    let combine = (d, c) => d;
    let type = "baseIndicator";

    function indicator() {
    }

    indicator.setAccessorName = function(value) {
        if(value != undefined) {
            accessor = (d) => d[value];
            combine = (d, c) => d[value] = c;
        }
        return indicator;
    }

    indicator.accessor = function(value) {
        if(value == undefined) {
            return accessor;
        }
        accessor = value;
        return indicator;
    }

    indicator.combine = function(value) {
        if(value == undefined) {
            return combine;
        }
        combine = value;
        return indicator;
    }

    indicator.type = function(value) {
        if(value == undefined) {
            return type;
        }
        type = value;
        return indicator;
    }

    return indicator;
}