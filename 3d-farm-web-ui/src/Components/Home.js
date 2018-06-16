import React, { Component } from 'react';
import Navbar from './Navbar';

class Home extends Component {
    render() {
        return (
            <div>
            	{console.log(JSON.parse(sessionStorage.getItem('user')))}
            	<Navbar>
            		<div>add content here</div>
            	</Navbar>
            </div>
        );
    }
}

export default Home;