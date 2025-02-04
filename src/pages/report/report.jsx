import React, { useState, useEffect  } from 'react';
import { useLocation } from "react-router-dom";
import ReactQuill from 'react-quill';
import {postReport} from '../../api/reportApi/reportApi'
import 'react-quill/dist/quill.snow.css'; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getProjectNameList, getProjectTypeList } from '../../api/ProjectDetailsAPI/projectDetailsApi'
import'./report.css'

const ReportPage = () => {
  const location = useLocation();

  const [vulnerabilityName, setVulnerabilityName] = useState('');
  const [severity, setSeverity] = useState('');;
  const [ProjectType, setProjectType] = useState("");
  const [round, setRound] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [ProjectName, setProjectName] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState(""); 
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [Description, setDescription] = useState("");
  const [Path, setPath] = useState("");
  const [Impact, setImpact] = useState("");
  const [VulnerableParameter, setvulnerableParameter] = useState("")
  const [Referance, setReferance] = useState("")
  const [Recomendation, setRecomendation] = useState('')
  const [proofOfConcepts, setProofOfConcepts] = useState([
    { text: "", file: null, preview: null },
    { text: "", file: null, preview: null },
    { text: "", file: null, preview: null }
  ]);

  
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
      const updatedProofs = [...proofOfConcepts];
      updatedProofs[index].file = file;
      updatedProofs[index].preview = reader.result;
      setProofOfConcepts(updatedProofs);
    };
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const formattedProofOfConcept = proofOfConcepts.map((proof, index) => ({
      noOfSteps: `Step ${index + 1}`,
      description: proof.text,
      proof: proof.file ? proof.file.name : "",
    }));

    const payload={
      projectName:selectedProjectName,
      projectType:ProjectType,
      round:round,
      vulnerabilityName:vulnerabilityName,
      sevirty:severity,
      description:Description,
      path:Path,
      impact:Impact,
      vulnerableParameter:VulnerableParameter,
      references:Referance,
      recomendation:Recomendation,
      proofOfConcept: formattedProofOfConcept,
    }
    const report = await postReport(payload);
  }

  const handleProjectName = (e) =>{
    const selectedOption = ProjectName.find((project) => project._id === e.target.value);
    setSelectedProjectName(selectedOption?.projectName || "");  
    setSelectedProjectId(e.target.value);  
  }
 
  const handleProjectType = (e)=>{
    setProjectType(e.target.value)
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

  const handleDescription=(e)=>{
    setDescription(e.target.value)
  }

  const handlePath = (e) =>{
    setPath(e.target.value)
  }

  const handleImpact = (e) =>{
    setImpact(e.target.value)
  }
  const handleVulnerableParameter = (e) =>{
    setvulnerableParameter(e.target.value)
  }

  const handleRefrence = (e) =>{
    setReferance(e.target.value)
  }

  const handleRecomendation = (e) => {
    setRecomendation(e.target.value)
  }
  useEffect(() => {
    if (ProjectName) {
      setProjectName(ProjectName);
    }
  }, [ProjectName]);

  return (
    <div className="report-page">
      <h1>Report Page</h1>
      <hr />
      <div className="container-fluid">
        <div className="row">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
              <Form.Group className="mb-3" controlId="ProjectType">
                <Form.Label className="fs-5 fw-bolder">Project Name</Form.Label>
                <Form.Select
                  value={selectedProjectName}
                  onChange={handleProjectName}
                >
                  <option value="" disabled>Select Project Type</option>

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
              </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Round</Form.Label>
                  <Form.Select
                    value={round}
                    onChange={handleround}
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
                  <Form.Label className="fs-5 fw-bolder">Severity</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Severity"
                    value={severity}
                    onChange={handleSevirty}
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Project Type</Form.Label>
                <Form.Select value={ProjectType} onChange={handleProjectType}>
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
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label className="fs-5 fw-bolder">Vulnerability Name/Type</Form.Label>
                  <Form.Select
                    value={vulnerabilityName}
                    onChange={handleVulnerabilityName}
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
                <Form.Label className="fs-5 fw-bolder">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Description"
                  value={Description}
                  onChange={handleDescription}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Path</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Path"
                  value={Path}
                  onChange={handlePath}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Impact</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Impact"
                  value={Impact}
                  onChange={handleImpact}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">Vulnerable Parameter</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Parameter of Vulnerabilty "
                  value={VulnerableParameter}
                  onChange={handleVulnerableParameter}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-5 fw-bolder">References (CVE/ Bug / OWASP 2017)</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Referance"
                  value={Referance}
                  onChange={handleRefrence}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="ProofOfConcept">
              <Form.Label className="fs-5 fw-bolder">Proof Of Concept</Form.Label>
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
                      <Form.Control type="file" onChange={(e) => handleFileChange(index, e)} />
                      {proof.preview && (
                        <div className="mt-2">
                          <h6>File Preview:</h6>
                          <img src={proof.preview} alt="File Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
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
                <Form.Label className="fs-5 fw-bolder">Recommendation</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Recomendation"
                  value={Recomendation}
                  onChange={handleRecomendation}
                />
              </Form.Group>
            </div>
            <Button variant="primary" type="submit" on>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
