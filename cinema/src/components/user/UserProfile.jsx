import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Card, Container } from 'react-bootstrap';
import { sharedGetRequestOptions, sharedResponse } from './../helpers/shared';

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
    
        const requestOptions = sharedGetRequestOptions;
    
        fetch(`${serviceConfig.baseURL}/api/users/byusername/` + username, requestOptions)
            .then(sharedResponse)
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
            <React.Fragment>
              <Container>
                <Card className="mt-5 central-position">
                  <Card.Img variant="top" src="/Images/user.png" className="user-img" />
                  <Card.Body>
                    <Card.Title className="text-center">User info</Card.Title>
                    <Card.Text>
                      <p className="float-left font-weight-bold">First name:</p><span className="float-right">{user.firstName}</span>
                      <div className="clearfix"></div>
                      <hr />
                      
                      <p className="float-left font-weight-bold">Last name:</p><span className="float-right">{user.lastName}</span>
                      <div className="clearfix"></div>
                      <hr />
                      <p className="float-left font-weight-bold">Username:</p><span className="float-right">{user.userName}</span>
                      <div className="clearfix"></div>
                      <hr />
                      <p className="float-left font-weight-bold">Bonus:</p><span className="float-right">{user.bonus}</span>
                      <div className="clearfix"></div>
                      <hr />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Container>
            </React.Fragment>
          );
      }
}

export default UserProfile;