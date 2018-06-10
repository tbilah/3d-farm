import React, { Component } from 'react';
import Login from './Login'
import User from './User'
import Home from './Home'
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <Router >
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/login' component={Login} />
                </Switch>
            </Router>
        );
    }
}

export default App;
