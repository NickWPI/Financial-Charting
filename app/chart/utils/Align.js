//fills up a shorter array with undefined
//to match the length of another array based on a key
//keys must be ordered the exact same way in both arrays
export default function align(match, dataToAlign, accessor) {
    let matchIndex = 0;
    let sourceIndex = 0;
    let result = [];
    //remove all undefined values from array
    let source = dataToAlign.filter(function(value, index, arr) {
        return value != undefined;
    });
    while (matchIndex < match.length) {
        let matchValue = accessor(match[matchIndex]);
        if (sourceIndex < source.length) {
            let sourceValue = accessor(source[sourceIndex]);
            if (matchValue != sourceValue) {
                result.push(undefined);
            }
            else {
                result.push(sourceValue);
                sourceIndex++;
            }
        }
        else {
            result.push(undefined);
        }
        matchIndex++;
    }
    return result;
}