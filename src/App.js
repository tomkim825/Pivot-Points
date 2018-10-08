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

    var defaultValue;

    if (localStorage.getItem('symbol')){
      defaultValue = localStorage.getItem('symbol');
    } else{
      defaultValue ='';
    }

    if((defaultValue === undefined) || (defaultValue === 'undefined') ) {
      defaultValue = ''
    };

    this.state = {
      symbol: defaultValue, 
      stock:'',
      open: 0,
      high: 0,
      low: 0,
      date: "",
      close:0,
      classicPP: 0.00,
      range:0,
      x:0,
      message:'',
      change:"",
      changeColor:'green'
  };


this.enterSymbol = (event) => {
    this.setState({symbol: event.target.value.toUpperCase()});
}

this.keyPress = (event) => {
  if(event.keyCode === 13){
    this.setState({symbol: event.target.value.toUpperCase()});
    this.lookup();
 }
}

var component = this;

this.lookup = () => {
  component.setState({message:'Crunching numbers...'});
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
        var date =  'Based on last trading session: ' + data['Global Quote']["07. latest trading day"];
        var high = parseFloat(data['Global Quote']["03. high"]).toFixed(2);
        var low =  parseFloat(data['Global Quote']["04. low"]).toFixed(2);
        var open = parseFloat(data['Global Quote']["02. open"]).toFixed(2);
        var close = parseFloat(data['Global Quote']["05. price"]).toFixed(2);
        var change = ' ( $ ' + parseFloat(data['Global Quote']["09. change"]).toFixed(2) + " ) ";
        var classicPP = ((parseFloat(high)+parseFloat(low)+parseFloat(close))/3).toFixed(2);
        var range = (parseFloat(high)-parseFloat(low)).toFixed(2);
        var x;
        var changeColor = '';
        if( data['Global Quote']["09. change"] >= 0){changeColor = "green"};
        if( data['Global Quote']["09. change"] < 0){changeColor = "red"};
        if( open > high) {high = open}; //sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
        if( close > high) {high = close};//sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
        if( open < low) {low = open};//sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
        if( close < low) {low = close};//sometimes open price is higher than high?? Strange info from AlphaVantage API. This will correct the issue
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
        component.setState( {high, low, stock,close, open,date,classicPP, range,x, change, changeColor, message:date});
        if( stock === undefined){ stock = ''};
        localStorage.setItem('symbol', stock);
      }},
    error: function (jqXHR, textStatus, error) {
        console.log("Post error: " + error);
        component.setState({message:'Server error or busy. Please try again in a minute'});
    }
});
}
}

componentDidMount(){
  if(localStorage.getItem('symbol')){
  this.lookup();
}
}

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className='content'>
            <h1> Pivot Points </h1>
            <TextField id="symbol" type="text" defaultValue={localStorage.getItem('symbol') || ""} onKeyDown={this.keyPress} label="Stock Symbol" onChange={this.enterSymbol}  />
            <br/>
            <Button size="small" style={{Height: '1vmin'}} id='button' variant="contained" color="primary" onClick={this.lookup}> Look up </Button>
           <br/>
           <div> <span id='message'> {this.state.message}</span><span style={{color:this.state.changeColor}}> {this.state.change} </span></div>
            <div>
              <span className="stats">High: $ {this.state.high} </span>
               <span className="stats">Low: $ {this.state.low} </span>
               <span className="stats">Open: $ {this.state.open} </span>
               <span className="stats">Close: $ {this.state.close} </span>    
            </div>
            <hr/>
          <Grid container className='classesdemo' justify="space-around" spacing={24} alignItems = "center">
           
              <Grid item xs={2}>
                <Title/>
              </Grid>

              <Grid item xs={2}>
                <Classic state={this.state}/>
              </Grid>

            <Grid item xs={2}>
              <Camarilla state={this.state}/>
            </Grid>

            <Grid item xs={2}>
              <Fib state={this.state}/>
            </Grid>

            <Grid item xs={2}>
              <Demark state={this.state}/>
            </Grid>
          </Grid>
          <hr/>
          <div className = 'footnote'>** Pivot Point data is only accurate before/after trading hours **</div>
        </div>
         </div>
      </div>
    );
  }
}

export default App;