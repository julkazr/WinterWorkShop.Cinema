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

// higher order component
import { PrivateRouteAdmin } from './components/hoc/privateRouteAdmin';

function App() {
  return (
    <React.Fragment>
      <Header/>
      <div className="set-overflow-y">
      <Switch>
        <Redirect exact from="/" to="projectionlist" />
        <Route path="/projectiondetails/:id" component={ProjectionDetails} />
        <Route path="/projectionlist" component={AllProjectionsForCinema} />
        <Route path="/topten" component={TopMovies} />
        <Route path="/FilterProjections" component={FilterProjections} />
        <Route path="/MovieSearch" component={MovieSearch} />
        <PrivateRouteAdmin path="/dashboard" component={Dashboard} />
      </Switch>
      <NotificationContainer />
      </div>
    </React.Fragment>
  );
}

export default App;
