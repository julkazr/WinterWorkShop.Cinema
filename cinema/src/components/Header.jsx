import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../appSettings';
import { sharedGetRequestOptions, sharedResponse } from './helpers/shared';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        submitted: false,
        user: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUser = this.getUser.bind(this);
}

componentDidMount() {
  this.getUser();       
}

handleChange(e) {
    const { id, value } = e.target;
    this.setState({ [id]: value });
}


handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username } = this.state;
    
    if (username) {
        this.login();
        this.getUser();
    } else {
        this.setState({ submitted: false });
    }
}

handleLogout(e) {
  e.preventDefault();

  localStorage.removeItem("username");
  localStorage.removeItem("jwt");
  let conf = window.confirm("CONFIRM LOGUT!");
  if(conf){
    window.location.reload(true);
  }
  
}

login() {
    const { username } = this.state;

    const requestOptions = {
        method: 'GET'
    };

    fetch(`${serviceConfig.baseURL}/get-token?name=${username}`, requestOptions)
        .then(sharedResponse)
        .then(data => {
          NotificationManager.success('Successfuly logged in!');
          if (data.token) {
            localStorage.setItem("jwt", data.token);
            localStorage.setItem('username', this.state.username);
            }
            setTimeout(function(){ window.location.reload(true); }, 1000);
        })
        .catch(response => {
            if(response.message === undefined || response.statusText === ""){
              
              NotificationManager.error("There is no user with that username!");
            }else{
              NotificationManager.error(response.message && response.statusText);
            }

            this.setState({ submitted: false });
        });
}
getUser() {
  const username = localStorage.getItem('username');

  const requestOptions = sharedGetRequestOptions;

  fetch(`${serviceConfig.baseURL}/api/users/byusername/` + username, requestOptions)
      .then(sharedResponse)
      .then(data => {
        if(data) {
          this.setState({user: data});
        }
      })
      .catch(response => {
        //NotificationManager.error(response.message && response.statusText);
      });
}

    renderdasboard(user)
    {
        return ((user.isAdmin || user.isSuperUser) ? <Nav.Link href="/dashboard" className={"text-white px-3"}>Dashboard</Nav.Link> : null)
    }

    renderLoginLogoutButton(username, user)
    {

      if(!localStorage.getItem('username')){
        return <Form inline onSubmit={this.handleSubmit}>
                <FormControl type="text" placeholder="Username"
                  id="username"
                  value={username}
                  onChange={this.handleChange}
                  className="mr-sm-2" />
                <Button type="submit" variant="outline-success" className="mr-1">Log In</Button>
                </Form> 
      }
      
      return <Form inline onSubmit={this.handleLogout}>
               <Button type="submit" variant="outline-success" className="mr-1">Log Out</Button>
             </Form>
    }

    renderUserTab(user) {
      let isInRole = '';
      if(user.isAdmin) {
        isInRole = '- admin';
      } else if(user.isSuperUser) {
        isInRole = '- superuser';
      } else {
        isInRole = '';
      }
      if(localStorage.getItem('username')){
        
        return <Nav.Link href="/UserProfile" className="text-white px-3">User: {user.firstName} {isInRole}</Nav.Link>
      }
    }

    render() {
      const { username, user } = this.state;
      let dasboard = this.renderdasboard(user);
      let loginLogout = this.renderLoginLogoutButton(username, user);
      let userTab = this.renderUserTab(user);
      console.log(user);

        return (
            <Navbar bg="dark" expand="lg">
            <Navbar.Brand className="text-info font-weight-bold text-capitalize"><Link className="text-decoration-none" to='/projectionlist'>Cinema 9</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-white" />
            <Navbar.Collapse id="basic-navbar-nav" className="text-white">
              <Nav className="mr-auto" >
              
              <Nav.Link href="/topten" className="text-white px-3">Top 10 Movies</Nav.Link>
              <Nav.Link href="/FilterProjections" className="text-white px-3">Filter Projections</Nav.Link>
              <Nav.Link href="/MovieSearch" className="text-white px-3">Movies Search</Nav.Link>
              {dasboard}
              </Nav>
              {userTab}
              {loginLogout}
            </Navbar.Collapse>
          </Navbar>
        );
      }
}

export default Header;