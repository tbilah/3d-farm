import React, { Component } from 'react';
import Navbar from './Navbar';
import Octicon from 'react-octicon';
import $ from 'jquery';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            editables: [],
            add: false
        };
    }

    modifyUser = (e, userId, index) => {
        e.preventDefault();
        let editables = this.state.editables;
        for (let i = 0; i < editables.length; i++) {
            if (index !== i) {
                editables[i] = false;
            }
        }
        editables[index] = !editables[index];
        this.setState({
            editables: editables
        });
    }

    deleteUser = (e, userId) => {
        e.preventDefault();
        $('#deleteAlert').modal('show');
        $('#confirm').on('click', () => {
            $('#deleteAlert').modal('hide');
            this.delete(userId);
        });
    }

    delete = (userId) => {
        fetch('http://localhost:3001/staff/' + userId,
            {
                method: 'DELETE'
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.fetchForStaff();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    addUser = (e) => {
        e.preventDefault();
        this.setState({
            add: !this.state.add
        });
    }

    renderAddLine = () => {
        if (this.state.add) {
            return (
                <tr>
                    <td><a href='/' onClick={(e) => this.addUser(e)}><Octicon name="dash" /></a></td>
                    <td><input id="addedName" type="text" className="form-control" /></td>
                    <td><input id="addedEmail" type="text" className="form-control" /></td>
                    <td><input id="addedPhone" type="text" className="form-control" /></td>
                    <td><input id="addedType" type="text" className="form-control" /></td>
                    <td><input id="addedDepartement" type="text" className="form-control" /></td>
                    <td className="text-center">
                        <a href='/' onClick={(e) => this.add(e)}><Octicon name="check" /></a>
                        <a href='/' onClick={(e) => this.addUser(e)}><Octicon name="x" /></a>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td><a href='/' onClick={(e) => this.addUser(e)}><Octicon name="plus" /></a></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center"></td>
                </tr>
            );
        }
    }

    modify = (e) => {
        e.preventDefault();
        let editables = this.state.editables;
        let index = -1;
        for (let i = 0; i < editables.length; i++) {
            if (editables[i]) {
                index = i;
            }
        }

        let user = this.state.users[index];
        let body = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            type: document.getElementById("type").value,
            phone: document.getElementById("phone").value,
            departement: document.getElementById("departement").value
        };
        fetch('http://localhost:3001/staff/' + user._id,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.fetchForStaff();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    add = (e) => {
        e.preventDefault();
        let body = {
            name: document.getElementById("addedName").value,
            email: document.getElementById("addedEmail").value,
            type: document.getElementById("addedType").value,
            phone: document.getElementById("addedPhone").value,
            departement: document.getElementById("addedDepartement").value
        };
        fetch('http://localhost:3001/staff/',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.fetchForStaff();
            })
            .catch((error) => {
                console.error(error);
            });
        this.setState({
            add: false
        });
    }

    fetchForStaff() {
        fetch('http://localhost:3001/staff/', { method: 'GET' })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    users: responseJson.users
                });

                let editables = [];
                for (let i = 0; i < responseJson.users.length; i++) {
                    editables.push(false);
                }
                this.setState({
                    editables: editables
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.fetchForStaff();
    }

    render() {
        return (
            <Navbar>
                <div className="container-fluid">
                    <h1>Utilisateurs</h1>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Email</th>
                                <th scope="col">Portable</th>
                                <th scope="col">Type</th>
                                <th scope="col">Département</th>
                                <th scope="col" width="8%" className="text-center"><Octicon name="gear" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.map(function (user, index) {
                                if (this.state.editables[index]) {
                                    return (
                                        <tr key={index}>
                                            <td><input id="name" type="text" className="form-control" defaultValue={user.name} /></td>
                                            <td><input id="email" type="text" className="form-control" defaultValue={user.email} /></td>
                                            <td><input id="phone" type="text" className="form-control" defaultValue={user.phone} /></td>
                                            <td>
                                                <select id="type" className="form-control" defaultValue={user.type}>
                                                    <option>MEMBER</option>
                                                    <option>LEADER</option>
                                                    <option>ADMIN</option>
                                                    <option>OPERATOR</option>
                                                </select>
                                            </td>
                                            <td><input id="departement" type="text" className="form-control" defaultValue={user.departement} /></td>
                                            <td className="text-center">
                                                <a href='/' onClick={(e) => this.modify(e)}><Octicon name="check" /></a>
                                                <a href='/' onClick={(e) => this.modifyUser(e, user._id, index)}><Octicon name="x" /></a>
                                                <a href='/' onClick={(e) => this.deleteUser(e, user._id)}><Octicon name="trashcan" /></a>
                                            </td>
                                        </tr>
                                    );
                                }

                                return (
                                    <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.type}</td>
                                        <td>{user.departement}</td>
                                        <td className="text-center">
                                            <a href='/' onClick={(e) => this.modifyUser(e, user._id, index)}><Octicon name="pencil" /></a>
                                            <a href='/' onClick={(e) => this.deleteUser(e, user._id)}><Octicon name="trashcan" /></a>
                                        </td>
                                    </tr>
                                );
                            }, this)}

                            {
                                this.renderAddLine()
                            }
                        </tbody>
                    </table>
                </div>

                <div className="modal fade" id="deleteAlert" tabIndex="-1" role="dialog" aria-labelledby="deleteAlert" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Voulez-vous vraiment supprimer l'utilisateur?
                      </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Non</button>
                                <button type="button" className="btn btn-danger" id="confirm">Supprimer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>
        );
    }
}

export default Users;