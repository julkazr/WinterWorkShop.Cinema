import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Row, Table, Container, Col, FormGroup, FormText, Button, FormControl } from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import DateTimePicker from 'react-datetime-picker';

class MovieSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            tag: '',
            submitted: false,
            canSubmit: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const {tag} = this.state;
        if (tag) {
            //this.addMovie();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'tag') {
            if (value === '') {
                this.setState({titleError: 'Fill in tag',
                                canSubmit: false});
            } else {
                this.setState({titleError: '',
                                canSubmit: true});
            }
        }
    }

    getMovies() {
        const {tag} = this.state;
        const data = {
            tag: tag
        }
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/Movies/getByTag`, requestOptions)
            .then(response => {
                if(!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if(data) {
                    this.setState({movies: data});
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({submittes: false});
            });
    }

    fillTableWithData() {
        return this.state.movies.map(movie => {
            return <tr key={movie.id}>                     
                        <td>{movie.title}</td>
                        <td>{movie.year}</td>
                        <td>{movie.rating}/10</td>
                        <td>{movie.current}</td>
                    </tr>
        })
    }

    render() {
        const {tag, submitted, canSubmit} = this.state;
        const rowsData = this.fillTableWithData();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Year</th>
                                    <th>Rating</th>
                                    <th>Current</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsData}
                            </tbody>
                        </Table>
                        );
        const showTable = table;

        return (         
            <Container>
                <Col>
                    <h1 className="form-header" >Movie Search</h1>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <FormControl
                                id="tag"
                                type="text"
                                placeholder="Movie tag"
                                value={tag}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <Button type="submit" block>Search</Button>
                    </form>
                </Col>
                <Row> 
                    <Col>
                        <form style = {{margin: 20}}> 
                            {showTable}
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default MovieSearch;