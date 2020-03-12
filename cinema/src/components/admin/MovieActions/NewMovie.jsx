import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, Form, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { YearPicker } from 'react-dropdown-date';
import { sharedPostRequestOptions, sharedResponse } from './../../helpers/shared';

class NewMovie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            year: 0,
            rating: 1,
            current: false,
            titleError: '',
            submitted: false,
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }
    
    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'title') {
            if (value === '') {
                this.setState({titleError: 'Fill in movie title',
                                canSubmit: false});
            } else {
                this.setState({titleError: '',
                                canSubmit: true});
            }
        }

        if(id === 'year') {
            const yearNum = +value;
            if(!value || value === '' || (yearNum<1895 || yearNum>2100)){
                this.setState({yearError: 'Please chose valid year'});
            } else {
                this.setState({yearError: ''});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { title, year } = this.state;
        if (title && year) {
            this.addMovie();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    handleYearChange(year) {
        this.setState({year: year});
        this.validate('year', year);
    }

    addMovie() {
        const { title, year, current, rating } = this.state;
        const data = {
            Title: title,
            Year: +year,
            Current: current === "true",
            Rating: +rating
        };

        const requestOptions = sharedPostRequestOptions(data);

        fetch(`${serviceConfig.baseURL}/api/movies`, requestOptions)
            .then(sharedResponse)
            .then(result => {
                NotificationManager.success('Successfuly added movie!');
                this.props.history.push(`AllMovies`);
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    render() {
        const { title, year, current, rating, submitted, titleError, yearError, canSubmit } = this.state;
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col>
                            <h1 className="form-header">Add New Movie</h1>
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <FormControl
                                        id="title"
                                        type="text"
                                        placeholder="Movie Title"
                                        value={title}
                                        onChange={this.handleChange}
                                    />
                                    <FormText className="text-danger">{titleError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <YearPicker
                                        defaultValue={'Select Movie Year'}
                                        start={1895}
                                        end={2100}
                                        reverse
                                        required={true}
                                        disabled={false}
                                        value={year}
                                        onChange={(year) => {
                                            this.handleYearChange(year);
                                        }}
                                        id={'year'}
                                        name={'year'}
                                        classes={'form-control'}
                                        optionClasses={'option classes'}
                                    />
                                    <FormText className="text-danger">{yearError}</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Form.Label>Rating</Form.Label>
                                    <FormControl as="select" placeholder="Rating" id="rating" value={rating} onChange={this.handleChange}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </FormControl>
                                </FormGroup>
                                <FormGroup>
                                    <FormControl as="select" placeholder="Current" id="current" value={current} onChange={this.handleChange}>
                                    <option value="true">Current</option>
                                    <option value="false">Not Current</option>
                                    </FormControl>
                                </FormGroup>
                                <Button type="submit" disabled={submitted || !canSubmit} block>Add Movie</Button>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(NewMovie);