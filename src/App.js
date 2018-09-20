import React, { Component } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import $ from "jquery";
import Title from './Title';
import Classic from './Classic';
import Camarilla from './Camarilla';
import Fib from './Fib';
import Demark from './Demark';
import subscriptionkey from './config/subscriptionkey.js'

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      symbol: '', 
      stock:'',
      open: 0,
      high: 0,
      low: 0,
      date: "",
      close:0,
      classicPP: 0.00,
      range:0,
      x:0,
      message:''
  };

this.enterSymbol = (event) => {
    this.setState({symbol: event.target.value.toUpperCase()});
}
var component = this;

this.lookup = () => {
  component.setState({message:'Collecting data...'});
  $.ajax({
    url: 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+component.state.symbol+ '&apikey=' + subscriptionkey, 
    // component.state.symbol.toUpperCase()
    crossDomain: true,
    dataType: "json",
    success: function(data, textStatus, jqXHR) {
      if(data.Information !== undefined){
        component.setState({message:'Server error or busy. Please try again in a minute'});
      } else{
        // var info = data['Global Quote'];
        var stock =  data['Global Quote']["01. symbol"];
        var date =  'Data based on last trading day: ' + data['Global Quote']["07. latest trading day"];
        var high = parseFloat(data['Global Quote']["03. high"]).toFixed(2);
        var low =  parseFloat(data['Global Quote']["04. low"]).toFixed(2);
        var open = parseFloat(data['Global Quote']["02. open"]).toFixed(2);
        var close = parseFloat(data['Global Quote']["05. price"]).toFixed(2);
        var classicPP = ((parseFloat(high)+parseFloat(low)+parseFloat(close))/3).toFixed(2);
        var range = (parseFloat(high)-parseFloat(low)).toFixed(2);
        var x;
        if(close === 'NaN'){
          component.setState({message:'Server error or busy. Please try again in a minute'});
        };

        if(parseFloat(close) > parseFloat(open)){
          x=2*parseFloat(high )+ parseFloat(low) + parseFloat(close);
        } else if(parseFloat(close) < parseFloat(open)){
          x=parseFloat(high )+ 2*parseFloat(low) + parseFloat(close);
        } else if(parseFloat(close) === parseFloat(open)){
          x=parseFloat(high )+ parseFloat(low) + 2*parseFloat(close);
        }
        component.setState( {high, low, stock,close, open,date,classicPP, range,x, message:date});
      }},
    error: function (jqXHR, textStatus, error) {
        console.log("Post error: " + error);
        component.setState({message:'Server error or busy. Please try again in a minute'});
    }
});
}

}

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className='content'>
            <h1>Pivot Points</h1>
            <TextField id="symbol" type="text"  label=" Enter Stock Symbol" onChange={this.enterSymbol}  />
            <br/>
            <Button id='button' variant="contained" color="primary" onClick={this.lookup}> Look up </Button>
           <br/>
           <span id='message'> {this.state.message}</span>
            <div>
              <span className="stats">High: $ {this.state.high} </span>
               <span className="stats">Low: $ {this.state.low} </span>
               <span className="stats">Open: $ {this.state.open} </span>
               <span className="stats">Close: $ {this.state.close} </span>    
            </div>
            <hr/>

    
          <Grid container className='classesdemo' justify="center" spacing={16}>
           
              <Grid item>
                <Title/>
              </Grid>

              <Grid item>
                <Classic state={this.state}/>
              </Grid>

            <Grid item>
              <Camarilla state={this.state}/>
            </Grid>

            <Grid item>
              <Fib state={this.state}/>
            </Grid>

            <Grid item>
              <Demark state={this.state}/>
            </Grid>
          </Grid>
        </div>
         </div>
      </div>
    );
  }
}

export default App;