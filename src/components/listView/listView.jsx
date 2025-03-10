import React from 'react';
import { Table, Pagination, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

const ListView = ({ 
  columns, 
  columnNames, 
  data, 
  page, 
  totalPages, 
  onPageChange, 
  searchQuery, 
  onSearchChange, 
  loading, 
  title,
  onAddNewClick,
  buttonName,
  onViewClick,
  onEditClick
}) => {
  return (
    <div>
      <div className="row mb-3">
        <div className="col-10">
          <h3>{title}</h3>
        </div>
        <div className="col-2 ">
          <InputGroup className="mb-3" style={{ maxWidth: '300px' }}>
            <FormControl
              placeholder="Search..."
              value={searchQuery}
              onChange={onSearchChange}
            />
          </InputGroup>
        </div>
      </div>
      <hr></hr>
      <div className='row pb-3'>
        <div className='col-sm-10 col-md-10 col-lg-10'></div>
        <div className='col-sm-2 col-md-2 col-lg-2 d-flex justify-content-end'>
          <Button variant="primary" className='btn btn-success' onClick={onAddNewClick}>
            {buttonName} <FaPlus />
          </Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>S.No</th> {/* Add a header for serial number */}
            {columns.map((col, index) => (
              <th key={index}>{columnNames[col]}</th> // Displaying user-friendly column names
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                Loading...
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{(page - 1) * 10 + index + 1}</td> {/* Serial Number */}
                {columns.map((col, i) => (
                  <td key={i}>{item[col] || 'N/A'}</td> // Safely display data or 'N/A' if no data
                ))}
                <td>
                    <IoEyeSharp style={{ cursor: 'pointer' }} 
                    onClick={() => onViewClick(item)} /> || <CiEdit style={{ cursor: 'pointer'}} onClick={() => onEditClick(item)}/>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-end mt-3">
        <Pagination className="pagination-sm">
          <Pagination.Prev
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === page}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default ListView;
