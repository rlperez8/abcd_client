import React, {useState, useRef, useEffect} from "react";
import './new.css'
import { handle_BaselineY } from './candle_chart_tools.js';

export const Candle_Chart = (props) => {

    const {
		selected_candles,
        set_is_listing_status,
        is_listing_status,
        ticker_symbol,
        set_canvas_dimensions,
        selected_abcd,
        selected_ab

	} = props
    
    console.log(selected_candles)
    const canvas_dates = useRef()
    const canvas_price = useRef()
    const canvas_chart = useRef()
    const mousePressedRef = useRef(false);
    const mouse_pressed_on_prices = useRef(false)
    const mouseX = useRef()
    const mouseY = useRef()
    const y_coord_on_mouse_click = useRef(0)
    const x_coord_on_mouse_click = useRef(0)
    const prev_shrink_expand = useRef(0)
    const current_shrink_expand = useRef(0)
    const height_counter = useRef(0)
    const [candle_high, set_candle_high] = useState(0)
    const [candle_close, set_candle_close] = useState(0)
    const [candle_open, set_candle_open] = useState(0)
    const [candle_low, set_candle_low] = useState(0)
    const [candle_color, set_candle_color] = useState('')
    const current_hovered_candle_index = useRef(0)
    const candle_width = useRef(10)
    const chart = useRef({
        current_pixels_between_candles: 5, 
        current_candle_width: 11,
        current_full_candle_width: 16,
        x_grid_increaser: 10,
        x_grid_width: 16*10,
        y_grid_height: 0,
        starting_price_unit_pixel_size: 0,
        current_price_unit_pixel_size: 0,
        grid_size_count: 0
    })
    let [abcd, set_abcd] = useState({
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        a_price: 0,
        b_price: 0,
        c_price: 0,
        d_price: 0,
        x_date: 0,
        x_price: 0,
        exit_price: 0,
        exit_date: 0,
        result: 0
    })
    const candleChartRef = useRef()

    useEffect(() => {
        // console.log(selected_candles[0])
        const resizeCanvas = () => {

            if (!canvas_chart.current || !canvas_price.current) return;
                
                const canvas = canvas_chart.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.height = canvas.offsetHeight;
                canvas.width = canvas.offsetWidth;
                const canvas_ = canvas_price.current;
                const ctx_ = canvas_.getContext('2d');

                if (!ctx_) return;
                canvas_.style.width = '100%';
                canvas_.style.height = '100%';
                canvas_.height = canvas_.offsetHeight;
                canvas_.width = canvas_.offsetWidth;

                const canvas_date = canvas_dates.current;
                const ctx_dates = canvas_date.getContext('2d');
                if (!ctx_dates) return;
                canvas_date.style.width = '100%';
                canvas_date.style.height = '100%';
                canvas_date.height = canvas_date.offsetHeight;
                canvas_date.width = canvas_date.offsetWidth;

                const PRICE_UNIT_DIVISOR = 10;
                const PRICE_MID = 5;
                candleChartRef.current = {
                    canvas,
                    ctx,
                    // canvas.style.height = "100%"
                    //   - This is CSS.
                    //   - It sets how tall the canvas *looks* on the page (relative to its parent).
                    //   - Does NOT change the canvas’s internal pixel grid for drawing.

                    // canvas.offsetHeight
                    //   - This is JavaScript (read-only).
                    //   - It gives the *actual rendered height in pixels* of the canvas on the page.
                    //   - Use this to set the canvas’s internal drawing size (canvas.height) so drawings aren’t blurry.
                    width: {
                        style_width: (canvas.style.width = "100%"),
                        width: canvas.offsetWidth,
                        starting_canvas_width: canvas.offsetWidth,
                        current_canvas_width: canvas.offsetWidth,
                        prev_canvas_width: canvas.offsetWidth,
                        prev_X_OffSet: 0,
                        current_X_OffSet: 0,
                    },
                    height: {
                        style_height: (canvas.style.height = "100%"),
                        height: 0,
                        previousBaselineY: 0,
                        startingBaselineY: 0,
                        currentBaselineY: 0,
                        initialBaselineY: 0,
                        prev_Y_OffSet: 0,
                        current_Y_OffSet: 0,
                        
                    },
                    price: {
                        starting_price_unit_pixel_size: 0,
                        current_price_unit_pixel_size: 0,
                        prev_pixels_per_price_unit: 0,
                        prev_mid_price: PRICE_MID,
                        current_mid_price: PRICE_MID,
                        static_mid: PRICE_MID,
                        current_pixels_per_price_unit: 0

                    },
                    candles: {
                        candles: selected_candles,
                        starting_candle_Y: selected_candles[0]?.open * (canvas.height / PRICE_UNIT_DIVISOR)
                    },
                    zoom: {
                        current: 0,
                        shrink_expand_height: 0
                    },
                    price_counter: 1,
                    unit_amount: 1
                    
                }   
                candleChartRef.current = handle_BaselineY(candleChartRef)
                candleChartRef.current.height.startingBaselineY = canvas.offsetHeight
                candleChartRef.current.height.currentBaselineY = canvas.offsetHeight
                candleChartRef.current.height.previousBaselineY = canvas.offsetHeight
                candleChartRef.current.width.starting_canvas_width = canvas.width
                candleChartRef.current.width.current_canvas_width = canvas.width
                candleChartRef.current.width.prev_canvas_width = canvas.width
                candleChartRef.current.price.starting_price_unit_pixel_size  = candleChartRef.current.height.currentBaselineY / 10
                candleChartRef.current.price.current_price_unit_pixel_size = candleChartRef.current.height.currentBaselineY / 10
                candleChartRef.current.price.prev_pixels_per_price_unit = candleChartRef.current.height.currentBaselineY / 10
                candleChartRef.current.price.current_pixels_per_price_unit = candleChartRef.current.height.currentBaselineY / 10
                candleChartRef.current.candles.candles = selected_candles
                candleChartRef.current.candles.starting_candle_Y = selected_candles[0]?.open * (canvas.height  / 10)     
                candleChartRef.current.height.currentBaselineY = (candleChartRef.current.candles.starting_candle_Y + candleChartRef.current.height.startingBaselineY) - (candleChartRef.current.height.startingBaselineY / 2)
                candleChartRef.current.height.previousBaselineY = (candleChartRef.current.candles.starting_candle_Y + candleChartRef.current.height.startingBaselineY) - (candleChartRef.current.height.startingBaselineY / 2)       
                candleChartRef.current.height.current_Y_OffSet = -candleChartRef.current.candles.starting_candle_Y + (candleChartRef.current.height.startingBaselineY / 2)
                candleChartRef.current.height.prev_Y_OffSet = -candleChartRef.current.candles.starting_candle_Y+ (candleChartRef.current.height.startingBaselineY / 2)
                candleChartRef.current.width.current_X_OffSet = -(canvas.width/2)
                candleChartRef.current.width.prev_X_OffSet = -(canvas.width/2)
                candleChartRef.current.price.current_mid_price = selected_candles[0]?.open
                candleChartRef.current.price.prev_mid_price = selected_candles[0]?.open
                candleChartRef.current.price.static_mid =selected_candles[0]?.open
                candleChartRef.current.zoom.current = 0
                candleChartRef.current.zoom.shrink_expand_height = 0
                candleChartRef.current.price_counter = 1
                candleChartRef.current.unit_amount = 1

                set_canvas_dimensions((prev)=> ({
                    ...prev,
                    chart_height: canvas.height,
                    price_height: canvas_.height,
                    date_height: canvas_date.height
                }))
        };
        // Run on mount
        resizeCanvas();
      
        // Re-run on window resize
        window.addEventListener('resize', resizeCanvas);
      
        return () => {
          window.removeEventListener('resize', resizeCanvas);
        };
    }, [selected_candles]);
    
    // Canvas Chart
    useEffect(() => {
        
        if (!canvas_chart.current) return;
        const canvas = canvas_chart.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        if (!canvas_price.current) return;
        const cp = canvas_price.current;
        const ctx_price = cp.getContext('2d');
        if (!ctx_price) return;
        cp.style.width = '100%';
        cp.style.height = '100%';
        cp.width = cp.offsetWidth;
        cp.height = cp.offsetHeight;

        if (!canvas_dates.current) return;
        const canvas_date = canvas_dates.current;
        const ctx_date = canvas_date.getContext('2d');
        if (!ctx_date) return;
        canvas_date.style.width = '100%';
        canvas_date.style.height = '100%';
        canvas_date.width = canvas_date.offsetWidth;
        canvas_date.height = canvas_date.offsetHeight;

        let animationFrameId = null;
         
        // Draw
        const drawGrid = () => {
            ctx.save()
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = .5;
                  
            for (
                let y = candleChartRef.current.height.currentBaselineY; 
                y > 0; 
                y -= candleChartRef.current.price.current_pixels_per_price_unit
            ) {
                const yPos = Math.floor(y);
                ctx.moveTo(0, yPos);
                ctx.lineTo(canvas.width, yPos);
            }
            
            ctx.stroke();
            ctx.restore()
        };
        const draw_x_grid = ()=>{

            ctx.save()
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = .5;


            let starting_x_loc = -(chart.current.current_full_candle_width/2)
            let ending_x_loc = -(candleChartRef.current.width.starting_canvas_width - candleChartRef.current.width.current_X_OffSet)

            for (let y = starting_x_loc; y > ending_x_loc; y -= chart.current.x_grid_width) {
                const yPos = y;
                ctx.moveTo(yPos - candleChartRef.current.width.current_X_OffSet, 0);
                ctx.lineTo(yPos - candleChartRef.current.width.current_X_OffSet, canvas.height);
            }
            
            ctx.stroke();
            ctx.restore()

        }
        const drawCandles = () => {
            
        
            let startingX = -(chart.current.current_pixels_between_candles / 2)
            candleChartRef.current.candles.candles.forEach(item => {
        
                    const x = Math.floor(startingX - candleChartRef.current.width.current_X_OffSet);
                    const y = Math.floor(item.current_bottom - candleChartRef.current.height.current_Y_OffSet);
                    const width = -chart.current.current_candle_width; // assuming this is negative for direction
                    const height = Math.floor(item.current_height);

                    // Fill with black
                    ctx.fillStyle = item.color;
                    ctx.fillRect(x, y, width, height);

                    // Outline with item color
                    ctx.strokeStyle = item.color;
                    ctx.lineWidth = 1; // Adjust thickness if needed
                    ctx.strokeRect(x, y, width, height);

                    startingX -= chart.current.current_candle_width + chart.current.current_pixels_between_candles;
                });
        };
        const drawWicks = () => {
            // let startingX = -(candle_width.current / 2);
            let startingX = -(chart.current.current_full_candle_width / 2)
            candleChartRef.current.candles.candles.forEach(item => {
                const x = Math.floor(startingX - candleChartRef.current.width.current_X_OffSet);
                const yHigh = Math.floor(item.current_high - candleChartRef.current.height.current_Y_OffSet);
                const yLow = Math.floor(item.current_low - candleChartRef.current.height.current_Y_OffSet);
                ctx.save()
                ctx.beginPath(); // start fresh path per wick
                ctx.strokeStyle = item.color;
                ctx.lineWidth = 1;
                ctx.moveTo(x, yHigh);
                ctx.lineTo(x, yLow);
                ctx.stroke();
                ctx.restore();
            
                startingX -= chart.current.current_candle_width + chart.current.current_pixels_between_candles;
            });
            
        };
        const drawPrices = () => {
            

            const start_pixel = candleChartRef.current.height.currentBaselineY
            const font_size = Math.floor(cp.width / 6);
            const x_position = cp.width / 4;
      
            ctx_price.font = `${font_size}px Source Sans Pro`;
            ctx_price.fillStyle = 'gray';
            
            
            let price = 0
            for (let y = start_pixel; y >= 0; y -= candleChartRef.current.price.current_pixels_per_price_unit) {
                ctx_price.fillText(price.toFixed(2), x_position, y + 8); 
                price += candleChartRef.current.price_counter;
            }
        }

        // Mouse Pointer
        const draw_Y_mouse = () => {
            ctx.save()
            let x_mouse_location = mouseY.current
            ctx.beginPath();
            ctx.lineWidth = 1
            ctx.strokeStyle = 'gray'
            ctx.setLineDash([5, 5]); 
            ctx.moveTo(0,x_mouse_location);    
            ctx.lineTo(canvas.width,x_mouse_location);  

            ctx.stroke();
            ctx.restore();
        };
        const draw_X_mouse = () => {
            ctx.save()
            
          
            // Find Current x-loc
            let mouse_x_loc = mouseX.current
            let mouse_x_loc_with_x_spacing = Math.floor(-(mouse_x_loc + candleChartRef.current.width.current_X_OffSet))
      

            // Track Index
            let index = Math.floor(mouse_x_loc_with_x_spacing/chart.current.current_full_candle_width) + 1
            current_hovered_candle_index.current = index 
         

            let pixelStart = (index * (chart.current.current_full_candle_width)) - (chart.current.current_full_candle_width/2)
         
 
       
            // const reversedCandles = [...candles].reverse();
            const hoveredCandle = candleChartRef.current.candles.candles[index-1];
            set_candle_high(hoveredCandle?.candle_high)
            set_candle_close(hoveredCandle?.candle_close)
            set_candle_open(hoveredCandle?.candle_open)
            set_candle_low( hoveredCandle?.candle_low)
            set_candle_color(hoveredCandle?.candle_open > hoveredCandle?.candle_close ? '#ef5350' : hoveredCandle?.candle_open < hoveredCandle?.candle_close ? '#26a69a' : '')
            
            const date = new Date(hoveredCandle?.date);
            const options = { weekday: 'short', day: '2-digit', month: 'short' };
            const formattedDate = date.toLocaleDateString('en-GB', options);

           
            // // Extract the last two digits of the year
            const shortYear = `'${date.getFullYear().toString().slice(-2)}`;

            let d = `${formattedDate} ${shortYear}`
     
            ctx.beginPath(); 
            ctx.lineWidth = 1
            ctx.strokeStyle = 'gray'
            ctx.setLineDash([5, 5]); 
            ctx.moveTo(-pixelStart - candleChartRef.current.width.current_X_OffSet, canvas.height);    
            ctx.lineTo(-pixelStart - candleChartRef.current.width.current_X_OffSet, 0); 

            // ctx.moveTo(-candleChartRef.current.width.current_X_OffSet, canvas.height);    
            // ctx.lineTo(-candleChartRef.current.width.current_X_OffSet, 0); 

            // let candle_size = chart.current.current_full_candle_width * 4
            // let x_loc = -(candleChartRef.current.width.current_X_OffSet + candle_size)

            // ctx.moveTo(-candleChartRef.current.width.current_X_OffSet - chart.current.current_full_candle_width, canvas.height);    
            // ctx.lineTo(-candleChartRef.current.width.current_X_OffSet - chart.current.current_full_candle_width, 0); 

            // ctx.moveTo(x_loc  , canvas.height);    
            // ctx.lineTo(x_loc  , 0); 
            
            // ctx.moveTo(-candleChartRef.current.width.current_X_OffSet - chart.current.current_full_candle_width * 5 , canvas.height);    
            // ctx.lineTo(-candleChartRef.current.width.current_X_OffSet - chart.current.current_full_candle_width * 5, 0); 

       
            // ctx.moveTo(-candleChartRef.current.width.current_X_OffSet, canvas.height);    
            // ctx.lineTo(-candleChartRef.current.width.current_X_OffSet, 0); 
            // ctx.moveTo(-candleChartRef.current.width.current_X_OffSet + (candle_width.current + 2.5 + 2.5), canvas.height);    
            // ctx.lineTo(-candleChartRef.current.width.current_X_OffSet +(candle_width.current + 2.5 + 2.5), 0); 

            ctx.stroke();
            ctx.restore();
        }

        // Mouse Price Tag
        const draw_Y_price_tag = () =>{
            

            let x_mouse_location = mouseY.current
            // let x_mouse_location_adjusted = x_mouse_location - pixel_of_top_of_canvas
            let x = 0
            let width = canvas.width
            let height = 25
            ctx_price.beginPath(); 
            ctx_price.fillStyle = "#151c20e0";
            ctx_price.fillStyle ="#151c20e0";
        
            ctx_price.fillRect(x, x_mouse_location- (height/2), width, height);
            ctx_price.stroke();
            ctx_price.restore();
        }
        const plot_y_price_tag = () => {
            ctx_price.beginPath(); 
          
      
            ctx_price.fillStyle = "#383838";
            ctx_price.fillStyle = "rgb(74, 13, 13)";

            let x_loc = Math.abs(mouseY.current-candleChartRef.current.height.startingBaselineY)
            let y_loc_price =x_loc/candleChartRef.current.price.current_pixels_per_price_unit
            let y_spacing_in_price = candleChartRef.current.height.current_Y_OffSet/candleChartRef.current.price.current_pixels_per_price_unit

            let shrink_expand_in_price = candleChartRef.current.zoom.shrink_expand_height / candleChartRef.current.price.current_pixels_per_price_unit
   
            let price = ((y_loc_price - y_spacing_in_price) - shrink_expand_in_price) * candleChartRef.current.unit_amount

    
            ctx_price.fillStyle = "gray";
            ctx_price.font = '20px Source Sans Pro';
            ctx_price.fillText(price.toFixed(2), 20 , mouseY.current+5);
            ctx_price.stroke();
        }

        // Date
        const draw_X_date_tag = () => {
            ctx_date.save()
            

            // Find Current x-loc
            let mouse_x_loc = mouseX.current
            let mouse_x_loc_with_x_spacing = -(mouse_x_loc + candleChartRef.current.width.current_X_OffSet)

            // Track Candle Width
            // let full_candle_width = candle_width.current + 5
            // let full_candle_width = chart.current.current_candle_width + 5
            let full_candle_width = chart.current.current_full_candle_width

            // Track X-Spacing
            let spacing_in_candles = candleChartRef.current.width.current_X_OffSet / full_candle_width

            // Track Index
            let index = Math.floor(mouse_x_loc_with_x_spacing/full_candle_width)
   
           
            mouse_x_loc = (mouse_x_loc - candleChartRef.current.width.current_X_OffSet);
            mouse_x_loc = mouse_x_loc - (candle_width.current / 2);
 
          
        
            let pixelStart = (index * full_candle_width) + (full_candle_width/2)
            pixelStart = pixelStart - 2.5
        
            let x_rect = candleChartRef.current.width.current_X_OffSet + (pixelStart - 75) - candle_width.current;
            let y_rect = 0;
            let width_rect = 150;
            let height_rect = 40;
       
            if(index>=0){
                ctx_date.beginPath();
                // ctx_date.fillStyle = "teal";
                ctx_date.fillStyle = "#151c20e0";
                ctx_date.fillRect( (-pixelStart - candleChartRef.current.width.current_X_OffSet)-80, y_rect, width_rect, canvas_date.height);
                ctx_date.stroke();
                ctx_date.restore()
            }
            
            
        }
        const draw_date_text = () => {
     
            let mouse_x_loc = mouseX.current 
            let mouse_x_loc_with_x_spacing = -(mouse_x_loc + candleChartRef.current.width.current_X_OffSet)


            // Track Candle Width
            // let full_candle_width = candle_width.current + 5
            let full_candle_width = chart.current.current_full_candle_width

            // Track X-Spacing
            let spacing_in_candles = candleChartRef.current.width.current_X_OffSet / full_candle_width

            // Track Index
            let index = Math.floor(mouse_x_loc_with_x_spacing/full_candle_width)
            // current_hovered_candle_index.current = index

            let pixelStart = (index * full_candle_width) + (full_candle_width/2)
            pixelStart = pixelStart - 2.5

            // Get Hovered Candle Date
            const hoveredCandle = candleChartRef.current.candles.candles[index]?.date;
            const date = new Date(hoveredCandle); 
            const options = { weekday: 'short', day: '2-digit', month: 'short' };
            const formattedDate = date.toLocaleDateString('en-GB', options);
            const shortYear = `'${date.getFullYear().toString().slice(-2)}`;
            const finalFormat = `${formattedDate} ${shortYear}`;

            

            const metrics = ctx_date.measureText(finalFormat);
            const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            

            let y_text = 30
            if(index>=0){
            ctx_date.beginPath(); 
            ctx_date.font = '16px Arial'
            ctx_date.fillStyle = "gray";
            ctx_date.fillText(finalFormat, (-pixelStart - candleChartRef.current.width.current_X_OffSet)-60,(canvas_date.height /2) + textHeight/2);
            ctx_date.stroke();
            }
        
        }
        const draw_x_grid_date = () => {

            // REMOVE DRAW FOR THIS FUNCTION WHEN JUST MOUSE MOVES
            let startingX = -(chart.current.current_candle_width / 2);
            
            let candle_index = 0
            // candleChartRef.current.candles.candles = candleChartRef.current.candles.candles.slice(0,30)
            candleChartRef.current.candles.candles.forEach(item => {
                
                const x = Math.floor(startingX - candleChartRef.current.width.current_X_OffSet);
         
                const date = new Date(candleChartRef.current.candles.candles[candle_index]?.date);
                
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`;
                const metrics = ctx_date.measureText(formattedDate);
                const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                ctx.save()
                ctx.beginPath(); 
                ctx_date.fillText(formattedDate, x-25, (canvas_date.height /2) + textHeight/2);
                ctx.stroke();
                ctx.restore();
            
                startingX -= chart.current.x_grid_width;
                let current_index = -Math.trunc(startingX/chart.current.current_full_candle_width)
                candle_index = current_index
    
   

            });
   

  
        }

        // Mouse Events
        const handleMouseMove = (e) => {
            mouseX.current = e.clientX - canvas.getBoundingClientRect().left;
            mouseY.current = e.clientY - canvas.getBoundingClientRect().top;
        
            // Mouse drag handling: update canvas offsets and mid-price while mouse is pressed
            if(mousePressedRef.current){   
              
                // -------------------
                // Horizontal movement (X)
                // -------------------

                // Calculate how many pixels the mouse moved horizontally while mouse down
                let pixels_mouse_moved_x = x_coord_on_mouse_click.current - mouseX.current

                // Update current canvas horizontal spacing based on previous offset
                candleChartRef.current.width.current_X_OffSet = candleChartRef.current.width.prev_X_OffSet + pixels_mouse_moved_x
                
                // Update canvas width to reflect new horizontal position
                candleChartRef.current.width.current_canvas_width = candleChartRef.current.width.prev_canvas_width  + candleChartRef.current.width.current_X_OffSet
    
                // -------------------
                // Vertical movement (Y)
                // -------------------

                // Calculate how many pixels the mouse moved vertically while mouse down
                let pixels_mouse_moved = y_coord_on_mouse_click.current - mouseY.current

                // Add canvas vertical spacing to previous value
                candleChartRef.current.height.current_Y_OffSet = candleChartRef.current.height.prev_Y_OffSet + pixels_mouse_moved

                // Update canvas height accordingly
                candleChartRef.current.height.currentBaselineY = candleChartRef.current.height.previousBaselineY - pixels_mouse_moved
                

                // NEW ==================
                // Update chartBaselineY
                candleChartRef.current.height.currentBaselineY = 
                    candleChartRef.current.height.previousBaselineY - pixels_mouse_moved
                
       



                // Mid
                let total_price_height = candleChartRef.current.price.current_pixels_per_price_unit + current_shrink_expand.current
                let prices_moved = pixels_mouse_moved / total_price_height
                let mid = candleChartRef.current.price.prev_mid_price - prices_moved
                candleChartRef.current.price.current_mid_price = mid
                candleChartRef.current.price.static_mid = mid
        
            
            }   
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(draw);
            }
        };
        const handleWheel = (e) => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(draw); 
        };
        const handleResize = () => {
        //   canvas.width = canvas.offsetWidth;
        //   canvas.height = canvas.offsetHeight;
          draw(); 
        };
        const handleResize_price = () => {
            // canvas.width = canvas.offsetWidth;
            // canvas.height = canvas.offsetHeight ;
            draw(); 
        };
        const candle_height_zoom = (e) => {

            let threshold = Math.floor(candleChartRef.current.price.starting_price_unit_pixel_size  * 0.5)

            let expand_threshold = Math.floor(candleChartRef.current.price.starting_price_unit_pixel_size  * 1.5)
        
            const zoomOut = () => {

                candleChartRef.current.zoom.shrink_expand_height += candleChartRef.current.price.current_mid_price
                candleChartRef.current.zoom.current += 1;
                candleChartRef.current.price.current_pixels_per_price_unit -= 1;
                const added_height = candleChartRef.current.price.current_mid_price * -1;
                candleChartRef.current.height.currentBaselineY += added_height;
                candleChartRef.current.height.previousBaselineY = candleChartRef.current.height.currentBaselineY;

                candleChartRef.current.price.current_price_unit_pixel_size = Math.floor(candleChartRef.current.price.current_price_unit_pixel_size -1)
                

                if (candleChartRef.current.price.current_price_unit_pixel_size === threshold) {

                    chart.current.grid_size_count+=1
                    
                    // Increase Unit Size
                    candleChartRef.current.price.current_pixels_per_price_unit *= 2;
                    candleChartRef.current.price.prev_pixels_per_price_unit *= 2;
                    
                    // Increase Displayed Numbers
                    candleChartRef.current.price_counter *= 2;
                    
                    // Adjust Height
                    let current_height = candleChartRef.current.height.currentBaselineY / candleChartRef.current.price.current_pixels_per_price_unit;
                    let total_height = candleChartRef.current.height.startingBaselineY / candleChartRef.current.price.current_pixels_per_price_unit;
                    
                    // Track Mid
                    let current_mid = (total_height / 2) - (total_height - current_height);
                    candleChartRef.current.price.current_mid_price = current_mid;
                    candleChartRef.current.price.prev_mid_price = current_mid;

                    candleChartRef.current.unit_amount *= 2
                    candleChartRef.current.price.current_price_unit_pixel_size = candleChartRef.current.price.current_pixels_per_price_unit

                    // break;
                }
                
                const add_shrink_expand_to_candle_top = (obj) => {


                    let res = (obj.close - obj.open) / candleChartRef.current.unit_amount
                    res = res * candleChartRef.current.price.current_pixels_per_price_unit
                    return Math.trunc(-res);
                }
                const add_shrink_expand_to_candle = (price, mid_price, height_counter, static_open, obj) => {

                    let res = price / candleChartRef.current.unit_amount
                    res = res * candleChartRef.current.price.current_pixels_per_price_unit
                    res = res - candleChartRef.current.height.startingBaselineY
                    res = res + candleChartRef.current.zoom.shrink_expand_height

                    return Math.trunc(-res);
                }
                // candleChartRef.current.candles.candles = candleChartRef.current.candles.candles.slice(0,1)
                candleChartRef.current.candles.candles = candleChartRef.current.candles.candles.map((obj) => {
               
               
                    return {
                        ...obj,
                        current_high: add_shrink_expand_to_candle(obj.high,candleChartRef.current.price.current_mid_price,1,obj.prev_high),
                        current_height: Math.abs(obj.current_height) > 1 ? add_shrink_expand_to_candle_top(obj) : 1,
                        current_bottom: add_shrink_expand_to_candle(obj.open,candleChartRef.current.price.current_mid_price,1,obj.prev_bottom, obj),
                        current_low: add_shrink_expand_to_candle(obj.low,candleChartRef.current.price.current_mid_price,1,obj.prev_low)
                    };
                });
                
            };
            const zoomIn = () => {
                
                candleChartRef.current.zoom.shrink_expand_height -= candleChartRef.current.price.current_mid_price
                candleChartRef.current.zoom.current -= 1;
                candleChartRef.current.price.current_pixels_per_price_unit += 1;
                const added_height = candleChartRef.current.price.current_mid_price * -1;
                candleChartRef.current.height.currentBaselineY -= added_height;
                candleChartRef.current.height.previousBaselineY = candleChartRef.current.height.currentBaselineY;

                candleChartRef.current.price.current_price_unit_pixel_size = Math.floor(candleChartRef.current.price.current_price_unit_pixel_size +1)
              
                // const zoomLevels = [
                //     { threshold: 80, multiplier: 5 , pixel_size_reducer: 1},
                //     { threshold: 200, multiplier: 2 , pixel_size_reducer: 5},
                //     { threshold: 290, multiplier: 2, pixel_size_reducer: 10},
                //     { threshold: 370, multiplier: 2.5 , pixel_size_reducer: 20},
                //     { threshold: 550, multiplier: 2 , pixel_size_reducer: 50},
                //     { threshold: 690, multiplier: 5 , pixel_size_reducer: 100},
                //     { threshold: 880, multiplier: 5, pixel_size_reducer: 500},
                //     { threshold: 1300, multiplier: 2 , pixel_size_reducer: 2500},
                //     { threshold: 1500, multiplier: 2 , pixel_size_reducer: 5000},
                //     { threshold: 1550, multiplier: 5 , pixel_size_reducer: 10000},
                // ];
                // for (const level of zoomLevels) {
                    if (candleChartRef.current.price.current_price_unit_pixel_size === expand_threshold) {
                    
                        // Descrease Unit Pixel Size
                        candleChartRef.current.price.current_pixels_per_price_unit /= 2;
                        candleChartRef.current.price.prev_pixels_per_price_unit /= 2;

                        // Descrease Displayed Numbers
                        candleChartRef.current.price_counter /= 2;
            
                        let current_height = candleChartRef.current.height.currentBaselineY / candleChartRef.current.price.current_pixels_per_price_unit;
                        let total_height = candleChartRef.current.height.startingBaselineY / candleChartRef.current.price.current_pixels_per_price_unit;
                     
                        // Track Mid
                        let current_mid = (total_height / 2) - (total_height - current_height);
                        candleChartRef.current.price.current_mid_price = current_mid;
                        candleChartRef.current.price.prev_mid_price = current_mid;
         
                        candleChartRef.current.unit_amount /= 2
                        candleChartRef.current.price.current_price_unit_pixel_size = candleChartRef.current.price.current_pixels_per_price_unit

                   
                    }
                
                const add_shrink_expand_to_candle_top = (obj) => {
                    let res = (obj.close - obj.open) / candleChartRef.current.unit_amount
                    res = res * candleChartRef.current.price.current_pixels_per_price_unit
                    return Math.trunc(-res);
                             
                }
                const add_shrink_expand_to_candle = (price) => {
                    let res = price / candleChartRef.current.unit_amount
                    res = res * candleChartRef.current.price.current_pixels_per_price_unit
                    res = res - candleChartRef.current.height.startingBaselineY
                    res = res + candleChartRef.current.zoom.shrink_expand_height

                    return Math.trunc(-res); 
                }
                candleChartRef.current.candles.candles = candleChartRef.current.candles.candles.map((obj) => {

                    return {
                        ...obj,
                        current_high: add_shrink_expand_to_candle(obj.high),
                        current_height: add_shrink_expand_to_candle_top(obj),
                        current_bottom: add_shrink_expand_to_candle(obj.open),
                        current_low: add_shrink_expand_to_candle(obj.low)
                    };
                });
                
              
            };
            if (e.deltaY < 0) zoomIn();
            if (e.deltaY > 0) zoomOut();
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(draw);
            }
   
        };
        const candle_width_zoom = (event) => {

            const zoomIn = () => {       
                
                
                // Increase Grid Width
                chart.current.x_grid_width += .75 * chart.current.x_grid_increaser
                
                // Increase Candle Width
                chart.current.current_candle_width += .50
                chart.current.current_pixels_between_candles += .25
                
                chart.current.current_full_candle_width = chart.current.current_candle_width + chart.current.current_pixels_between_candles

                let multiplier = 2 * current_hovered_candle_index.current - 1
                let offset = (0.25 + 0.125) * multiplier

                // X-Spacing
                candleChartRef.current.width.current_X_OffSet -= offset
                candleChartRef.current.width.prev_X_OffSet -= offset
          
                // Add More Grids
                const zoomLevels = [
                    { threshold: 5, increaser: 20},
                    { threshold: 10, increaser: 10},
                    { threshold: 25, increaser: 5},
                    { threshold: 35, increaser: 3},
                    { threshold: 100, increaser: 1},
                ];            
                for(const level of zoomLevels){
                    if(level.threshold === chart.current.current_full_candle_width){
                        chart.current.x_grid_increaser = level.increaser
                        chart.current.x_grid_width = chart.current.current_full_candle_width * level.increaser
                        
                    }
                }
              
            }
            const zoomOut = () => {
                
                // Decrease Grid Width
                
                if(chart.current.current_candle_width>0.5){

               
                    chart.current.x_grid_width -= .75 * chart.current.x_grid_increaser
              
                
                // Decrease Candle Width
                // if(chart.current.current_candle_width > .50){
                    chart.current.current_candle_width -= .50
                    chart.current.current_pixels_between_candles -= .25
                    chart.current.current_full_candle_width = chart.current.current_candle_width + chart.current.current_pixels_between_candles

                    let multiplier = 2 * current_hovered_candle_index.current - 1
                    let offset = (0.25 + 0.125) * multiplier
                    // X-Spacing
                    candleChartRef.current.width.current_X_OffSet += offset
                    candleChartRef.current.width.prev_X_OffSet += offset
                // } 

                // Reduce Grids
                const zoomLevels = [
                     { threshold: 1.75, increaser: 320},
                    { threshold: 5, increaser: 40},
                    { threshold: 10, increaser: 20},
                    { threshold: 25, increaser: 10},
                    { threshold: 35, increaser: 5},
                    { threshold: 100, increaser: 3},
                ];            
                for(const level of zoomLevels){
                    if(level.threshold === chart.current.current_full_candle_width){
                        chart.current.x_grid_increaser = level.increaser
                        chart.current.x_grid_width = chart.current.current_full_candle_width * level.increaser
                        
                    }
                }
 }


                
            }

            event.deltaY < 0 && zoomIn()
            event.deltaY > 0 && zoomOut()
            animationFrameId = null;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(draw); 


            
        }
        const draw = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            ctx_price.clearRect(0, 0, cp.width, cp.height);
            
            const draw_X_letter = () => {

                ctx.save();

                // --- A Coordinates ---
                let a_y_loc = (abcd.x_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.x_date;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // Set font and measure text
                const fontSize = 14;
                ctx.font = `${fontSize}px Arial`;
                const text = "X";
                const textMetrics = ctx.measureText(text);
                const padding = 4;

                const textWidth = textMetrics.width;
                const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

                // Draw background box
                ctx.fillStyle = "orange";
                ctx.fillRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw border (optional)
                ctx.strokeStyle = "black";
                ctx.strokeRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw the letter A
                ctx.fillStyle = "black";
                ctx.fillText(text, a_x_loc, a_y_loc);

                ctx.restore();

            }
            const draw_A_letter = () => {

                ctx.save();

                // --- A Coordinates ---
                let a_y_loc = (abcd.a_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // Set font and measure text
                const fontSize = 14;
                ctx.font = `${fontSize}px Arial`;
                const text = "A";
                const textMetrics = ctx.measureText(text);
                const padding = 4;

                const textWidth = textMetrics.width;
                const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

                // Draw background box
                ctx.fillStyle = "orange";
                ctx.fillRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw border (optional)
                ctx.strokeStyle = "black";
                ctx.strokeRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw the letter A
                ctx.fillStyle = "black";
                ctx.fillText(text, a_x_loc, a_y_loc);

                ctx.restore();

            }
            const draw_B_letter = () => {

                ctx.save();

                // --- A Coordinates ---
                let a_y_loc = (abcd.b_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.b;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // Set font and measure text
                const fontSize = 14;
                ctx.font = `${fontSize}px Arial`;
                const text = "B";
                const textMetrics = ctx.measureText(text);
                const padding = 4;

                const textWidth = textMetrics.width;
                const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

                // Draw background box
                ctx.fillStyle = "orange";
                ctx.fillRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw border (optional)
                ctx.strokeStyle = "black";
                ctx.strokeRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw the letter A
                ctx.fillStyle = "black";
                ctx.fillText(text, a_x_loc, a_y_loc);

                ctx.restore();

            }
            const draw_C_letter = () => {

                ctx.save();

                // --- A Coordinates ---
                let a_y_loc = (abcd.c_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.c;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // Set font and measure text
                const fontSize = 14;
                ctx.font = `${fontSize}px Arial`;
                const text = "C";
                const textMetrics = ctx.measureText(text);
                const padding = 4;

                const textWidth = textMetrics.width;
                const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

                // Draw background box
                ctx.fillStyle = "orange";
                ctx.fillRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw border (optional)
                ctx.strokeStyle = "black";
                ctx.strokeRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw the letter A
                ctx.fillStyle = "black";
                ctx.fillText(text, a_x_loc, a_y_loc);

                ctx.restore();

            }
            const draw_D_letter = () => {

                ctx.save();

                // --- A Coordinates ---
                let a_y_loc = (abcd.d_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.d;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // Set font and measure text
                const fontSize = 14;
                ctx.font = `${fontSize}px Arial`;
                const text = "D";
                const textMetrics = ctx.measureText(text);
                const padding = 4;

                const textWidth = textMetrics.width;
                const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

                // Draw background box
                ctx.fillStyle = "orange";
                ctx.fillRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw border (optional)
                ctx.strokeStyle = "black";
                ctx.strokeRect(
                    a_x_loc - padding,
                    a_y_loc - textHeight - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                );

                // Draw the letter A
                ctx.fillStyle = "black";
                ctx.fillText(text, a_x_loc, a_y_loc);

                ctx.restore();

            }
            const draw_start_AB = () => {
                
                ctx.save()
                // --- X Coordinates ---
                let pivot_x_y_loc = (abcd.x_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                pivot_x_y_loc = -(pivot_x_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let pivot_x_x_loc = -chart.current.current_full_candle_width * abcd.x_date;
                pivot_x_x_loc -= candleChartRef.current.width.current_X_OffSet;
                pivot_x_x_loc += chart.current.current_full_candle_width / 2;
                // --- A Coordinates ---
                let a_y_loc = (abcd.a_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // --- B Coordinates ---
                let b_y_loc = (abcd.b_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                b_y_loc = -(b_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let b_x_loc = -chart.current.current_full_candle_width * abcd.b;
                b_x_loc -= candleChartRef.current.width.current_X_OffSet;
                b_x_loc += chart.current.current_full_candle_width / 2;

                // --- C Coordinates ---
                let c_y_loc = (abcd.c_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                c_y_loc = -(c_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let c_x_loc = -chart.current.current_full_candle_width * abcd.c;
                c_x_loc -= candleChartRef.current.width.current_X_OffSet;
                c_x_loc += chart.current.current_full_candle_width / 2;

                // --- D Coordinates ---
                let d_y_loc = (abcd.d_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                d_y_loc = -(d_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let d_x_loc = -chart.current.current_full_candle_width * abcd.d;
                d_x_loc -= candleChartRef.current.width.current_X_OffSet;
                d_x_loc += chart.current.current_full_candle_width / 2;

                // --- Exit Coordinates ---
                let exit_y_loc = (abcd.exit_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                exit_y_loc = -(exit_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let exit_x_loc = -chart.current.current_full_candle_width * abcd.exit_date;
                exit_x_loc -= candleChartRef.current.width.current_X_OffSet;
                exit_x_loc += chart.current.current_full_candle_width / 2;

                // --- Draw Lines ---
                ctx.beginPath();
    

                // AB
                ctx.moveTo(pivot_x_x_loc, pivot_x_y_loc);
                ctx.lineTo(a_x_loc, a_y_loc);
                ctx.lineTo(b_x_loc, b_y_loc);
                // BC
                ctx.lineTo(c_x_loc, c_y_loc); 
                // CD
                ctx.lineTo(d_x_loc, d_y_loc); 
         
       
                // --- Optional stroke on top ---
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 5;

                ctx.stroke();
                ctx.restore()

                ctx.save();

                // --- Common Values ---
                const arrowLength = 20;
                const arrowAngle = Math.PI / 6;

                // --- Calculate angle of the line ---
                const angle = Math.atan2(exit_y_loc - d_y_loc, exit_x_loc - d_x_loc);

                // --- Calculate shortened end point for line (before arrow) ---
                const shortened_x = exit_x_loc - arrowLength * Math.cos(angle);
                const shortened_y = exit_y_loc - arrowLength * Math.sin(angle);

                // --- Draw line (stops before arrowhead) ---
                ctx.beginPath();
                ctx.moveTo(d_x_loc, d_y_loc);
                ctx.lineTo(shortened_x, shortened_y);
                ctx.strokeStyle = abcd.result === 'Win' ? 'teal' : 'darkred';
                ctx.lineWidth = 10;
                ctx.shadowColor = abcd.result === 'Win' ? 'teal' : 'red'; // match line color
                ctx.shadowBlur = 25
                ctx.stroke();

                // --- Draw Arrowhead ---
                ctx.beginPath();
                ctx.moveTo(exit_x_loc, exit_y_loc);
                ctx.lineTo(
                exit_x_loc - arrowLength * Math.cos(angle - arrowAngle),
                exit_y_loc - arrowLength * Math.sin(angle - arrowAngle)
                );
                ctx.lineTo(
                exit_x_loc - arrowLength * Math.cos(angle + arrowAngle),
                exit_y_loc - arrowLength * Math.sin(angle + arrowAngle)
                );
                ctx.lineTo(exit_x_loc, exit_y_loc); // Back to tip
                ctx.closePath();

                ctx.fillStyle = 'white'; // visible arrowhead color
                ctx.fill();

                ctx.restore();

            }
            const draw_retracement = () => {
                
                ctx.save()
                // --- A Coordinates ---
                let a_y_loc = (abcd.a_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                // --- B Coordinates ---
                let b_y_loc = (abcd.b_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                b_y_loc = -(b_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let b_x_loc = -chart.current.current_full_candle_width * abcd.b;
                b_x_loc -= candleChartRef.current.width.current_X_OffSet;
                b_x_loc += chart.current.current_full_candle_width / 2;

                // --- C Coordinates ---
                let c_y_loc = (abcd.c_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                c_y_loc = -(c_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let c_x_loc = -chart.current.current_full_candle_width * abcd.c;
                c_x_loc -= candleChartRef.current.width.current_X_OffSet;
                c_x_loc += chart.current.current_full_candle_width / 2;

                // --- D Coordinates ---
                let d_y_loc = (abcd.d_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                d_y_loc = -(d_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let d_x_loc = -chart.current.current_full_candle_width * abcd.d;
                d_x_loc -= candleChartRef.current.width.current_X_OffSet;
                d_x_loc += chart.current.current_full_candle_width / 2;

                // --- Draw Lines ---
                ctx.beginPath();
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3
                ctx.setLineDash([5, 5]); 

                // AB
                ctx.moveTo(a_x_loc, a_y_loc);
                ctx.lineTo(c_x_loc, c_y_loc);

                // ctx.moveTo(b_x_loc, b_y_loc);
                // ctx.lineTo(d_x_loc, d_y_loc);
       

                // --- Optional stroke on top ---
                ctx.strokeStyle = 'white';
                // ctx.lineWidth = 7;

                ctx.stroke();
                ctx.restore()

            }
            const draw_price_levels = () => {
                            ctx.save();

                            // Calculate all y positions
                            const y_stop_loss = -( (abcd.stop_loss / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit - candleChartRef.current.height.startingBaselineY ) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;
                            const y_take_profit = -( (abcd.take_profit / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit - candleChartRef.current.height.startingBaselineY ) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;
                            const y_entered_price = -( (abcd.entered_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit - candleChartRef.current.height.startingBaselineY ) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                            // Calculate horizontal start and end positions
                            let x_start = -chart.current.current_full_candle_width * abcd.d;
                            x_start -= candleChartRef.current.width.current_X_OffSet;
                            x_start += chart.current.current_full_candle_width / 2;

                            let x_end = -chart.current.current_full_candle_width * abcd.exit_date;
                            x_end -= candleChartRef.current.width.current_X_OffSet;
                            x_end += chart.current.current_full_candle_width / 2;

                            // Draw stop loss line
                            ctx.beginPath();
                            ctx.strokeStyle = '#ef5350';
                            ctx.lineWidth = 3;
                            ctx.moveTo(x_start, y_stop_loss);
                            ctx.lineTo(x_end, y_stop_loss);
                            ctx.stroke();

                            // Draw take profit line
                            ctx.beginPath();
                            ctx.strokeStyle = '#26a69a';
                            ctx.lineWidth = 3;
                            ctx.moveTo(x_start, y_take_profit);
                            ctx.lineTo(x_end, y_take_profit);
                            ctx.stroke();

                            // Draw entered price line
                            ctx.beginPath();
                            ctx.strokeStyle = 'white';
                            ctx.lineWidth = 3;
                            ctx.moveTo(x_start, y_entered_price);
                            ctx.lineTo(x_end, y_entered_price);
                            ctx.stroke();

                            // Fill area above entered price line with teal (take profit zone)
                            let topFillY = y_take_profit;
                            let heightTop = y_entered_price - y_take_profit;
                            if (heightTop > 0) {  // sanity check so height is positive
                                ctx.fillStyle = 'rgba(38, 166, 154, 0.2)';  // semi-transparent teal
                                ctx.fillRect(x_start, topFillY, x_end - x_start, heightTop);
                            }

                            // Fill area below entered price line with red (stop loss zone)
                            let bottomFillY = y_entered_price;
                            let heightBottom = y_stop_loss - y_entered_price;
                            if (heightBottom > 0) {
                                ctx.fillStyle = 'rgba(239, 83, 80, 0.2)';  // semi-transparent red
                                ctx.fillRect(x_start, bottomFillY, x_end - x_start, heightBottom);
                            }

                            ctx.restore();
            }
            const draw_ab_price = () => {

                ctx.save()
                let a_y_loc = (abcd.a_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                a_y_loc = -(a_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
                a_x_loc -= candleChartRef.current.width.current_X_OffSet;
                a_x_loc += chart.current.current_full_candle_width / 2;

                let b_y_loc = (abcd.b_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                b_y_loc = -(b_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let b_x_loc = -chart.current.current_full_candle_width * abcd.b;
                b_x_loc -= candleChartRef.current.width.current_X_OffSet;
                b_x_loc += chart.current.current_full_candle_width / 2;

                let c_y_loc = (abcd.c_price / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                c_y_loc = -(c_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                let c_x_loc = -chart.current.current_full_candle_width * abcd.c;
                c_x_loc -= candleChartRef.current.width.current_X_OffSet;
                c_x_loc += chart.current.current_full_candle_width / 2;

                let d_y_loc = ((abcd.c_price-abcd.ab_price_length) / candleChartRef.current.unit_amount) * candleChartRef.current.price.current_pixels_per_price_unit;
                d_y_loc = -(d_y_loc - candleChartRef.current.height.startingBaselineY) - candleChartRef.current.zoom.shrink_expand_height - candleChartRef.current.height.current_Y_OffSet;

                ctx.beginPath();
    

                // AB
                ctx.moveTo(a_x_loc, a_y_loc);
                ctx.lineTo(a_x_loc, b_y_loc);

                ctx.moveTo(c_x_loc, c_y_loc);
                ctx.lineTo(c_x_loc, d_y_loc);
            

       
                // --- Optional stroke on top ---
              
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3
                ctx.setLineDash([5, 5]); 

                ctx.stroke();
                ctx.restore()


            }

          

            drawGrid();
            draw_x_grid()
            
            drawCandles();
            drawWicks();
            drawPrices();
            draw_Y_mouse()
            draw_Y_price_tag()
            draw_X_mouse()

            plot_y_price_tag()
            
            ctx_date.clearRect(0, 0, canvas_date.width, canvas_date.height);
            
            // draw_x_grid_date();
            // draw_X_date_tag()
            draw_date_text()

            draw_start_AB()
      
            draw_retracement()
            // draw_retracement_days()
            // draw_stop_lost()
            // draw_take_profit()
            // draw_entered_price()
            // draw_price_levels()
            // draw_X_letter()
            // draw_A_letter()
            // draw_B_letter()
            // draw_C_letter()
            // draw_D_letter()
            // draw_ab_price()
    
            
            animationFrameId = null;

        };
        

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUpPrices);
        canvas.addEventListener('mousedown', handleMouseDownPrices);
        canvas.addEventListener('resize', handleResize);
        canvas.addEventListener('wheel', candle_width_zoom)

        cp.addEventListener('mouseup', handleMouseUpPrices);
        cp.addEventListener('mousedown', handleMouseDownPrices);
        cp.addEventListener('resize', handleResize_price);
        cp.addEventListener('wheel', candle_height_zoom)

        draw();
        
        return () => {
            cancelAnimationFrame(animationFrameId);canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('resize', handleResize);
            canvas.removeEventListener('wheel', candle_width_zoom)

            cp.removeEventListener('mouseup', handleMouseUpPrices);
            cp.removeEventListener('mousedown', handleMouseDownPrices);
            cp.removeEventListener('resize', handleResize_price);
            cp.removeEventListener('wheel', candle_height_zoom)
    
        };
    }, [selected_candles, abcd]);

    // Format Pattern
    useEffect(()=>{
        if(selected_abcd){

            const get_formatted_date = (candle) => {
                const date = new Date(candle.date);
                return date.toISOString().split("T")[0];
            }
            
            set_abcd(prev=> ({
                ...prev,
                a: get_formatted_date(selected_abcd['pattern_A_pivot_date']) + 1,
                b: get_formatted_date(selected_abcd['pattern_B_pivot_date'])  + 1,
                c: get_formatted_date(selected_abcd['pattern_C_pivot_date'])  + 1,
                d: get_formatted_date(selected_abcd['trade_entered_date'])  + 1,
                exit_date: get_formatted_date(selected_abcd['trade_exited_date']) + 1,
                x_date: get_formatted_date(selected_abcd['x_pivot_date']) + 1,
                x_price: parseFloat(selected_abcd['x_pivot_price']),
                a_price: parseFloat(selected_abcd['pivot_A_price']),
                b_price: parseFloat(selected_abcd['pivot_B_price']),
                c_price: parseFloat(selected_abcd['pivot_C_price']),
                d_price: parseFloat(selected_abcd['trade_entered_price']),
                stop_loss: parseFloat(selected_abcd['trade_stop_loss']),
                take_profit: parseFloat(selected_abcd['trade_exited_price']),
                entered_price: parseFloat(selected_abcd['trade_entered_price']),
                ab_price_length: parseFloat(selected_abcd['ab_price_length']),
                exit_price: parseFloat(selected_abcd['trade_exited_price']),
                result: selected_abcd['trade_result']
            }))
           


        }
    },[selected_abcd])

    const handleMouseDown = () => {
        mousePressedRef.current = true;
        y_coord_on_mouse_click.current = mouseY.current
        x_coord_on_mouse_click.current = mouseX.current

      
    };
    const handleMouseDownPrices = () => {
        mouse_pressed_on_prices.current = true;
        y_coord_on_mouse_click.current = mouseY.current
        x_coord_on_mouse_click.current = mouseX.current
    };
    const handleMouseUp = () => {
        mousePressedRef.current = false;
        candleChartRef.current.height.previousBaselineY = candleChartRef.current.height.currentBaselineY
        candleChartRef.current.height.prev_Y_OffSet = candleChartRef.current.height.current_Y_OffSet
        candleChartRef.current.width.prev_canvas_width = candleChartRef.current.width.current_canvas_width
        candleChartRef.current.width.prev_X_OffSet = candleChartRef.current.width.current_X_OffSet
        candleChartRef.current.price.prev_mid_price = candleChartRef.current.price.current_mid_price
        candleChartRef.current.price.prev_pixels_per_price_unit = candleChartRef.current.price.current_pixels_per_price_unit


        // ==========
        candleChartRef.current.height.previousBaselineY = candleChartRef.current.height.currentBaselineY
        

        
    };
    const handleMouseUpPrices = () => {
        mouse_pressed_on_prices.current = false;
        prev_shrink_expand.current = current_shrink_expand.current
        candleChartRef.current.height.previousBaselineY = candleChartRef.current.height.currentBaselineY
        candleChartRef.current.price.prev_mid_price = candleChartRef.current.price.current_mid_price
        candleChartRef.current.price.prev_pixels_per_price_unit = candleChartRef.current.price.current_pixels_per_price_unit
        height_counter.current = 0
        for (const candle of candleChartRef.current.candles.candles) {
            candle.prev_high = candle.current_high;
            candle.prev_bottom = candle.current_bottom;
            candle.prev_low = candle.current_low;
            candle.prev_height = candle.current_height;
        }

      
    };
    return(
        <div className='candle_chart_container'>
         
            <div className='candle_chart_wrapper'>
                <div className='canvas'>

                    <div className='header-bar'>
    
                        <div className='header_slot' onClick={()=>{set_is_listing_status(!is_listing_status)}}>{ticker_symbol}</div>
                            <div className='header_slot'>
                                <div className='header_one'>H</div>
                                <div className='header_two' style={{color: candle_color}}>{candle_high}</div>
                            </div>
                            <div className='header_slot'>
                                <div className='header_one'>C</div>
                                <div className='header_two' style={{color: candle_color}}>{candle_close}</div>
                            </div>
                            <div className='header_slot'>
                                <div className='header_one'>O</div>
                                <div className='header_two' style={{color: candle_color}}>{candle_open}</div>
                            </div>
                            <div className='header_slot'>
                                <div className='header_one'>L</div>
                                <div className='header_two' style={{color: candle_color}}>{candle_low}</div>
                            </div>
                    </div>
    
                    <canvas id='canvas' 
                    ref={canvas_chart}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        // onWheel={(event) => {zoom(event)}}
                    >

                    </canvas>
                </div>
    
                <div className='canvas_dates'>
                    <canvas id='canvasDatesBar' ref={canvas_dates}></canvas>
                </div>
    
            </div>	
                    
            <div className='canvas_prices'>
                <div className='pricesb'>
                    <canvas ref={canvas_price} 
                        onMouseDown={handleMouseDownPrices}
                        onMouseUp={handleMouseUpPrices}></canvas>
                </div>
            </div>
                    
        </div>
    )
}

