import React, { Component } from 'react';
import Login from './Login'
import Home from './Home'
import Users from './Users'
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route path='/home' component={Home} />
                    <Route path='/users' component={Users} />
                </Switch>
            </Router>
        );
    }
}

export default App;
