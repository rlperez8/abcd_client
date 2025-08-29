import React, { useState, useEffect, useRef } from 'react';
import { Candle_Chart } from './candle_chart';
import './new.css'
import search from 'C:/Users/rpere/Desktop/abcd_local_v3/client/src/search.png';

const App = () => {

  const chart_container = useRef(null)
  const [ab_candles, set_ab_candles] = useState([])
  const [candles, set_candles] = useState([])
  let [chart_height, set_chart_height] = useState(0)
  const [formatted_candles, set_formatted_candles] = useState([])
  const [listing_status, set_listing_status] = useState([])
  const [is_listing_status, set_is_listing_status] = useState(false)
  const [ticker_symbol, set_ticker_symbol] = useState('AACG')
  const [searchValue, setSearchValue] = useState('');
  const asset_types = ['All','Stock','ETF','Crypto']
  const [asset_type, set_asset_type] = useState('All')
  const [current_abcds, set_current_abcds] = useState([])
  const [canvas_dimesions, set_canvas_dimensions] = useState({
    chart_height: 0,
    price_height: 0,
    date_height: 0
  })
  const [abcd_stage, set_abcd_stage] = useState(['All','Won','Lost','Live','Failed'])
  const [selected_abcd_stage, set_selected_abcd_stage] = useState('All')
  const get_listed_tickers = async (searched_ticker, selected_type) => {
    try {
        const res = await fetch('http://localhost:8000/get_listed_tickers', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searched: searched_ticker,
          type: selected_type
        })
      });
      if (!res.ok) {
        console.error(`Server Error: ${res.status} - ${res.statusText}`);
        throw new Error("Request failed");
      }
      const responseData = await res.json();

      set_listing_status(responseData.data)
     
    } catch (error) {
      console.error("Error during fetch:", error);
  }}
  const get_abcd_of_selected_symbol = async (symbol) => {
    try {
        const res = await fetch('http://localhost:8000/get_abcd_of_selected_symbol', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol,
        })
      });
      if (!res.ok) {
        console.error(`Server Error: ${res.status} - ${res.statusText}`);
        throw new Error("Request failed");
      }
      const responseData = await res.json();
  
      // set_current_abcds(responseData.data)
      
    } catch (error) {
      console.error("Error during fetch:", error);
  }}
  const get_ab_candles = async () => {
  try {
    const res = await fetch("http://localhost:8000/ab_candles", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const responseData = await res.json();

    // set_ab_candles(responseData.data)
  } catch (error) {
    console.log(error);
  }
};
  const get_selected_candles = async (symbol) => {

    try{
      const res = await fetch('http://localhost:8000/get_selected_ticker', 
        {
          method: "POST", 
          headers: {"Content-Type": "application/json",}, 
          body: JSON.stringify({'symbol':symbol})
        });

      if (!res.ok) {
        console.error(`Server Error: ${res.status} - ${res.statusText}`);
        throw new Error("Request failed");
      }
      const responseData = await res.json();
      set_candles(responseData.data)
  

    } catch(error) {
      console.error(error)
    }

  }
  // Define Chart Height
  useEffect(() => {
    if (chart_container.current) {
     
      set_chart_height(chart_container.current.clientHeight-1)

    }
  }, []);
  // Format Candles To Canvas Dimensions
  useEffect(()=>{

      let new_candles = candles.reverse().map((item)=> ({
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

  
      let chartHeight = canvas_dimesions.chart_height

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
      set_formatted_candles(new_candles)


  }, [candles])

  useEffect(()=>{
    get_selected_candles(ticker_symbol); 
    // get_listed_tickers('',asset_type)
    // get_abcd_of_selected_symbol(ticker_symbol)
    // get_ab_candles()
  
  }, [])  



  return (

      <div className='App' >
        
        {
          is_listing_status && (
            <div className='overlay'>
              <div className='ticker_selection_container'>
                <div className='select_ticker_header'>
                  <div className='select_ticker_text'>Select Ticker</div>
                  <div className='X' onClick={()=>{set_is_listing_status(false)}}>X</div>
                </div>
                
                <div className='input_container'>
            
                <div className='search_img_container'>
                  <img className='search_img' src={search} />
                  
                </div>
            
                <input className='input_box' 
                  defaultValue={searchValue}
                  onChange={(e)=>{
                    
                    get_listed_tickers(e.target.value, asset_type)
                    setSearchValue(e.target.value)

                }}
                
                />
                <div className='search_img_container'>
                  
                </div>
                   
            
            </div>

          <div className='select_type'>
              {asset_types.map((type, index) => (
                <div className={asset_type===type ? 'type_selected' :'type'} key={index} 
                onClick={()=>{
                  set_asset_type(type);
                  get_listed_tickers(searchValue,type);
                  
                }}
                >{type}</div>
              ))}
                          
        
          </div>

     
          <div className='select_ticker'>
              <div className='symbol_status1'>Ticker</div>
              <div className='symbol_status2'>Security</div>
              <div className='symbol_status3'>Exchange</div>
              <div className='symbol_status3'>Type</div>
          </div>
          <div className='ticker_container'>
          {listing_status.map((item, index) => {
            return (
              <div className={item.symbol === ticker_symbol ? 'symbol_status_selected' : 'symbol_status'} key={index} onClick={()=>{
                get_selected_candles(item.symbol); 
                set_is_listing_status(!is_listing_status);
                set_ticker_symbol(item.symbol);
                get_abcd_of_selected_symbol(item.symbol)
                
                }}>
           
                <div className='symbol_status1'>{item.symbol}</div>
                <div className='symbol_status2'>{item.name}</div>
                <div className='symbol_status3'>{item.exchange}</div>
                <div className='symbol_status3'>{item.assetType}</div>
              </div>
            );
        })}
                      

          </div>
          </div>
            </div>

          )
        }

        <div className='data' >
          <div className='data_inner' ref={chart_container}>
          <Candle_Chart 
            selected_candles={formatted_candles} 
            chart_height={chart_height}
            set_is_listing_status={set_is_listing_status}
            is_listing_status={is_listing_status}
            ticker_symbol={ticker_symbol}
            set_canvas_dimensions={set_canvas_dimensions}
            // selected_abcd={selected_abcd}  
            // selected_ab={selected_ab}
          />
        </div>
       </div>
      
        <div className='menu'>
          <div className='menu_inner'>

            <div className='abcd_title'>ABCDs</div>

            <div className='abcd_stage_container'>
              {abcd_stage.map((item,index)=>{
                return(
                  <div key={index} className={item === selected_abcd_stage ? 'abcd_stage_selected': 'abcd_stage'} onClick={()=>{set_selected_abcd_stage(item)}}>{item}</div>

                )
              })}
             
            </div>
      
            <div className='abcd_header'>
              <div className='abcd_column1'>Result</div>
              <div className='abcd_column1'>Enter Date</div>
              <div className='abcd_column1'>Exit Date</div>
              <div className='abcd_column1'>Length</div>
              <div className='abcd_column1'>Enter</div>
              <div className='abcd_column1'>Exit</div>   
            </div>
{/* 
            <div className='abcd_rows_container'>
              {ab_candles?.map((value, index) => {
    
                const date = new Date(value.pattern_A_pivot_date);
                return (
                  <div key={index} className={selected_ab?.id === value.id ? 'selected_ab_row_active' : 'selected_ab_row'} onClick={()=>{set_selected_ab(value)}}>
          
                    <div className='col1'>{date.toLocaleDateString()}</div>
              

                  </div>
                );
              })}
            </div> */}
            
          </div>
        </div>
           



			</div>

    



  );
  }

export default App;