import React, { Component } from 'react';
import './App.css';

class Demark extends Component {

render() {
  return (
    <div className="">
    DeMark
        <br/>  <br/>
      --
       <br/>  <br/>
       --
       <br/>  <br/>
       $ {  (parseFloat(this.props.state.x)/2-parseFloat(this.props.state.low)).toFixed(2) }
       <br/>  <br/>
       $ {  (parseFloat(this.props.state.x)/4).toFixed(2) }
       <br/>  <br/>
       $ {  (parseFloat(this.props.state.x)/2-parseFloat(this.props.state.high)).toFixed(2) }
       <br/>  <br/>
       --
       <br/>  <br/>
       --
    </div>
  );
}
}

export default Demark;
