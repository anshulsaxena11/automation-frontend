import React, { useState, useEffect, useRef  } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import reportValidationSchema from '../../../validation/reportValidationSchema';
import {postReport,getVulListSpecific} from '../../../api/reportApi/reportApi'
import 'react-quill/dist/quill.snow.css'; 
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import {getDeviceList} from '../../../api/deviceListAPI/decicelistApi'
import { Button, Spinner, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getVulnerabilityList } from '../../../api/vulnerabilityApi/vulnerability'
import Select from 'react-select';
import PreviewModal from "../../../components/previewfile/preview"
import { PiImagesSquareBold } from "react-icons/pi";
import { getProjectNameList, getProjectTypeList } from '../../../api/ProjectDetailsAPI/projectDetailsApi'
import {getAllRound, postAddRound} from '../../../api/roundApi/round'
import FormComponent from '../../../components/formComponent/formcomponent'
import PopupForm from '../../../components/PopBoxForm/PopupBoxForm'
import { IoIosSave,IoMdAdd } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
import'./report.css'

const ReportPage = () => {
  const { control, handleSubmit, watch, formState: { errors }, setValue,getValues } = useForm({
    resolver: yupResolver(reportValidationSchema),
  
  });
  
  const [vulnerabilityOptions, setVulnerabilityOptions] = useState([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [showModalVul, setShowModalVul] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [ProjectType, setProjectType] = useState("");
  const [round, setRound] = useState('');
  const [addVulnerability,setAddVulnerability] = useState();
  const [device, setDevice] = useState([]);
  const [vulnerabilityData, setVulnerabilityData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [ProjectName, setProjectName] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(""); 
  const [selectedProjectNameAdd,setSelectedProjectNameAdd] = useState('')
  const [showPreview, setShowPreview] = useState(false);
  const severityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];
  const [proofOfConcepts, setProofOfConcepts] = useState([
    { text: "", file: null, preview: null },
    { text: "", file: null, preview: null },
    { text: "", file: null, preview: null }
  ]);
  const [selectDevice, setSelectDevice] = useState([])
  const navigate = useNavigate();
  const [disableDevices, setDisableDevices] = useState("")
  const fileInputRefs = useRef([]); 
  const [roundOptions, setRoundOptions] = useState([]);
  const [addDescription,setAddDescription] = useState("")
  const [addImpact,setAddImpact] = useState("")
  const [addReferance,setAddReferance] = useState("")
  const [addRecomendation,setAddRecomendation] = useState("")
  const [addSevirity,setAddSevirity] = useState("")
  const [showModal, setShowModal] = useState(false); 
  const [showModalVulList, setShowModalVulList] = useState(false); 
  const [showVulLisst,setShowVulList] = useState([])
  const roundValue = watch("round");
  const name = watch("name");
  const deviceValue = watch("device");
  const ipAddress = watch('ipAddress')
  
  useEffect(() => {
  const fetchVulList = async () => {
    setLoading(true);
    try {
      if (selectedProjectName || roundValue || name || selectedProjectNameAdd || ipAddress || deviceValue) {
        const response = await getVulListSpecific({
          projectName: selectedProjectName,
          projectType: selectedProjectNameAdd,
          round: roundValue,
          devices: deviceValue,
          Name: name,
          ipAddress: ipAddress,
        });
        console.log(response.data)
        setShowVulList(response.data); 
      }
    } catch (error) {
      console.error("Error fetching vulnerabilities:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchVulList();
}, [selectedProjectName, roundValue, name, selectedProjectNameAdd, deviceValue, ipAddress])

  useEffect(() => {
    loadRounds();
  }, []);
  
  useEffect(() => {
    const fetchVulnerabilities = async () => {
      setLoading(true);  // Start loading
      try {
        if (ProjectType && (ProjectType !== "Network Devices" || selectDevice)){
          const projectType = ProjectType === 'Network Devices' && selectDevice ? selectDevice.label : ProjectType;
          const response = await getVulnerabilityList({ProjectType:projectType}); 
          const vulnerabilities = response.data;
          setVulnerabilityData(vulnerabilities)
  
          const options = vulnerabilities.map(vuln => ({
            value: vuln._id,  
            label: vuln.vulnerabilityTypes,  
          }));
  
          setVulnerabilityOptions(options);   
        } else {
          setVulnerabilityOptions()
        }
      } catch (error) {
        console.error('Error fetching vulnerabilities:');
      } finally {
        setLoading(false); 
      }
    };

    fetchVulnerabilities();
  }, [ProjectType,selectDevice]);

  const handleVulnerabilityChange = (selectedOption) => {
    setSelectedVulnerability(selectedOption); 
    setValue('selectedVulnerability', selectedOption.label);  
    const selectedVuln = vulnerabilityData.find((vuln) => vuln._id === selectedOption?.value);
    if (selectedVuln) {
      setValue("Description", selectedVuln.description); 
      setValue("Impact",selectedVuln.impact)
      setValue("VulnerableParameter",selectedVuln.vulnarabilityParameter)
      setValue("Referance",selectedVuln.references)
      setValue("Recomendation",selectedVuln.recommendation)
      const severityValue = severityOptions.find((option) => option.value === selectedVuln.severity);
      setValue("severity", severityValue ? severityValue.value : "");
    } else {
      setValue("Description", "");
      setValue("Impact", ""); 
      setValue("VulnerableParameter", ""); 
      setValue("Referance", ""); 
      setValue("Recomendation", "");  
      setValue("severity", null);
    }
 
  };

  useEffect(() => {
    setValue("selectedProjectName", ""); 
    localStorage.removeItem("selectedProjectName"); 
  }, [setValue]);

  useEffect(()=>{
    const fetchDevices = async () => {
      setLoading(true)
      setError("")
      try{
        const data = await getDeviceList()
        const deviceOption = data.data
        if (deviceOption && Array.isArray(deviceOption)){
          const option = deviceOption.map((item)=>({
            value:item._id,
            label:item.devicesName
          }))
          setDevice(option)   
          } else {
            throw new Error("Unexpected data format or empty project list");
          }
      } catch(error){
        setError(`Failed to fetch project types: ${error.message}`);
        console.error("Error fetching project types:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchDevices()
  },[])
  
  useEffect(() => {
    const fetchProjectNameList = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProjectNameList();

        if (data && data.statusCode === 200 && Array.isArray(data.data)) {
          setProjectName(data.data);
        } else {
          throw new Error("Unexpected data format or empty project list");
        }
      } catch (err) {
        setError(`Failed to fetch project types: ${err.message}`);
        console.error("Error fetching project types:");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectNameList();
  }, []);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      if (selectedProjectName) {
        setLoading(true);
        setError("");

        try {
          const selectedProjectId = selectedProjectName; 

          const data = await getProjectTypeList(selectedProjectId);

          if (data && data.statusCode === 200 && Array.isArray(data.data)) {
            setSelectedTypes(data.data);
          } else {
            throw new Error("Unexpected data format or empty VAPT types");
          }
        } catch (err) {
          setError(`Failed to fetch VAPT types: ${err.message}`);
          console.error("Error fetching VAPT types:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjectTypes();
  }, [selectedProjectName]);

  const loadRounds = async () => {
    try {
      const res = await getAllRound();
      const options = res.data.data || [];
      const withAddOption = [
        ...options,
        { label: "➕ Add Round", value: "add_round", isAddOption: true },
      ];
      setRoundOptions(withAddOption);
    } catch (err) {
      console.error("Error loading rounds:", err);
    }
  };

  const addNewRound = async () => {
    try {
      const res = await postAddRound();
      loadRounds();
      toast.success(res.data.message || 'Round added successfully!');
      return res.data.data;
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add round');
        console.error(err);
        return null;
    }
  };

const handleAddStep = () => {
  setProofOfConcepts([...proofOfConcepts, { text: "", file: null, preview: null }]);
};

const handleRemoveStep = (index) => {
  setProofOfConcepts(proofOfConcepts.filter((_, i) => i !== index));
};

const handleTextChange = (index, value) => {
  if (index > 0 && !proofOfConcepts[index - 1].text.trim()) {
    toast.error(`Please fill Step ${index} before proceeding.`,{
      className: 'custom-toast custom-toast-error',
    });
    return;
  }
  const updatedProofs = [...proofOfConcepts];
  updatedProofs[index].text = value;
  setProofOfConcepts(updatedProofs);
};

const handleFileChange = (index, event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProofs = proofOfConcepts.map((proof, i) => {
        if (i === index) {
          return {
            ...proof,
            file: file, 
            preview: reader.result, 
            fileType: file.type 
          };
        }
        return proof;
      });

      setProofOfConcepts(updatedProofs);
    };
    reader.readAsDataURL(file);
  }
};
  

  const handleFormSubmit = async (data) =>{
    const formattedProofOfConcept = proofOfConcepts.map((proof, index) => ({
      noOfSteps: `Step ${index + 1}`,
      description: proof.text,
      proof: proof.file ? proof.file : "",
    }));

    const payload={
      projectName:data.selectedProjectName,
      projectType:data.ProjectType,
      Name:data.name,
      ipAddress:data.ipAddress,
      round:data.round,
      vulnerabilityName:data.selectedVulnerability,
      sevirty:data.severity,
      description:data.Description,
      path:data.Path,
      impact:data.Impact,
      vulnerableParameter:data.VulnerableParameter,
      references:data.Referance,
      recomendation:data.Recomendation,
      proofOfConcept: formattedProofOfConcept,
      devices:selectDevice?.label || null,
      proof: formattedProofOfConcept.map((item) => item.proof),
    }
    
    setLoading(true);
    try{
    await postReport(payload);
      setValue("selectedVulnerability", null);
      // setValue("ProjectType",null);
      setValue("Description", "");
      setValue("Impact", "");
      // setValue("device",null)
      setValue("VulnerableParameter", "");
      setValue("Referance", "");
      setValue("Recomendation", "");
      setValue("severity", null);
      // setValue("selectedProjectName", null)
      setValue("Path","")
      // setValue("round",null)
      setRoundOptions(null)
      setSelectedVulnerability(null);
      // setSelectDevice(null);
      setShowModalVul(false)
      setProofOfConcepts([
        { text: "", file: null, preview: null },
        { text: "", file: null, preview: null },
        { text: "", file: null, preview: null }
      ]);
      fileInputRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
      toast.success('Form submitted successfully!', {
        className: 'custom-toast custom-toast-success',
      });
    } catch(error){
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message, {
        className: 'custom-toast custom-toast-error',
      });
    }
    setLoading(false);
  }
  const handleDevice = (selected) =>{
    setValue("selectedVulnerability", null);
    setValue("Description", "");
    setValue("Impact", "");
    setValue("VulnerableParameter", "");
    setValue("Referance", "");
    setValue("Recomendation", "");
    setValue("severity", null);
    setSelectedVulnerability(null);
    setSelectDevice(selected)
    const selectedOption = selected.label
    setValue("device",selectedOption)
  }

  const handleButtonClick = (e) => {
    e.preventDefault();
      handleSubmit(handleFormSubmit)();
  };
 
  const handleround=(selected)=>{
    if (selected?.isAddOption) {
      addNewRound();
    } else {
      setValue("round",selected.value)
    }
  }

  useEffect(() => {
    if (ProjectName) {
      setProjectName(ProjectName);
    }
  }, [ProjectName]);
  
  const handleBackClick = ()=>{
    navigate(`/report`) 
  }

  const handleShow = () => {
    setShowModal(true); 
  };
   const handleClose = () => {
    setShowModal(false); 
  };

   const handleInputChange = (e) => {
    setAddVulnerability(e.target.value);
  };
  const handleSevirity =(selected) =>{
    setAddSevirity(selected?.label)
  }
  const handleDiscription=(e) =>{
    setAddDescription(e.target.value)
  }
   const handleImpact=(e) =>{
    setAddImpact(e.target.value)

  }
  const handleReferance=(e) =>{
    setAddReferance(e.target.value)
  }
  const handleRecomendation=(e) =>{
    setAddRecomendation(e.target.value)
  }

  const handeleVulnabilitySubmit = async()=>{
    const payload = {
      projectName:selectedProjectNameAdd,
      devices:selectDevice?.label,
      vulnerabilityTypes:addVulnerability,
      severity:addSevirity,
      description:addDescription,
      impact:addImpact,
      recommendation:addRecomendation,
      references:addReferance

    }

    console.log(payload,'payload')

  }
 const handleShowModal = () => {
  const selectedProject = getValues("selectedProjectName");
  const selectedRound = getValues("round");
  const selectedDevice = getValues("device");
  const selectedProjectType = getValues("ProjectType");
  const enteredName = getValues("name");
  const ipAddress = getValues('ipAddress')
    if (selectedProject && selectedRound && selectedDevice && selectedProjectType && enteredName && ipAddress) {
      setShowModalVul(true);
    } else {
      toast.error('All field must be filed', {
        className: 'custom-toast custom-toast-error',
      });
    }
  }

  const handleShowModalVulList =()=>{
    const selectedProject = getValues("selectedProjectName");
    const selectedRound = getValues("round");
    const selectedDevice = getValues("device");
    const selectedProjectType = getValues("ProjectType");
    const enteredName = getValues("name");
    const ipAddress = getValues('ipAddress')
    if (selectedProject && selectedRound && selectedDevice && selectedProjectType && enteredName && ipAddress) {
      setShowModalVulList(true)
    }
    else{
      toast.error('All field must be filed', {
        className: 'custom-toast custom-toast-error',
      });
    }
  }

  const handleCloseModal = () => setShowModalVulList(false);
  return (
    <div className="report-page">
     <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
     <PopupForm show={showModalVulList} handleClose={handleCloseModal} title="Vulnerability List" showFooter={false}>
        <div>
          {showVulLisst.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto',maxWidth:'1000px'}}>
                <Table striped bordered hover responsive style={{ maxWidth: '1000px', margin: 'auto' }}>
                  <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Vulnerability Name</th>
                      </tr>
                  </thead>
                  <tbody>
                    {showVulLisst.map((vulnerabilityName, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{vulnerabilityName.vulnerabilityName}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            </div>
          ):(
            <p>No Vulnerability mapped for this project.</p>
          )}
        </div>
     </PopupForm>
     <PopupForm
         show={showModal}
        handleClose={handleClose}
        title="Add Vulnerability Name/Type"   
        showFooter={true}      
        footerText="Close" 
        handleAdd={handeleVulnabilitySubmit}    
      >     
       <FormComponent
          label="Project Type" 
          value={selectedProjectNameAdd} 
          readonly
          disabled
        />
         {disableDevices === "Network Devices" && (
          <FormComponent
            label="Devices" 
            value={selectDevice?.label} 
            readonly
            disabled
            // onChange={handleDirectrateInputChange}
          />
         )}
         <FormComponent
            label="Vulnerability Name/Type" 
            placeholder="Add Vulnerability Name/Type"
            value={addVulnerability} 
            onChange={handleInputChange}
          />
          <Form.Group>
            <Form.Label>Sevirity</Form.Label>
            <Select
              options={severityOptions}
              placeholder="Select severity"
              onChange={handleSevirity}
              isClearable
            />
          </Form.Group>
          <FormComponent
            label="Description" 
            placeholder="Add Description"
            value={addDescription} 
            onChange={handleDiscription}
          />
           <FormComponent
            label="Impact" 
            placeholder="Add Impact"
            value={addImpact} 
            onChange={handleImpact}
          />
          
          <FormComponent
            label="Referance" 
            placeholder="Add Referance"
            value={addReferance} 
            onChange={handleReferance}
          />
          <FormComponent
            label="Recomendation" 
            placeholder="Add ReferaRecomendationnce"
            value={addRecomendation} 
            onChange={handleRecomendation}
          />
      </PopupForm>
     <div className='row'>
      <div className='col-sm-10 col-md-10 col-lg-10 '>
        <h1>Report Page</h1>
      </div>
      <div className='col-sm-2 col-md-2 ol-lg-2'>
        <Button variant="danger" className='btn btn-success ' onClick={handleBackClick}>
        <TiArrowBack />BACK
        </Button>
      </div>
     </div>
      <hr />
      <div className="container-fluid">
        <div className="row">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
              <Form.Group className="mb-3" controlId="ProjectType">
                <Form.Label className="fs-5 fw-bolder">Project Name<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="selectedProjectName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={
                        field.value
                          ? {
                              value: field.value, 
                              label: ProjectName.find(p => p._id === field.value)?.projectName || "Select a project",
                            }
                          : null
                      }
                      options={ProjectName.map(({ _id, projectName }) => ({
                        value: _id, 
                        label: projectName,
                      }))}
                      isLoading={loading}
                      isSearchable
                      placeholder="Select a project"
                      onChange={(selectedOption) => {
                        setValue("selectedVulnerability", null);
                        setValue("ProjectType",null);
                        setValue("Description", "");
                        setValue("Impact", "");
                        setValue("VulnerableParameter", "");
                        setValue("Referance", "");
                        setValue("Recomendation", "");
                        setValue("severity", null);
                        setSelectedVulnerability(null);
                        field.onChange(selectedOption?.value); 
                        setSelectedProjectName(selectedOption?.value); 
                      }}
                    />
                  )}
                />
                {errors.selectedProjectName && <p className="text-danger">{errors.selectedProjectName.message}</p>}
              </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Round<span className="text-danger">*</span></Form.Label>
                  <Controller
                    name="round"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={roundOptions?.find((option) => option.value === field.value)}
                        options={roundOptions}
                        placeholder="Select Round"
                        onChange={handleround}
                      />
                    )}
                  />
                  {errors.round && <p className="text-danger">{errors.round.message}</p>}
                </Form.Group>
                {disableDevices === "Network Devices" && (
                <Form.Group>
                    <Form.Label className="fs-5 fw-bolder">Name<span className="text-danger">*</span>
                    </Form.Label>
                     <Controller
                        name="name"
                        control={control}
                        render={({field})=>(
                          <input {...field} className="form-control"  placeholder="Enter Name"/>
                        )}
                      />
                      {errors.name && <p className="text-danger">{errors.name.message}</p>}
                  </Form.Group>
                )}
                
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Project Type<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="ProjectType"
                  control={control}
                  rules={{ required: "Project Type is required" }} 
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={selectedTypes.find(type => type === field.value) ? { value: field.value, label: field.value } : null} // Ensure selected value is structured correctly
                      options={selectedTypes.map(type => ({
                        value: type,  
                        label: type,  
                      }))}
                      isLoading={loading}
                      isSearchable
                      placeholder="Select Project Type"
                      onChange={(selectedOption) => {
                        const selection = selectedOption ? selectedOption.label : "";
                        setValue("selectedVulnerability", null);
                        setValue("Description", "");
                        // setValue("device",null)
                        setValue("Impact", "");
                        setValue("VulnerableParameter", "");
                        setValue("Referance", "");
                        setValue("Recomendation", "");
                        setValue("severity", null);
                        setSelectedVulnerability(null);
                        field.onChange(selection);
                        setProjectType(selection);
                        setDisableDevices(selection);
                        setSelectedProjectNameAdd(selectedOption?.label)
                        setValue("ProjectType",selectedOption.label)
                      }}
                    />
                  )}
                />
                {errors.ProjectType && <p className="text-danger">{errors.ProjectType.message}</p>}
              </Form.Group>
              {disableDevices === "Network Devices" && (
                  <Form.Group>
                    <Form.Label className="fs-5 fw-bolder">Devices<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="device"
                      control={control}
                      rules={{ required: disableDevices === "Network Devices" ? "Device is required" : false }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="device"
                          options={device}
                          value={selectDevice}
                          onChange={handleDevice}
                          isLoading={loading}
                          isSearchable={true}
                          onInputChange={(newValue) => setSearchQuery(newValue)}
                        />
                      )}
                    />
                      {errors.device && <p className="text-danger">{errors.device.message}</p>}
                  </Form.Group>
                )}
                   {disableDevices === "Network Devices" && (
                <Form.Group>
                    <Form.Label className="fs-5 fw-bolder pt-3">IP Address<span className="text-danger">*</span>
                    </Form.Label>
                     <Controller
                        name="ipAddress"
                        control={control}
                        render={({field})=>(
                          <input {...field} className="form-control"  placeholder="Enter IPAddress"/>
                        )}
                      />
                      {errors.ipAddress && <p className="text-danger">{errors.ipAddress.message}</p>}
                  </Form.Group>
                   )}
              </div>
            </div>
            <div className="row">
              <div className="d-flex justify-content-between align-items-center my-4">
                <Button variant="primary" onClick={handleShowModalVulList}>List Of Vulnerability</Button>

                {!showModalVul && (
                  <Button variant="primary" onClick={handleShowModal}>Add Vulnerability</Button>
                )}
              </div>
            </div>
            {showModalVul && (
            <div className="row pt-5">
              <div className='col-sm-6 col-md-6 col-lg-6'>
                  <Form.Group className="mb-3">
                  <div className='row'>
                    <div className='col-sm-10 col-md-10 col-lg-10'>
                  <Form.Label className={`fs-5 fw-bolder ${disableDevices === "Network Devices" ? "pt-3" : ""}`}>Vulnerability Name/Type<span className="text-danger">*</span></Form.Label>
                      <Controller
                        name="selectedVulnerability"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            id="vulnerability"
                            options={vulnerabilityOptions}
                            value={selectedVulnerability}  
                            onChange={handleVulnerabilityChange}  
                            placeholder="Select a vulnerability"
                            isSearchable={true}
                            onInputChange={(newValue) => setSearchQuery(newValue)}
                            isLoading={loading}
                          />
                        )}
                      />
                      {errors.selectedVulnerability && <p className="text-danger">{errors.selectedVulnerability.message}</p>} 
                      </div>
                      <div className='col-sm-2 col-md-2 col-lg-2'>
                          <Button variant="success" className="button-middle" onClick={handleShow}><IoMdAdd className="fs-3" /></Button>
                      </div>
                    </div>
                  </Form.Group>
              </div>
              <div className='col-sm-6 col-md-6 col-lg-6'>
                  <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Severity<span className="text-danger">*</span></Form.Label>
                  <Controller
                  name="severity"
                  control={control}
                  render={({field})=>(
                    <Form.Control  {...field}
                      className='form-control'
                      placeholder="Enter Description"
                      readOnly
                      disabled
                  />
                  )}
                />
                   {errors.severity && <p className="text-danger">{errors.severity.message}</p>}
                </Form.Group>
              </div>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Description<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="Description"
                  control={control}
                  render={({field})=>(
                    <textarea  {...field}
                      className='form-control'
                      placeholder="Enter Description"
                  />
                  )}
                />
                {errors.Description && <p className="text-danger">{errors.Description.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Location<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="Path"
                  control={control}
                  render={({field})=>(
                    <textarea  {...field}
                      className='form-control'
                      placeholder="Enter Path"
                  />
                  )}
                />
                {errors.Path && <p className="text-danger">{errors.Path.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Impact<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="Impact"
                  control={control}
                  render={({field})=>(
                    <textarea  {...field}
                      className='form-control'
                      placeholder="Enter Impact"
                  />
                  )}
                />
                {errors.Impact && <p className="text-danger">{errors.Impact.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Vulnerable Parameter<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="VulnerableParameter"
                  control={control}
                  render={({field})=>(
                    <textarea  {...field}
                      className='form-control'
                      placeholder="Enter Vulnerable Parameter"
                  />
                  )}
                />
                {errors.VulnerableParameter && <p className="text-danger">{errors.VulnerableParameter.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">References (CVE/ Bug / OWASP 2017)<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="Referance"
                  control={control}
                  render={({field})=>(
                    <textarea  {...field}
                      className='form-control'
                      placeholder="Enter Referance"
                  />
                  )}
                />
                {errors.Referance && <p className="text-danger">{errors.Referance.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="ProofOfConcept">
              <Form.Label className="fs-5 fw-bolder">Proof Of Concept<span className="text-danger">*</span></Form.Label>
              <div className="container border py-4" style={{ maxHeight: "350px", overflowY: "auto" }}>
                {proofOfConcepts.map((proof, index) => (
                  <div className="row mb-3" key={index}>
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <Form.Label className="fs-6 fw-bolder">Step {index + 1}</Form.Label>
                      {proofOfConcepts.length > 3 && (
                        <Button variant="danger" size="sm" onClick={() => handleRemoveStep(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="col-md-6">
                      <Form.Control
                        as="textarea"
                        placeholder="Enter Proof Of Concept"
                        value={proof.text}
                        onChange={(e) => handleTextChange(index, e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mt-3">
                    <Form.Control type="file"  accept=".jpeg,.jpg" onChange={(e) => handleFileChange(index, e)}   ref={(el) => (fileInputRefs.current[index] = el)} />
                    {proof.preview && (
                      <div className="mt-2" style={{ cursor: 'pointer', marginTop: '10px' }}>
                        <h6 variant="primary" onClick={() => setShowPreview(true)}>
                          <PiImagesSquareBold style={{ marginRight: '8px' }} />
                            Preview Image
                        </h6>
                        <PreviewModal 
                          show={showPreview} 
                          onHide={() => setShowPreview(false)} 
                          preview={proof.preview} 
                          fileType={proof.fileType} 
                        />
                      </div>
                    )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Button variant="success" size="sm" onClick={handleAddStep}>
                  ADD
                </Button>
              </div>
            </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Recommendation<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="Recomendation"
                  control={control}
                  render={({field})=>(
                    <textarea  {...field}
                      className='form-control'
                      placeholder="Enter Recomendation"
                  />
                  )}
                />
                {errors.Recomendation && <p className="text-danger">{errors.Recomendation.message}</p>}
              </Form.Group>
            </div>
            )}
            <Button variant="primary" onClick={handleButtonClick} type="submit" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <IoIosSave /> SAVE
                </>
              )}
            </Button>
            <Button variant="danger" className='btn btn-success mx-4' onClick={handleBackClick}>
            <TiArrowBack /> BACK
           </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
