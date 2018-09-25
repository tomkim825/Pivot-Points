import React, { Component } from 'react';
import './App.css';

class Classic extends Component {

render() {
  return (
    <div className="">
    <div className='cell title'>  Classic  </div> 
    <div className='cell resistance3'> ${   (parseFloat(this.props.state.classicPP) + 2*(parseFloat(this.props.state.high) - parseFloat(this.props.state.low))).toFixed(2) } </div>  
    <div className='cell resistance2'> ${   (parseFloat(this.props.state.classicPP) +parseFloat(this.props.state.high) - parseFloat(this.props.state.low)).toFixed(2) } </div>
    <div className='cell resistance1'> ${   (2*parseFloat(this.props.state.classicPP) - parseFloat(this.props.state.low)).toFixed(2) } </div>
    <div className='cell pivot'> ${  parseFloat(this.props.state.classicPP).toFixed(2) }</div>
    <div className='cell support1'>  ${   (2*parseFloat(this.props.state.classicPP) - parseFloat(this.props.state.high)).toFixed(2) }</div>
    <div className='cell support2'>  ${   (parseFloat(this.props.state.classicPP) - parseFloat(this.props.state.high) + parseFloat(this.props.state.low)).toFixed(2) } </div>
    <div className='cell support3'>  ${   (parseFloat(this.props.state.classicPP) - 2*(parseFloat(this.props.state.high) - parseFloat(this.props.state.low))).toFixed(2) }</div> 
    </div>
  );
}
}

export default Classic;
