import React, { Component } from 'react';
import Navbar from '../Navbar';
import Order from "./Order";
import OrderCreator from "./OrderCreator";
const printeryURL = "http://localhost:3010";

export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders() {
        fetch(printeryURL + "/order", { method: "GET" })
            .then(res => res.json())
            .then(res => this.setState({ orders: res }))
            .catch(err => {
                console.error(err);
                // TODO announce error on uI
            });
    }
    
    render() {
        return (
            <Navbar>
                <div className="container">
                    <OrderCreator />
                    {this.state.orders.map(o =>
                        <Order order={o} key={o._id} />
                    )}
                </div>
            </Navbar>
        );
    }
}