import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Calendar from './components/Calendar';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/calendar">
          <Calendar />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
