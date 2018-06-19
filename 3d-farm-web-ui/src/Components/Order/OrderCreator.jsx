import React, { Component } from 'react';
import { Collapse, CustomInput, Label, Input, Form, Button, Alert } from "reactstrap";
const printeryURL = "http://localhost:3010";

export default class OrderCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            printerId: null,
            user: JSON.parse(sessionStorage.getItem("user")).magasin,
            model: "example",
            message: "",
            state: "idle" // idle, request, success, fail
        }
    }

    createOrder(e) {
        e.preventDefault();
        this.setState({ message: "Requesting", state: "request" });
        fetch(printeryURL + "/order", {
            method: "POST",
            body: JSON.stringify({
                printer: this.state.printerId,
                requester: this.state.user._id,
                model: this.state.model
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => this.setState({ message: res.message + ". id=" + res.order._id, state: "success" }))
            .then(_ => this.props.onSuccess())
            .catch(err => {
                console.error(err);
                this.setState({ message: "Error on request", state: "fail" });
            });
    }

    handleChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        this.setState({ [name]: value });
    }

    componentDidUpdate(prevprops) {
        if (JSON.stringify(this.props.printers) !== JSON.stringify(prevprops.printers) && Array.isArray(this.props.printers)) {
            this.setState({ printerId: this.props.printers[0]._id });
        }
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

    render() {
        return (
            <div className="card OrderCreator">
                <div className="card-header" onClick={_ => this.setState({ collapse: !this.state.collapse })}>
                    <h4>New order</h4>
                </div>
                <Collapse className="card-body" isOpen={this.state.collapse}>
                    <Form onSubmit={this.createOrder.bind(this)}>
                        <Label for="inputModel">File Browser</Label>
                        <CustomInput type="file" id="inputModel" name="customFile" label="Choose a model" onChange={this.handleChange.bind(this)} />
                        <Input type="select" id="printer" name="printerId" label="Choose a printer"
                            onChange={this.handleChange.bind(this)} value={this.state.printerId ? this.state.printerId : ""}>
                            {this.props.printers.map(p => <option value={p._id} key={p._id}>{p._id}</option>)}
                        </Input>
                        <Button type="submit" className="btn btn-secondary">Print</Button>
                    </Form>
                    <Alert style={{ display: this.state.state === "idle" ? "none" : "block" }}
                        color={this._getAlertColor()}>{this.state.message}</Alert>
                </Collapse>
            </div>
        );
    }
}