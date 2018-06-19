import React, { Component } from 'react';
import Navbar from '../Navbar';
import OrderList from './OrderList';

export default class Orders extends Component {
    render() {
        return (
            <Navbar>
                <OrderList />
            </Navbar>
        );
    }
}