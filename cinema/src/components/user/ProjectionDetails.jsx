import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

class ProjectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        auditorium: [],
        seat: null,
        submitted: false,
        canSubmit: true,
        projection: [],
        movieTitle: '',
        movieYear: null,
        movieRating: null
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
    
  }

  handleClick(seat) {
    // e.preventDefault();
    //seats.forEach(seat => {
      // seatId = seat.id;
      console.log("seat from click funct:");
      console.log(seat);
      seat.clicked = !seat.clicked;
    //});
    //this.state.auditorium.seatsList[id].clicked = !this.state.auditorium.seatsList[id].clicked;
    this.forceUpdate();
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    // for (var i = 0; i < this.state.projection.auditoriumRowNumber; i++) {
    //   for (var j = 0; j < this.state.projection.auditoriumSeatNumber; j++) {
    //     if (this.state.auditorium.seatsList[i][j].clicked === true) {
    //       this.makePayment();
    //     }
    //     else {
    //       this.setState({ submitted: false });
    //     }
    //   }
    // }
    if(this.state.submitted === false) {
      NotificationManager.error('Please, choose seats by clicking on them.');
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
              console.log("Projection from fetch: ");
              console.log(this.state.projection);
              console.log("Auditorium from fetch: ");
              console.log(this.state.auditorium);
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
        console.log(seats);
        console.log(i);
    }
    console.log("rowsRendered");
    console.log(rowsRendered);
    let allSeats = [];
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < seats; j++) {
        allSeats.push(rowsRendered[i].props.children[j]);
      }
    }

    for(let i = 0; i < allSeats.length; i++) {
      console.log(this.state.auditorium.seatsList[i].id);
    }

    return rowsRendered;
  }

  renderSeats(seats, row) {
      let renderedSeats = [];
      
      console.log('this.state.auditorium.seatsList =================');
      console.log(this.state.auditorium.seatsList);
      for (let i = 0; i < seats; i++) {        
        
          renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}
                                className={this.state.auditorium.seatsList[i].clicked === true ? "want-to-reserve" : "is-not-reserved"}
                                onClick={this.handleClick.bind(this, this.state.auditorium.seatsList[i])}
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
  const { submitted, canSubmit, movieTitle, movieYear } = this.state;
  const rating = this.getRoundedRating(this.state.movieRating);
  
  console.log("Auditorium: ");
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