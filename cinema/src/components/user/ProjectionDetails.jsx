import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Projection } from './Projection';

class ProjectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        auditorium: [],
        row: null,
        seat: null,
        submitted: false,
        canSubmit: true,
        movies: [],
    };

    for (var i = 0; i < 5; i++) {
      this.state.auditorium.push([]);
      for (var j = 0; j < 26; j++) {
        this.state.auditorium[i].push({clicked: false});
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //this.getMovie();
    const { id } = this.props.match.params
    console.log("ProjectionId in projectionDitails: ");
    console.log(id);
  }

  handleClick(row, seat) {
    this.state.auditorium[row][seat].clicked = !this.state.auditorium[row][seat].clicked;
    this.forceUpdate();
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 26; j++) {
        if (this.state.auditorium[i][j].clicked === true) {
          this.makePayment();
        }
        else {
          this.setState({ submitted: false });
        }
      }
    }
    if(this.state.submitted === false) {
      NotificationManager.error('Please, choose seats by clicking on them.');
    }
  }

  getProjection() {
    // TO DO: here you need to fetch movie with projection details using ID from router
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };

    fetch(`${serviceConfig.baseURL}/movies/261e3562-5f7b-418f-61a6-08d797a6bf42`, requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
      }
      return response.json();
      })
      .then(data => {
          if (data) {
              // this.setState({ posts: data });
          }
      })
      .catch(response => {
          NotificationManager.error(response.message || response.statusText);
          this.setState({ submitted: false });
      });
  }
  
  renderRows(rows, seats) {
    const rowsRendered = [];
    for (let i = 0; i < rows; i++) {
        rowsRendered.push( <tr key={i}>
            {this.renderSeats(seats, i)}
        </tr>);
    }
    return rowsRendered;
  }

  renderSeats(seats, row) {
      let renderedSeats = [];
    
      for (let i = 0; i < seats; i++) {
          renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}
                                id={'row: ' + row + ', seat: ' + i}
                                className={this.state.auditorium[row][i].clicked ? "want-to-reserve" : "is-not-reserved"}
                                onClick={this.handleClick.bind(this, row, i)}
                                ></td>);
      }
      
      return renderedSeats;
  }

  render() {
  const auditorium = this.renderRows(5,26);
  const { submitted, canSubmit } = this.state;

      return (
        <Container>
          <Row className="justify-content-center">
            <Col>
              <Card className="mt-5 card-width">
                <Card.Body>
                <Card.Title><span className="card-title-font">Star Wars: Last jedi</span> <span className="float-right">Rating: 9/10</span></Card.Title>
                    <hr/>
                    <Card.Subtitle className="mb-2 text-muted">Year of production: 2012 <span className="float-right">Time of projection: 18.10.2020 15:25</span></Card.Subtitle>
                    <hr/>
                  <Card.Text>
                  <Row className="mt-2">
                    <Col className="justify-content-center align-content-center">
                        <h4>Chose your seat(s)</h4>
                        <div>
                        <Row className="justify-content-center mb-4">
                            <div className="text-center text-white font-weight-bold cinema-screen">
                                CINEMA SCREEN
                            </div>
                        </Row>
                        <Row>
                          <Badge variant="primary" className="mx-2">Available seats</Badge>
                          <Badge variant="warning" className="mx-2">Reserved seats</Badge>
                        </Row>
                        <Row className="justify-content-center">
                            <table className="table-cinema-auditorium">
                            <tbody>
                            {auditorium}
                            </tbody>
                            </table>
                        </Row>
                        </div>
                    </Col>
                  </Row>
                  <hr/>
                  </Card.Text>
                  <Row className="justify-content-center font-weight-bold">
                    Price for reserved seats:  800 RSD
                  </Row>
                  <Row className="pt-2">
                    <form onSubmit={this.handleSubmit}>
                      <Button type="submit" disabled={submitted || !canSubmit} className="font-weight-bold" block>Pay for tickets and make reservations</Button>
                    </form>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
}

export default ProjectionDetails;