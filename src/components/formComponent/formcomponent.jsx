import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { CiEdit } from "react-icons/ci";

const FormComponent = ({ label, placeholder, value, onChange }) => {
  
  return (
    <Form>
      <Form.Group controlId="formDevice">
        <div className="row">
          <div className="col-sm-10 col-md-10 col-lg-10">
            {/* Dynamic Label */}
            <Form.Label>{label}</Form.Label>
          </div>
          <div className="col-sm-2 col-md-2 col-lg-2">
            <Button className="btn btn-light" type="submit">
              <CiEdit className="text-success fs-3" />
            </Button>
          </div>
        </div>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={value}  
          onChange={onChange}  
        />
      </Form.Group>
    </Form>
  );
};

export default FormComponent;
