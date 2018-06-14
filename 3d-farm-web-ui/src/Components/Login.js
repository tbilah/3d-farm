import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom';
import Home from './Home';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        redirect: false,
        user: null
      };
    }

    onSuccess(googleUser) {
        this.props.history.push({
            pathname : '/home',
            state : {
                user : googleUser
            }
        });
    }

    onFailure(response) {
        console.log(response);
    }

    render() {
        return (
            <div className="Login">
                <div className="container">
                    <h1 className="display-1 text-center">3D Farm</h1>
                    <h2 className="text-center">Veuillez vous identifier</h2>
                    <form>
                        <div className="text-center">
                            <GoogleLogin
                                clientId="368488107530-funna3ndjd772vt26d9ri20lt3om1p30.apps.googleusercontent.com"
                                buttonText="Se connecter avec Google"
                                onSuccess={this.onSuccess.bind(this)}
                                onFailure={this.onFailure.bind(this)}
                                className="btn btn-primary"
                                style={{marginLeft:10}}
                            />
                        </div>   
                    </form>
                </div>
                <Router>
                    <div>
                        <Route exact path="/home" render={() => <Home user={this.state.googleUser} />} />
                    </div> 
                </Router>
            </div>
        );
    }
}

export default withRouter(Login);