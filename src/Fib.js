import React, { Component } from 'react';
import './App.css';

class Fib extends Component {

render() {
  return (
    <div className="">
    Fibonacci
        <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*0.618).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*0.382).toFixed(2) }
       <br/>  <br/>
       $ {  parseFloat(this.props.state.classicPP).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*0.382).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*0.618).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))).toFixed(2) }
    </div>
  );
}
}

export default Fib;
