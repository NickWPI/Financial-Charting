import zipper from "./Zip";
import align from "./Align"

export default function() {
    let skipUndefined = true;
    let data = [];
    let combine = (d, c) => {
        if(c == Object(c)) {
            /*if(d == undefined)
                d = c;
            else*/
                d = Object.assign(d, c)
        }
    };

    function merge(dest) {
        const zip = zipper().combine(function(d, other) {
            if(skipUndefined && other == undefined) {
                return d;
            }
            combine(d, other);
            let result = d;
            if(result == undefined) {
                return d;
            }
            return result;
        });

        return zip(dest, data);
    }

    merge.datum = function(value) {
        if (value == undefined) {
            return data;
        }
        data = value;
        return merge;
    }

    merge.combine = function(value) {
        if (value == undefined) {
            return combine;
        }
        combine = value;
        return merge;
    }

    merge.skipUndefined = function(value) {
        if (value == undefined) {
            return skipUndefined;
        }
        skipUndefined = value;
        return merge;
    }

    return merge;
}