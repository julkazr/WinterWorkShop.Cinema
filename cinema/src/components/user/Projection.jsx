import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

class Projection extends Component {
  constructor(props) {
    super(props);
    this.state = {
        movies: [],
        movie: this.props.movie
    };
  }

  componentDidMount() {
  }
  
  getRoundedRating(rating) {
      const result = Math.round(rating);
      return <span className="float-right">Rating: {result}/10</span>
  }

  navigateToProjectionDetails(id) {
    this.props.history.push(`projectiondetails/${id}`);
  }

  getProjections() {
    const projectionTimes = [];
    let projectionId = '';
    for(let i = 0; i < this.state.movie.projections.length; i++) {
      projectionTimes.push(this.state.movie.projections[i].projectionTime);
      projectionId = this.state.movie.projections[i].id;
      console.log("ProjectionId: ");
    console.log(projectionId);
    }
    console.log("List of projectiontimes: ");
    console.log(projectionTimes);
    
    return projectionTimes.map((time, index) => {
      var date = new Date(time);
      var year = date.getFullYear();
      var mounth = date.getMonth();
      var day = date.getDate();
      var hour = date.getHours()
      var min = date.getMinutes()
      var s = "";
      if(day < 10)
      {
        s = "0";
      }
      s += day.toString() + "/";
      if(mounth < 10)
      {
        s += "0";
      }
      s += mounth.toString() + "/" + year.toString() + " ";
      if(hour < 10)
      {
        s += "0";
      }
      s += hour.toString() + ":";
      if(min < 10 && min > 0)
      {
        s += "0";
      }
      s += min.toString();
      if(min === 0)
      {
        s += '0';
      }
      console.log(date.getUTCDay())
      return <Button key={index} onClick={() => this.navigateToProjectionDetails(projectionId)} className="mr-1 mb-2">{s}</Button>
    })
  }

  render() {
      const rating = this.getRoundedRating(this.state.movie.movie.rating);
      const projectionTimes = this.getProjections();
      return (
        <React.Fragment>
          <Container>
            <Row className="justify-content-center">
              <Col>
                <Card className="mt-5 card-width">
                  <Card.Body format>
                      <Card.Title><span className="card-title-font">{this.state.movie.movie.title}</span> {rating}</Card.Title>
                      <hr/>
                      <Card.Subtitle className="mb-2 text-muted">Year of production: {this.state.movie.movie.year}</Card.Subtitle>
                      <hr/>
                      <Card.Text>
                          <span className="mb-2 font-weight-bold">
                            Projection times: 
                          </span>
                      </Card.Text>
                            {projectionTimes}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
    }
}

export default withRouter(Projection);