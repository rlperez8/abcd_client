export const mousePressedOnCanvas = (setIsMousePressedOnCanvas,setXCoordinatesOnMouseClick,setYCoordinatesOnMouseClick,xyActiveCoordinates) => {	
	setIsMousePressedOnCanvas(true)
	setXCoordinatesOnMouseClick(xyActiveCoordinates['x'])
	setYCoordinatesOnMouseClick(xyActiveCoordinates['y']) 
}
export const mouseReleasedOnCanvas = (setIsMousePressedOnCanvas,setPrevCanvasXSpacing,setPrevCanvasYSpacing,canvasXSpacing,canvasYSpacing) => {
	setIsMousePressedOnCanvas(false)
	setPrevCanvasXSpacing(canvasXSpacing)
	setPrevCanvasYSpacing(canvasYSpacing)

}	
export const mousePressedOnPrices = (
	
	// setPreviousPriceSpacing,
	setIsMousePressedOnPrices,
	// setXCoordinatesOnMouseClick,
	setYCoordinatesOnMouseClick,
	// priceSpacing,
	xyActiveCoordinates
	) => {

	// setPreviousPriceSpacing(priceSpacing)
	setIsMousePressedOnPrices(true)
	// setXCoordinatesOnMouseClick(xyActiveCoordinates['x'])
	setYCoordinatesOnMouseClick(xyActiveCoordinates['y']) 

}
export const mouseReleasedOnPrices = (isMousePressedOnPrices,setIsMousePressedOnPrices,setPreviousExpandSize,expandSize) =>{
	if(isMousePressedOnPrices){
		setIsMousePressedOnPrices(false)
		setPreviousExpandSize(expandSize)
	}
}
export const scrollZoom = (event, candleWidth, setSpaceBetweenCandles, spaceBetweenCandles, setCandleWidth, setSpaceBetweenWicks, spaceBetweenWicks) => {
	

	const maxWidth = 680
	const minWidth = .25
	const spaceBetweenCandles_GrowShrinkSize = .50
	const candleWidth_GrowShrinkSize = .50
	const spaceBetweenWicks_GrowShrinkSize = .25

	
	const zoomIn = () => {
		if(candleWidth < maxWidth){
			setSpaceBetweenCandles(spaceBetweenCandles + spaceBetweenCandles_GrowShrinkSize)
			setCandleWidth(candleWidth + candleWidth_GrowShrinkSize)
			setSpaceBetweenWicks(spaceBetweenWicks + spaceBetweenWicks_GrowShrinkSize)
			// set_x_spacing(prev => prev -(candleWidth_GrowShrinkSize*candle_number_mouse_is_on))
		}
	}
	const zoomOut = () => {
		if(candleWidth > minWidth){
			setSpaceBetweenCandles(spaceBetweenCandles - spaceBetweenCandles_GrowShrinkSize)
			setCandleWidth(candleWidth - candleWidth_GrowShrinkSize)
			setSpaceBetweenWicks(spaceBetweenWicks - spaceBetweenWicks_GrowShrinkSize)
			// set_x_spacing(prev => prev +(candleWidth_GrowShrinkSize*candle_number_mouse_is_on))
		}
	}
	
	// Scroll up.
	event.deltaY < 0 && zoomIn()

	// Scroll down.
	event.deltaY > 0 && zoomOut()

}
export const checkIfMouseIsOverChart = (xyActiveCoordinates, canvasChartDimensions) => {
	
	let isMouseOverCanvas 
	let a = xyActiveCoordinates['x'] > canvasChartDimensions['left']
	let b = xyActiveCoordinates['x'] < canvasChartDimensions['right']
	let c = xyActiveCoordinates['y'] > canvasChartDimensions['top']
	let d = xyActiveCoordinates['y'] < canvasChartDimensions['bottom']	
	isMouseOverCanvas =  a && b && c && d
	return isMouseOverCanvas
}
export const checkIfMouseIsOverPrices = (xyActiveCoordinates, canvasPriceDimensions) => {
	
	let isMouseOverCanvasPrices
	let z = xyActiveCoordinates['x'] > canvasPriceDimensions['left']
	let y = xyActiveCoordinates['x'] < canvasPriceDimensions['right']
	let x = xyActiveCoordinates['y'] > canvasPriceDimensions['top']
	let w = xyActiveCoordinates['y'] < canvasPriceDimensions['bottom']


	isMouseOverCanvasPrices = z && x && y && w
	
	return isMouseOverCanvasPrices

}
export const getWhichCandleMouseIsOver = (canvasChartDimensions, canvasXSpacing, candleWidth, testCandles, xyActiveCoordinates, setOnCandle, spaceBetweenCandles) => {

	let cpp = []
	let i = 0
	let start = (canvasChartDimensions['left'] + canvasXSpacing)
	let end = start + candleWidth
	for (i = 0; i < testCandles.length; i += 1) 
	{
		cpp.push(
			{ 
				'index': i,
				'start': start,
				'end': start + candleWidth,
			},
		)	
		start += candleWidth + spaceBetweenCandles

	}

	cpp.map((item,index)=>{
		if(xyActiveCoordinates['x'] >= item['start'] && xyActiveCoordinates['x'] <= item['end'] ){
			setOnCandle(item['index'])
		}
	})

}