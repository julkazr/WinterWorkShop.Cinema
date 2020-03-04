import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Row, Table, Col, FormControl, FormGroup, Button, FormText } from 'react-bootstrap';
import Spinner from '../Spinner';

class TopMovies extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          isLoading: true,
          Year: 0,
          yearError:'',
          submitted: false,
          canSubmit: true
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { id, value } = e.target;
        console.log(id + " " + value)
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    
    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { Year } = this.state;
        if (Year) {
            this.getTopMoviesByYear();
        } else {
            NotificationManager.error('Please fill form with data.');
            this.setState({ submitted: false });
        }
    }

    validate(id, value) {
        if (id === 'Year') {
            if(value === '' || value < 1895 || value > 2100){
                this.setState({yearError: 'Fill Year',
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
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/movies/tops`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
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
        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/movies/tops/${Year}`, requestOptions)
          .then(response => {
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
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
            return <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.rating}/10</td>
                        <td>{movie.year}</td>
                    </tr>
        })
    }

    render() {
        const {isLoading, Year, submitted, canSubmit, yearError} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                {/* <th>Id</th> */}
                                <th>Title</th>
                                <th>Rating</th>
                                <th>Year</th>
                                {/* <th>Is Current</th> */}
                            </tr>
                            </thead>
                            <tbody>
                                {rowsData}
                            </tbody>
                        </Table>);
        const showTable = isLoading ? <Spinner></Spinner> : table;
                            
        return (
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <Col>
                        <form onSubmit={this.handleSubmit}>
                        <h1 className="form-header ml-2">Top 10 Movies</h1>
                        <FormGroup>
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
            </React.Fragment>
        );
      }
}

export default TopMovies;