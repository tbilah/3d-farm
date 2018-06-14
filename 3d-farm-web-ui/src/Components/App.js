import React, { Component } from 'react';
import Login from './Login'
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
                    <Route exact path='/' component={Login} />
                    <Route path='/home' component={Home} />
                </Switch>
            </Router>
        );
    }
}

export default App;
