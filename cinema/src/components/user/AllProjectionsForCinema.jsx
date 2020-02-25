import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import Projection from './Projection';
import { Row, Col, Container, FormText, Button } from 'react-bootstrap';
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
      // this.getProjections();
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

    // onProjectionsForAuditoriumChange(projection) {
    //     if(projection[0]) {
    //         this.setState({projectionId: projection[0].id});
    //         this.validate('projectionId', projection[0]);
    //         console.log(projection[0].id);
    //     } else {
    //         this.setState({projectionId: null});
    //         this.validate('projectionId', null);
    //     }
    // }
  
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
    // else if (id === 'movieId') {
    //     if (!value) {
    //         this.setState({movieIdError: '',
    //                         canSubmit: false})
    //     } else {
    //         this.setState({movieIdError: '',
    //                         canSubmit: true});
    //     }
    // }
}

    // getProjections() {
    //   // TO DO here you need to change this part and query, and fetch movies with projections, and in future add fetch by cinema name
    //   const requestOptions = {
    //     method: 'GET',
    //     headers: {'Content-Type': 'application/json',
    //                   'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    //   };

    //   fetch(`${serviceConfig.baseURL}/api/Movies/current`, requestOptions)
    //     .then(response => {
    //       if (!response.ok) {
    //         return Promise.reject(response);
    //     }
    //     return response.json();
    //     })
    //     .then(data => {
    //       NotificationManager.success('Successfuly fetched data');
    //       //console.log(data);
    //       if(data) {
    //         let projectionsForMovie = [];
    //         data.forEach(item => {
    //           if(item.auditoriumId === auditoriumId) {
    //             projectionsForAuditorium.push(item);
    //             //console.log(item.auditoriumId);
    //           }
              
              
    //         });
    //         console.log(projectionsForAuditorium);
    //           this.setState({projections: projectionsForAuditorium});
              
    //       }
    //     })
    //     .catch(response => {
    //         NotificationManager.error(response.message || response.statusText);
    //         this.setState({ submitted: false });
    //     })
    // }

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
                this.setState({auditoriums: auditoriumsForCinema});
              }
          })
          .catch(response => {
              NotificationManager.error(response.message || response.statusText);
          });
  }

  getProjectionsForAuditorium(auditoriumId) {
    console.log(auditoriumId);
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/projections/all`, requestOptions)
      .then(response => {
          if(!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
      })
      .then(data => {
          if(data) {
            let projectionsForAuditorium = [];
            data.forEach(item => {
              if(item.auditoriumId === auditoriumId && this.state.projectionTime <= item.projectionTime) {
                projectionsForAuditorium.push(item);
              } 
            });
            console.log(projectionsForAuditorium);
              this.setState({projections: projectionsForAuditorium});
              
          }
      })
      .catch(response => {
          NotificationManager.error(response.message || response.statusText);
      });
  }

    render() {
      const { cinemas, auditoriums, cinemaIdError, auditoriumIdError } = this.state;
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
              <Row className="no-gutters set-overflow-y">
                <Projection></Projection>
                <Projection></Projection>
                <Projection></Projection>
                <Projection></Projection>
                <Projection></Projection>
              </Row>
            </Container>
          </div>
        );
      }
}

export default AllProjectionsForCinema;