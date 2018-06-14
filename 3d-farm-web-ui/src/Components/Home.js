import React, { Component } from 'react';
import Navbar from './Navbar';

class Home extends Component {
    render() {
        return (
            <div>
            	{console.log(this.props.history.location.state.user)}
            	<Navbar user={this.props.history.location.state.user} />
            </div>
        );
    }
}

export default Home;