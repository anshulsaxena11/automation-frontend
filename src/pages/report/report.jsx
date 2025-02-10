import React, { useState, useEffect  } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import reportValidationSchema from '../../validation/reportValidationSchema';
import {postReport} from '../../api/reportApi/reportApi'
import 'react-quill/dist/quill.snow.css'; 
import Form from 'react-bootstrap/Form';
import { Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PreviewModal from "../../components/previewfile/preview"
import { PiImagesSquareBold } from "react-icons/pi";
import { getProjectNameList, getProjectTypeList } from '../../api/ProjectDetailsAPI/projectDetailsApi'
import'./report.css'

const ReportPage = () => {
  const { control, handleSubmit, formState: { errors }, setValue,reset } = useForm({
    resolver: yupResolver(reportValidationSchema),
    defaultValues: {
    
    },
  });
  const [vulnerabilityName, setVulnerabilityName] = useState('');
  const [severity, setSeverity] = useState('');;
  const [ProjectType, setProjectType] = useState("");
  const [round, setRound] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [ProjectName, setProjectName] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(""); 
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [proofOfConcepts, setProofOfConcepts] = useState([
    { text: "", file: null, preview: null },
    { text: "", file: null, preview: null },
    { text: "", file: null, preview: null }
  ]);
  
  useEffect(() => {
    setValue("selectedProjectName", ""); 
    localStorage.removeItem("selectedProjectName"); 
  }, [setValue]);
  
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

const handleAddStep = () => {
  setProofOfConcepts([...proofOfConcepts, { text: "", file: null, preview: null }]);
};

const handleRemoveStep = (index) => {
  setProofOfConcepts(proofOfConcepts.filter((_, i) => i !== index));
};

const handleTextChange = (index, value) => {
  const updatedProofs = [...proofOfConcepts];
  updatedProofs[index].text = value;
  setProofOfConcepts(updatedProofs);
};

  

const handleFileChange = (index, event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Create a copy of the proofOfConcepts array and update the specific index
      const updatedProofs = proofOfConcepts.map((proof, i) => {
        if (i === index) {
          return {
            ...proof,           // Preserve other fields
            file: file,         // Store full file object
            preview: reader.result, // Base64 preview data
            fileType: file.type // Store file type for preview handling
          };
        }
        return proof; // Return unchanged proof for other indexes
      });

      // Update the state with the new proofs array
      setProofOfConcepts(updatedProofs);
    };

    // Read the file as a data URL for previewing (image, PDF, etc.)
    reader.readAsDataURL(file);
  }
};
  

  const handleFormSubmit = async (data) =>{

    const formattedProofOfConcept = proofOfConcepts.map((proof, index) => ({
      noOfSteps: `Step ${index + 1}`,
      description: proof.text,
      proof: proof.file ? proof.file.name : "",
    }));

    const payload={
      projectName:data.selectedProjectName,
      projectType:data.ProjectType,
      round:round,
      vulnerabilityName:vulnerabilityName,
      sevirty:severity,
      description:data.Description,
      path:data.Path,
      impact:data.Impact,
      vulnerableParameter:data.VulnerableParameter,
      references:data.Referance,
      recomendation:data.Recomendation,
      proofOfConcept: formattedProofOfConcept,
    }
    console.log("payload",payload)
    setLoading(true);
    try{
      await postReport(payload);
      reset();
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

  const handleButtonClick = (e) => {
    e.preventDefault();
      handleSubmit(handleFormSubmit)();
  };


  const handleProjectName = (e) =>{
    const selectedOption = ProjectName.find((project) => project._id === e.target.value);
    setSelectedProjectName(selectedOption?.projectName || "");  
    setSelectedProjectId(e.target.value);  
  }
 

  const handleround=(e)=>{
    setRound(e.target.value)
  }

  const handleVulnerabilityName = (e) =>{
    setVulnerabilityName(e.target.value)
  }
  const handleSevirty = (e) =>{
    setSeverity(e.target.value)
  }

  useEffect(() => {
    if (ProjectName) {
      setProjectName(ProjectName);
    }
  }, [ProjectName]);

  return (
    <div className="report-page">
     <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
      <h1>Report Page</h1>
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
                  render={({field})=>(
                    <Form.Select {...field} required onChange={(e) => {
                      field.onChange(e); // Ensure Controller handles value
                      handleProjectName(e); // Keep existing change handler
                      localStorage.setItem("selectedProjectName", e.target.value);
                    }}>
                    <option value="" disabled>
                      Select Project Type<span className="text-danger">*</span>
                    </option>
              
                    {loading ? (
                      <option value="">Loading...</option>
                    ) : error ? (
                      <option value="">{error}</option>
                    ) : ProjectName.length > 0 ? (
                      ProjectName.map(({ _id, projectName }) => (
                        <option key={_id} value={_id}>
                          {projectName?.trim() ? projectName : "Unnamed Project Type"}
                        </option>
                      ))
                    ) : (
                      <option value="">No project types available</option>
                    )}
                  </Form.Select>
                  )}
                />
                {errors.selectedProjectName && <p className="text-danger">{errors.selectedProjectName.message}</p>}
              </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Round<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={round}
                    onChange={handleround}
                    required
                  >
                    <option value="">Select Round</option>
                    <option value="1">Round 1</option>
                    <option value="2">Round 2</option>
                    <option value="3">Round 3</option>
                    <option value="4">Round 4</option>
                    <option value="4">Add Round</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Severity<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Severity"
                    value={severity}
                    onChange={handleSevirty}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Project Type<span className="text-danger">*</span></Form.Label>
                <Controller
                  name="ProjectType"
                  control={control}
                  render={({field})=>(
                    <Form.Select {...field} onChange={(e) => field.onChange(e.target.value)}>
                    <option value="">Select Project Type</option>
                    {selectedTypes.length > 0 ? (
                      selectedTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))
                    ) : (
                      <option value="">No VAPT types available</option>
                    )}
                  </Form.Select>
                  )}
                />
                {errors.ProjectType && <p className="text-danger">{errors.ProjectType.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Vulnerability Name/Type<span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={vulnerabilityName}
                    onChange={handleVulnerabilityName}
                    required
                  >
                    <option value="">Select Vulnerability Name/Type</option>
                    <option value="1">Vulnerability 1</option>
                    <option value="2">Vulnerability 2</option>
                    <option value="3">Vulnerability 3</option>
                    <option value="4">Vulnerability 4</option>
                    <option value="4">other</option>
                  </Form.Select>
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
                    <Form.Control type="file"  accept=".jpeg,.jpg" onChange={(e) => handleFileChange(index, e)} />
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
            <Button variant="primary" onClick={handleButtonClick} type="submit" disabled={loading} on>
             {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Submit'
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
