import React, { Component } from 'react';
import Login from './Login'
import Home from './Home'
import Users from './Users'
import NewUser from './NewUser'
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import Orders from "./Order/Orders";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route path='/home' component={Home} />
                    <Route path='/users' component={Users} />
                    <Route path="/orders" component={Orders} />
                    <Route path="/newUser" component={NewUser} />
                </Switch>
            </Router>
        );
    }
}

export default App;
