import React, { Component } from 'react';

class NewUser extends Component {
    fetchForStaff = (staffId) => {
        console.log(staffId);
        fetch('http://localhost:3001/staff/' + staffId, 
            {
                method : 'GET'
            })
            .then((response) => response.json())
            .then((responseJson) => {
                let googleUser = JSON.parse(sessionStorage.getItem('user'));
                googleUser.magasin = responseJson;
                sessionStorage.setItem('user', JSON.stringify(googleUser));
                window.location.href = 'http://localhost:3000/home';
            })
            .catch((error) => {
              console.error(error);
            });
    }

    submit = (e) => {
        e.preventDefault();
        let body = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            type: document.getElementById("type").value,
            phone: document.getElementById("phone").value,
            departement: document.getElementById("departement").value
        };
        fetch('http://localhost:3001/staff/', 
            {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body : JSON.stringify(body)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.fetchForStaff(responseJson.createdStaff._id);
            })
            .catch((error) => {
              console.error(error);
            });
    }

    render() {
        return (
            <div className="container-fluid">
                <form onClick={this.submit.bind(this)}>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="name">Nom</label>
                            <input readOnly type="text" className="form-control" id="name" value={JSON.parse(sessionStorage.getItem('user')).profileObj.name} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="email">Email</label>
                            <input readOnly type="email" className="form-control" id="email" aria-describedby="emailHelp" value={JSON.parse(sessionStorage.getItem('user')).profileObj.email} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="phone">Numéro portable</label>
                            <input required="true" type="text" className="form-control" id="phone" placeholder="Votre numéro portable" />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="departement">Département</label>
                            <input required="true" type="text" className="form-control" id="departement" placeholder="Votre département" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="type">Type</label>
                            <select className="form-control" id="type">
                              <option>MEMBER</option>
                              <option>LEADER</option>
                              <option>ADMIN</option>
                              <option>OPERATOR</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-primary float-right" type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default NewUser;