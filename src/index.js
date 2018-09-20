import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Personal from './Personal';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter,Switch, Route } from 'react-router-dom';

// const Main = () => (
//     <main>
//       <Switch>
//         <Route exact path='/' component={App}/>
//         <Route path='/:symbol' component={Personal}/>
//       </Switch>
//     </main>
//   )

ReactDOM.render(  
  <App/>
// {/* <BrowserRouter>
//     <Main/>
//   </BrowserRouter> */}
  , document.getElementById('root'));
registerServiceWorker();
