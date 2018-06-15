import React, { Component } from 'react';
import './css/simple-sidebar.css';

class Navbar extends Component {
    render() {
        return (
            <div>
                <div id="wrapper" className="toggled">
                    <div id="sidebar-wrapper">
                        <ul className="sidebar-nav">
                            <li className="sidebar-brand">
                                <a href="/home">
                                    <h1>3D-farm</h1>
                                </a>
                            </li>
                            <li>
                                <a href="/home">Vue d'ensemble</a>
                            </li>
                            <li>
                                <a href="/home">Utilisateur</a>
                            </li>
                            <li>
                                <a href="/home">Groupe</a>
                            </li>
                            <li>
                                <a href="/home">Matérial</a>
                            </li>
                            <li>
                                <a href="/home">Rapports</a>
                            </li>
                            <li>
                                <a href="/home">Option</a>
                            </li>
                            <li>
                                <a href="/home">Logs</a>
                            </li>
                        </ul>
                    </div>

                    <div id="page-content-wrapper">
                        <nav className="navbar navbar-dark bg-dark">
                            <a className="navbar-brand"><font color='white'>Bienvenue, {this.props.user.profileObj.name}</font></a>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href='/' id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    style={{display : 'inline-block'}}>
                                  <img src={this.props.user.profileObj.imageUrl} alt='' width='30' height='30' />
                                </a>
                                <div className='dropdown-menu' aria-labelledby="navbarDropdown">
                                  <a className="dropdown-item" href="/">Logout</a>
                                </div>
                            </li>
                        </nav>
                    </div>

                    <div>
                        add content here
                    </div>
                </div>   
            </div>
        );
    }
}

export default Navbar;