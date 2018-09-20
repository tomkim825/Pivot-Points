import React, { Component } from 'react';
import './App.css';

class Classic extends Component {

render() {
  return (
    <div className="">
    Classic 
    <br/>  <br/>
    $ {   (parseFloat(this.props.state.classicPP) + 2*(parseFloat(this.props.state.high) - parseFloat(this.props.state.low))).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.classicPP) +parseFloat(this.props.state.high) - parseFloat(this.props.state.low)).toFixed(2) }
       <br/>  <br/>
       $ {   (2*parseFloat(this.props.state.classicPP) - parseFloat(this.props.state.low)).toFixed(2) }
       <br/>  <br/>
       $ {  parseFloat(this.props.state.classicPP).toFixed(2) }
       <br/>  <br/>
       $ {   (2*parseFloat(this.props.state.classicPP) - parseFloat(this.props.state.high)).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.classicPP) - parseFloat(this.props.state.high) + parseFloat(this.props.state.low)).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.classicPP) - 2*(parseFloat(this.props.state.high) - parseFloat(this.props.state.low))).toFixed(2) }
    </div>
  );
}
}

export default Classic;
