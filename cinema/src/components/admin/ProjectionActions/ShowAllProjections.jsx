import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import { sharedGetRequestOptions, sharedDeleteRequestOptions, sharedResponse } from './../../helpers/shared';

class ShowAllProjections extends Component {
    constructor(props) {
      super(props);
      this.state = {
        projections: [],
        isLoading: true
      };
      this.editProjection = this.editProjection.bind(this);
      this.removeProjection = this.removeProjection.bind(this);
    }

    componentDidMount() {
      this.getProjections();
    }

    getProjections() {
      const requestOptions = sharedGetRequestOptions;

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Projections/all`, requestOptions)
        .then(sharedResponse)
        .then(data => {
          if (data) {
            this.setState({ projections: data, isLoading: false });
            }
        })
        .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
        });
    }

    removeProjection(id) {
      const requestOptions = sharedDeleteRequestOptions;

    fetch(`${serviceConfig.baseURL}/api/projections/${id}`, requestOptions)
        .then(sharedResponse)
        .then(result => {
            NotificationManager.success('Successfuly removed projection with id: '+ id);
            const newState = this.state.projections.filter(projection => {
                return projection.id !== id;
            })
            this.setState({projections: newState});
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    fillTableWithDaata() {
        return this.state.projections.map(projection => {
            let Time = new Date(projection.projectionTime).toLocaleString();
            return <tr key={projection.id}>
                        <td width="18%">{projection.id}</td>
                        <td width="18%">{projection.movieId}</td>
                        <td width="15%">{projection.movieTitle}</td>
                        <td width="5%">{projection.auditoriumId}</td>
                        <td >{projection.aditoriumName}</td>
                        <td width="18%">{Time}</td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.editProjection(projection.id)}>
                            <FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/>
                        </td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.removeProjection(projection.id)}>
                            <FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/>
                        </td>
                    </tr>
        })
    }

    editProjection(id) {
        this.props.history.push(`editProjection/${id}`);
    }

    render() {
        const {isLoading} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Movie Id</th>
                                <th>Movie Title</th>
                                <th>Auditorium Id</th>
                                <th>Auditorium Name</th>
                                <th>Projection Time</th>
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
                        <h1 className="form-header ml-2">All Projections</h1>
                    </Row>
                    <Row className="no-gutters pr-5 pl-5">
                        {showTable}
                    </Row>
                </Container>
            </React.Fragment>
        );
      }
}

export default ShowAllProjections;