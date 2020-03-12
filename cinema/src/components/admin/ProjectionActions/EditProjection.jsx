import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, Button, Container, Row, Col, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import DateTimePicker from 'react-datetime-picker';
import {Typeahead} from 'react-bootstrap-typeahead';
import { sharedGetRequestOptions, sharedPutRequestOptions, sharedResponse } from './../../helpers/shared';

class EditProjection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieTitle: '',
            auditoriumName: '',
            id: null,
            movieId: '',
            auditoriumId: '',
            submitted: false,
            canSubmit: true,
            projectionTime: null,
            movies: [],
            auditoriums: [],
            movieError: '',
            auditoriumError: '',
            projectionTimeError: ''

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params; 
        this.getProjection(id);
        this.getMovies();
        this.getAuditoriums();
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    getProjection(id) {
        const requestOptions = sharedGetRequestOptions;
    
        fetch(`${serviceConfig.baseURL}/api/projections/${id}`, requestOptions)
            .then(sharedResponse)
            .then(data => {
                if (data) {
                    this.setState({id: data.id,
                                   movieId: data.movieId,
                                   auditoriumId: data.auditoriumId,
                                   movieTitle: data.movieTitle,
                                   auditoriumName: data.aditoriumName,
                                   projectionTime:  data.projectionTime});
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
        }

        getMovies() {
            const requestOptions = sharedGetRequestOptions;
        
            fetch(`${serviceConfig.baseURL}/api/movies/all`, requestOptions)
                .then(sharedResponse)
                .then(data => {
                    if (data) {
                        this.setState({movies: data});
                    }
                })
                .catch(response => {
                    NotificationManager.error(response.message || response.statusText);
                    this.setState({ submitted: false });
                });
        }

        getAuditoriums() {
            const requestOptions = sharedGetRequestOptions;
        
            fetch(`${serviceConfig.baseURL}/api/auditoriums/all`, requestOptions)
                .then(sharedResponse)
                .then(data => {
                    if (data) {
                        this.setState({auditoriums: data});
                    }
                })
                .catch(response => {
                    NotificationManager.error(response.message || response.statusText);
                    this.setState({ submitted: false });
                });
        }

        updateProjection() {
            const {id, movieId, auditoriumId, projectionTime} = this.state;
            // Before: JSON.stringify apply timezone offset
            var date = new Date(projectionTime);
            var h = date.getTimezoneOffset()/60;
            var hour = date.getHours();
            hour += (-1 * h);
            date.setHours(hour);
            const data = {
                auditoriumId: auditoriumId,
                movieId: movieId,
                projectionTime: date
            };
            const requestOptions = sharedPutRequestOptions(data);
    
            fetch(`${serviceConfig.baseURL}/api/projections/update/${id}`, requestOptions)
                .then(sharedResponse)
                .then(result => {
                    this.props.history.goBack();
                    NotificationManager.success('Successfuly edited projection!');
                })
                .catch(response => {
                    NotificationManager.error(response.message || response.statusText);
                    this.setState({ submitted: false });
                });
        }

        handleSubmit(e) {
            e.preventDefault();
            this.updateProjection();
            this.setState({ submitted: true });
        }

        onMovieChange(movie) {
            if(movie[0]) {
                this.setState({movieId: movie[0].id});
                this.validate('movieId', movie[0]);
            } else {
                this.setState({cinemaId: null});
                this.validate('movieId', null);
            }
        }

        onAuditoriumChange(auditorium) {
            if(auditorium[0]) {
                this.setState({auditoriumId: auditorium[0].id});
                this.validate('auditoriumId', auditorium[0]);
            } else {
                this.setState({auditoriumId: null});
                this.validate('auditoriumId', null);
            }
        }

        validate(id, value) {
            if (id === 'movieId') {
                if (!value) {
                    this.setState({movieError: '',
                                    canSubmit: false})
                } else {
                    this.setState({movieError: '',
                                    canSubmit: true});
                }
            }
            else if (id === 'auditoriumId') {
                if (!value) {
                    this.setState({auditoriumError: '',
                                    canSubmit: false})
                } else {
                    this.setState({auditoriumError: '',
                                    canSubmit: true});
                }
            }
            else if (id === 'movieId') {
                if (!value) {
                    this.setState({projectionTimeError: '',
                                    canSubmit: false})
                } else {
                    this.setState({projectionTimeError: '',
                                    canSubmit: true});
                }
            }
        }

        onDateChange = date => this.setState({ projectionTime: date})

        render() {
            const { movieTitle, auditoriums, auditoriumName, movies, projectionTime} = this.state;
            const ExampleCustomTimeInput = ({ value, onChange }) => (
                <input
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  style={{ border: "solid 1px pink" }}
                />
              );
            return (
                <React.Fragment>
                    <Container>
                        <Row>
                            <Col>
                                <h1 className="form-header">Edit Existing Projection</h1>
                                <form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Typeahead
                                            labelKey="title"
                                            options={movies}
                                            placeholder={movieTitle}
                                            id="browser"
                                            onChange={e => {this.onMovieChange(e)}}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Typeahead
                                            labelKey="name"
                                            options={auditoriums}
                                            placeholder={auditoriumName}
                                            id="browser"
                                            onChange={e => {this.onAuditoriumChange(e)}}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <DateTimePicker 
                                            className="form-control"
                                            format = "dd/MM/yyyy h:mm aa"
                                            locale="sr"
                                            showTimeInput
                                            customTimeInput={<ExampleCustomTimeInput />}
                                            onChange={this.onDateChange}
                                            value={projectionTime && new Date(projectionTime) || null}
                                            />
                                    </FormGroup>
                                    <Button type="submit">Edit Projections</Button>
                                </form>
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            );
        }
}

export default withRouter(EditProjection);