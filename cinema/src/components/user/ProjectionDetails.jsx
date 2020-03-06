import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

class ProjectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        seats: [],
        auditorium: [],
        submitted: false,
        canSubmit: true,
        projection: [],
        movieTitle: '',
        movieYear: null,
        movieRating: null,
        user: [],
        seatsWantToReserve: []
    };

    for (var i = 0; i < this.state.projection.auditoriumRowNumber; i++) {
      this.state.auditorium.seatsList.push([]);
      for (var j = 0; j < this.state.projection.auditoriumSeatNumber; j++) {
        this.state.auditorium.seatsList[i][j].push({clicked: false});
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params
    this.getProjection(id);
    this.getUser();
   
  }

  handleClick(seat) {
    seat.clicked = !seat.clicked;
    this.forceUpdate();
    let seatToReserve = this.state.seatWantToReserve;
    if(seat.clicked) {
      
      if(seatToReserve === undefined) {
        seatToReserve = [seat.id]
      } else {
        seatToReserve.push(seat.id);
      }
      
      
    } else {
      let index = seatToReserve.indexOf(seat.id);
      seatToReserve.splice(index, 1);
    }
    console.log("seats u varijabli");
    console.log(seatToReserve);
    this.setState({seatWantToReserve: seatToReserve});
    this.checkForReservation(seatToReserve);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    if(this.state.seatsWantToReserve) {
      this.reserveSeats();
    } else {
      NotificationManager.error('Please click on seats...');
      this.setState({ submitted: false });
    }
  }

  getProjection(projectionId) {
    // TO DO: here you need to fetch movie with projection details using ID from router
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    };

    fetch(`${serviceConfig.baseURL}/api/projections/getwithauditorium/` + projectionId, requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
      }
      return response.json();
      })
      .then(data => {
          if (data) {
              this.setState({ projection: data,
                              movieTitle: data.projection.movieTitle,
                              movieYear: data.movie.year,
                              movieRating: data.movie.rating,
                              auditorium: data.auditorium });
          }
          console.log("data");
          console.log(data);
      })
      .catch(response => {
          NotificationManager.error(response.message || response.statusText);
          this.setState({ submitted: false });
      });
  }

  getUser() {
    const username = localStorage.getItem('username');
    console.log("User: ");
    console.log(username);

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
          console.log("User data:");
          console.log(this.state.user);
        })
        .catch(response => {
          NotificationManager.error(response.message || response.statusText);
        });
  }

  checkForReservation(seatIds) {
    const data = {
      listOfSeatsId: seatIds
    }
    console.log("data from check method:");
    console.log(data);
    const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
          body: JSON.stringify(data)
        };
    console.log("rekvest opsns");
    console.log(requestOptions.body);
    fetch(`${serviceConfig.baseURL}/api/Reservations/check`, requestOptions)
        .then(response => {
          console.log("response");
          console.log(response);
          if(!response.ok) {
            return Promise.reject(response);
          }
          return response.statusText;
        })
        .then(result => {
            NotificationManager.success('Seat can be reserved!');
        })
        .catch(response => {
          NotificationManager.error(response.message || response.statusText);
        });
  }

  reserveSeats() {
    console.log("Sedista za rezervaciju");
    console.log(this.state.seatWantToReserve);
    const data = {
      projectionId: this.state.projection.projection.id,
      userId: this.state.user.id,
      seatsToReserveID: this.state.seatWantToReserve
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
      body: JSON.stringify(data)
    };
    fetch(`${serviceConfig.baseURL}/api/Reservations/reserve`, requestOptions)
      .then(response => {
        if(!response.ok) {
          return Promise.reject(response);
        }
        return response.statusText;
      })
      .then(result => {
        NotificationManager.success('Your seats are reserved!');
        window.location.reload(true);
      })
      .catch(response => {
        NotificationManager.error(response.message || response.statusText);
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
        let k = 0;
        for(let j = 0; j < this.state.auditorium.seatsList.length; j ++) {

            if(this.state.auditorium.seatsList[j].number === i + 1 && this.state.auditorium.seatsList[j].row === row + 1)
            {
              k = j;
            }
        }  
          renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}
                                className={this.state.auditorium.seatsList[k].clicked === true ? "want-to-reserve" : "is-not-reserved"}
                                onClick={this.handleClick.bind(this, this.state.auditorium.seatsList[k])}
                                ></td>);
      }
    
      return renderedSeats;
     

    }

  getRoundedRating(rating) {
    const result = Math.round(rating);
    return <span className="float-right">Rating: {result}/10</span>
}

  render() {
  
  const auditorium = this.renderRows(this.state.projection.auditoriumRowNumber, this.state.projection.auditoriumSeatNumber);
  const { submitted, canSubmit, movieTitle, movieYear, seats } = this.state;
  const rating = this.getRoundedRating(this.state.movieRating);
  console.log("Auditorium renderovan:");
  console.log(auditorium);
      return (
        <Container>
          <Row className="justify-content-center">
            <Col>
              <Card className="mt-5 card-width">
                <Card.Body>
                <Card.Title><span className="card-title-font">{movieTitle}</span> <span className="float-right"> {rating}</span></Card.Title>
                    <hr/>
                    <Card.Subtitle className="mb-2 text-muted">Year of production: {movieYear} <span className="float-right">Time of projection: 18.10.2020 15:25</span></Card.Subtitle>
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
                  <form onSubmit={this.handleSubmit}>
                    <Row className="pt-2">
                      {/* <Col sm={6}>
                        <Button  onClick={this.checkForReservation} className="font-weight-bold" block>Check if seats can be reserved</Button>
                      </Col> */}
                      <Col sm={12}>
                        <Button type="submit" disabled={submitted || !canSubmit} className="font-weight-bold" block>Pay for tickets and make reservations</Button>
                      </Col> 
                    </Row> 
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
}

export default ProjectionDetails;