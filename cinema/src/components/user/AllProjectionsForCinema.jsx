import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import Projection from './Projection';
import { Row, Col, Container, FormText, Button } from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { sharedGetRequestOptions, sharedResponse } from './../helpers/shared';

class AllProjectionsForCinema extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: null,
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

      this.handleChange = this.handleChange.bind(this);
      this.getProjectionsForAuditorium = this.getProjectionsForAuditorium.bind(this);
    }

    componentDidMount() {
      this.getCinemas();
    }

    handleChange(e) {
      const { id, value } = e.target;
      this.setState({ [id]: value });
      this.validate(id, value);
    }

    onAuditoriumChange(auditoriums) {
        if(auditoriums[0]) {
            this.setState({auditoriumId: auditoriums[0].id});
            this.validate('auditoriumId', auditoriums[0].id);

            
        } else {
            this.setState({auditoriumId: ''});
            this.validate('auditoriumId', '');
        }

    }

    onCinemaChange(cinemas) {
        if(cinemas[0]) {
            this.setState({cinemaId: cinemas[0].id});
            this.validate('cinemaId', cinemas[0].id);

        } else {
            this.setState({cinemaId: ''});
            this.validate('cinemaId', '');
        }
    }
  
    validate(id, value) {
      if (id === 'cinemaId') {
          if (value === '') {
              this.setState({cinemaIdError: 'Please choose cinema'
                              })
                              
          } else {
              this.setState({cinemaIdError: ''
                             });
          }
      }
      else if (id === 'auditoriumId') {
          if (!value) {
              this.setState({auditoriumIdError: 'Please choose auditorium'
                              })
          } else {
              this.setState({auditoriumIdError: ''
                              });
          }
      }
    }

    getCinemas() {
      const requestOptions = sharedGetRequestOptions;

      fetch(`${serviceConfig.baseURL}/api/cinemas/all`, requestOptions)
        .then(sharedResponse
        )
        .then(data => {
          if(data) {
            this.setState({ cinemas: data, isLoading: false});
          }
        })
        .catch(response => {
          this.setState({isLoading: false});
          //NotificationManager.error(response.message || response.statusText);
        })
    }

    getAuditoriums(cinemaId) {
      const requestOptions = sharedGetRequestOptions;

      fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
          .then(sharedResponse)
          .then(data => {
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
                this.setState({auditoriums: auditoriumsForCinema, isLoading: false});
              }
          })
          .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
          });
    }

    getProjectionsForAuditorium(auditoriumId) {
      this.setState({ movies: null, isLoading: false});
      const requestOptions = sharedGetRequestOptions;

      fetch(`${serviceConfig.baseURL}/api/Movies/movieprojections/` + auditoriumId, requestOptions)
        .then(sharedResponse)
        .then(data => {
            if(data) {
              this.setState({ movies: data, isLoading: false});  
            }
        }) 
        .catch(response => {
          this.setState({isLoading: false});
          NotificationManager.error('Please choose auditorium!');
        });
    }


    
    fillListWithData(movies) {
;
      if(movies) {
        return movies.map((movie, index) => {
          return <Projection key={index} movie={movie}></Projection>
        })
      } 
    }

    render() {
      const { cinemas, auditoriums, cinemaIdError, auditoriumIdError, movies } = this.state;
      
      const list = this.fillListWithData(movies);

        return (
          <React.Fragment>
            <div className="no-gutters">
              <Container>
                <Row>
                  <form onSubmit={this.handleSubmit} className="col-md-12 pt-4">
                    <Row>
                      <Col sm={3}>
                        <Typeahead
                          labelKey="name"
                          options={cinemas}
                          placeholder="Choose a cinema..."
                          id={'cinemaId'}
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
                        <Button onClick={() => this.getProjectionsForAuditorium(this.state.auditoriumId)} className="primary">Find projections</Button>
                      </Col>    
                    </Row>
                  </form>
                </Row>
                <Row className="no-gutters set-overflow-y mt-3">
                  {list} 
                </Row>
                <Row>
                  <h2 className="text-primary font-italic py-3">Comming soon in cinema near you...</h2>
                  <div id="carouselExampleControls" class="carousel slide carousel-style" data-ride="carousel">
                    <div class="carousel-inner">
                      <div class="carousel-item active">
                        <img src="/Images/1.jpg" class="d-block w-100 img-style" alt="First movie" />
                      </div>
                      <div class="carousel-item">
                        <img src="/Images/2.jpg" class="d-block w-100 img-style" alt="..." />
                      </div>
                      <div class="carousel-item">
                        <img src="/Images/3.jpg" class="d-block w-100 img-style" alt="..." />
                      </div>
                      <div class="carousel-item">
                        <img src="/Images/4.jpg" class="d-block w-100 img-style" alt="..." />
                      </div>
                      <div class="carousel-item">
                        <img src="/Images/5.jpg" class="d-block w-100 img-style" alt="..." />
                      </div>
                      <div class="carousel-item">
                        <img src="/Images/6.jpg" class="d-block w-100 img-style" alt="..." />
                      </div>
                      <div class="carousel-item">
                        <img src="/Images/7.jpg" class="d-block w-100 img-style" alt="..." />
                      </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="sr-only">Next</span>
                    </a>
                  </div>
                </Row>
              </Container>
            </div>
          </React.Fragment>
        );
      }
}

export default AllProjectionsForCinema;