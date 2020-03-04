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
  console.log("Movie: ");
  console.log(this.state.movie);
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
      return <Button key={index} onClick={() => this.navigateToProjectionDetails(projectionId)} className="mr-1 mb-2">{time}</Button>
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
                  <Card.Body>
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