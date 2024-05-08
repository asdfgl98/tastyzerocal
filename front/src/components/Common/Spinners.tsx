import React from 'react'
import Spinner from 'react-bootstrap/Spinner';

const Spinners = () => {
  return (
    <Spinner animation="border" role="status" variant="danger">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}

export default Spinners