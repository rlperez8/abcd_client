// Canvas Price
export const plot_prices = (
	canvas, 
	ctx,
    canvas_details,
    set_canvas_details
	) => {

	/*
	
			How Shrinking and Expanding Effect Works:

			The pixel height of the canvas is set to match the height of the parent element. 
			The number of prices or grid lines on the chart is determined by dividing the 
			canvas height by the specified number. The default is set to 10. The pixel space 
			between each grid price and line is calculated as the canvas height divided by 
			the number of grid lines. 

			For example, with zero shrinking or expanded size and a canvas height of 500, the 
			grid line price height would be set to 50. We then iterate over the height of the canvas, 
			drawing a grid line at every interval defined by the grid price line height.

			The shrink and expand value is used to adjust the grid line spacing by adding or 
			subtracting from the default grid line spacing. It does not modify the set number 
			of grid lines but directly affects the height itself.

			This approach allows for dynamic adaptation of grid lines based on the canvas height 
			and the specified number of grid lines, providing flexibility for responsive chart 
			displays.

			Example:

			Assuming the canvas height is 500 and the grid line amount is set to 2, a line would be 
			drawn at every 250 pixels. 

			Scenario 1:
			If 1 pixel is added by shrink and expand, there won't be a last line drawn because the 
			height of both lines would exceed the height of the canvas.

			Scenario 2:
			If the shrink and expand size is set to -90, reducing the grid line height to 160, this 
			not only shrinks each grid line but also draws an additional line. This happens because 
			the draw line is called three times within the height of the canvas.

			*/
            
    if (!canvas || !ctx) return;
    if (Number.isNaN(canvas_details.y_spacing)) return;
    if (canvas_details.current_pixels_per_price_unit == 0) return;
    if (canvas_details.current_canvas_height == 0) return;
    
    const start_pixel = canvas_details.current_canvas_height + canvas_details.y_spacing;
    const font_size = Math.floor(canvas.width / 6);
    const x_position = canvas.width / 4;

    ctx.font = `${font_size}px Source Sans Pro`;
    ctx.fillStyle = 'white';
    let price = 0;
    
    


    if(canvas_details.current_pixels_per_price_unit> 0){

    
    for (let y = start_pixel; y >= 0; y -= canvas_details.current_pixels_per_price_unit) {
        ctx.fillText(price.toFixed(2), x_position, y + 8); 
        price += canvas_details.counter;
    }}
}
export const plot_y_price_box = (ctx, canvas, canvas_details) => {
    let x = 0
    let y = -200
    let width = canvas.width
    let height = 25
    ctx.beginPath(); 
    ctx.fillStyle = "teal";
    ctx.fillRect(x, canvas_details.current_mouse_pixel_location - (height/2), width, height);
    ctx.stroke();

}
export const plot_y_price_tag = (ctx, canvas, canvas_details) => {
    ctx.beginPath(); 
    ctx.fillStyle = "#383838";
    ctx.beginPath(); 
    ctx.fillStyle = "white";
    ctx.font = '' + (canvas.width / 5) + 'px Source Sans Pro';
    ctx.fillText(canvas_details.current_mouse_price.toFixed(2), canvas.width / 4 , canvas_details.current_mouse_pixel_location + 7);
    ctx.stroke();
}

