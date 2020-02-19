import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';

class NewCinema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            titleError: '',
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
        console.log("1 ", value);
    }

    validate(id, value) {
      console.log("2 ", id, value);
        if (id === 'name') {
            if (value === '') {
                this.setState({titleError: 'Fill in cinema name',
                                canSubmit: false});
            } else {
                this.setState({titleError: '',
                                canSubmit: true});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { name } = this.state;
        console.log("3 ", name);
        if (name) {
            this.addCinema();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    addCinema() {
        const { name } = this.state;

        const data = {
            Name: name
        };

        console.log("request method ", data)

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/cinemas/create`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
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
        const { name, submitted, titleError, canSubmit } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Add New Cinema</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    id="name"
                                    type="text"
                                    placeholder="Cinema name"
                                    value={name}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{titleError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={submitted || !canSubmit} block>Add Cinema</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(NewCinema);