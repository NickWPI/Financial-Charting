export function isNumericalExtents(extents) {
	if(Array.isArray(extents) && extents.length === 2) {
		const [start, end] = extents;
		return (typeof start == "number" && typeof end == "number");
	}
	return false;
}

export function getClosestDateIndices(plotData, value, accessor) {
	let start = 0;
	let end = plotData.length - 1;
	/*while(end - start > 1) {
		let mid = Math.round((start + end) / 2);
		if(accessor(plotData[mid]).getTime() == value) {
			start = mid;
			end = mid;
		}
		//console.log(value);
		if(accessor(plotData[mid]).getTime() > value) {
			start = mid;
		}
		else {
			end = mid;
		}
	}*/
	if(value < accessor(plotData[0])) {
		start = 0;
		end = 0;
	}
	else if(value >= accessor(plotData[plotData.length - 1])) {
		start = plotData.length - 1;
		end = plotData.length - 1;
	}
	else {
		for(let i = 0; i < plotData.length; i++) {
			if(value >= accessor(plotData[i])) {
				start = i;
				end = i;
			}
		}
	}

	return {
		left: start,
		right: end
	}
}

export function plotDataProcessor(fullData, xAccessor, start, end) {
	let startIndex = getClosestDateIndices(fullData, start, xAccessor).right;
	let endIndex = getClosestDateIndices(fullData, end, xAccessor).left;
	let plotData = fullData.slice(startIndex, endIndex);
	return plotData;
}