export const handle_BaselineY = (candleChartRef) => {

    let new_bottom = 
        (candleChartRef.current.candles.starting_candle_Y + 
            candleChartRef.current.height.startingBaselineY ) - 
                (candleChartRef.current.height.startingBaselineY /2)

    candleChartRef.current.height.previousBaselineY = new_bottom
    candleChartRef.current.height.startingBaselineY = new_bottom
    candleChartRef.current.height.currentBaselineY = new_bottom

    return candleChartRef.current
}
export const drawGrid = (candleChartRef, x) => {
    let ctx = candleChartRef.current.ctx
    ctx.save()
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = .5;
    console.log(candleChartRef.current.price.currentPxPerUnit)
    for (
        let y = candleChartRef.current.height.currentBaselineY;
        y > 0; 
        y -= x
    ) {
        const yPos = Math.floor(y);
        ctx.moveTo(0, yPos);
        ctx.lineTo(candleChartRef.current.width.width, yPos);
    }
    ctx.stroke();
    ctx.restore()
};
export const draw_Y_mouse = (candleChartRef) => {
    let ctx = candleChartRef.current.ctx
    ctx.save()
    ctx.beginPath();
    ctx.lineWidth = 3
    ctx.strokeStyle = 'white'
    ctx.setLineDash([5, 5]); 
    ctx.moveTo(0,candleChartRef.current.mouse.current_Y);    
    ctx.lineTo(candleChartRef.current.width.width,candleChartRef.current.mouse.current_Y);  
    ctx.stroke();
    ctx.restore();
};












//  const draw_X_letter = () => {

//                 ctx.save();

//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.x_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.x_date;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // Set font and measure text
//                 const fontSize = 14;
//                 ctx.font = `${fontSize}px Arial`;
//                 const text = "X";
//                 const textMetrics = ctx.measureText(text);
//                 const padding = 4;

//                 const textWidth = textMetrics.width;
//                 const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

//                 // Draw background box
//                 ctx.fillStyle = "orange";
//                 ctx.fillRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw border (optional)
//                 ctx.strokeStyle = "black";
//                 ctx.strokeRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw the letter A
//                 ctx.fillStyle = "black";
//                 ctx.fillText(text, a_x_loc, a_y_loc);

//                 ctx.restore();

//             }
//             const draw_A_letter = () => {

//                 ctx.save();

//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.a_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // Set font and measure text
//                 const fontSize = 14;
//                 ctx.font = `${fontSize}px Arial`;
//                 const text = "A";
//                 const textMetrics = ctx.measureText(text);
//                 const padding = 4;

//                 const textWidth = textMetrics.width;
//                 const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

//                 // Draw background box
//                 ctx.fillStyle = "orange";
//                 ctx.fillRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw border (optional)
//                 ctx.strokeStyle = "black";
//                 ctx.strokeRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw the letter A
//                 ctx.fillStyle = "black";
//                 ctx.fillText(text, a_x_loc, a_y_loc);

//                 ctx.restore();

//             }
//             const draw_B_letter = () => {

//                 ctx.save();

//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.b_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.b;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // Set font and measure text
//                 const fontSize = 14;
//                 ctx.font = `${fontSize}px Arial`;
//                 const text = "B";
//                 const textMetrics = ctx.measureText(text);
//                 const padding = 4;

//                 const textWidth = textMetrics.width;
//                 const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

//                 // Draw background box
//                 ctx.fillStyle = "orange";
//                 ctx.fillRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw border (optional)
//                 ctx.strokeStyle = "black";
//                 ctx.strokeRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw the letter A
//                 ctx.fillStyle = "black";
//                 ctx.fillText(text, a_x_loc, a_y_loc);

//                 ctx.restore();

//             }
//             const draw_C_letter = () => {

//                 ctx.save();

//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.c_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.c;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // Set font and measure text
//                 const fontSize = 14;
//                 ctx.font = `${fontSize}px Arial`;
//                 const text = "C";
//                 const textMetrics = ctx.measureText(text);
//                 const padding = 4;

