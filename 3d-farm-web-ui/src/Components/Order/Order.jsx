import React, { Component } from 'react';
import "../../Styles/index.css";
import { Collapse } from "reactstrap";
const cameraURL = "http://localhost:3002";

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameras: [],
            collapse: false
        }
    }

    componentDidMount() {
        this.timer = setInterval(() => this.fetchCameras(), 2000);
    }

    fetchCameras() {
        fetch(cameraURL + "/cameras", { method: "GET" })
            .then(res => res.json())
            .then(res => {
                this.setState({ cameras: res.cameras })
            })
            .catch(err => {
                console.error(err);
                // TODO announce error on uI
            });
    }

    render() {
        return (
            <div className="card Order">
                <div className="card-header" onClick={_ => this.setState({ collapse: !this.state.collapse })}>
                    <OrderId id={this.props.order._id} />
                </div>
                <Collapse className="card-body" isOpen={this.state.collapse}>
                    <OrderState state={this.props.order.state} />
                    <OrderRequester requester={this.props.order.requester} />
                    <OrderPrinter printer={this.props.order.printer} />
                    <OrderModel model={this.props.order.model} />
                    <OrderCameras cameras={this.state.cameras} />
                    <OrderHistory history={this.props.order.history} />
                </Collapse>
                <div className="card-footer btn-group" role="group">
                    <button type="button" className="btn btn-secondary">Accept</button>
                    <button type="button" className="btn btn-dark">Unaccept</button>
                    <button type="button" className="btn btn-secondary">Pause</button>
                    <button type="button" className="btn btn-dark">Cancel</button>
                    <button type="button" className="btn btn-secondary">Finish</button>
                </div>
            </div>
        );
    }
}

class OrderCameras extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCamera: null
        }
    }

    updateSelectedCamera(camera, event) {
        this.setState({ selectedCamera: camera });
    }

    render() {
        const cameras = this.props.cameras;
        return (
            <div className="OrderCameras">
                <h4>Visualiser</h4>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.selectedCamera ? this.state.selectedCamera.reference : "Choisir la camera"}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {cameras.map((camera, key) => {
                            return (
                                <button key={camera._id} className="OrderCameras dropdown-item" onClick={this.updateSelectedCamera.bind(this, camera)}>
                                    {camera.reference}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

class OrderId extends Component {
    render() {
        return (
            <h4 className="OrderId">
                {this.props.id}
            </h4>
        );
    }
}

class OrderState extends Component {
    render() {
        return (
            <p className="OrderState card-text">
                <b>State:</b>
                {this.props.state}
            </p>
        );
    }
}

class OrderRequester extends Component {
    render() {
        return (
            <p className="OrderRequester card-text">
                <b>Requester:</b>
                {this.props.requester}
            </p>
        );
    }
}

class OrderPrinter extends Component {
    render() {
        return (
            <p className="OrderPrinter card-text">
                <b>Printer:</b>
                {this.props.printer}
            </p>
        );
    }
}

class OrderModel extends Component {
    render() {
        return (
            <p className="OrderModel card-text">
                <b>Model:</b>
                {/* TODO */}
                {/* this.props.model */}
            </p>
        );
    }
}

class OrderHistory extends Component {
    render() {
        return (
            <div className="OrderHistory card-text">
                <b>Journal:</b>
                <ul>
                    {this.props.history.map(e => <OrderEvent event={e} key={e._id} />)}
                </ul>
            </div>
        )
    }
}

class OrderEvent extends Component {
    render() {
        const date = new Date(this.props.event.date);
        const emitter = this.props.event.emittorId;
        const description = this.props.event.description;
        return (
            <li className="OrderEvent card-text">
                {description + " by " + emitter + " at " + date.toLocaleString()}
            </li>
        )
    }
}