import React, { Component } from 'react';
import './App.css';

class Demark extends Component {

render() {
  return (
    <div className="">
      <div className='cell small title'> DeMark </div> 
      <div className='cell small resistance3'> --</div>  
      <div className='cell small resistance2'> -- </div>
      <div className='cell small resistance1'> ${  (parseFloat(this.props.state.x)/2-parseFloat(this.props.state.low)).toFixed(2) } </div>
      <div className='cell small pivot'> ${  (parseFloat(this.props.state.x)/4).toFixed(2) } </div>
      <div className='cell small support1'> ${  (parseFloat(this.props.state.x)/2-parseFloat(this.props.state.high)).toFixed(2) } </div>
      <div className='cell small support2'> -- </div>
      <div className='cell small support3'> -- </div> 
    </div>
  );
}
}

export default Demark;
