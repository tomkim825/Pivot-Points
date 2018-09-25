import React, { Component } from 'react';
import './App.css';

class Camarilla extends Component {

render() {
  return (
    <div className="">
      <div className='cell title'> Camarilla  </div> 
      <div className='cell resistance3'> ${   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*1.1/4).toFixed(2) }</div>  
      <div className='cell resistance2'> ${   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*1.1/6).toFixed(2) }</div>
      <div className='cell resistance1'> ${   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*1.1/12).toFixed(2) } </div>
      <div className='cell pivot'> -- </div>
      <div className='cell support1'> ${   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*1.1/12).toFixed(2) } </div>
      <div className='cell support2'> ${   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*1.1/6).toFixed(2) } </div>
      <div className='cell support3'> ${   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*1.1/4).toFixed(2) } </div> 
    </div>
  );
}
}

export default Camarilla;
