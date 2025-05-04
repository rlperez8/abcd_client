import React, { useState, useEffect } from 'react';
import { Candle_Chart } from './candle_chart';

// import config from '../../config.json';

import './new.css'

// import CandleChart from '../../02_pages/data_center/single_trade/candle_graph/candleChart/CandleChart';
// import { Candle_Chart } from './candle_chart';


// const create_selected_candles_in_django = async (selected_pattern) => {
	
// 	try {
// 		await fetch(`${config.server}/candle_data/selected_candles/`, {
// 		method: 'POST',
// 		headers: {},
// 		body: JSON.stringify({
// 			symbol: selected_pattern?.trade_symbol,
// 			trade_id: selected_pattern?.id,
// 			candles: selected_pattern?.candles

// 		})
// 		});
//     console.log(selected_pattern)
// 	} catch (error) {console.log(error)}
	
// }
// const get_selected_patterns_from_django = async (set_selected_patterns) => {

// 	try {
// 		const res = await fetch(`${config.server}/patterns/abcd_patterns/`);
// 		const result = await res.json();
// 		set_selected_patterns(result)

// 		return result
		
// 	} catch (e) { console.log(e); }
// }
// const get_selected_candles_in_django = async () => {

// 	try {
// 		const res = await fetch(`${config.server}/candle_data/view_selected_candles/`);
// 		const result = await res.json();
// 		// set_selected_candles(result)
		
// 		return result
		

// 	} catch (e) { console.log(e); }
// }
const App = () => {

  // const [selected_patterns, set_selected_patterns] = useState()
  // const [selected_pattern, set_selected_pattern] = useState()
  // const [selected_candles, set_selected_candles] = useState()

  // useEffect(() => {

  //   const get_starting_data = async () => {
    
  //     let res = await get_selected_patterns_from_django(set_selected_patterns)
  //     set_selected_pattern(res[0])
  //   }
  //   get_starting_data()	
  // },[]);

  // useEffect(()=>{

  //   const prepare_selected_candle_data = async () => {

  //     await create_selected_candles_in_django(selected_pattern)
    
  //     let candles = await get_selected_candles_in_django()
  //     candles.sort((a, b) => (a.candle_date > b.candle_date) ? 1 : -1);
  //     set_selected_candles(candles)
  
  //   }
  
  //   prepare_selected_candle_data()
  // }, [selected_pattern])

  const [candles, set_candles] = useState([])
 

  useEffect(()=>{

    call_server_function()
  
  }, [])  


  const call_server_function = async () => {
 

    try {
      
        const res = await fetch('http://localhost:8000/all_options', {
      
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (!res.ok) {
        console.error(`Server Error: ${res.status} - ${res.statusText}`);
        throw new Error("Request failed");
      }
  
      const responseData = await res.json();

      const updatedlist = responseData.data.map(ojb => ({
        ...ojb,
        trade_id: 0,
        candle_volume: 100,
        id: 100
      }))
      set_candles(updatedlist)
  
    } catch (error) {
      console.error("Error during fetch:", error);
    
  }}


  useEffect(()=>{

    

  }, [candles])

  // if (candles.length > 0 ){
  //   console.log(selected_candles[0])
  //   console.log(candles[0])
  // }



  return (

      <div className='App' >
        
        <Candle_Chart selected_candles={candles}/>



			</div>

    



  );
  }

export default App;