//                 const textWidth = textMetrics.width;
//                 const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

//                 // Draw background box
//                 ctx.fillStyle = "orange";
//                 ctx.fillRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw border (optional)
//                 ctx.strokeStyle = "black";
//                 ctx.strokeRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw the letter A
//                 ctx.fillStyle = "black";
//                 ctx.fillText(text, a_x_loc, a_y_loc);

//                 ctx.restore();

//             }
//             const draw_D_letter = () => {

//                 ctx.save();

//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.d_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.d;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // Set font and measure text
//                 const fontSize = 14;
//                 ctx.font = `${fontSize}px Arial`;
//                 const text = "D";
//                 const textMetrics = ctx.measureText(text);
//                 const padding = 4;

//                 const textWidth = textMetrics.width;
//                 const textHeight = fontSize; // Approximate height since canvas doesn't give this directly

//                 // Draw background box
//                 ctx.fillStyle = "orange";
//                 ctx.fillRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw border (optional)
//                 ctx.strokeStyle = "black";
//                 ctx.strokeRect(
//                     a_x_loc - padding,
//                     a_y_loc - textHeight - padding,
//                     textWidth + padding * 2,
//                     textHeight + padding * 2
//                 );

//                 // Draw the letter A
//                 ctx.fillStyle = "black";
//                 ctx.fillText(text, a_x_loc, a_y_loc);

//                 ctx.restore();

//             }
//             const draw_start_AB = () => {
                
//                 ctx.save()
//                 // --- X Coordinates ---
//                 let pivot_x_y_loc = (abcd.x_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 pivot_x_y_loc = -(pivot_x_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let pivot_x_x_loc = -chart.current.current_full_candle_width * abcd.x_date;
//                 pivot_x_x_loc -= current_x_spacing.current;
//                 pivot_x_x_loc += chart.current.current_full_candle_width / 2;
//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.a_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- B Coordinates ---
//                 let b_y_loc = (abcd.b_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 b_y_loc = -(b_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let b_x_loc = -chart.current.current_full_candle_width * abcd.b;
//                 b_x_loc -= current_x_spacing.current;
//                 b_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- C Coordinates ---
//                 let c_y_loc = (abcd.c_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 c_y_loc = -(c_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let c_x_loc = -chart.current.current_full_candle_width * abcd.c;
//                 c_x_loc -= current_x_spacing.current;
//                 c_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- D Coordinates ---
//                 let d_y_loc = (abcd.d_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 d_y_loc = -(d_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let d_x_loc = -chart.current.current_full_candle_width * abcd.d;
//                 d_x_loc -= current_x_spacing.current;
//                 d_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- Exit Coordinates ---
//                 let exit_y_loc = (abcd.exit_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 exit_y_loc = -(exit_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let exit_x_loc = -chart.current.current_full_candle_width * abcd.exit_date;
//                 exit_x_loc -= current_x_spacing.current;
//                 exit_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- Draw Lines ---
//                 ctx.beginPath();
    

//                 // AB
//                 ctx.moveTo(pivot_x_x_loc, pivot_x_y_loc);
//                 ctx.lineTo(a_x_loc, a_y_loc);
//                 ctx.lineTo(b_x_loc, b_y_loc);
//                 // BC
//                 ctx.lineTo(c_x_loc, c_y_loc); 
//                 // CD
//                 ctx.lineTo(d_x_loc, d_y_loc); 
         
       
//                 // --- Optional stroke on top ---
//                 ctx.strokeStyle = 'white';
//                 ctx.lineWidth = 5;

//                 ctx.stroke();
//                 ctx.restore()

//                 ctx.save();

//                 // --- Common Values ---
//                 const arrowLength = 20;
//                 const arrowAngle = Math.PI / 6;

//                 // --- Calculate angle of the line ---
//                 const angle = Math.atan2(exit_y_loc - d_y_loc, exit_x_loc - d_x_loc);

//                 // --- Calculate shortened end point for line (before arrow) ---
//                 const shortened_x = exit_x_loc - arrowLength * Math.cos(angle);
//                 const shortened_y = exit_y_loc - arrowLength * Math.sin(angle);

