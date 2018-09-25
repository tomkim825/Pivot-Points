import React, { Component } from 'react';
import './App.css';

class Title extends Component {

render() {
  return (
    <div className="name">
    <div className='cell small title'>   </div> 
    <div className='cell small resistance3'> Resistance3: </div>  
    <div className='cell small resistance2'> Resistance2: </div>
    <div className='cell small resistance1'> Resistance1: </div>
    <div className='cell small pivot'> Pivot:  </div>
    <div className='cell small support1'> Support1: </div>
    <div className='cell small support2'> Support2: </div>
    <div className='cell small support3'> Support3: </div> 
    </div>
  );
}
}

export default Title;
