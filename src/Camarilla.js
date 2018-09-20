import React, { Component } from 'react';
import './App.css';

class Camarilla extends Component {

render() {
  return (
    <div className="">
    Camarilla 
        <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*1.1/4).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*1.1/6).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) + (parseFloat(this.props.state.range))*1.1/12).toFixed(2) }
       <br/>  <br/>
--
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*1.1/12).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*1.1/6).toFixed(2) }
       <br/>  <br/>
       $ {   (parseFloat(this.props.state.close) - (parseFloat(this.props.state.range))*1.1/4).toFixed(2) }
    </div>
  );
}
}

export default Camarilla;
