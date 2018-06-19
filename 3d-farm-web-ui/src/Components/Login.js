import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

class Login extends Component {
    onSuccess(googleUser) {
        fetch('http://localhost:3001/staff/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                for(let i = 0; i < responseJson.users.length; i++) {
                    if(googleUser.profileObj.email.toUpperCase() === responseJson.users[i].email.toUpperCase()) {
                        googleUser.magasin = responseJson.users[i];
                    }
                }
                sessionStorage.setItem('user', JSON.stringify(googleUser));
                if(!googleUser.magasin) {
                    window.location.href = 'http://localhost:3000/newUser';
                } else {
                    window.location.href = 'http://localhost:3000/home';
                }
            })
            .catch((error) => {
                console.error(error);
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
                            />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;