import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
// components
import Header from './components/Header';
import ProjectionDetails from './components/user/ProjectionDetails';
import AllProjectionsForCinema from './components/user/AllProjectionsForCinema';
import TopMovies from './components/user/TopMovies'
import Dashboard from './components/admin/Dashboard';
import FilterProjections from './components/user/FilterProjections';
import MovieSearch from './components/user/MovieSearch';
import UserProfile from './components/user/UserProfile';

// higher order component
import { SuperUserRoute } from './components/hoc/SuperUserRoute';


function App() {
  return (
    <React.Fragment>
      <Header/>
        <div className="set-overflow-y app-content-main bcg-image">
          <Switch>
            <Redirect exact from="/" to="projectionlist" />
            <Route path="/UserProfile" component={UserProfile} />
            <Route path="/projectiondetails/:id" component={ProjectionDetails} />
            <Route path="/projectionlist" component={AllProjectionsForCinema} />
            <Route path="/topten" component={TopMovies} />
            <Route path="/FilterProjections" component={FilterProjections} />
            <Route path="/MovieSearch" component={MovieSearch} />
            <SuperUserRoute path="/dashboard" component={Dashboard} />
          </Switch>
          <NotificationContainer />
        </div>
    </React.Fragment>
  );
}

export default App;