//                 // --- Draw line (stops before arrowhead) ---
//                 ctx.beginPath();
//                 ctx.moveTo(d_x_loc, d_y_loc);
//                 ctx.lineTo(shortened_x, shortened_y);
//                 ctx.strokeStyle = abcd.result === 'Win' ? 'teal' : 'darkred';
//                 ctx.lineWidth = 10;
//                 ctx.shadowColor = abcd.result === 'Win' ? 'teal' : 'red'; // match line color
//                 ctx.shadowBlur = 25
//                 ctx.stroke();

//                 // --- Draw Arrowhead ---
//                 ctx.beginPath();
//                 ctx.moveTo(exit_x_loc, exit_y_loc);
//                 ctx.lineTo(
//                 exit_x_loc - arrowLength * Math.cos(angle - arrowAngle),
//                 exit_y_loc - arrowLength * Math.sin(angle - arrowAngle)
//                 );
//                 ctx.lineTo(
//                 exit_x_loc - arrowLength * Math.cos(angle + arrowAngle),
//                 exit_y_loc - arrowLength * Math.sin(angle + arrowAngle)
//                 );
//                 ctx.lineTo(exit_x_loc, exit_y_loc); // Back to tip
//                 ctx.closePath();

//                 ctx.fillStyle = 'white'; // visible arrowhead color
//                 ctx.fill();

//                 ctx.restore();

//             }
//             const draw_retracement = () => {
                
//                 ctx.save()
//                 // --- A Coordinates ---
//                 let a_y_loc = (abcd.a_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- B Coordinates ---
//                 let b_y_loc = (abcd.b_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 b_y_loc = -(b_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let b_x_loc = -chart.current.current_full_candle_width * abcd.b;
//                 b_x_loc -= current_x_spacing.current;
//                 b_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- C Coordinates ---
//                 let c_y_loc = (abcd.c_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 c_y_loc = -(c_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let c_x_loc = -chart.current.current_full_candle_width * abcd.c;
//                 c_x_loc -= current_x_spacing.current;
//                 c_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- D Coordinates ---
//                 let d_y_loc = (abcd.d_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 d_y_loc = -(d_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let d_x_loc = -chart.current.current_full_candle_width * abcd.d;
//                 d_x_loc -= current_x_spacing.current;
//                 d_x_loc += chart.current.current_full_candle_width / 2;

//                 // --- Draw Lines ---
//                 ctx.beginPath();
//                 ctx.strokeStyle = 'yellow';
//                 ctx.lineWidth = 3
//                 ctx.setLineDash([5, 5]); 

//                 // AB
//                 ctx.moveTo(a_x_loc, a_y_loc);
//                 ctx.lineTo(c_x_loc, c_y_loc);

//                 // ctx.moveTo(b_x_loc, b_y_loc);
//                 // ctx.lineTo(d_x_loc, d_y_loc);
       

//                 // --- Optional stroke on top ---
//                 ctx.strokeStyle = 'white';
//                 // ctx.lineWidth = 7;

//                 ctx.stroke();
//                 ctx.restore()

//             }
//             const draw_price_levels = () => {
//                             ctx.save();

//                             // Calculate all y positions
//                             const y_stop_loss = -( (abcd.stop_loss / unit_amount.current) * current_pixels_per_price_unit.current - starting_canvas_height.current ) - shrink_expand_height.current - current_y_spacing.current;
//                             const y_take_profit = -( (abcd.take_profit / unit_amount.current) * current_pixels_per_price_unit.current - starting_canvas_height.current ) - shrink_expand_height.current - current_y_spacing.current;
//                             const y_entered_price = -( (abcd.entered_price / unit_amount.current) * current_pixels_per_price_unit.current - starting_canvas_height.current ) - shrink_expand_height.current - current_y_spacing.current;

//                             // Calculate horizontal start and end positions
//                             let x_start = -chart.current.current_full_candle_width * abcd.d;
//                             x_start -= current_x_spacing.current;
//                             x_start += chart.current.current_full_candle_width / 2;

