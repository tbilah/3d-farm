import React, { Component } from "react";
import Order from "./Order";
import OrderCreator from "./OrderCreator";
const printeryURL = "http://localhost:3010";
const magasinURL = "http://localhost:3001";

export default class OrderList extends Component {
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
            .then(ar => {
                console.log(ar);
                return ar;
            })
            .then(ar => this.setState({ orders: ar[0], printers: ar[1].printers, users: ar[2].users }))
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
            <div className="container">
                <OrderCreator printers={this.state.printers} onSuccess={this.fetchAll.bind(this)} />
                {this.state.orders.map(o =>
                    <Order order={o} key={o._id} printers={this.state.printers} users={this.state.users} />
                )}
            </div>
        );
    }
}