import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Row, Table, Container, Col, FormGroup, FormText, Button } from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import DateTimePicker from 'react-datetime-picker';
import { sharedGetRequestOptions, sharedPostRequestOptions, sharedResponse } from './../helpers/shared';

class FilterProjections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cinemaId: null,
            cinemas: [],
            auditoriumId: null,
            auditoriums: [],
            movieId: null,
            movies: [],
            submitted: false,
            cinemaIdError: '',
            auditoriumIdError: '',
            movieIdError: '',
            projectionTimeError: '',
            startProjectionTime: null,
            finishProjectionTime: null,
            projections: [],
            isLoading: true,
            auditoriumName: '',
            disabledCinema: false,
            disabledMovie: false,
            disabledAuditorium: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.filterProjections = this.filterProjections.bind(this);
    }

    componentDidMount() {
        this.getCinemas();
        this.getAuditoriums();
        this.getMovies();
        this.filterProjections();
    }

    getCinemas() {
        const requestOptions = sharedGetRequestOptions;

        fetch(`${serviceConfig.baseURL}/api/Cinemas/all`, requestOptions)
            .then(sharedResponse)
            .then(data => {
                if(data) {
                    this.setState({cinemas: data});
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({submittes: false});
            });
    }

    getAuditoriums() {
        const requestOptions = sharedGetRequestOptions;

        fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
            .then(sharedResponse)
            .then(data => {
                if(data) {
                    this.setState({auditoriums: data});
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({submittes: false});
            });
    }

    getMovies() {
        const requestOptions = sharedGetRequestOptions;

        fetch(`${serviceConfig.baseURL}/api/movies/all`, requestOptions)
            .then(sharedResponse)
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

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
    }
    
    onCinemaChange(cinema) {
        if(cinema[0]) {
            this.setState({cinemaId: cinema[0].id, disabledAuditorium: true, disabledMovie: true});
            this.validate('cinemaId', cinema[0]);
        } else {
            this.setState({cinemaId: null, disabledAuditorium: false, disabledMovie: false});
            this.validate('cinemaId', null);
        }
    }

    onAuditoriumChange(auditorium) {
        if(auditorium[0]) {
            this.setState({auditoriumId: auditorium[0].id, disabledCinema: true, disabledMovie: true});
            this.validate('auditoriumId', auditorium[0]);
        } else {
            this.setState({auditoriumId: null, disabledCinema: false, disabledMovie: false});
            this.validate('auditoriumId', null);
        }
    }

    onMovieChange(movie) {
        if(movie[0]) {
            this.setState({movieId: movie[0].id, disabledCinema: true, disabledAuditorium: true});
            this.validate('movieId', movie[0]);
        } else {
            this.setState({movieId: null, disabledCinema: false, disabledAuditorium: false});
            this.validate('movieId', null);
        }
    }

    onStartDateChange = date => this.setState({ startProjectionTime: date })

    onFinishDateChange = date => this.setState({ finishProjectionTime: date })

    validate(id, value) {
        if (id === 'cinemaId') {
            if (!value) {
                this.setState({cinemaIdError: '',
                                canSubmit: false})
            } else {
                this.setState({cinemaIdError: '',
                                canSubmit: true});
            }
        }
        else if (id === 'auditoriumId') {
            if (!value) {
                this.setState({auditoriumIdError: '',
                                canSubmit: false})
            } else {
                this.setState({auditoriumIdError: '',
                                canSubmit: true});
            }
        }
        else if (id === 'movieId') {
            if (!value) {
                this.setState({movieIdError: '',
                                canSubmit: false})
            } else {
                this.setState({movieIdError: '',
                                canSubmit: true});
            }
        }
        else if (id === 'startProjectionTime') {
            if (!value) {
                this.setState({projectionTimeError: '',
                                canSubmit: false});
            } else {
                this.setState({projectionTimeError: '',
                                canSubmit: true});
            }
        }
        else if (id === 'finishProjectionTime') {
            if (!value) {
                this.setState({projectionTimeError: '',
                                canSubmit: false});
            } else {
                this.setState({projectionTimeError: '',
                                canSubmit: true});
            }
        }
    }

    filterProjections(){
        const {movieId, cinemaId, auditoriumId, startProjectionTime, finishProjectionTime} = this.state;
        const data = {
            movieId: movieId,
            cinemaId: cinemaId,
            auditoriumId: auditoriumId,
            fromTime: startProjectionTime,
            toTime: finishProjectionTime
        }

        const requestOptions = sharedPostRequestOptions(data);

          fetch(`${serviceConfig.baseURL}/api/Projections/filter`, requestOptions)
            .then(sharedResponse)
            .then(data => {
                if (data) {
                    this.setState({ projections: data, isLoading: false });
                }
            })
            .catch(response => {
                this.setState({isLoading: false});
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });

    }

    fillTableWithData() {
        return this.state.projections.map(projection => {
            return <tr key={projection.id}>                     
                        <td>{projection.projectionTime}</td>
                        <td>{projection.movieTitle}</td>
                        <td>{projection.aditoriumName}</td>
                    </tr>
        })
    }


    render() {
        const {cinemas, cinemaIdError, auditoriums, auditoriumIdError, movies, movieIdError, projectionTimeError, disabledCinema, disabledAuditorium, disabledMovie} = this.state;
        const rowsData = this.fillTableWithData();
        const table = (<Table striped bordered hover size="sm" variant="dark">
            <thead>
            <tr>
                <th>Data</th>
                <th>Movie</th>
                <th>Auditorium</th>
            </tr>
            </thead>
        <tbody>
            {rowsData}
        </tbody>
    </Table>);

    const showTable = table;
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col>
                        <h1 className="form-header">Filter Projections</h1>
                        <form  onSubmit={this.handleSubmit}>
                            <FormGroup>
                                    <Typeahead
                                        labelKey="name"
                                        options={cinemas}
                                        placeholder="Choose a cinema..."
                                        id="browser"
                                        disabled={disabledCinema}
                                        onChange={e => {this.onCinemaChange(e)}}
                                        />
                                        <FormText className="text-danger">{cinemaIdError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                    <Typeahead
                                        labelKey="name"
                                        options={auditoriums}
                                        placeholder="Choose a auditorium..."
                                        id="browser"
                                        disabled={disabledAuditorium}
                                        onChange={e => {this.onAuditoriumChange(e)}}
                                        />
                                        <FormText className="text-danger">{auditoriumIdError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                    <Typeahead
                                        labelKey="title"
                                        options={movies}
                                        placeholder="Choose a movie..."
                                        id="browser"
                                        disabled={disabledMovie}
                                        onChange={e => {this.onMovieChange(e)}}
                                        />
                                        <FormText className="text-danger">{movieIdError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                    <h2 className="form-header">start data</h2>
                                    <DateTimePicker format="y-MM-dd"
                                        className="form-control"
                                        onChange={this.onStartDateChange}
                                        value={this.state.startProjectionTime}
                                        />
                                    <FormText className="text-danger">{projectionTimeError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                    <h3 className="form-header">finish data</h3>
                                    <DateTimePicker format="y-MM-dd"
                                        className="form-control"
                                        onChange={this.onFinishDateChange}
                                        value={this.state.finishProjectionTime}
                                        />
                                    <FormText className="text-danger">{projectionTimeError}</FormText>

                            </FormGroup>
                            <Button type="submit" onClick={this.filterProjections}>Filter Projections</Button>
                        </form>
                        </Col>
                    </Row>
                    <Row className="no-gutters pr-5 pl-5">
                        <Col>
                            <form style={{margin: 20}}>
                                {showTable}
                            </form>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default FilterProjections;