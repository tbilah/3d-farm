import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

class Login extends Component {

    onSuccess(googleUser) {
        console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
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
                        <div class="form-group row">
                            <label for="login" class="col-sm-2 col-form-label">Identifiant</label>
                            <div class="col-sm-10">
                                <input type="text" readonly class="form-control" id="login" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-2 col-form-label">Mot de passe</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="password" required />
                            </div>
                        </div>
                        <div className="text-center">
                            <button class="btn btn-primary" type="submit">
                                Sign in
                            </button>
                            <GoogleLogin
                                clientId="368488107530-funna3ndjd772vt26d9ri20lt3om1p30.apps.googleusercontent.com"
                                onSuccess={this.onSuccess}
                                onFailure={this.onFailure}
                                className="btn btn-primary"
                                style={{marginLeft:10}}
                            />
                        </div>
                        
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
