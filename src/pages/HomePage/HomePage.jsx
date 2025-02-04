import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import { postPerseonlData } from '../../api/ProjectDetailsAPI/projectDetailsApi'
import {postProjectTypeList, getProjectTypeList} from '../../api/projectTypeListApi/projectTypeListApi'
import "react-datepicker/dist/react-datepicker.css";
import "./homePage.css";
import Popup from '../../components/popupBox/PopupBox'
import FormComponent from '../../components/formComponent/formcomponent'

const HomePage = () => {
  const [OrganisationName, setOrganisationName] = useState()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); 
  const [ProjectName, setProjectName] = useState("");
  const [PrimaryFullName, setPrimaryFullName] = useState("")
  const [SecondaryFullName, setSecondaryFullName] = useState("")
  const [PrimaryPhoneNo, setPrimaryPhoneNo] = useState("")
  const [SecondaryPhoneNo, setSecondaryPhoneNo] = useState("")
  const [SecondaryEmail, setSecondaryEmail] = useState('')
  const [PrimaryEmail, setPrimaryEmail] = useState('');
  const [DirectrateName, setDirectrateName] = useState('')
  const [ServiceLoction, setServiceLoction] = useState('')
  const [preview, setPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projectTypeName, setProjectTypeName] = useState(''); 
  const [projectTypes, setProjectTypes] = useState([]); 
  const [ProjectValue, setProjectValue] =useState("");
  const [selectedProjectTypes, setSelectedProjectTypes] = useState([]); 

  useEffect(() => {

    const fetchProjectTypeList = async () => {
      try {
        const response = await getProjectTypeList(); 
        console.log('data',response)

        if (response && Array.isArray(response.data)) {
          const options = response.data.map((projectTypes) => ({
            label: projectTypes.ProjectTypeName, 
            value: projectTypes._id 
          }));
          
          setProjectTypes(options); 
        } else {
          console.error("Expected an array in response.data but got:", response);
        }
      } catch (error) {
        console.error("Error fetching device list:", error);
      }
    };
  
    fetchProjectTypeList();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Both Start Date and End Date are required!");
      return;
    }
    const selectedTypes = selectedProjectTypes.map((type) => type.value);
    const payload = {
      orginisationName: OrganisationName,
      projectName:ProjectName,
      startDate:startDate,
      endDate:endDate,
      projectValue:ProjectValue,
      primaryPersonName:PrimaryFullName,
      secondaryPersonName:SecondaryFullName,
      primaryPersonPhoneNo:PrimaryPhoneNo,
      secondaryPrsonPhoneNo:SecondaryPhoneNo,
      secondaryPersonEmail:SecondaryEmail,
      primaryPersonEmail:PrimaryEmail,
      directrate:DirectrateName,
      serviceLocation:ServiceLoction,
      projectType:selectedTypes,
      workOrder:uploadedFile,
    }
    console.log('data',payload)
    const response = await postPerseonlData(payload);
  };

  const handelProjectListFormSubmit = async() =>{
    const payload = {
      ProjectTypeName:projectTypeName 
    }
    const response = await postProjectTypeList(payload);
  }

  const handleFormSubmit = (formData) => {
    console.log('Form Submitted:', formData);
    handleClose(); 
  };

  const handleShow = () => {
    setShowModal(true); 
  };


  const handleClose = () => {
    setShowModal(false); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOrganisationChange = (e) =>{
    setOrganisationName(e.target.value)
  }
  const handleEmailChange = (e) => {
    setPrimaryEmail(e.target.value); 
  };

  const handleSecondaryEmail = (e) => {
    setSecondaryEmail(e.target.value)
  };
  const handleServiceLocation = (e) =>{
    setServiceLoction(e.target.value)
  };
  const handleStartDate = (date) =>{
    setStartDate(date)
  }
  const handleEndDate = (date) =>{
    setEndDate(date);
  };
  const handleProjectValue = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setProjectValue(value);
    }
  };
  const handleProjectName = (e) =>{
    setProjectName(e.target.value)
  }
  const handleDirectrateName = (e) =>{
    setDirectrateName(e.target.value)
  }
  const handlePrimaryFullName = (e) =>{
    setPrimaryFullName(e.target.value)
  }
  const handleSecondaryFullName = (e) =>{
    setSecondaryFullName(e.target.value)
  }
  const handlePrimaryPhoneNo = (e) =>{
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrimaryPhoneNo(value);
    }
  }
  const handleSecondaryPhoneNo = (e) =>{
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSecondaryPhoneNo(value);
    }
  }

  return (
    <div className="home-page">
      <Popup
        show={showModal}
        handleClose={handleClose}
        title="ADD Project Type"   
        showFooter={true}      
        footerText="Close" 
        handleAdd={handelProjectListFormSubmit}   
      >     
       <FormComponent  setProjectTypeName={setProjectTypeName} />
      </Popup>
      <h1>Project Details</h1>
      <hr />
      <div className="container-fluid">
        <div className="row">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
                <Form.Group className="mb-3" controlId="FormOrganisation">
                  <Form.Label className="fs-5 fw-bolder">Organisation Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Organisation Name"
                    value={OrganisationName}
                    onChange={handleOrganisationChange}
                  />
                </Form.Group>
                <div className="row">
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <Form.Group className="mb-3" controlId="StartDate">
                      <Form.Label className="fs-5 fw-bolder">Start Date</Form.Label>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDate}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select Start Date"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-6 col-md-6 col-lg-6">
                    <Form.Group className="mb-3" controlId="EndDate">
                      <Form.Label className="fs-5 fw-bolder">End Date</Form.Label>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndDate}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select End Date"
                      />
                    </Form.Group>
                  </div>
                </div>
                <Form.Group className="mb-3" controlId="ProjectValue">
                  <Form.Label className="fs-5 fw-bolder">Project value</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter project value"
                    value={ProjectValue} 
                    onChange={handleProjectValue}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Service Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Service Location"
                    value={ServiceLoction}
                    onChange={handleServiceLocation}
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6"> 
                <Form.Group className="mb-3" controlId="PriojectName">
                  <Form.Label className="fs-5 fw-bolder">Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Project Name"
                    value={ProjectName}
                    onChange={handleProjectName} 
                  />
                </Form.Group>
                <div className="row">
                  <div className="col-sm-10 col-md-10 col-lg-10">
                    <Form.Group className="mb-3" >
                      <Form.Label className="fs-5 fw-bolder">Project Type</Form.Label>
                      <MultiSelect
                        options={projectTypes}
                        value={selectedProjectTypes}
                        onChange={setSelectedProjectTypes}
                        labelledBy="Select"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-sm-2 col-md-2 col-lg-2">
                    <Button variant="success" className="button-middle" onClick={handleShow}><IoMdAdd className="fs-3" /></Button>
                  </div>
                </div>
                <Form.Group className="mb-3" controlId="directrate">
                  <Form.Label className="fs-5 fw-bolder">Directrate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Directrate Name"
                    value={DirectrateName}
                    onChange={handleDirectrateName} 
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                <Form.Label className="fs-5 fw-bolder">Work Order</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                {preview && (
                  <div className="mt-3">
                    <h6>File Preview:</h6>
                    <img
                      src={preview}
                      alt="File Preview"
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
            </div>
            <h1 className="pt-5">Contact Perseonal Details</h1>
            <hr></hr>
            <div className="row">
              <div className="col-sm-4 col-md-4 col-lg-4">
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label className="fs-5 fw-bolder">Primary Person Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Full Name"
                    value={PrimaryFullName}
                    onChange={handlePrimaryFullName}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label className="fs-5 fw-bolder">Secondary Person Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Full Name"
                    value={SecondaryFullName}
                    onChange={handleSecondaryFullName}
                  />
                </Form.Group>
              </div>
              <div className="col-sm-4 col-md-4 col-lg-4">
                <Form.Group className="mb-3" controlId="primaryPhoneNo">
                  <Form.Label className="fs-5 fw-bolder">Primary Mobile Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Phone Number"
                    value={PrimaryPhoneNo}
                    onChange={handlePrimaryPhoneNo} 
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="secondryPhoneNo">
                  <Form.Label className="fs-5 fw-bolder">Secondary Mobile Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Phone Number"
                    value = {SecondaryPhoneNo}
                    onChange={handleSecondaryPhoneNo} 
                  />
                </Form.Group>
              </div>
              <div className="col-sm-4 col-lg-4 col-md-4">
                <Form.Group className="mb-3" controlId="primaryemail">
                  <Form.Label className="fs-5 fw-bolder">Primary E-Mail</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Primary E-mail" 
                    value = {PrimaryEmail}
                    onChange={handleEmailChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="Secondaryemail">
                  <Form.Label className="fs-5 fw-bolder">Secondary E-Mail</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter Secondary E-mail" 
                    value = {SecondaryEmail}
                    onChange={handleSecondaryEmail}
                  />
                </Form.Group>
              </div>
            </div>  
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
