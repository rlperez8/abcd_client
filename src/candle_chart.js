import React, {useState, useRef, useEffect} from "react";
import './new.css'

export const Candle_Chart = (props) => {

    const {
		selected_candles,
	} = props
    const canvas_dates = useRef()
    const canvas_price = useRef()
    const canvas_chart = useRef()
    const mousePressedRef = useRef(false);
    const mouse_pressed_on_prices = useRef(false)
    const canvas_height = useRef(0);
    const mouseX = useRef()
    const mouseY = useRef()
    const y_coord_on_mouse_click = useRef(0)
    const x_coord_on_mouse_click = useRef(0)
    const current_y_spacing = useRef(0)
    const prev_y_spacing = useRef(0)
    const current_x_spacing = useRef(0)
    const prev_x_spacing = useRef(0)
    const starting_canvas_height = useRef(0)
    const current_canvas_height = useRef(0)
    const prev_canvas_height = useRef(0)
    const starting_canvas_width = useRef(0)
    const current_canvas_width = useRef(0)
    const prev_canvas_width = useRef(0)
    const candle_width = useRef(10)
    const candles = useRef([])
    const prev_shrink_expand = useRef(0)
    const current_shrink_expand = useRef(0)
    const current_mid_price = useRef(0)
    const prev_mid_price = useRef(0)
    const prev_pixels_per_price_unit = useRef(0)
    const current_pixels_per_price_unit = useRef(0)
    const height_counter = useRef(0)
    const price_counter = useRef(1)
    const zoom_level = useRef(0)
    const unit_amount = useRef(1)
    const static_mid = useRef(0)
    const shrink_expand_height = useRef(0)
    const candles_loaded = useRef(false)
    const [candle_high, set_candle_high] = useState(0)
    const [candle_close, set_candle_close] = useState(0)
    const [candle_open, set_candle_open] = useState(0)
    const [candle_low, set_candle_low] = useState(0)
    const [candle_color, set_candle_color] = useState('')

    const hovered_candle_open = useRef(0)
    const hovered_candle_close = useRef(0)
    const hovered_candle_low = useRef(0)
    console.log('rendered')
    
    // Canvas Re-Size
    useEffect(() => {
        const resizeCanvas = () => {
            if (!canvas_chart.current || !canvas_price.current) return;
            
                const canvas = canvas_chart.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.height = canvas.offsetHeight;
                canvas.width = canvas.offsetWidth;
                canvas_height.current = canvas.height;
                starting_canvas_height.current = canvas.height
                current_canvas_height.current = canvas.height
                prev_canvas_height.current = canvas.height
                starting_canvas_width.current = canvas.width
                current_canvas_width.current = canvas.width
                prev_canvas_width.current = canvas.width
                prev_pixels_per_price_unit.current = current_canvas_height.current / 10
                current_pixels_per_price_unit.current = current_canvas_height.current / 10
                current_mid_price.current = 5
                prev_mid_price.current = 5
                static_mid.current = 5

                // Starting Height
                // current_canvas_height.current += 3549.59
                // prev_canvas_height.current += 3549.59
 
                // // Starting Y
                // let half = 122.6 * 5
                // current_y_spacing.current = -2970.59 - half
                // prev_y_spacing.current = -2970.59 - half

                // Starting X
                // current_x_spacing.current = ((candle_width.current+5) * 3950) - (canvas.width/2)
                // prev_x_spacing.current = ((candle_width.current+5) * 3950) - (canvas.width/2)
                // current_x_spacing.current = -(canvas.width/2)
                // prev_x_spacing.current = -(canvas.width/2)

                // Starting Mid
                // current_mid_price.current = ((3549.59+(122.6*5)) / 122.6)
                // prev_mid_price.current = ((3549.59+(122.6*5)) / 122.6)
                // static_mid.current =((3549.59+(122.6*5)) / 122.6)


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

            

        };
      
        // Run on mount
        resizeCanvas();
      
        // Re-run on window resize
        window.addEventListener('resize', resizeCanvas);
      
        return () => {
          window.removeEventListener('resize', resizeCanvas);
        };
    }, []);
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
        prev_canvas_height.current = current_canvas_height.current
        prev_y_spacing.current = current_y_spacing.current
        prev_canvas_width.current = current_canvas_width.current
        prev_x_spacing.current = current_x_spacing.current
        prev_mid_price.current = current_mid_price.current
        prev_pixels_per_price_unit.current = current_pixels_per_price_unit.current

        
    };
    const handleMouseUpPrices = () => {
        mouse_pressed_on_prices.current = false;
        prev_shrink_expand.current = current_shrink_expand.current
        prev_canvas_height.current = current_canvas_height.current
        prev_mid_price.current = current_mid_price.current
        prev_pixels_per_price_unit.current = current_pixels_per_price_unit.current
        height_counter.current = 0
        for (const candle of candles.current) {
            candle.prev_high = candle.current_high;
            candle.prev_bottom = candle.current_bottom;
            candle.prev_low = candle.current_low;
            candle.prev_height = candle.current_height;
        }

      
    };
    // Transform Candles to Fit Canvas
    useEffect(()=>{
        
        let s = selected_candles.slice(0,1)
        let new_candles = selected_candles.reverse().map((item)=> ({
            ...item,
            date: item.candle_date,
            high: item.candle_high,
            open: Math.min(item.candle_open, item.candle_close),
            close: Math.max(item.candle_open, item.candle_close),
            low: item.candle_low,
            prev_high : 0,
            prev_height : 0,
            prev_bottom : 0,
            prev_low : 0,
            current_high : 0,
            current_height : 0,
            current_bottom : 0,
            current_low : 0,
            color: item.candle_open > item.candle_close ? '#ef5350' : '#26a69a'
        }))
    
        const canvas = canvas_chart.current
        let chartHeight = canvas.height;
        const current_pixels_per_price_unit = chartHeight / 10
        
        const toCanvasY = (price) => {
            let a = price *current_pixels_per_price_unit
            let price_px =  -(a - chartHeight)
            return price_px
        }
            
        const toHeight = (close, open) => -(close - open) * current_pixels_per_price_unit;
    
        let startX = 0;
        new_candles = new_candles.map((candle) => {
            startX += 15;
            const bottom = toCanvasY(Math.min(candle.open, candle.close));
            const height = toHeight(Math.max(candle.open, candle.close),Math.min(candle.open, candle.close));
            const high = toCanvasY(candle.high);
            const low = toCanvasY(candle.low);
   
    
            return {
                ...candle,
                prev_high : high,
                prev_height : height,
                prev_bottom : bottom,
                prev_low : low,
                current_high : high,
                current_height : height,
                current_bottom : bottom,
                current_low : low,


            };
        });
        
        // candles.current = new_candles.slice(426,610)
        candles.current = new_candles
        candles_loaded.current = true


    }, [selected_candles])
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
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = .2;
                  
            for (
                let y = current_canvas_height.current; 
                y > 0; 
                y -= current_pixels_per_price_unit.current
            ) {
                const yPos = Math.floor(y);
                ctx.moveTo(0, yPos);
                ctx.lineTo(canvas.width, yPos);
            }
            
            ctx.stroke();
            ctx.restore()
        };
        const drawCandles = () => {
    
            let startingX = 0;
            let candleWidth = Math.max(1, Math.floor(candle_width.current));
            let spacing = 5;
            
            if(candleWidth === 4){
                spacing=4
            }
            if(candleWidth === 3){
                spacing=3
            }
            if(candleWidth === 2){
                spacing=2
            }
            if(candleWidth === 1){
                spacing=0
            }

            // ctx.fillRect(0, 500, 500, 50);
            candles.current.forEach(item => {

                const x = Math.floor(startingX - current_x_spacing.current);
                const y = Math.floor(item.current_bottom - current_y_spacing.current);
                const height = Math.floor(item.current_height);
                ctx.fillStyle = item.color;
             
                ctx.fillRect(x, y, -candleWidth, height);
                startingX -= candleWidth + spacing;
            });
        };
        const drawWicks = () => {

            
            let startingX = -(candle_width.current / 2);
            let candleWidth = Math.max(1, Math.floor(candle_width.current));
            let spacing = 5;
            if(candleWidth === 4){
                spacing=4
            }
            if(candleWidth === 3){
                spacing=3
            }
            if(candleWidth === 2){
                spacing=2
            }
            if(candleWidth === 1){
                spacing=0
            }
            
            candles.current.forEach(item => {
                const x = Math.floor(startingX - current_x_spacing.current);
                const yHigh = Math.floor(item.current_high - current_y_spacing.current);
                const yLow = Math.floor(item.current_low - current_y_spacing.current);
                ctx.save()
                ctx.beginPath(); // start fresh path per wick
                ctx.strokeStyle = item.color;
                ctx.lineWidth = 1;
                ctx.moveTo(x, yHigh);
                ctx.lineTo(x, yLow);
                ctx.stroke();
                ctx.restore();
            
                startingX -= candleWidth + spacing;
            });
            
        };
        const drawPrices = () => {
            

            const start_pixel = current_canvas_height.current
            const font_size = Math.floor(cp.width / 6);
            const x_position = cp.width / 4;
    
            ctx_price.font = `${font_size}px Source Sans Pro`;
            ctx_price.fillStyle = 'white';
            
            
            let price = 0
            for (let y = start_pixel; y >= 0; y -= current_pixels_per_price_unit.current) {
                ctx_price.fillText(price.toFixed(2), x_position, y + 8); 
                price += price_counter.current;
            }
        }
        const draw_X_mouse = () => {
            ctx.save()
     
            // Find Current x-loc
            let mouse_x_loc = mouseX.current - canvas.getBoundingClientRect().left
            let mouse_x_loc_with_x_spacing = -(mouse_x_loc + current_x_spacing.current)

            // Track Candle Width
            let full_candle_width = candle_width.current + 5

            // Track X-Spacing
            let spacing_in_candles = current_x_spacing.current / full_candle_width

            // Track Index
            let index = Math.floor(mouse_x_loc_with_x_spacing/full_candle_width)
            

            let pixelStart = (index * full_candle_width) + (full_candle_width/2)
            pixelStart = pixelStart - 2.5
       
            // const reversedCandles = [...candles].reverse();
            const hoveredCandle = candles.current[index];
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
            ctx.moveTo(-pixelStart - current_x_spacing.current, canvas.height);    
            ctx.lineTo(-pixelStart - current_x_spacing.current, 0); 

            // ctx.moveTo(-current_x_spacing.current, canvas.height);    
            // ctx.lineTo(-current_x_spacing.current, 0); 
            // ctx.moveTo(-current_x_spacing.current - (candle_width.current + 2.5 + 2.5), canvas.height);    
            // ctx.lineTo(-current_x_spacing.current - (candle_width.current + 2.5 + 2.5), 0); 

       
            // ctx.moveTo(-current_x_spacing.current, canvas.height);    
            // ctx.lineTo(-current_x_spacing.current, 0); 
            // ctx.moveTo(-current_x_spacing.current + (candle_width.current + 2.5 + 2.5), canvas.height);    
            // ctx.lineTo(-current_x_spacing.current +(candle_width.current + 2.5 + 2.5), 0); 

            ctx.stroke();
            ctx.restore();
        }
        const draw_Y_mouse = () => {
            ctx.save()
            let pixel_of_top_of_canvas = canvas.getBoundingClientRect()['top']
            let x_mouse_location = mouseY.current
            let x_mouse_location_adjusted = x_mouse_location - pixel_of_top_of_canvas
        
            ctx.beginPath();
            ctx.lineWidth = 1
            ctx.strokeStyle = 'gray'
            ctx.setLineDash([5, 5]); 
            ctx.moveTo(0,x_mouse_location_adjusted);    
            ctx.lineTo(canvas.width,x_mouse_location_adjusted);  

            ctx.stroke();
            ctx.restore();
        };
        const draw_Y_price_tag = () =>{
            
            let pixel_of_top_of_canvas = canvas.getBoundingClientRect()['top']
            let x_mouse_location = mouseY.current
            let x_mouse_location_adjusted = x_mouse_location - pixel_of_top_of_canvas
            let x = 0
            let width = canvas.width
            let height = 25
            ctx_price.beginPath(); 
            ctx_price.fillStyle = "teal";
            ctx_price.fillRect(x, x_mouse_location_adjusted- (height/2), width, height);
            ctx_price.stroke();
            ctx_price.restore();
        }
        const draw_X_date_tag = () => {
            ctx_date.save()
            ctx_date.clearRect(0, 0, canvas_date.width, canvas_date.height);

            // Find Current x-loc
            let mouse_x_loc = mouseX.current - canvas.getBoundingClientRect().left
            let mouse_x_loc_with_x_spacing = -(mouse_x_loc + current_x_spacing.current)

            // Track Candle Width
            let full_candle_width = candle_width.current + 5

            // Track X-Spacing
            let spacing_in_candles = current_x_spacing.current / full_candle_width

            // Track Index
            let index = Math.floor(mouse_x_loc_with_x_spacing/full_candle_width)
            
            console.log(index)
           
            mouse_x_loc = (mouse_x_loc - current_x_spacing.current);
            mouse_x_loc = mouse_x_loc - (candle_width.current / 2);
 
          
        
            let pixelStart = (index * full_candle_width) + (full_candle_width/2)
            pixelStart = pixelStart - 2.5
        
            let x_rect = current_x_spacing.current + (pixelStart - 75) - candle_width.current;
            let y_rect = 0;
            let width_rect = 150;
            let height_rect = 40;
            console.log(index)
            if(index>=0){
                ctx_date.beginPath();
                ctx_date.fillStyle = "teal";
                ctx_date.fillRect( (-pixelStart - current_x_spacing.current)-80, y_rect, width_rect, height_rect);
                ctx_date.stroke();
                ctx_date.restore()
            }
            
            
        }
        const draw_date_text = () => {

            // let mouse_x_loc = (mouseX.current - canvas.getBoundingClientRect().left)
            // mouse_x_loc = (mouse_x_loc - current_x_spacing.current) 
            // mouse_x_loc = mouse_x_loc - (candle_width.current / 2)
            // let full_candle_width = candle_width.current + 5
            // let hovered_candled_index = ((mouse_x_loc / full_candle_width) + 1).toFixed(0)
            
            // let pixelStart = (hovered_candled_index * full_candle_width) + (candle_width.current / 2)
            // var text = candles.current[hovered_candled_index]?.date;
        
           
            // Find Current x-loc
            let mouse_x_loc = mouseX.current - canvas.getBoundingClientRect().left
            let mouse_x_loc_with_x_spacing = -(mouse_x_loc + current_x_spacing.current)

            // Track Candle Width
            let full_candle_width = candle_width.current + 5

            // Track X-Spacing
            let spacing_in_candles = current_x_spacing.current / full_candle_width

            // Track Index
            let index = Math.floor(mouse_x_loc_with_x_spacing/full_candle_width)

            let pixelStart = (index * full_candle_width) + (full_candle_width/2)
            pixelStart = pixelStart - 2.5

            // Get Hovered Candle Date
            const hoveredCandle = candles.current[index]?.date;
            const date = new Date(hoveredCandle); 
            const options = { weekday: 'short', day: '2-digit', month: 'short' };
            const formattedDate = date.toLocaleDateString('en-GB', options);
            const shortYear = `'${date.getFullYear().toString().slice(-2)}`;
            const finalFormat = `${formattedDate} ${shortYear}`;
            console.log(finalFormat)

            let y_text = 25
            if(index>=0){
            ctx_date.beginPath(); 
            ctx_date.font = '16px Arial'
            ctx_date.fillStyle = "white";
            ctx_date.fillText(finalFormat, (-pixelStart - current_x_spacing.current)-60, y_text);
            ctx_date.stroke();
            }
        }
        const plot_y_price_tag = () => {
            ctx_price.beginPath(); 
          
      
            ctx_price.fillStyle = "#383838";

            let x_loc = Math.abs(mouseY.current-starting_canvas_height.current)
            let y_loc_price =x_loc/current_pixels_per_price_unit.current
            let y_spacing_in_price = current_y_spacing.current/current_pixels_per_price_unit.current

            let shrink_expand_in_price = shrink_expand_height.current / current_pixels_per_price_unit.current
   
            let price = ((y_loc_price - y_spacing_in_price) - shrink_expand_in_price) * unit_amount.current

    
            ctx_price.fillStyle = "white";
            ctx_price.font = '20px Source Sans Pro';
            ctx_price.fillText(price.toFixed(2), 20 , mouseY.current+5);
            ctx_price.stroke();
        }

        // Mouse Events
        const handleMouseMove = (e) => {
            mouseX.current = e.clientX - canvas.getBoundingClientRect().left;
            mouseY.current = e.clientY - canvas.getBoundingClientRect().top;
            
            
            if(mousePressedRef.current){   
              
                // x
                let pixels_mouse_moved_x = x_coord_on_mouse_click.current - mouseX.current
                current_x_spacing.current = prev_x_spacing.current + pixels_mouse_moved_x
                current_canvas_width.current = prev_canvas_width.current  + current_x_spacing.current
    
                // Y
                let pixels_mouse_moved = y_coord_on_mouse_click.current - mouseY.current
                current_y_spacing.current = prev_y_spacing.current + pixels_mouse_moved
                current_canvas_height.current = prev_canvas_height.current - pixels_mouse_moved

                // Mid
                let total_price_height = current_pixels_per_price_unit.current + current_shrink_expand.current
                let prices_moved = pixels_mouse_moved / total_price_height
                let mid = prev_mid_price.current - prices_moved
                current_mid_price.current = mid
                static_mid.current = mid
        
            
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
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          draw(); 
        };
        const handleResize_price = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            draw(); 
        };
        const mouseWheel = (e) => {
            const zoomOut = () => {

                shrink_expand_height.current += current_mid_price.current
                zoom_level.current += 1;
                current_pixels_per_price_unit.current -= 1;
                const added_height = current_mid_price.current * -1;
                current_canvas_height.current += added_height;
                prev_canvas_height.current = current_canvas_height.current;
                const zoomLevels = [
                    { threshold: 80, unit_size_increase: 5 , unit_amount: 5},
                    { threshold: 200, unit_size_increase: 2 , unit_amount: 10},
                    { threshold: 290, unit_size_increase: 2, unit_amount: 20},
                    { threshold: 370, unit_size_increase: 2.5 , unit_amount: 50},
                    { threshold: 550, unit_size_increase: 2 , unit_amount: 100},
                    { threshold: 690, unit_size_increase: 5 , unit_amount: 500},
                    { threshold: 880, unit_size_increase: 5, unit_amount: 2500},
                    { threshold: 1300, unit_size_increase: 2 , unit_amount: 5000},
                    { threshold: 1500, unit_size_increase: 2 , unit_amount: 10000},
                    { threshold: 1550, unit_size_increase: 5 , unit_amount: 50000},
                ];
                for (const level of zoomLevels) {
                    if (zoom_level.current === level.threshold) {
                        
                        // Increase Unit Size
                        current_pixels_per_price_unit.current *= level.unit_size_increase;
                        prev_pixels_per_price_unit.current = current_pixels_per_price_unit.current;
                        
                        // Increase Displayed Numbers
                        price_counter.current *= level.unit_size_increase;
                        
                        // Adjust Height
                        let current_height = current_canvas_height.current / current_pixels_per_price_unit.current;
                        let total_height = starting_canvas_height.current / current_pixels_per_price_unit.current;
                        
                        // Track Mid
                        let current_mid = (total_height / 2) - (total_height - current_height);
                        current_mid_price.current = current_mid;
                        prev_mid_price.current = current_mid;

                        // Adjust Unit Amount
                        unit_amount.current = level.unit_amount

                        break;
                    }
                }
                const add_shrink_expand_to_candle_top = (obj) => {

                    let res = (obj.close - obj.open) / unit_amount.current
                    res = res * current_pixels_per_price_unit.current

                    return Math.trunc(-res);
                }
                const add_shrink_expand_to_candle = (price, mid_price, height_counter, static_open, obj) => {

                    let res = price / unit_amount.current
                    res = res * current_pixels_per_price_unit.current
                    res = res - starting_canvas_height.current
                    res = res + shrink_expand_height.current

                    return Math.trunc(-res);
                }
                candles.current = candles.current.map((obj) => {
               
                
                    return {
                        ...obj,
                        current_high: add_shrink_expand_to_candle(obj.high,current_mid_price.current,1,obj.prev_high),
                        current_height: add_shrink_expand_to_candle_top(obj),
                        current_bottom: add_shrink_expand_to_candle(obj.open,current_mid_price.current,1,obj.prev_bottom, obj),
                        current_low: add_shrink_expand_to_candle(obj.low,current_mid_price.current,1,obj.prev_low)
                    };
                });
                
            };
            const zoomIn = () => {

                shrink_expand_height.current -= current_mid_price.current
                zoom_level.current -= 1;
                current_pixels_per_price_unit.current += 1;
                const added_height = current_mid_price.current * -1;
                current_canvas_height.current -= added_height;
                prev_canvas_height.current = current_canvas_height.current;
                const zoomLevels = [
                    { threshold: 80, multiplier: 5 , pixel_size_reducer: 1},
                    { threshold: 200, multiplier: 2 , pixel_size_reducer: 5},
                    { threshold: 290, multiplier: 2, pixel_size_reducer: 10},
                    { threshold: 370, multiplier: 2.5 , pixel_size_reducer: 20},
                    { threshold: 550, multiplier: 2 , pixel_size_reducer: 50},
                    { threshold: 690, multiplier: 5 , pixel_size_reducer: 100},
                    { threshold: 880, multiplier: 5, pixel_size_reducer: 500},
                    { threshold: 1300, multiplier: 2 , pixel_size_reducer: 2500},
                    { threshold: 1500, multiplier: 2 , pixel_size_reducer: 5000},
                    { threshold: 1550, multiplier: 5 , pixel_size_reducer: 10000},
                ];
                for (const level of zoomLevels) {
                    if (zoom_level.current === level.threshold) {
                    
                        // Descrease Unit Pixel Size
                        current_pixels_per_price_unit.current /= level.multiplier;
                        prev_pixels_per_price_unit.current = current_pixels_per_price_unit.current;

                        // Descrease Displayed Numbers
                        price_counter.current /= level.multiplier;
            
                        let current_height = current_canvas_height.current / current_pixels_per_price_unit.current;
                        let total_height = starting_canvas_height.current / current_pixels_per_price_unit.current;
                        let current_mid = (total_height / 2) - (total_height - current_height);
            
                        current_mid_price.current = current_mid;
                        prev_mid_price.current = current_mid;
         
                        unit_amount.current = level.pixel_size_reducer

                        break;
                    }
                }   
                const add_shrink_expand_to_candle_top = (obj) => {
                    let res = (obj.close - obj.open) / unit_amount.current
                    res = res * current_pixels_per_price_unit.current
                    return Math.trunc(-res);
                             
                }
                const add_shrink_expand_to_candle = (price) => {
                    let res = price / unit_amount.current
                    res = res * current_pixels_per_price_unit.current
                    res = res - starting_canvas_height.current
                    res = res + shrink_expand_height.current

                    return Math.trunc(-res); 
                }
                candles.current = candles.current.map((obj) => {

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

        const draw = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            ctx_price.clearRect(0, 0, cp.width, cp.height);

            // ctx.beginPath();
            // ctx.strokeStyle = 'yellow';
            // ctx.lineWidth = 1;
            // ctx.moveTo(0, starting_canvas_height.current / 2);
            // ctx.lineTo(canvas.width, starting_canvas_height.current / 2);
            // ctx.stroke();

            drawGrid();
            drawCandles();
            drawWicks();
            drawPrices();
            draw_Y_mouse()
            draw_Y_price_tag()
            draw_X_mouse()
            draw_X_date_tag()
            draw_date_text()
            plot_y_price_tag()
            
            animationFrameId = null;

        };
        const zoom = (event) => {
            const zoomIn = () => {      
                candle_width.current = candle_width.current  + 1     
            }
            const zoomOut = () => {
                if(candle_width.current > 0){
                    candle_width.current = candle_width.current  -1
                } 
            }
            event.deltaY < 0 && zoomIn()
            event.deltaY > 0 && zoomOut()
            animationFrameId = null;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(draw); 
        }
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUpPrices);
        canvas.addEventListener('mousedown', handleMouseDownPrices);
        canvas.addEventListener('resize', handleResize);
        canvas.addEventListener('wheel', zoom)

        cp.addEventListener('mouseup', handleMouseUpPrices);
        cp.addEventListener('mousedown', handleMouseDownPrices);
        cp.addEventListener('resize', handleResize_price);
        cp.addEventListener('wheel', mouseWheel)

        draw();
        
        return () => {
          cancelAnimationFrame(animationFrameId);canvas.addEventListener('wheel', handleWheel);
          canvas.addEventListener('wheel', handleWheel);
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('mouseup', handleMouseUp);
          canvas.removeEventListener('mousedown', handleMouseDown);
          canvas.removeEventListener('resize', handleResize);

          cp.addEventListener('mouseup', handleMouseUpPrices);
          cp.addEventListener('mousedown', handleMouseDownPrices);
          cp.addEventListener('resize', handleResize_price);
  
        };
    }, [candles_loaded.current]);
    useEffect(()=>{

    },[candles.current])
    
    return(
        <div className='candle_chart_container'>
         
            <div className='candle_chart_wrapper'>
                <div className='canvas'>

                    <div className='header-bar'>
    
                        <div className='header_slot'>
                                {'AAPL'}
                            </div>
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