//                             let x_end = -chart.current.current_full_candle_width * abcd.exit_date;
//                             x_end -= current_x_spacing.current;
//                             x_end += chart.current.current_full_candle_width / 2;

//                             // Draw stop loss line
//                             ctx.beginPath();
//                             ctx.strokeStyle = '#ef5350';
//                             ctx.lineWidth = 3;
//                             ctx.moveTo(x_start, y_stop_loss);
//                             ctx.lineTo(x_end, y_stop_loss);
//                             ctx.stroke();

//                             // Draw take profit line
//                             ctx.beginPath();
//                             ctx.strokeStyle = '#26a69a';
//                             ctx.lineWidth = 3;
//                             ctx.moveTo(x_start, y_take_profit);
//                             ctx.lineTo(x_end, y_take_profit);
//                             ctx.stroke();

//                             // Draw entered price line
//                             ctx.beginPath();
//                             ctx.strokeStyle = 'white';
//                             ctx.lineWidth = 3;
//                             ctx.moveTo(x_start, y_entered_price);
//                             ctx.lineTo(x_end, y_entered_price);
//                             ctx.stroke();

//                             // Fill area above entered price line with teal (take profit zone)
//                             let topFillY = y_take_profit;
//                             let heightTop = y_entered_price - y_take_profit;
//                             if (heightTop > 0) {  // sanity check so height is positive
//                                 ctx.fillStyle = 'rgba(38, 166, 154, 0.2)';  // semi-transparent teal
//                                 ctx.fillRect(x_start, topFillY, x_end - x_start, heightTop);
//                             }

//                             // Fill area below entered price line with red (stop loss zone)
//                             let bottomFillY = y_entered_price;
//                             let heightBottom = y_stop_loss - y_entered_price;
//                             if (heightBottom > 0) {
//                                 ctx.fillStyle = 'rgba(239, 83, 80, 0.2)';  // semi-transparent red
//                                 ctx.fillRect(x_start, bottomFillY, x_end - x_start, heightBottom);
//                             }

//                             ctx.restore();
//             }
//             const draw_ab_price = () => {

//                 ctx.save()
//                 let a_y_loc = (abcd.a_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 a_y_loc = -(a_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let a_x_loc = -chart.current.current_full_candle_width * abcd.a;
//                 a_x_loc -= current_x_spacing.current;
//                 a_x_loc += chart.current.current_full_candle_width / 2;

//                 let b_y_loc = (abcd.b_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 b_y_loc = -(b_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let b_x_loc = -chart.current.current_full_candle_width * abcd.b;
//                 b_x_loc -= current_x_spacing.current;
//                 b_x_loc += chart.current.current_full_candle_width / 2;

//                 let c_y_loc = (abcd.c_price / unit_amount.current) * current_pixels_per_price_unit.current;
//                 c_y_loc = -(c_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 let c_x_loc = -chart.current.current_full_candle_width * abcd.c;
//                 c_x_loc -= current_x_spacing.current;
//                 c_x_loc += chart.current.current_full_candle_width / 2;

//                 let d_y_loc = ((abcd.c_price-abcd.ab_price_length) / unit_amount.current) * current_pixels_per_price_unit.current;
//                 d_y_loc = -(d_y_loc - starting_canvas_height.current) - shrink_expand_height.current - current_y_spacing.current;

//                 ctx.beginPath();
    

//                 // AB
//                 ctx.moveTo(a_x_loc, a_y_loc);
//                 ctx.lineTo(a_x_loc, b_y_loc);

//                 ctx.moveTo(c_x_loc, c_y_loc);
//                 ctx.lineTo(c_x_loc, d_y_loc);
            

       
//                 // --- Optional stroke on top ---
              
//                 ctx.lineWidth = 5;
//                 ctx.strokeStyle = 'white';
//                 ctx.lineWidth = 3
//                 ctx.setLineDash([5, 5]); 

//                 ctx.stroke();
//                 ctx.restore()


//             }