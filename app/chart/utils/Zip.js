export default function() {
    let combine = d => d;

    function zip() {
        const n = arguments.length;
        if (n == 0)
            return [];
        const m = d3.min(arguments, length);
        let transpose = new Array(m);
        for (var i = -1; ++i < m;) {
            for (var j = -1, row = transpose[i] = new Array(n); ++j < n;) {
                row[j] = arguments[j][i];
            }
            transpose[i] = combine.apply(this, transpose[i]);
        }
        return transpose;
    }

    zip.combine = function (value) {
        if (value == undefined) {
            return combine;
        }
        combine = value;
        return zip;
    }

    function length(d) {
        return d.length;
    }

    return zip;
}