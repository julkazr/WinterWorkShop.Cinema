import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import classNames from 'classnames';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            canSubmit: true,
            user: []
        };
    }

    componentDidMount() {
        this.getUser();       
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

      render() {
          const {user} = this.state;
          console.log({user})
          return (
              <Table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>{user.firstName}</th>
                    </tr>
                </thead>
                <thead>
                  <tr>
                    <th>Last Name</th>
                    <th>{user.lastName}</th>
                    </tr>
                </thead>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>{user.userName}</th>
                    </tr>
                </thead>
                <thead>
                  <tr>
                    <th>Bonus</th>
                    <th>{user.bonus}</th>
                  </tr>
                </thead>
              </Table>
          );
      }
}

export default UserProfile;