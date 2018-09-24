import React, { Component } from 'react';
import './App.css';

class Fib extends Component {

render() {
  return (
    <div className="">

      <div className='cell small title'>  Fibonacci  </div> 
      <div className='cell small resistance'>  ${   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))).toFixed(2) } </div>  
      <div className='cell small resistance'> ${   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*0.618).toFixed(2) }</div>
      <div className='cell small resistance'> ${   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*0.382).toFixed(2) } </div>
      <div className='cell small pivot'> ${  parseFloat(this.props.state.classicPP).toFixed(2) } </div>
      <div className='cell small support'> ${   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*0.382).toFixed(2) } </div>
      <div className='cell small support'>  ${   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*0.618).toFixed(2) }</div>
      <div className='cell small support'> ${   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))).toFixed(2) } </div> 
       
    </div>
  );
}
}

export default Fib;
