import React, { Component } from 'react';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {}
        };
    }

    render() {
        return (
            <div>
                <p>User</p>
            </div>
        );
    }
}

export default User;