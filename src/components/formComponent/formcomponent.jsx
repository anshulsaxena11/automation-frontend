import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const FormComponent = ({ setProjectTypeName }) => {
  const [projectName, setprojectName] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setProjectTypeName(value);
    setprojectName(value)
  };


  return (
    <Form>
      <Form.Group controlId="formDevice">
        <Form.Label>Device Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Project Type"
          name="projectName"
          value={projectName} 
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  );
};

export default FormComponent;