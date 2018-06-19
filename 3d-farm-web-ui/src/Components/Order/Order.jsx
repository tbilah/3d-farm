import React, { Component } from 'react';
import "../../Styles/index.css";
import { Collapse, Alert } from "reactstrap";
const printeryURL = "http://localhost:3010";
const cameraURL = "http://localhost:3002";

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameras: [],
            collapse: false,
            message: "",
            state: "idle", // idle, request, success, fail
            user: JSON.parse(sessionStorage.getItem("user")).magasin 
        }
    }

    _sendAction(action, finalmsg) {
        this.setState({ message: "Requesting", state: "request" });
        fetch(printeryURL + "/order/" + this.props.order._id, {
            method: "POST",
            body: JSON.stringify({
                emittorId: this.state.user._id,
                action: action.toUpperCase(),
                date: Date.now()
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(console.log)
            .then(_ => this.setState({ message: finalmsg, state: "success" }))
            .then(_ => this.props.onSuccess())
            .catch(err => {
                console.error(err);
                this.setState({ message: "Error on request", state: "fail" });
            });
    }

    _accept() {
        this._sendAction("ACCEPT", "Order accepted");
    }

    _unaccept() {
        this._sendAction("UNACCEPT", "Order unaccepted");
    }

    _pause() {
        this._sendAction("PAUSE", "Order paused");
    }

    _cancel() {
        this._sendAction("CANCEL", "Order canceled");
    }

    _finish() {
        this._sendAction("FINISH", "Order finished");
    }

    _getAlertColor() {
        switch (this.state.state) {
            case "request":
                return "primary";
            case "success":
                return "success";
            case "fail":
                return "danger";
            default:
                return "danger";
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
                    <button type="button" className="btn btn-secondary" onClick={this._accept.bind(this)}>Accept</button>
                    <button type="button" className="btn btn-dark" onClick={this._unaccept.bind(this)}>Unaccept</button>
                    <button type="button" className="btn btn-secondary" onClick={this._pause.bind(this)}>Pause</button>
                    <button type="button" className="btn btn-dark" onClick={this._cancel.bind(this)}>Cancel</button>
                    <button type="button" className="btn btn-secondary" onClick={this._finish.bind(this)}>Finish</button>
                </div>
                <Alert style={{ display: this.state.state === "idle" ? "none" : "block" }} className="card-text"
                    color={this._getAlertColor()}>{this.state.message}</Alert>
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