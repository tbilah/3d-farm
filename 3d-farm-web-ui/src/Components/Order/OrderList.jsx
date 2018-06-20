import React, { Component } from "react";
import Order from "./Order";
import OrderCreator from "./OrderCreator";
import OrderFilter from "./OrderFilter";
const printeryURL = "http://localhost:3010";
const magasinURL = "http://localhost:3001";

export default class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            printers: [],
            users: [],
            filter: [
                "WAITING",
                "BEING_PRINTED",
                "PAUSED",
                "CANCELED",
                "DONE"
            ]
        };
    }

    componentDidMount() {
        this.fetchAll();
    }

    fetchAll() {
        Promise.all([this.fetchOrders(), this.fetchPrinters(), this.fetchUsers()])
            .then(ar => {
                return ar;
            })
            .then(ar => this.setState({ orders: ar[0], printers: ar[1].printers, users: ar[2].users, hiddenOrders: [] }))
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

    setFilter(newVisibility) {
        this.setState({ filter: newVisibility });
    }

    shouldShow(order) {
        if (!this.state.filter) return true;
        return this.state.filter.indexOf(order.state) >= 0;
    }

    render() {
        return (
            <div className="container">
                <OrderFilter setFilter={this.setFilter.bind(this)} />
                <OrderCreator printers={this.state.printers} onSuccess={this.fetchAll.bind(this)} />
                <div className="OrderList">
                    {this.state.orders.map(o =>
                        this.shouldShow(o) ?
                            <Order order={o} key={o._id} users={this.state.users} onSuccess={this.fetchAll.bind(this)} />
                            : null
                    )}
                </div>
            </div>
        );
    }
}