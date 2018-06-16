import React, { Component } from 'react';
import Navbar from './Navbar';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/staff/', {method : 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
               this.setState({
                  users: responseJson.users
               });
            })
            .catch((error) => {
              console.error(error);
            });
    }

    render() {
        return (
        	<Navbar>
                <div className="container-fluid">
                    <h1>Utilisateurs</h1>
            		<table className="table">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Nom</th>
                          <th scope="col">Email</th>
                          <th scope="col">Portable</th>
                          <th scope="col">Type</th>
                          <th scope="col">Département</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.users.map(function(user, index) {
                            return (
                                <tr>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.type}</td>
                                    <td>{user.departement}</td>
                                </tr>
                            );
                        })}
                      </tbody>
                    </table>
                </div>
        	</Navbar>
        );
    }
}

export default Users;