import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import Projection from './Projection';
import { Row, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import Spinner from '../Spinner';

class AllProjectionsForCinema extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          cinemas: [],
          isLoading: true,
          //submitted: false
      };
      this.handleSubmit = this.handleSubmit(this);

    }

    componentDidMount() {
      // this.getProjections();
    }

    getProjections() {
      // TO DO here you need to change this part and query, and fetch movies with projections, and in future add fetch by cinema name
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      fetch(`${serviceConfig.baseURL}/api/Movies/current`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          NotificationManager.success('Successfuly fetched data');
          if (data) {
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        })
    }

    getCinemas() {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
      };

      fetch(`${serviceConfig.baseURL}/api/cinemas/all`, requestOptions)
        .then(response => {
          if(!response.ok) {
            return Promise.reject(response);
          }
          return response.json();
        })
        .then(data => {
          if(data) {
            this.setState({ cinemas: data, isLoading: false});
          }
        })
        .catch(response => {
          this.setState({isLoading: false});
          NotificationManager.error(response.message || response.statusText);
          //this.setState({ submitted: true });
        })
    }

    render() {
        return (
          <div className="no-gutters">
            <Row className="no-gutters">
            </Row>
            <Row>
              <Col>
                <form onSubmit={this.handleSubmit}>

                </form>
              </Col>
            </Row>
            <Row className="no-gutters set-overflow-y">
              <Projection></Projection>
              <Projection></Projection>
              <Projection></Projection>
              <Projection></Projection>
              <Projection></Projection>
            </Row>
          </div>
        );
      }
}

export default AllProjectionsForCinema;