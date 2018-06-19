import React, { Component } from 'react';
import { Collapse, CustomInput, Label, Input, Form, Button } from "reactstrap";
const printeryURL = "http://localhost:3010";

export default class OrderCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            printer: props.printers[0],
            user: JSON.parse(sessionStorage.getItem("user")).magasin._id,
            model: "example"
        }
    }

    createOrder(event) {
        fetch(printeryURL + "/order", {
            method: "POST",
            body: {
                printer,
                user,
                model
            }
        })
            .then(res => res.json())
            .then(console.log)
            .then(_ => this.props.onSuccess())
            .catch(console.error);
    }

    handleChange(e) {
        const target = e.target
        const name = target.name
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value

        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className="card OrderCreator">
                <div className="card-header" onClick={_ => this.setState({ collapse: !this.state.collapse })}>
                    <h4>New order</h4>
                </div>
                <Collapse className="card-body" isOpen={this.state.collapse}>
                    <Form onSubmit={this.createOrder}>
                        <Label for="inputModel">File Browser</Label>
                        <CustomInput type="file" id="inputModel" name="customFile" label="Choose a model" onChange={this.handleChange} />
                        <Input type="select" id="printer" name="printer" label="Choose a printer" onChange={this.handleChange} value={this.state.printer}>
                            {this.props.printers.map(p => <option value={p._id}>{p._id}</option>)}
                        </Input>
                        <Button type="submit" className="btn btn-secondary">Print</Button>
                    </Form>
                </Collapse>
            </div>
        );
    }
}