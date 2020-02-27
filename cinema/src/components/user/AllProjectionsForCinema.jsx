import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import Projection from './Projection';
import { Row, Col, Container, FormText, Button, Table } from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons';
//import Spinner from '../Spinner';

class AllProjectionsForCinema extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          cinemas: [],
          auditoriums: [],
          projections: [],
          projectionTime: new Date().toISOString(),
          cinemaId: null,
          auditoriumId: null,
          projectionsId: null,
          movieId: null,
          cinemaIdError: '',
          auditoriumIdError: '',     
          isLoading: true,
          submitted: false,
          canSubmit: true
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.getProjections();
      this.getCinemas();
      //this.getAuditoriums(this.state.cinemaId);
      //this.getProjectionsForAuditorium(this.state.auditoriumId);
    }

    handleChange(e) {
      const { id, value } = e.target;
      this.setState({ [id]: value });
      this.validate(id, value);
    }

    handleSubmit(e) {
      e.preventDefault();

      this.setState({ submitted: true });
      const { cinemaId, auditoriumId } = this.state;
      if (!cinemaId || !auditoriumId) {
          NotificationManager.error('Please fill form with data.');
          this.setState({ submitted: false });
      }
      
  }

    onAuditoriumChange(auditorium) {
        if(auditorium[0]) {
            this.setState({auditoriumId: auditorium[0].id});
            this.validate('auditoriumId', auditorium[0].id);
            console.log(auditorium[0].id, this.state.projectionTime);
            
        } else {
            this.setState({auditoriumId: null});
            this.validate('auditoriumId', null);
        }
        console.log(this.state.auditoriumId);
    }

    onCinemaChange(cinema) {
        if(cinema[0]) {
            this.setState({cinemaId: cinema[0].id});
            this.validate('cinemaId', cinema[0].id);
            console.log(cinema[0].id);
        } else {
            this.setState({cinemaId: null});
            this.validate('cinemaId', null);
        }
    }
  
  validate(id, value) {
    if (id === 'cinemaId') {
        if (value === '') {
            this.setState({cinemaIdError: 'Please choose cinema',
                            canSubmit: false})
                            
        } else {
            this.setState({cinemaIdError: '',
                            canSubmit: true});
        }
        console.log('CinemaError: ' + this.state.cinemaIdError);
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
  }

  getProjections() {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    this.setState({isLoading: true});
    fetch(`${serviceConfig.baseURL}/api/Projections/all`, requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
      }
      return response.json();
      })
      .then(data => {
        if (data) {
            console.log(data)
          this.setState({ projections: data, isLoading: false });
          }
      })
      .catch(response => {
          this.setState({isLoading: false});
          NotificationManager.error(response.message || response.statusText);
      });
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
        })
    }

    getAuditoriums(cinemaId) {
      console.log(cinemaId);
      const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
          .then(response => {
              if(!response.ok) {
                  return Promise.reject(response);
              }
              return response.json();
          })
          .then(data => {
            console.log(data);
              if(data) {
                let auditoriumsForCinema = [];
                if(cinemaId) {
                  data.forEach(item => {
                    if(item.cinemaId === cinemaId) {
                      auditoriumsForCinema.push(item);
                    }
                    
                  });
                } else {
                  data.forEach(item => {
                    
                      auditoriumsForCinema.push(item);
                   }) 
                }
                
                console.log(auditoriumsForCinema);
                this.setState({auditoriums: auditoriumsForCinema,
                               });
                console.log(this.state.auditorium);
              }
          })
          .catch(response => {
              NotificationManager.error(response.message || response.statusText);
          });
  }

  getProjectionsForAuditorium(auditoriumId) {
    
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/Movies/movieprojections/` + auditoriumId, requestOptions)
      .then(response => {
          if(!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
      })
      .then(data => {
          if(data) {
            NotificationManager.success('Successfuly fetched data!');
              this.setState({ movies: data });   
              //this.fillListWithData(this.state.movies);
          }
          console.log(this.state.movies);
      }) 
      .catch(response => {
          NotificationManager.error(response.message || response.statusText);
      });
  }

  fillListWithData(movies) {
    console.log(movies);
    // if(this.state.movies != []) {
    //   for (var i = 0; i < this.state.movies.length; i++) {
    //     console.log(this.state.movies[i]);
    //      return <Projection movie={this.state.movies[i]}></Projection>
    //   }
    // } else {
      if(movies = []) {
        let rows = this.state.projections.map(projection => {
          return (<tr key={projection.id}>
            {/* <td width="18%">{projection.id}</td>
            <td width="18%">{projection.movieId}</td> */}
            <td width="40%">{projection.movieTitle}</td>
            {/* <td width="5%">{projection.auditoriumId}</td> */}
            <td width="40%">{projection.aditoriumName}</td>
            <td width="20%">{projection.projectionTime}</td>
            {/* <td width="5%" className="text-center cursor-pointer" onClick={() => this.editProjection(projection.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
            <td width="5%" className="text-center cursor-pointer" onClick={() => this.removeProjection(projection.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/></td> */}
          </tr>);
          })
        return <Table striped bordered hover size="sm" variant="dark">
                  <thead>
                    <tr>
                        {/* <th>Id</th>
                        <th>Movie Id</th> */}
                        <th>Movie Title</th>
                        {/* <th>Auditorium Id</th> */}
                        <th>Auditorium Name</th>
                        <th>Projection Time</th>
                        {/* <th></th>
                        <th></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </Table>
    
      } else {
        for (var i = 0; i < this.state.movies.length; i++) {
          console.log(this.state.movies[i]);
          return <Projection movie={this.state.movies[i]}></Projection>
        }
      }
  }

    render() {
      const { cinemas, auditoriums, cinemaIdError, auditoriumIdError } = this.state;
      const moviesProjectionsCard = this.fillListWithData(this.state.movies);
        return (
          <div className="no-gutters">
            <Row className="no-gutters">
            </Row>
            <Container>
              <Row>
                <form onSubmit={this.handleSubmit} className="col-md-12 pt-4">
                  <Row>
                    <Col sm={3}>
                      <Typeahead
                        labelKey="name"
                        options={cinemas}
                        placeholder="Choose a cinema..."
                        id="cinemaId"
                        onChange={e => {this.onCinemaChange(e)}}
                        required={true}
                        />
                        <FormText className="text-danger">{cinemaIdError}</FormText>
                    </Col>
                    <Col sm={3}>
                      <Button onClick={this.getAuditoriums.bind(this, this.state.cinemaId)} className="primary">Press and go to auditoriums <FontAwesomeIcon icon={faHandPointRight}/></Button>
                    </Col>
                    <Col sm={4}>
                      <Typeahead
                        labelKey="name"
                        options={auditoriums}
                        placeholder="Choose a auditorium..."
                        id="auditoriumId"
                        onChange={e => {this.onAuditoriumChange(e)}}
                        required={true}
                        />
                        <FormText className="text-danger">{auditoriumIdError}</FormText>
                    </Col>
                    <Col sm={2}>
                      <Button onClick={this.getProjectionsForAuditorium.bind(this, this.state.auditoriumId)} className="primary">Find projections</Button>
                    </Col>    
                  </Row>
                </form>
              </Row>
              <Row className="no-gutters set-overflow-y mt-3">
                {/* <Projection></Projection>
                <Projection></Projection>
                <Projection></Projection>
                <Projection></Projection>
                <Projection></Projection> */}
                {moviesProjectionsCard}
              </Row>
            </Container>
          </div>
        );
      }
}

export default AllProjectionsForCinema;