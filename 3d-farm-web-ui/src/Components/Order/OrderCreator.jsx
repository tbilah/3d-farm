import React, { Component } from 'react';
import { Collapse, CustomInput, Label } from "reactstrap";
// const printeryURL = "http://localhost:3010";

export default class OrderCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false
        }
    }

    render() {
        return (
            <div className="card OrderCreator">
                <div className="card-header" onClick={_ => this.setState({ collapse: !this.state.collapse })}>
                    <h4>New order</h4>
                </div>
                <Collapse className="card-body" isOpen={this.state.collapse}>
                    <form>
                        <Label for="inputModel">File Browser</Label>
                        <CustomInput type="file" id="inputModel" name="customFile" label="Choose a model" />
                        <button type="submit" className="btn btn-secondary">Print</button>
                    </form>
                </Collapse>
            </div>
        );
    }
}