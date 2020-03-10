import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Switch, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faFilm, faVideo, faTicketAlt, faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';

// Admin actions
import NewMovie from './MovieActions/NewMovie';
import EditMovie from './MovieActions/EditMovie';
import ShowAllMovies from './MovieActions/ShowAllMovies';
import NewCinema from './CinemaActions/NewCinema';
import ShowAllCinemas from './CinemaActions/ShowAllCinemas';
import NewAuditorium from './AuditoriumActions/NewAuditorium';
import ShowAllAuditoriums from './AuditoriumActions/ShowAllAuditoriums';
import ShowAllProjections from './ProjectionActions/ShowAllProjections';
import NewProjection from './ProjectionActions/NewProjection';
import EditCinema from './CinemaActions/EditCinema';
import EditAuditorium from './AuditoriumActions/EditAuditorium';
import EditProjection from './ProjectionActions/EditProjection'

// higher order component
import { PrivateRouteAdmin } from '../hoc/privateRouteAdmin';
import { SuperUserRoute } from '../hoc/SuperUserRoute';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: []
        };
        this.getUser = this.getUser.bind(this);
    }
    getUser() {
        const username = localStorage.getItem('username');
      
        const requestOptions = {
              method: 'GET',
              headers: { 'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
            };
      
        fetch(`${serviceConfig.baseURL}/api/users/byusername/` + username, requestOptions)
            .then(response => {
              if(!response.ok) {
                return Promise.reject(response);
              }
              return response.json();
            })
            .then(data => {
              if(data) {
                this.setState({user: data});
              }
            })
            .catch(response => {
              NotificationManager.error(response.message || response.statusText);
            });
      }
    renderForAdmin(user) {
        const Rendered = [];
        Rendered.push(<Row className="justify-content-center mt-2">
        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faFilm}/>Movie</span>
        </Row>)
        Rendered.push(<Row className="justify-content-center mt-2">
        <NavLink activeClassName="active-link" to='/dashboard/AllMovies'><FontAwesomeIcon className='text-primary mr-1' icon={faList}/>All Movies</NavLink>
        </Row>)
        Rendered.push(<Row className="justify-content-center mt-2">
        <NavLink activeClassName="active-link" to='/dashboard/NewMovie'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Add Movie</NavLink>
        </Row>)
        Rendered.push(<Row className="justify-content-center">
        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faBinoculars}/>Auditorium</span>
        </Row>)
        Rendered.push(<Row className="justify-content-center mt-2">
        <NavLink activeClassName="active-link" to='/dashboard/AllAuditoriums'><FontAwesomeIcon className='text-primary mr-1' icon={faList}/>All Auditoriums</NavLink>
        </Row>)
        Rendered.push(<Row className="justify-content-center mt-2">
        <NavLink activeClassName="active-link" to='/dashboard/NewAuditorium'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Add Auditorium</NavLink>
        </Row>)
        Rendered.push(<Row className="justify-content-center">
        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faTicketAlt}/>Cinema</span>
        </Row>)
        Rendered.push(<Row className="justify-content-center mt-2">
        <NavLink activeClassName="active-link" to='/dashboard/AllCinemas'><FontAwesomeIcon className='text-primary mr-1' icon={faList}/>All Cinemas</NavLink>
        </Row>)
        Rendered.push(<Row className="justify-content-center mt-2">
        <NavLink activeClassName="active-link" to='/dashboard/NewCinema'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Add Cinema</NavLink>
        </Row>)

        return (user.isAdmin ? Rendered : null);
      }

    render() {
        const { user } = this.state;
        this.getUser();
        let Rendered = this.renderForAdmin(user);
        return (
            <Row className="justify-content-center no-gutters">
                <Col lg={2} className="dashboard-navigation">
                    {Rendered}                       
                    <Row className="justify-content-center">
                        <span className="fa-2x text-white"><FontAwesomeIcon className="text-white mr-2 fa-1x" icon={faVideo}/>Projection</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/AllProjections'><FontAwesomeIcon className='text-primary mr-1' icon={faList}/>All Projections</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NewProjection'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus}/>Add Projection</NavLink>
                    </Row>
                </Col>
                <Col className="pt-2 app-content-main">
                    <Switch>
                        <PrivateRouteAdmin path="/dashboard/NewMovie" component={NewMovie} />
                        <PrivateRouteAdmin path="/dashboard/AllMovies" component={ShowAllMovies} />
                        <PrivateRouteAdmin path="/dashboard/EditMovie/:id" component={EditMovie} />
                        <PrivateRouteAdmin path="/dashboard/NewCinema" component={NewCinema} />
                        <PrivateRouteAdmin path="/dashboard/AllCinemas" component={ShowAllCinemas} />
                        <PrivateRouteAdmin path="/dashboard/EditCinema/:id" component={EditCinema} />
                        <PrivateRouteAdmin path="/dashboard/NewAuditorium" component={NewAuditorium} />
                        <PrivateRouteAdmin path="/dashboard/AllAuditoriums" component={ShowAllAuditoriums} />
                        <PrivateRouteAdmin path="/dashboard/EditAuditorium/:id" component={EditAuditorium} />
                        <SuperUserRoute path="/dashboard/AllProjections" component={ShowAllProjections} />
                        <SuperUserRoute path="/dashboard/EditProjection/:id" component={EditProjection} />
                        <SuperUserRoute path="/dashboard/NewProjection" component={NewProjection} />
                    </Switch>
                </Col>
            </Row>
        );
      }
}

export default Dashboard;