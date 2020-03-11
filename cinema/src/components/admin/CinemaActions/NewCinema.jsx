import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { sharedPostRequestOptions, sharedResponse } from './../../helpers/shared';

class NewCinema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cinemaName: '',
            auditName: '',
            seatRows: 0,
            numberOfSeats: 0,
            titleError: '',
            auditNameError: '',
            seatRowsError: '',
            numOfSeatsError: '',
            submitted: false,
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'cinemaName') {
            if (value === '') {
                this.setState({titleError: 'Fill in cinema name',
                                canSubmit: false});
            } else {
                this.setState({titleError: '',
                                canSubmit: true});
            }
        } else if (id === 'auditName') {
            if(value === ''){
                this.setState({auditNameError: 'Fill in auditorium name',
                                canSubmit: false})
            } else {
                this.setState({auditNameError: '',
                                canSubmit: true});
            }
        } else if (id === 'numberOfSeats') {
            const seatsNum = +value;
            if (seatsNum > 20 || seatsNum < 1) {
                this.setState({numOfSeatsError: 'Seats number can be in between 1 and 20',
                                canSubmit: false})
            } else {
                this.setState({numOfSeatsError: '',
                                canSubmit: true});
            }
        } else if (id === 'seatRows') {
            const seatsNum = +value;
            if (seatsNum > 20 || seatsNum < 1) {
                this.setState({seatRowsError: 'Rows number can be in between 1 and 20',
                                canSubmit: false})
            } else {
                this.setState({seatRowsError: '',
                                canSubmit: true});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { cinemaName, auditName, numberOfSeats, seatRows } = this.state;
        if (cinemaName && auditName && numberOfSeats && seatRows) {
            this.addCinema();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    addCinema() {
        const { cinemaName, auditName, numberOfSeats, seatRows } = this.state;

        const data = {
            cinemaName: cinemaName,
            auditName: auditName,
            seatRows: +seatRows,
            numberOfSeats: +numberOfSeats
        };
        const requestOptions = sharedPostRequestOptions(data);

        fetch(`${serviceConfig.baseURL}/api/Cinemas/createwithauditorium`, requestOptions)
            .then(sharedResponse)
            .then(result => {
                NotificationManager.success('Successfuly added cinemas!');
                this.props.history.push(`AllCinemas`);
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    render() {
        const { cinemaName, auditName, numberOfSeats, seatRows, auditNameError ,seatRowsError, numOfSeatsError, submitted, titleError, canSubmit } = this.state;
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col>
                            <h1 className="form-header">Add New Cinema</h1>
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormControl
                                        id="cinemaName"
                                        type="text"
                                        placeholder="Cinema name"
                                        value={cinemaName}
                                        onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{titleError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        id="auditName"
                                        type="text"
                                        placeholder="Auditorium Name"
                                        value={auditName}
                                        onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{auditNameError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Form.Label>Rows</Form.Label>
                                    <FormControl
                                        id="seatRows"
                                        type="number"
                                        placeholder="Number Of Rows"
                                        value={seatRows}
                                        onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{seatRowsError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Form.Label>Number of seats in row</Form.Label>
                                    <FormControl
                                        id="numberOfSeats"
                                        type="number"
                                        placeholder="Number Of Seats"
                                        value={numberOfSeats}
                                        onChange={this.handleChange}
                                        max="36"
                                    />
                                    <FormText className="text-danger">{numOfSeatsError}</FormText>
                                </FormGroup>
                                <Button type="submit" disabled={submitted || !canSubmit} block>Add Cinema</Button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(NewCinema);