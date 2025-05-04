import React, {useState, useEffect} from 'react'

export const MouseEvents = async (
    y_spacing,
    shrink_expand,
    setMousePressedOnCanvas,
    setIsMousePressedOnPrices,
    current_canvas_height,
    set_total_prices_moved,
    total_prices_moved,
    current_prices_moved,
    set_height_counter,
    x_spacing,
    set_canvas_details,
) => {
    useEffect(() => {
        const handleMouseDown = () => {
            // Handle mouse down event
        };

        const handleMouseUp = async () => {

            setIsMousePressedOnPrices(false);
            setMousePressedOnCanvas(false);
            set_total_prices_moved(current_prices_moved + total_prices_moved);
            set_height_counter(0);
            set_canvas_details(prev => ({
                ...prev,
                prev_canvas_height: current_canvas_height,
                prev_x_spacing: x_spacing,
                prev_y_spacing: y_spacing,
                prev_shrink_expand: shrink_expand,
                prev_mid_price: prev.current_mid_price
            }));
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [y_spacing, shrink_expand]);

    return;
};