// Canvas Chart
export const plot_candles = (
	canvas_details,
	starting_X_point,
	candles,
	ctx,
	x_spacing,
	y_spacing,
	candle_width,
	pixels_between,
) => {

	[...candles].reverse().forEach((item)=>{
		ctx.beginPath(); 
		let colorRed = "#ef5350"
		// let colorGreen = '#09f0f0'
		let colorGreen = '#26a69a'
		if(item.open > item.close){
			ctx.fillStyle = colorRed
		}
		else if(item.open < item.close){
			ctx.fillStyle = colorGreen
		}
	
		ctx.fillRect(starting_X_point + x_spacing, item.dynamic_open + canvas_details.y_spacing, -candle_width, item.dynamic_close);
		
		ctx.stroke();
		starting_X_point-= (candle_width + pixels_between)
	})
	ctx.stroke();
	console.log(candles)
}
export const plot_wicks = (
	canvas_details,
	candles,
	ctx,
	x_spacing,
	y_spacing,
	candle_width,
	pixels_between,
	pixels_between_wicks

) => {
	// Plot Wicks
	let x_= -candle_width / 2
	let reversedCandles = [...candles].reverse();
	reversedCandles.forEach((item)=>{
		ctx.beginPath(); 
		let colorRed = "#ef5350"
		let colorGreen = '#26a69a'
		if(item.open > item.close){
			ctx.strokeStyle = colorRed
		}
		else if(item.open < item.close){
			ctx.strokeStyle = colorGreen
		}
		ctx.lineWidth = 1
		ctx.moveTo(x_ + x_spacing - 5, item.dynamic_wick_high + y_spacing);    // Move to the starting point
		ctx.lineTo(x_ + x_spacing - 5, item.dynamic_wick_low + y_spacing);   // Draw a line to the ending point
		ctx.stroke();
		x_ -= (pixels_between_wicks)
	})
}
export const plot_grid = (
	canvas, 
	ctx, 
	shrink_expand_amount,
	current_canvas_height,
	default_number_of_prices,
	y_spacing
	) => {


			/*
				GRID LINES:
			
				Grid lines are dynamically drawn based on the pixel height of the canvas, which is set to the height of the element, 
				allowing it to adapt to changes in element height.

				Algorithm:
				1. Obtain the height of the canvas.
				2. Divide the canvas height by the number of set grid lines.
				3. Set the starting pixel to 0 and the ending pixel to the canvas height.
				4. Iterate through the canvas height, drawing a line at each grid line interval.

				This process ensures that the grid lines adapt to changes in the element's height, providing a responsive representation 
				on the canvas.

				Price Expansion Size: The pixels added or removed in a grid_line_height to give the shrink and expand effect.
				
				Y-Spacing: Additional pixels added to the starting pixel of a Y cord.
				
				Grid Line Height: Pixels in between each line, or price line. 
			*/
			// Number of the default grid lines on the chart
		
			let default_price_pixel_height = canvas.height / default_number_of_prices
			let current_price_pixel_height = default_price_pixel_height + shrink_expand_amount

			let c = 1
			const get_price_height = () => {
				let price_height = 1
				// if(shrink_expand_amount>0){
				// 	if(shrink_expand_amount>20){
				// 		default_number_of_prices = 40
				// 		c = 2
		
				// 	}
					
				// 	return current_price_pixel_height/c
				// }
				
				// if(shrink_expand_amount<0){
				// 	// price_height = 10		
				// 	return current_price_pixel_height*price_height
				// }
		
				// else{
					return current_price_pixel_height*price_height
				// }
			}

			// The starting and ending pixels will be equal to the height of the canvas.
			let end_pixel = 0  
			let start_pixel = current_canvas_height + y_spacing
			ctx.beginPath(); 
            for(let i = start_pixel; i > end_pixel; i -= get_price_height()){
                // ctx.beginPath(); 
                // ctx.strokeStyle = '	#202020'
				ctx.strokeStyle = '#404040'
				ctx.lineWidth = .5
                ctx.moveTo(0, i);    // Move to the starting point
                ctx.lineTo(canvas.width, i);   // Draw a line to the ending point
                
            }
			ctx.stroke();
		
		
        // }
    // }
}
export const plot_mouse_grid = (
	canvas_details,
	canvas,
	x_spacing,
	ctx,
	graph_height,
	candle_width,
	pixels_between
) => {

	let mouse_y_loc = (canvas_details.current_x_cord - canvas.getBoundingClientRect().left)
	// Add x-spacing
	mouse_y_loc = (mouse_y_loc - x_spacing) 
	// Add candle width
	mouse_y_loc = mouse_y_loc - (candle_width / 2)
	

	// Pixel space a single candle takes
	let pixel_space_of_single_candle = candle_width + pixels_between

	let p = (mouse_y_loc / pixel_space_of_single_candle).toFixed(0)

	let pixelStart = (p * pixel_space_of_single_candle) + (candle_width / 2)
	ctx.beginPath(); 
	ctx.lineWidth = 1
	ctx.strokeStyle = 'gray'
	ctx.setLineDash([5, 5]); // [dash length, gap length]
	ctx.moveTo(pixelStart + x_spacing,graph_height);    // Move to the starting point
	ctx.lineTo(pixelStart + x_spacing, 0);   // Draw a line to the ending point
	ctx.stroke();
}
export const plot_y_mouse_grid = (
	canvas_details,
    canvas,
    ctx,
    xyActiveCoordinates
) => {

    let pixel_of_top_of_canvas = canvas.getBoundingClientRect()['top']
    let x_mouse_location = canvas_details.current_y_cord
    let x_mouse_location_adjusted = x_mouse_location - pixel_of_top_of_canvas

    ctx.beginPath(); 
    ctx.lineWidth = 1
    ctx.strokeStyle = 'gray'
    ctx.setLineDash([5, 5]); // [dash length, gap length]
    ctx.moveTo(0,x_mouse_location_adjusted);    // Move to the starting point
    ctx.lineTo(canvas.width,x_mouse_location_adjusted);   // Draw a line to the ending point
    ctx.stroke();



    
}
export const plot_mouse_date = (
	canvas_details,
	canvas,
	ctx,
	canvasDates,
	canvasDisplayHeight,
	xyActiveCoordinates,
	x_spacing,
	candles,
	candle_width,
	pixels_between,
	set_candle_number_mouse_is_one

) => {

		if (canvas) {

			if (ctx) {

				

				let mouse_x_loc = (canvas_details.current_x_cord - canvas.getBoundingClientRect().left)
				// Add x-spacing
				mouse_x_loc = (mouse_x_loc - x_spacing) 
				// Add Candle Width
				mouse_x_loc = mouse_x_loc - (candle_width / 2)

	
				let full_candle_width = candle_width + pixels_between
				let hovered_candled_index = (mouse_x_loc / full_candle_width).toFixed(0)
				set_candle_number_mouse_is_one(hovered_candled_index)
		

				// Placement of x-grid line
				let pixelStart = (hovered_candled_index * full_candle_width) + (candle_width / 2)

				let canvas_height = canvasDates.current.getBoundingClientRect()['height']

				var dynamicFontSize = canvas_height / 2.5;
				var text = candles[hovered_candled_index]?.date;
				var textMetrics = ctx.measureText(text);
				var textHeight = textMetrics.width;
				let mid_height = canvasDates.current.getBoundingClientRect()['height'] / 2
			
				ctx.font = '' + dynamicFontSize + 'px Source Sans Pro';
				
				// let text = 0
				// let x_text = x_spacing + (pixelStart - 40)
				let x_text = pixelStart
				let y_text = (mid_height + 8)

				let x_rect = x_spacing + (pixelStart - 50)
				let y_rect = 0
				let width_rect = 100
				let height_rect = 40
				ctx.beginPath(); 
				ctx.fillStyle = "teal";
				ctx.fillRect(x_rect, y_rect , width_rect, height_rect);

				ctx.beginPath(); 
				ctx.fillStyle = "white";
				ctx.fillText(text, x_text, y_text);
				ctx.stroke();
				
			
			}
		}

}
export const plot_date_container = (
	canvas_details,
	canvas,
	ctx,
	xyActiveCoordinates,
	x_spacing,
	candleWidth,
	pixels_between

) => {

	let mouse_x_loc = (canvas_details.current_x_cord - canvas.getBoundingClientRect().left)
	mouse_x_loc = (mouse_x_loc - x_spacing) 
	mouse_x_loc = mouse_x_loc - (candleWidth / 2)
	let full_candle_width = candleWidth + pixels_between
	let hovered_candled_index = (mouse_x_loc / full_candle_width + 1).toFixed(0)

	let pixelStart = (hovered_candled_index * full_candle_width) + (candleWidth / 2)

	let x_rect = x_spacing + (pixelStart - 50) - candleWidth
	let y_rect = 0
	let width_rect = 100
	let height_rect = 40
	ctx.beginPath(); 
	ctx.fillStyle = "teal";
	ctx.fillRect(x_rect, y_rect , width_rect, height_rect);


}
export const plot_date_text = (
	set_canvas_details,
	canvas_details,
	canvas_dates,
	ctx_dates,
	x_spacing,
	candleWidth,
	pixels_between,
	candles
) =>{
	let mouse_x_loc = (canvas_details.current_x_cord - canvas_dates.getBoundingClientRect().left)
	mouse_x_loc = (mouse_x_loc - x_spacing) 
	mouse_x_loc = mouse_x_loc - (candleWidth / 2)
	let full_candle_width = candleWidth + pixels_between
	let hovered_candled_index = -((mouse_x_loc / full_candle_width) + 1).toFixed(0)
	

	let pixelStart = -(hovered_candled_index * full_candle_width) + (candleWidth / 2)
	// var text = candles[hovered_candled_index]?.date;
	
	var text = [...candles].reverse()[hovered_candled_index]?.date;

	let open = [...candles].reverse()[hovered_candled_index]?.candle_open
	let close = [...candles].reverse()[hovered_candled_index]?.candle_close



	set_canvas_details(prev => {
		const reversedCandles = [...candles].reverse();
		const hoveredCandle = reversedCandles[hovered_candled_index];
		const hovered_candle_color = open > close ? '#ef5350' : open < close ? '#26a69a' : '';
	
		return {
			...prev,
			hovered_candle_high: hoveredCandle?.high.toFixed(2),
			hovered_candle_close: hoveredCandle?.close.toFixed(2),
			hovered_candle_open: hoveredCandle?.open.toFixed(2),
			hovered_candle_low: hoveredCandle?.low.toFixed(2),
			hovered_candle_color: hovered_candle_color

		};
	});
	// console.log([...candles].reverse())

	let mid_height = canvas_dates.getBoundingClientRect().height / 2
	let x_text = x_spacing + (pixelStart - 41) - candleWidth
	let y_text = 25
	// ctx_dates.beginPath(); 
	ctx_dates.font = '16px Arial'
	ctx_dates.fillStyle = "white";
	ctx_dates.fillText(text, x_text, y_text);
	ctx_dates.stroke();

}

