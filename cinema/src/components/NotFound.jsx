import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';

class NotFound extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
      return (
        <React.Fragment>
          <Container>
            <Row className="d-flex justify-content-center align-items-cente">
              <h1 style={{color: "red", margin: "160px", "font-size": "60px"}}>404 NOT FOUND</h1>
            </Row>
          </Container>
        </React.Fragment>
      );
    }
}

export default withRouter(NotFound);