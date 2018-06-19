import React, { Component } from 'react';
import Navbar from '../Navbar';
import Order from "./Order";
import OrderCreator from "./OrderCreator";
const printeryURL = "http://localhost:3010";
const magasinURL = "http://localhost:3001";

export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            printers: [],
            users: []
        };
    }

    componentDidMount() {
        this.fetchAll();
    }

    fetchAll() {
        Promise.all([this.fetchOrders(), this.fetchPrinters(), this.fetchUsers()])
            .then(ar => this.setState({ orders: ar[0], printers: ar[1], users: ar[2] }))
            .catch(console.error);
    }

    fetchOrders() {
        return fetch(printeryURL + "/order", { method: "GET" }).then(res => res.json());
    }

    fetchPrinters() {
        return fetch(magasinURL + "/printers", { method: "GET" }).then(res => res.json());
    }

    fetchUsers() {
        return fetch(magasinURL + "/staff", { method: "GET" }).then(res => res.json());
    }

    render() {
        return (
            <Navbar>
                <div className="container">
                    <OrderCreator printers={this.props.printers} onSuccess={this.fetchAll.bind(this)} />
                    {this.state.orders.map(o =>
                        <Order order={o} key={o._id} printers={this.props.printers} users={this.props.users} />
                    )}
                </div>
            </Navbar>
        );
    }
}