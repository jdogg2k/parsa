import { Badge, ListGroup, Button } from 'react-bootstrap';
import React from 'react';

export default class CustomerGroupList extends React.Component {

render() {
  return (
    <ListGroup>
      {this.props.data.map(group => {
        return(
          <ListGroup.Item key={group.id} className="d-flex justify-content-between align-items-start customerGroup">





          <div className="ms-2 me-auto">
            <div className="fw-bold">{group.name}</div>
            {group.description}
          </div>

            <Button onClick={() => this.props.handleCluster(group.id)} className="btn-info clusterBtn">Cluster Data</Button>
            <Button onClick={() => this.props.handleDelete(group.id)} className="btn-danger deleteBtn">Delete</Button>
          </ListGroup.Item>
        )
      })}
      
    </ListGroup>
  );
}
}