// Shrink Expand
export const Add_Shrink_Expand_To_Candles = (
    mid_price, 
    height_counter,
    candles,
    set_candles,
) => {
    
    const add_shrink_expand_to_candle = (open, mid_price, height_counter, static_open) => {
        let bot_mid_distance = open - mid_price
        let current_added_height =  height_counter * bot_mid_distance
        return (static_open + current_added_height)
    }
    const add_shrink_expand_to_candle_top = (candle_close, candle_open, height_counter, static_close) => {
        let height_of_candle_in_price = candle_close - candle_open
        // let height_of_candle_in_pixels = size_of_one_price_unit * -height_of_candle_in_price
        let top_mid_distance = candle_close - candle_open
        let current_added_height = height_counter * top_mid_distance
        return (static_close + current_added_height)
    }
    // let new_top = add_to_candle_top(candle_close, candle_open, size_of_one_price_unit, static_end)
    // let new_bot = add_to_candle_bot(candle_open, mid_price, height_counter, static_start)
    // set_dynamic_end(new_top)
    // set_dynamic_start(new_bot)
  
    // Map through candles array asynchronously
    const new_candles = candles.map( (obj) => ({
        ...obj,
        dynamic_open: add_shrink_expand_to_candle(obj.open, mid_price, height_counter, obj.static_open),
        dynamic_close: add_shrink_expand_to_candle_top(obj.close, obj.open, height_counter, obj.static_close),
        dynamic_wick_high: add_shrink_expand_to_candle(obj.high, mid_price, height_counter, obj.static_wick_high),
        dynamic_wick_low: add_shrink_expand_to_candle(obj.low, mid_price, height_counter, obj.static_wick_low)
    }))

    // Set the state of candles after all asynchronous operations are completed
    set_candles(new_candles)
}




export const getCanvasAndCtx = (ref) => {
    if (!ref.current) return [null, null];
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [null, null];

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    return [canvas, ctx];
};

























// export const PlotCandles = (candle_open, candle_close, canvasPriceDimensions, mid_price, shrink_expand, set_candle_start, set_candle_height, set_prev_candle_start) => {
    
//     useEffect(()=>{

//         let size_of_one_price_unit = canvasPriceDimensions['height'] / 20
//         const get_starting_candle_open = (price_unit_pixel_size, candle_open) => {

//             let scaled_bot_price = price_unit_pixel_size * candle_open
            
//             return scaled_bot_price

//         }

//         const start_point = get_starting_candle_open(size_of_one_price_unit, candle_open)

//         set_candle_start(start_point)
//         set_prev_candle_start(start_point)

        

//         let price_of_bottom_of_candle = get_starting_candle_open(
//             candle_open, 
//             size_of_one_price_unit, 
//             canvasPriceDimensions['height'],
//             mid_price,
//             shrink_expand)

//         set_candle_start(price_of_bottom_of_candle)
//         set_candle_height(-size_of_one_price_unit)

//         return () => {

//         };
        
//     },[canvasPriceDimensions['height'], shrink_expand ])

//     return
// }
