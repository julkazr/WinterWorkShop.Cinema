import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import classNames from 'classnames';

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
        seatsWantToReserve: [],
        reservedSeats: [],
        tickets: [],
        ticketsInfo: [],
        canReserved: false
    };

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
    let seatTicket = this.state.ticketsInfo;
    let seats = this.state.auditorium.seatsList;
    console.log(seats);
    if(seat.clicked) {
      
      if(seatToReserve === undefined) {
        seatToReserve = [seat.id];
        seatTicket = [seat];
      } else {
        seatToReserve.push(seat.id);
        seatTicket.push(seat);
        for(let i = 0; i < seatToReserve.length; i ++)
        {
          for(let j = 0; j < this.state.auditorium.seatsList.length; j ++)
          {
            if(seatToReserve[i] === this.state.auditorium.seatsList[j].id)
            {
              for(let k = i+1; k < seatToReserve.length; k ++)
              {
                for(let t = 0; t < this.state.auditorium.seatsList.length; t ++)
                {
                  if(seatToReserve[k] === this.state.auditorium.seatsList[t].id)
                  {
                      if(this.state.auditorium.seatsList[t].number < this.state.auditorium.seatsList[j].number)
                      {
                        let sw = seatToReserve[k];
                        seatToReserve[k] = seatToReserve[i];
                        seatToReserve[i] = sw;
                        sw = seatTicket[k];
                        seatTicket[k] = seatTicket[i];
                        seatTicket[i] = sw;
                      }
                  }
                }
              }
            }
          }
        }
      }
 
    } else {
      let index = seatToReserve.indexOf(seat.id);
      seatToReserve.splice(index, 1);
      seatTicket.splice(index, 1);
    }
    this.setState({seatWantToReserve: seatToReserve,
                    ticketsInfo: seatTicket});
    this.checkForReservation(seatToReserve);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    if(this.state.seatsWantToReserve && this.state.canReserved) {
      this.reserveSeats();
      // this.ticketInfoForUser();
    } else if(this.state.seatsWantToReserve && !this.state.canReserved){
      NotificationManager.error('Please, select correct seat(s)');
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
      .then(data => {;
          if (data) {
              this.setState({ projection: data,
                              movieTitle: data.projection.movieTitle,
                              movieYear: data.movie.year,
                              movieRating: data.movie.rating,
                              auditorium: data.auditorium,
                              reservedSeats: data.listOfReservedSeats });
          }
      })
      .catch(response => {
          NotificationManager.error(response.message || response.statusText);
          this.setState({ submitted: false });
      });
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

  checkForReservation(seatIds) {
    const {canReserved} = this.state;
    const data = {
      listOfSeatsId: seatIds
    }

    const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
          body: JSON.stringify(data)
        };

    fetch(`${serviceConfig.baseURL}/api/Reservations/check`, requestOptions)
        .then(response => {
          if(!response.ok) {
            this.setState({canReserved: false});
            NotificationManager.error('Seats can not be reserved.');
            return Promise.reject(response);
          }
          return response.statusText;
        })
        .then(result => {
            this.setState({canReserved: true});
            NotificationManager.success('Seat can be reserved!');
        })
        .catch(response => {
          NotificationManager.error('Seats must be next to eachother. Please uncheck it and try again.');
        });
  }

  reserveSeats() {
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
          NotificationManager.error('Insuficient fonds or error conection');
          window.location.reload(true);
          return Promise.reject(response);
        }
        return response.statusText;
      })
      .then(result => {
        NotificationManager.success('Your seats are reserved!');
        this.ticketInfoForUser(this.state.user, this.state.ticketsInfo);
        //window.location.reload(true);
        
      })
      .catch(response => {
        NotificationManager.error(response.message || response.statusText);
      });
  }

  ticketInfoForUser(user, seat) {
      const username = `${user.firstName} ${user.lastName}`;
      const bonus = user.bonus;
      let ticketsInfo = { username, bonus, seat}
      this.setState({tickets: ticketsInfo});
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
      let reservedSeatsIds = [];
      let reserved;
      let disabled;
      this.state.reservedSeats.forEach(seat => {
        reservedSeatsIds.push(seat.id);
        
      });
      for (let i = 0; i < seats; i++) {   
        let k = 0;
        for(let j = 0; j < this.state.auditorium.seatsList.length; j ++) {

            if(this.state.auditorium.seatsList[j].number === i + 1 && this.state.auditorium.seatsList[j].row === row + 1)
            {
              k = j;
              if (reservedSeatsIds.includes(this.state.auditorium.seatsList[k].id)) {
                reserved = true;
                disabled = true;
              } else {
                reserved = false;
                disabled = false;
              }
            }
        }  
          renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}
                                className={classNames({'is-not-reserved': true,
                                                        'is-reserved': reserved,
                                                        'want-to-reserve': this.state.auditorium.seatsList[k].clicked})}
                                 onClick={disabled ? '' : this.handleClick.bind(this, this.state.auditorium.seatsList[k])}
                                 ></td>);
      }
    
      return renderedSeats;
     

    }

  getRoundedRating(rating) {
    const result = Math.round(rating);
    return <span className="float-right">Rating: {result}/10</span>
  }

  getSeatNumberForTicket() {
    let seatNumbers = [];
    
    if(this.state.ticketsInfo !== []) {
      this.state.ticketsInfo.forEach(seat => {
        seatNumbers.push(seat.number);
      });
      return seatNumbers.map((seat) => {
        return ` ${seat}, `;
      });
    }
    
  }
  
  getSeatsRowForTicket() {
    let seatRow;
    if(this.state.ticketsInfo !== []) {
      this.state.ticketsInfo.forEach(seat => {
        if(seatRow !== seat.row) {
          seatRow = seat.row;
        }      
      });
    }
    return seatRow;
  }

  render() {
  
  const auditorium = this.renderRows(this.state.projection.auditoriumRowNumber, this.state.projection.auditoriumSeatNumber);
  const { submitted, canSubmit, movieTitle, movieYear, tickets } = this.state;
  const rating = this.getRoundedRating(this.state.movieRating);
  const row = this.getSeatsRowForTicket();
  const seatNumbers = this.getSeatNumberForTicket();

      return (
        <React.Fragment>
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
                        <Col sm={12}>
                          <Button type="submit" disabled={submitted || !canSubmit} className="font-weight-bold" block>Pay for tickets and make reservations</Button>
                        </Col> 
                      </Row> 
                    </form>
                    { tickets.seat &&
                    <Row className="justify-content-center">
                      <Col>
                        <Card className="mt-5 card-width">
                          <Card.Body format>
                          
                            <h3>You reservation was success!</h3> 
                          
                            <hr/>
                            <Card.Subtitle className="mb-2 text-muted">Tickets info:</Card.Subtitle>
                              <hr/>
                            <Card.Text>
                                <span className="mb-2 font-weight-bold">
                                Username: {tickets.username} 
                                </span>
                                
                            </Card.Text>
                            <Card.Text>
                              <span className="mb-2 font-weight-bold">
                                Row: {row}
                              </span><br/>
                              <span className="mb-2 font-weight-bold">
                                Seats: {seatNumbers} 
                              </span><br/>
                              <span className="mb-2 font-weight-bold">
                                Bonus: {tickets.bonus}
                              </span><br/>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    } 
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
    }
}

export default ProjectionDetails;