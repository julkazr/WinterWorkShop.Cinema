import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { sharedGetRequestOptions, sharedPutRequestOptions, sharedResponse } from './../../helpers/shared';

class EditCinema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameError: '',
            canSubmit: true,
            id: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params; 
        this.getCinema(id);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'name') {
            if (value === '') {
                this.setState({nameError: 'Fill in cinema name', 
                                canSubmit: false});
            } else {
                this.setState({nameError: '',
                                canSubmit: true});
            }
        }
    }

    
    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { name } = this.state;
        if (name) {
            this.updateCinema();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    getCinema(id) {
        const requestOptions = sharedGetRequestOptions;
        fetch(`${serviceConfig.baseURL}/api/cinemas/${id}`, requestOptions)
            .then(sharedResponse)
            .then(data => {
                if (data) {
                    console.log({data})
                    this.setState({name: data.name, id: data.id});
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
        }

        updateCinema() {
            const { name, id } = this.state;
            const data = {
                name: name
            };
            console.log({data},{id})
            const requestOptions = sharedPutRequestOptions(data);
    
            fetch(`${serviceConfig.baseURL}/api/Cinemas/update/${id}`, requestOptions)
                .then(sharedResponse)
                .then(result => {
                    this.props.history.goBack();
                    NotificationManager.success('Successfuly edited cinema!');
                })
                .catch(response => {
                    NotificationManager.error(response.message || response.statusText);
                    this.setState({ submitted: false });
                });
        }
       
        render() {
            const {name, nameError, submitted, canSubmit} = this.state;
            return (
                <React.Fragment>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className="form-header">Edit Existing Cinema</h1>
                                <form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <FormControl
                                            id="name"
                                            type="text"
                                            placeholder="Cinema name"
                                            value={name}
                                            onChange={this.handleChange}
                                        />
                                        <FormText className="text-danger">{nameError}</FormText>
                                    </FormGroup>
                                    <Button type="submit" disabled={submitted || !canSubmit} block>Edit Cinema</Button>
                                </form>
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            );
        }

}

export default withRouter(EditCinema);