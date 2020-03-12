import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import { sharedGetRequestOptions, sharedDeleteRequestOptions, sharedResponse } from './../../helpers/shared';

class ShowAllCinemas extends Component {
    constructor(props) {
      super(props);
      this.state = {
          cinemas: [],
          isLoading: true
      };
      this.editCinema = this.editCinema.bind(this);
      this.removeCinema = this.removeCinema.bind(this);
    }

    componentDidMount() {
      this.getCinemas();
    }

    getCinemas() {
      const requestOptions = sharedGetRequestOptions;

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Cinemas/all`, requestOptions)
        .then(sharedResponse)
        .then(data => {
          if (data) {
            this.setState({ cinemas: data, isLoading: false });
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ isLoading: false });
        });
    }

    removeCinema(id) {
        const requestOptions = sharedDeleteRequestOptions;
  
          fetch(`${serviceConfig.baseURL}/api/cinemas/delete/${id}`, requestOptions)
          .then(sharedResponse)
          .then(result => {
              NotificationManager.success('Successfuly removed cinema with id: ' + id);
              const newState = this.state.cinemas.filter(cinema => {
                  return cinema.id !== id;
              })
              this.setState({cinemas: newState});
          })
          .catch(response => {
              NotificationManager.error(response.message || response.statusText);
              this.setState({ submitted: false });
          });
    }

    fillTableWithDaata() {
        return this.state.cinemas.map(cinema => {
            return <tr key={cinema.id}>
                        <td width="45%">{cinema.id}</td>
                        <td width="45%">{cinema.name}</td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.editCinema(cinema.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.removeCinema(cinema.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/></td>
                    </tr>
        })
    }

    editCinema(id) {
        this.props.history.push(`editcinema/${id}`);
    }

    render() {
        const {isLoading} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {rowsData}
                            </tbody>
                        </Table>);
        const showTable = isLoading ? <Spinner></Spinner> : table;

        return (
            <React.Fragment>
                <Container>
                    <Row className="no-gutters pt-2">
                        <h1 className="form-header ml-2">All Cinemas</h1>
                    </Row>
                    <Row className="no-gutters pr-5 pl-5">
                        {showTable}
                    </Row>
                </Container>
            </React.Fragment>
        );
      }
}

export default ShowAllCinemas;