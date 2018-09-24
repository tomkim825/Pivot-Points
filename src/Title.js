import React, { Component } from 'react';
import './App.css';

class Title extends Component {

render() {
  return (
    <div className="name">
    <div className='cell small title'>  -  </div> 
    <div className='cell small resistance'> Resistance3: </div>  
    <div className='cell small resistance'> Resistance2: </div>
    <div className='cell small resistance'> Resistance1: </div>
    <div className='cell small pivot'> Pivot:  </div>
    <div className='cell small support'> Support1: </div>
    <div className='cell small support'> Support2: </div>
    <div className='cell small support'> Support3: </div> 
    </div>
  );
}
}

export default Title;
