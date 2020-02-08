import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import Classes from './App.module.css';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className={Classes.App}>
        <Navbar />
        <Switch>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
