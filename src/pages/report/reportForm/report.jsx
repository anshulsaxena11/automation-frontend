import React, { useState, useEffect, useRef  } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import reportValidationSchema from '../../../validation/reportValidationSchema';
import {postReport} from '../../../api/reportApi/reportApi'
import 'react-quill/dist/quill.snow.css'; 
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import {getDeviceList} from '../../../api/deviceListAPI/decicelistApi'
import { Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getVulnerabilityList } from '../../../api/vulnerabilityApi/vulnerability'
import Select from 'react-select';
import PreviewModal from "../../../components/previewfile/preview"
import { PiImagesSquareBold } from "react-icons/pi";
import { getProjectNameList, getProjectTypeList } from '../../../api/ProjectDetailsAPI/projectDetailsApi'
import {getAllRound, postAddRound} from '../../../api/roundApi/round'
import { IoIosSave } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
import'./report.css'

const ReportPage = () => {
  const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(reportValidationSchema),
  
  });
  
  const [vulnerabilityOptions, setVulnerabilityOptions] = useState([]);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [ProjectType, setProjectType] = useState("");
  const [round, setRound] = useState('');
  const [device, setDevice] = useState([]);
  const [vulnerabilityData, setVulnerabilityData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [ProjectName, setProjectName] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(""); 
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

  useEffect(() => {
    loadRounds();
  }, []);
  
  useEffect(() => {
    const fetchVulnerabilities = async () => {
      setLoading(true);  // Start loading
      try {
        if (ProjectType && (ProjectType !== "Devices" || selectDevice)){
          const projectType = ProjectType === 'Devices' && selectDevice ? selectDevice.label : ProjectType;
          const response = await getVulnerabilityList({ProjectType:projectType}); 
          console.log(response)
          const vulnerabilities = response.data;
          setVulnerabilityData(vulnerabilities)
  
          const options = vulnerabilities.map(vuln => ({
            value: vuln._id,  
            label: vuln.vulnerabilityTypes,  
          }));
          console.log(options)
  
          setVulnerabilityOptions(options);   
        } else {
          setVulnerabilityOptions()
        }
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
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
        console.error("Error fetching project types:", err);
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
      console.log('New Round:', res.data.data); 
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
      setValue("ProjectType",null);
      setValue("Description", "");
      setValue("Impact", "");
      setValue("device",null)
      setValue("VulnerableParameter", "");
      setValue("Referance", "");
      setValue("Recomendation", "");
      setValue("severity", null);
      setValue("selectedProjectName", null)
      setValue("Path","")
      setValue("round",null)
      setRoundOptions(null)
      setSelectedVulnerability(null);
      setSelectDevice(null);
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
      toast.error('Failed to submit the form.', {
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
  
  return (
    <div className="report-page">
     <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
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
                        value={roundOptions.find((option) => option.value === field.value)}
                        options={roundOptions}
                        placeholder="Select Round"
                        onChange={handleround}
                      />
                    )}
                  />
                  {errors.round && <p className="text-danger">{errors.round.message}</p>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Severity<span className="text-danger">*</span></Form.Label>
                  <Controller
                    name ="severity"
                    control={control}
                    render={({ field }) => (
                      <Select
                      {...field}
                      value={severityOptions.find((option) => option.value === field.value)}
                      options={severityOptions}
                      placeholder="Select severity"
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : "");
                      }}
                      isClearable
                    />
                    )}
                  />
                   {errors.severity && <p className="text-danger">{errors.severity.message}</p>}
                </Form.Group>
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
                        setValue("device",null)
                        setValue("Impact", "");
                        setValue("VulnerableParameter", "");
                        setValue("Referance", "");
                        setValue("Recomendation", "");
                        setValue("severity", null);
                        setSelectedVulnerability(null);
                        field.onChange(selection);
                        setProjectType(selection);
                        setDisableDevices(selection);
                        setValue("ProjectType",selectedOption.label)
                      }}
                    />
                  )}
                />
                {errors.ProjectType && <p className="text-danger">{errors.ProjectType.message}</p>}
              </Form.Group>
              {disableDevices === "Devices" && (
                  <Form.Group>
                    <Form.Label className="fs-5 fw-bolder">Devices<span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name="device"
                      control={control}
                      rules={{ required: disableDevices === "Devices" ? "Device is required" : false }}
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
              <Form.Group className="mb-3">
              <Form.Label className={`fs-5 fw-bolder ${disableDevices === "Devices" ? "pt-3" : ""}`}>Vulnerability Name/Type<span className="text-danger">*</span></Form.Label>
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
                </Form.Group>
              </div>
            </div>
            <div className="row">
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
                <Form.Label className="fs-5 fw-bolder">Path<span className="text-danger">*</span></Form.Label>
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
