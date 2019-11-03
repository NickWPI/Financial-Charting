//extracts data with a specific accessor
//into an indepdenent array
export default function() {
    let accessor = d => d;

    function extractor(data) {
        return data.filter(function(value, index, arr) {
            return accessor(value) != undefined;
        });
    }

    extractor.accessor = function(value) {
        if(arguments.length == 0) {
            return accessor;
        }
        accessor = value;
        return extractor;
    }

    return extractor;
}