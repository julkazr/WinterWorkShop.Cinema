import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Row, Table } from 'react-bootstrap';
import Spinner from '../Spinner';

class TopMovies extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          isLoading: true
      };
      
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

    fillTableWithDaata() {
        return this.state.movies.map(movie => {
            return <tr key={movie.id}>
                        {/* <td>{movie.id}</td> */}
                        <td>{movie.title}</td>
                        <td>{movie.rating}/10</td>
                        <td>{movie.year}</td>
                        {/* <td>{movie.current ? 'Yes' : 'No'}</td> */}
                    </tr>
        })
    }

    render() {
        const {isLoading} = this.state;
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
                    <h1 className="form-header ml-2">Top 10 Movies (by rating)</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {showTable}
                </Row>
            </React.Fragment>
        );
      }
}

export default TopMovies;