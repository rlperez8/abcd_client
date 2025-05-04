import React, {useState, useEffect, useRef} from 'react'; 
import {mousePressedOnCanvas,mouseReleasedOnCanvas,mousePressedOnPrices,mouseReleasedOnPrices,scrollZoom,checkIfMouseIsOverChart,checkIfMouseIsOverPrices,getWhichCandleMouseIsOver} from './MouseStatus';

import { MouseEvents } from './mouse_events';


// css
// import './CandleChart.css'

import * as canvas_tools from './tools';
const CandleChart = (props) => {

	const {
		selected_candles,
	} = props

	const [spaceBetweenCandles, setSpaceBetweenCandles] = useState(5)		
	const [candleWidth, setCandleWidth] = useState(10)						
	const [spaceBetweenWicks, setSpaceBetweenWicks] = useState(7.5)							    
	const [isMousePressedOnPrices, setIsMousePressedOnPrices] = useState(false)
	const main_ = React.createRef(null)
	const canvasPriceBar = React.createRef(null)
	const canvasChart = React.createRef(null);
	const canvasDates = React.createRef(null)
	const [mousePressedOnCanvas, setMousePressedOnCanvas] = useState(false)
	const [current_prices_moved, set_current_prices_moved] = useState(0)
	const [total_prices_moved, set_total_prices_moved] = useState(0)
	let price_and_grid_size = 20
	const [height_counter, set_height_counter] = useState(0)
	const [candles, set_candles] = useState([])
	const [starting_X_point, set_starting_X_point] = useState(-5)
	const [pixels_between, set_pixels_between] = useState(5)
	let default_number_of_prices = 20
	const displayed_price_range = 20 

	const [canvas_details, set_canvas_details] = useState({
		starting_pixels_per_price_unit: 0,
		pixels_per_single_price: 0,
		shrink_expand: 0,
		prev_shrink_expand: 0,
		current_pixels_per_price_unit: 0,
		current_mouse_price: 0,
		current_mouse_pixel_location: 0,
		y_spacing: 0,
		prev_y_spacing: 0,
		prev_x_spacing: 0,
		current_x_spacing: 0,
		starting_canvas_height: 0,
		current_canvas_height: 0,
		prev_canvas_height: 0,
		counter: 1,
		y_cord_on_mouse_click: 0,
		x_cord_on_mouse_click: 0,
		current_y_cord: 0,
		current_x_cord: 0,
		hovered_candle_high: 0,
		hovered_candle_close: 0,
		hovered_candle_open: 0,
		hovered_candle_low: 0,
		hovered_candle_color: '#26a69a',
		current_mid_price: 0,
		prev_mid_price: 0



	})

	// Track Mouse Movement
	useEffect(() => {
		const handleMouseMove = (event) => {
			set_canvas_details(prev => ({
				...prev,
				current_x_cord: event.clientX,
				current_y_cord: event.clientY
			}));
		
		};
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
		window.removeEventListener('mousemove', handleMouseMove);
		};
	
	}, []);

	// Canvas Height
	useEffect(() => {
		const timer = setTimeout(() => {

		  if (canvasPriceBar.current) {
			;
			const canvas = canvasPriceBar.current.getBoundingClientRect();
			const starting_pixels_per_price_unit = canvas.height / displayed_price_range
			let mid = starting_pixels_per_price_unit * (224 - 10)

			set_canvas_details(prev => ({
				...prev,
				starting_canvas_height: canvas.height,
				current_canvas_height: canvas.height,
				prev_canvas_height: canvas.height,
				y_spacing: mid,
				prev_y_spacing: mid,
				prev_mid_price: 224,
				current_mid_price: 224,
				current_x_spacing: canvas.right / 1.5,
				prev_x_spacing: canvas.right / 1.5,
			}));
		  }
	  
		}, 0);
	  
		return () => clearTimeout(timer);
	}, []);
	
	// Handle Canvas Sizing 
	useEffect(()=>{

		const [canvas, ctx] = canvas_tools.getCanvasAndCtx(canvasChart);
		if (!canvas || !ctx) return;

		set_canvas_details(prev => {
			const starting_pixels_per_price_unit = canvas_details.starting_canvas_height / displayed_price_range;
			const current_pixels_per_price_unit = starting_pixels_per_price_unit + canvas_details.shrink_expand;
			const pixels_per_single_price = current_pixels_per_price_unit / 100;
			const mouse_y_canvas_coords = canvas_details.current_canvas_height - (canvas_details.current_y_cord - canvas.getBoundingClientRect().top);
			const current_mouse_price = (mouse_y_canvas_coords / pixels_per_single_price) / 100 + (prev.y_spacing / current_pixels_per_price_unit);
			const current_mouse_pixel_location = canvas_details.current_y_cord - canvas.getBoundingClientRect().top;
			
			return {
				...prev,
				starting_pixels_per_price_unit,
				current_pixels_per_price_unit,
				pixels_per_single_price,
				current_mouse_price,
				current_mouse_pixel_location,
			};
		});
		
		return(()=>{})
	}, [canvas_details.shrink_expand, canvas_details.y_spacing, canvas_details.current_y_cord])

	// Plot Canvas Price
	useEffect(()=>{

		const [canvas, ctx] = canvas_tools.getCanvasAndCtx(canvasPriceBar);
		if (!canvas || !ctx) return;

		canvas_tools.plot_prices(canvas, ctx, canvas_details, set_canvas_details);
		canvas_tools.plot_y_price_box(ctx, canvas, canvas_details);
		canvas_tools.plot_y_price_tag(ctx, canvas, canvas_details);

		return(()=>{

		})
	}, [
		canvas_details.y_spacing, 
		canvas_details.current_pixels_per_price_unit,
		// canvas_details.current_mouse_price,
		// canvas_details.current_mouse_pixel_location
	])

	// Transform Candles to Fit Canvas
	useEffect(()=>{

		let new_candles = selected_candles.map((item)=> ({
			...item,
			date: item.date,
			high: item.high,
			open: item.open,
			close: item.close,
			low: item.low,
			static_wick_high : 0,
			dynamic_wick_high : 0,
			static_open : 0,
			dynamic_open : 0,
			static_close : 0,
			dynamic_close : 0,
			static_wick_low : 0,
			dynamic_wick_low : 0,
			pixel_start: 0,
			pixel_end: 0,
			static_a_price: 0,
			static_b_price: 0,
			static_c_price: 0,
		}))
		
		
		const chartRect = canvasChart.current.getBoundingClientRect();
		const chartHeight = chartRect.height;
		
		const toCanvasY = (price) => chartHeight - (price * canvas_details.current_pixels_per_price_unit);
		const toHeight = (close, open) => -(close - open) * canvas_details.current_pixels_per_price_unit;

		let startX = 0;
		new_candles = new_candles.map((candle) => {
			startX += 15;
			const openY = toCanvasY(candle.open);
			const closeY = toHeight(candle.close, candle.open);
			const highY = toCanvasY(candle.high);
			const lowY = toCanvasY(candle.low);
			const closePx = toCanvasY(candle.close);

			return {
				...candle,
				static_open: openY,
				dynamic_open: openY,
				static_close: closeY,
				dynamic_close: closeY,
				static_wick_high: highY,
				dynamic_wick_high: highY,
				static_wick_low: lowY,
				dynamic_wick_low: lowY,
				pixel_start: startX - 10,
				pixel_end: startX,
				static_a_price: closePx,
				static_b_price: closePx,
				static_c_price: closePx,
				static_d_price: openY,
			};
		});

		set_candles(new_candles);
		console.log(new_candles)

	}, [selected_candles])

	// Y-Spacing
	useEffect(()=>{
        if(mousePressedOnCanvas){
			set_canvas_details(prev => {
				let pixels_mouse_moved = canvas_details.current_y_cord - canvas_details.y_cord_on_mouse_click;
				let y_spacing = canvas_details.prev_y_spacing + pixels_mouse_moved;
				return {
					...prev,
					y_spacing
				}
		})}
        return () => {

        };
    }, [canvas_details.current_y_cord])

	// X-Spacing
	useEffect(()=>{
        if(mousePressedOnCanvas){
			set_canvas_details(prev => {
				let pixels_mouse_moved = canvas_details.current_x_cord - canvas_details.x_cord_on_mouse_click;
				let current_x_spacing = canvas_details.prev_x_spacing + pixels_mouse_moved;
				return {
					...prev,
					current_x_spacing
				}
			})
            let new_candles = candles.map((item)=>{
                return{
                    ...item,
                    pixel_start: 5 + canvas_details.current_x_spacing,
                    pixel_end: 15 + canvas_details.current_x_spacing,
                }
            })
            set_candles(new_candles)
        }

        return () => {

        };
    }, [canvas_details.current_x_cord])
	
	// Plot Canvas Chart
	useEffect(()=>{

		const [canvas, ctx] = canvas_tools.getCanvasAndCtx(canvasChart);
		if (!canvas || !ctx) return;
		
		canvas_tools.plot_grid(
			canvas, 
			ctx, 
			canvas_details.shrink_expand,
			canvas_details.current_canvas_height,
			default_number_of_prices,
			canvas_details.y_spacing
		)
		canvas_tools.plot_candles(
			canvas_details,
			starting_X_point,
			candles,
			ctx,
			canvas_details.current_x_spacing,
			canvas_details.y_spacing,
			candleWidth,
			pixels_between,
		)
		canvas_tools.plot_wicks(
			canvas_details,
			candles,
			ctx,
			canvas_details.current_x_spacing,
			canvas_details.y_spacing,
			candleWidth,
			pixels_between,
			candleWidth+pixels_between
		)
		canvas_tools.plot_mouse_grid(
			canvas_details,
			canvas,
			canvas_details.current_x_spacing,
			ctx,
			canvas.getBoundingClientRect()['height'],
			candleWidth,
			pixels_between)
		canvas_tools.plot_y_mouse_grid(canvas_details,canvas,ctx)


	},[canvas_details.current_x_spacing, canvasDates, canvas_details.shrink_expand, candleWidth])
	
	// Plot Canvas Date
	useEffect(()=>{

		const [canvas_dates, ctx_dates] = canvas_tools.getCanvasAndCtx(canvasDates);
		if (!canvas_dates || !ctx_dates) return;

		canvas_tools.plot_date_container(
			canvas_details,
			canvas_dates,
			ctx_dates,
			canvas_details.current_x_spacing,
			candleWidth,
			pixels_between
		)
		canvas_tools.plot_date_text(
			set_canvas_details,
			canvas_details,
			canvas_dates,
			ctx_dates,
			canvas_details.current_x_spacing,
			candleWidth,
			pixels_between,
			candles)

	}, [canvas_details.current_x_cord])

	// Dynamic Middle Price
	useEffect(()=>{
		let amount_moused_moved = canvas_details.current_y_cord - canvas_details.y_cord_on_mouse_click;
		let start_price_height = canvas_details.starting_canvas_height / price_and_grid_size
		let total_price_height = start_price_height + canvas_details.shrink_expand
		let prices_moved = amount_moused_moved / total_price_height
		let mid = canvas_details.prev_mid_price + prices_moved
		set_current_prices_moved(amount_moused_moved / total_price_height)
		set_canvas_details(prev => ({
			...prev,
		
			current_mid_price: mid

		}))
	}, [canvas_details.y_spacing])	

	MouseEvents(
		canvas_details.y_spacing, 
		canvas_details.shrink_expand,
		setMousePressedOnCanvas, 
		setIsMousePressedOnPrices,
		canvas_details.current_canvas_height,
		set_total_prices_moved,
		total_prices_moved,

		current_prices_moved,
		set_height_counter,
		canvas_details.current_x_spacing,

		set_canvas_details

	)
	useEffect(()=>{
		
		canvas_tools.Add_Shrink_Expand_To_Candles(
			canvas_details.current_mid_price, 
			height_counter,
			candles,
    		set_candles,
		)
	},[canvas_details.shrink_expand])

	// Shrink & Expand
	useEffect(()=>{

		if(isMousePressedOnPrices){
			
			// DRAG UP
			if(canvas_details.current_y_cord < canvas_details.y_cord_on_mouse_click){

				const dragAmount = canvas_details.current_y_cord - canvas_details.y_cord_on_mouse_click;
				const shrink_expand = canvas_details.prev_shrink_expand - dragAmount;
				const added_height = canvas_details.current_mid_price * -dragAmount;	
				// set_shrink_expand(shrink_expand)
				set_canvas_details(prev => ({
					...prev,
					current_canvas_height: prev.prev_canvas_height + added_height,
					shrink_expand: shrink_expand
		
				}));

				set_height_counter(dragAmount)
			}
			// DRAG DOWN
			if(canvas_details.current_y_cord > canvas_details.y_cord_on_mouse_click){

				
				let amount_moused_moved = canvas_details.current_y_cord - canvas_details.y_cord_on_mouse_click;
				let shrink_expand = canvas_details.prev_shrink_expand - amount_moused_moved;
				let added_height =  canvas_details.current_mid_price * amount_moused_moved
				// set_shrink_expand(shrink_expand)
				set_canvas_details(prev => ({
					...prev,
					current_canvas_height: prev.prev_canvas_height - added_height,
					shrink_expand: shrink_expand
				}));
				set_height_counter(amount_moused_moved)
			}
		}

	},[canvas_details.current_y_cord])


	
	return(
		<div className='candle_chart_container'

			onMouseUp={()=>{
				let new_candles = candles.map((obj)=>({
					...obj,
					static_open: obj.dynamic_open,
					static_close: obj.dynamic_close,
					static_wick_high : obj.dynamic_wick_high,
					static_wick_low: obj.dynamic_wick_low

				}))
				set_candles(new_candles
			)}}>

			<div className='candle_chart_container_2' 
				
				onMouseDown={()=>{
					set_canvas_details(prev => ({
						...prev,
						y_cord_on_mouse_click: canvas_details.current_y_cord,
						x_cord_on_mouse_click: canvas_details.current_x_cord,
					}));
				}}>

				<div className='candle_chart_wrapper' ref={main_}>

					<div className='canvas' >
					<div className='header-bar'>

					<div className='header_slot'>
							{candles[0]?.symbol}
						</div>
						<div className='header_slot'>
							<div className='header_one'>H</div>
							<div className='header_two' style={{color: canvas_details.hovered_candle_color}}>{canvas_details.hovered_candle_high}</div>
						</div>
						<div className='header_slot'>
							<div className='header_one'>C</div>
							<div className='header_two' style={{color: canvas_details.hovered_candle_color}}>{canvas_details.hovered_candle_close}</div>
						</div>
						<div className='header_slot'>
							<div className='header_one'>O</div>
							<div className='header_two' style={{color: canvas_details.hovered_candle_color}}>{canvas_details.hovered_candle_open}</div>
						</div>
						<div className='header_slot'>
							<div className='header_one'>L</div>
							<div className='header_two' style={{color: canvas_details.hovered_candle_color}}>{canvas_details.hovered_candle_low}</div>
						</div>
					</div>

						<canvas id='canvas' onMouseDown={()=>{setMousePressedOnCanvas(true)}} ref={canvasChart} onWheel={(event) => {scrollZoom(event,candleWidth,setSpaceBetweenCandles,spaceBetweenCandles,setCandleWidth,setSpaceBetweenWicks,spaceBetweenWicks)}}></canvas>
					</div>

					<div className='canvas_dates' 
				
					
						>
						<canvas id='canvasDatesBar' 
							ref={canvasDates}></canvas>

					</div>

				</div>	
				
				<div className='canvas_prices' 
					onMouseDown={() => {setIsMousePressedOnPrices(true)}}
					onWheel={(event) => {}}
					>
						<div className='pricesb'>
							<canvas ref={canvasPriceBar}></canvas>
						</div>
				</div>
				
				
			</div>
	    </div>
    )
}

export default CandleChart 