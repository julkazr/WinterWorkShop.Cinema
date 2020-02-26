import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';

class EditAuditorium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameError: '',
            canSubmit: true,
            id: '',
            seatRows: 0,
            numberOfSeats: 0,
            seatRowsError: '',
            numOfSeatsError: '',
            seatsList: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params; 
        this.getAuditorium(id);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    createRows(row) {

    }

    validate(id, value) {
        if (id === 'name') {
            if (value === '') {
                this.setState({nameError: 'Fill in auditorium name', 
                                canSubmit: false});
            } else {
                this.setState({nameError: '',
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
                this.setState({seatRowsError: 'Seats number can be in between 1 and 20',
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
        const { name } = this.state;
        if (name) {
            this.updateAuditorium();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    getAuditorium(id) {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
        fetch(`${serviceConfig.baseURL}/api/auditoriums/${id}`, requestOptions)
            .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({name: data.name, 
                                   id: data.id,
                                   seatRows: data.seatsList[data.seatsList.length - 1].row,
                                   numberOfSeats: data.seatsList[data.seatsList.length - 1].number,
                                   seatsList: data.seatsList });
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
        }

        updateAuditorium() {
            const { name, id, seatRows, numberOfSeats, seatsList } = this.state;
            const data = {
                name: name,
                numberOfSeats: +numberOfSeats,
                numberOfRows: +seatRows
            };
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
                body: JSON.stringify(data)
                
            };
    
            fetch(`${serviceConfig.baseURL}/api/auditoriums/update/${id}`, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }
                    return response.statusText;
                })
                .then(result => {
                    this.props.history.goBack();
                    NotificationManager.success('Successfuly edited auditorium!');
                })
                .catch(response => {
                    NotificationManager.error(response.message || response.statusText);
                    this.setState({ submitted: false });
                });
        }
       
        render() {
            const {name, nameError, submitted, canSubmit, seatRows, numberOfSeats, seatRowsError, numOfSeatsError} = this.state;
            return (
                <Container>
                    <Row>
                        <Col>
                            <h1 className="form-header">Edit Existing Auditorium</h1>
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormControl
                                        id="name"
                                        type="text"
                                        placeholder="Auditorium name"
                                        value={name}
                                        onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{nameError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        id="seatRows"
                                        type="number"
                                        placeholder="Number Of Rows"
                                        value={seatRows}
                                        onChange={this.handleChange}
                                        max="20"
                                    />
                                    <FormText className="text-danger">{seatRowsError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl
                                        id="numberOfSeats"
                                        type="number"
                                        placeholder="Number Of Seats"
                                        value={numberOfSeats}
                                        onChange={this.handleChange}
                                        max="20"
                                    />
                                    <FormText className="text-danger">{numOfSeatsError}</FormText>
                                </FormGroup>
                                <Button type="submit" disabled={submitted || !canSubmit} block>Edit Cinema</Button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            );
        }

}

export default withRouter(EditAuditorium);