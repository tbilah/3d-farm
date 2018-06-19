import React, { Component } from "react";
import { Col, Collapse, Form, FormGroup, Label, Input, Button } from "reactstrap";

const orderstates = [
    "WAITING",
    "BEING_PRINTED",
    "PAUSED",
    "CANCELED",
    "DONE"
];

export default class OrderFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            visibleStates: orderstates.slice()
        };
    }

    handleVisibilityChange(e) {
        const target = e.target;
        const name = target.name.toUpperCase();
        const checked = target.checked;
        let v = this.state.visibleStates;
        if (checked && v.indexOf(name) < 0) v.push(name);
        if (!checked && v.indexOf(name) >= 0) v.splice(v.indexOf(name), 1);
        this.setState({ visibleStates: v });
    }

    onSubmit(e) {
        e.preventDefault();
        console.log("Visible states", this.state.visibleStates);
        this.props.setFilter(this.state.visibleStates);
    }

    render() {
        return (
            <div className="card OrderFilter">
                <div className="card-header" onClick={_ => this.setState({ collapse: !this.state.collapse })}>
                    <h4>Filter order</h4>
                </div>
                <Collapse className="card-body" isOpen={this.state.collapse}>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <FormGroup row>
                            <Label sm={2}>Order state</Label>
                            <Col sm={{ size: 10 }}>
                                <FormGroup check inline>
                                    {orderstates.map(s =>
                                        <Label check key={s} className="OrderVisibility">
                                            <Input type="checkbox" checked={this.state.visibleStates.indexOf(s) >= 0} name={s}
                                                onChange={this.handleVisibilityChange.bind(this)} /> {s}
                                        </Label>
                                    )}
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <Button type="submit" className="btn btn-secondary">Filter</Button>
                    </Form>
                </Collapse>
            </div>
        );
    }
}