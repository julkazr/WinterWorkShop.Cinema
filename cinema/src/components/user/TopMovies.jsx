import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Row, Table, Col, FormControl, FormGroup, Button, FormText, Container, Form } from 'react-bootstrap';
import Spinner from '../Spinner';
import { sharedGetRequestOptions, sharedResponse } from './../helpers/shared';

class TopMovies extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          isLoading: true,
          Year: '',
          yearError:'',
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

    
    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { Year, canSubmit } = this.state;
        if (Year && canSubmit) {
            this.getTopMoviesByYear();
        } else {
            NotificationManager.error('Please fill form with correct data.');
            this.setState({ submitted: false });
        }
    }

    validate(id, value) {
        if (id === 'Year') {
            if(value === '' || value < 1895 || value > 2100){
                this.setState({yearError: 'Fill Year with correct year(1895 - 2100)',
                                canSubmit: false})
            } else {
                this.setState({yearError: '',
                                canSubmit: true});
            }
        } 
    }

    componentDidMount() {
      this.getTopMovies();
    }

    getTopMovies() {
      const requestOptions = sharedGetRequestOptions;

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/movies/tops`, requestOptions)
        .then(sharedResponse)
        .then(data => {
          if (data) {
            this.setState({ movies: data, isLoading: false });
            }
        })
        .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    getTopMoviesByYear() {
        const {Year} = this.state;
        const requestOptions = sharedGetRequestOptions;
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/movies/tops/${Year}`, requestOptions)
          .then(sharedResponse)
          .then(data => {
            if (data) {
              this.setState({ movies: data, isLoading: false });
              }
          })
          .catch(response => {
              this.setState({isLoading: false});
              NotificationManager.error(response.message || response.statusText);
              this.setState({ submitted: false });
          });
      }

    fillTableWithDaata() {
        return this.state.movies.map(movie => {
            const result = Math.round(movie.rating);
            return <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{result}/10</td>
                        <td>{movie.year}</td>
                    </tr>
        })
    }

    render() {
        const {isLoading, Year, yearError} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Rating</th>
                                <th>Year</th>
                            </tr>
                            </thead>
                            <tbody>
                                {rowsData}
                            </tbody>
                        </Table>);
        const showTable = isLoading ? <Spinner></Spinner> : table;
                            
        return (
            <React.Fragment>
                <Container>
                    <Row className="no-gutters pt-2 pr-5 pl-5">
                        <Col>
                            <form onSubmit={this.handleSubmit}>
                            <h1 className="form-header ml-2">Top 10 Movies</h1>
                            <FormGroup>
                                <Form.Label>For year:</Form.Label>
                                <FormControl
                                    id="Year"
                                    type="number"
                                    placeholder="Year"
                                    value={Year}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{yearError}</FormText>
                                <Button type="submit" block>Top</Button>
                            </FormGroup>
                            </form>
                        </Col>
                    </Row>
                    <Row className="no-gutters pr-5 pl-5">
                        {showTable}
                    </Row>
                </Container>
            </React.Fragment>
        );
      }
}

export default TopMovies;