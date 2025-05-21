import React, { useState, useEffect } from 'react';
import { getProjectNameList } from '../../api/ProjectDetailsAPI/projectDetailsApi';
import Select from 'react-select';
import { getProjectDetailsTimelineById, putProjectDetailsTimelineById } from '../../api/TimelineAPI/timelineApi';
import { useForm } from "react-hook-form";
import Popup from '../../components/popupBox/PopupBox';
import { Form, Button, Table } from "react-bootstrap";
import { srpiEmpTypeListActive } from "../../api/syncEmp/syncEmp";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';

const Timeline = () => {
    const { register, setValue, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [ProjectName, setProjectName] = useState([]);
    const [SelectedProjectName, setselectedProjectName] = useState();
    const [showModal, setShowModal] = useState(false); 
    const [viewData, setViewData] = useState([]); 
    const [Phase, setPhase] = useState([ 
        { projectStartDate: "", testCompletedEndDate: "", reportSubmissionEndDate: "", comments: "" }
    ]);
    const [resourceMapping, setResourceMapping] = useState([]); 

    const [expandedPhases, setExpandedPhases] = useState({});

    useEffect(() => {
        const fetchEmpList = async () => {
            if (!SelectedProjectName) return;
            setLoading(true);
            try {
                const response = await srpiEmpTypeListActive({ projectId: SelectedProjectName.value });
                if (response && response.data) {
                    setViewData(response.response); 
                }
            } catch (error) {
                console.error('Failed to fetch employee list:');
            }
            setLoading(false);
        };
        fetchEmpList();
    }, [SelectedProjectName]);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const id = SelectedProjectName.value;
                const response = await getProjectDetailsTimelineById(id);
                const fetchedData = response?.data; 
                const fetchPhase = fetchedData?.projectPhase; 

                if (fetchedData) {
                    const formattedStartDate = fetchedData.startDate?.split("T")[0] || "";
                    const formattedEndDate = fetchedData.endDate?.split("T")[0] || "";

                    reset({
                        ...fetchedData,
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                    });

                    setResourceMapping(fetchedData.resourseMapping || []);
                    if (!fetchPhase ||!Array.isArray(fetchPhase.phase)||fetchPhase.phase.length === 0 ){
                        setPhase([]);
                    } else if (fetchPhase.phase && Array.isArray(fetchPhase.phase)) {
                        const formattedPhases = fetchPhase.phase.map((p, index) => ({
                            noOfPhases: `Phase ${index + 1}`,
                            projectStartDate: p.projectStartDate?.split('T')[0] || '',
                            testCompletedEndDate: p.testCompletedEndDate?.split('T')[0] || '',
                            reportSubmissionEndDate: p.reportSubmissionEndDate?.split('T')[0] || '',
                            comments: p.comments || '',
                        }));
                        setPhase(formattedPhases);

                        const expandedInit = {};
                        formattedPhases.forEach((_, idx) => {
                            expandedInit[idx] = true;
                        });
                        setExpandedPhases(expandedInit);
                    }
                } else {
                    console.log("No data received for the project.");
                }
            } catch (error) {
                console.error('Error fetching project details:');
            } finally {
                setLoading(false);
            }
        };
        if (SelectedProjectName?.value) {
            fetchProjectDetails();
        }
    }, [SelectedProjectName, reset]);

    useEffect(() => {
        const fetchProjectNameList = async () => {
            setLoading(true);
            try {
                const data = await getProjectNameList();
                if (data?.statusCode === 200 && Array.isArray(data.data)) {
                    const options = data.data.map((centre) => ({
                        value: centre._id,
                        label: centre.projectName,
                    }));
                    setProjectName(options);
                } else {
                    throw new Error("Unexpected data format or empty project list");
                }
            } catch (err) {
                console.error("Error fetching project types:");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectNameList();
    }, []);

    const handleProjectName = (e) => {
        setselectedProjectName(e);
        setExpandedPhases({}); 
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddStep = () => {
        const newIndex = Phase.length + 1;
        setPhase([
            ...Phase,
            {
                noOfPhases: `Phase ${newIndex}`,
                projectStartDate: "",
                testCompletedEndDate: "",
                reportSubmissionEndDate: "",
                comments: "",
            },
        ]);
        setExpandedPhases(prev => ({ ...prev, [Phase.length]: true }));
    };

    const handleRemoveStep = (index) => {
        const updatedSteps = Phase.filter((_, i) => i !== index);
        const reindexedSteps = updatedSteps.map((step, idx) => ({
            ...step,
            noOfPhases: `Phase ${idx + 1}`,
        }));
        setPhase(reindexedSteps);


        setExpandedPhases(prev => {
            const newExpanded = {};
            reindexedSteps.forEach((_, idx) => {
                newExpanded[idx] = prev[idx >= index ? idx + 1 : idx] ?? true; 
            });
            return newExpanded;
        });
    };

    const handleChangePhaseInput = (index, field, value) => {
        const updatedPhases = [...Phase];
        updatedPhases[index][field] = value;
        setPhase(updatedPhases);
    };


    const toggleExpandPhase = (index) => {
        setExpandedPhases(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleSubmitAllPhases = async () => {
        if (!SelectedProjectName?.value) {
            toast.error("Please select a project first");
            return;
        }

        const payload = {
            phase: Phase.map((item, index) => ({
                ...item,
                noOfPhases: `Phase ${index + 1}`,
            })),
        };

        try {
            const response = await putProjectDetailsTimelineById(SelectedProjectName.value, payload);
            if (response.statuscode === 200) {
                toast.success("All phases submitted successfully!");
                const formattedPhases = response.data.phase.map((p, i) => ({
                    noOfPhases: `Phase ${i + 1}`,
                    projectStartDate: p.projectStartDate?.split('T')[0] || '',
                    testCompletedEndDate: p.testCompletedEndDate?.split('T')[0] || '',
                    reportSubmissionEndDate: p.reportSubmissionEndDate?.split('T')[0] || '',
                    comments: p.comments || '',
                }));
                setPhase(formattedPhases);

                const expandedInit = {};
                formattedPhases.forEach((_, idx) => {
                    expandedInit[idx] = true;
                });
                setExpandedPhases(expandedInit);
            } else {
                toast.error("Failed to submit phases.");
            }
        } catch (error) {
            console.error("Error submitting all phases:");
            toast.error("Submission error");
        }
    };

    const isAddPhaseDisabled = () => {
        return Phase.some(
            (phase) =>
                !phase.projectStartDate ||
                !phase.testCompletedEndDate ||
                !phase.reportSubmissionEndDate ||
                !phase.comments
        );
    };

    return (
        <div>
            <Popup show={showModal} handleClose={handleCloseModal} title="Resource Allotment" showFooter={false}>
                <div>
                    {resourceMapping.length > 0 ? (
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Employee ID</th>
                                        <th>Name</th>
                                        <th>Designation</th>
                                        <th>Centre</th>
                                        <th>Directorates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resourceMapping.map((resource, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{resource.empid}</td>
                                            <td>{resource.ename}</td>
                                            <td>{resource.edesg}</td>
                                            <td>{resource.centre}</td>
                                            <td>{resource.dir}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <p>No resources mapped for this project.</p>
                    )}
                </div>
            </Popup>

            <div className="container">
                <h1>Project Management</h1>
                <hr />
                <Select
                    options={ProjectName}
                    value={SelectedProjectName}
                    onChange={handleProjectName}
                    placeholder="Select Project Name"
                    isClearable
                />
                
                {SelectedProjectName && (
                    <div>
                        <div className="row mt-4">
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control type="text" readOnly {...register("projectName")} />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Organisation Name</Form.Label>
                                    <Form.Control type="text" readOnly {...register("orginisationName")} />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Project Start Date</Form.Label>
                                    <Form.Control type="date" readOnly {...register("startDate")} />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Project End Date</Form.Label>
                                    <Form.Control type="date" readOnly {...register("endDate")} />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="my-4">
                            <Button variant="primary" onClick={handleShowModal}>Resource Allotment</Button>
                        </div>
                        <h4>Project Phases</h4>
                        {Phase.length === 0 && <p>No phases found.</p>}
                        {Phase.map((phase, index) => (
                            <div key={index} className="mb-3 border p-3 rounded">
                                <div 
                                  style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                  onClick={() => toggleExpandPhase(index)}>
                                    <h5>{phase.noOfPhases}</h5>
                                    <Button
                                        variant="black"
                                        size="sm"
                                        aria-expanded={expandedPhases[index] ? "true" : "false"}
                                    >
                                        {expandedPhases[index] ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}
                                    </Button>        
                                </div>
                                {expandedPhases[index] && (
                                    <div className="mt-3">
                                        <div className='row'>
                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Start Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={phase.projectStartDate}
                                                        onChange={(e) =>
                                                            handleChangePhaseInput(index, "projectStartDate", e.target.value)
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Test Completion Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        disabled={!phase.projectStartDate}
                                                        min={phase.projectStartDate || ''}
                                                        value={phase.testCompletedEndDate}
                                                        onChange={(e) =>
                                                            handleChangePhaseInput(index, "testCompletedEndDate", e.target.value)
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                             <div className='col-sm-4 col-md-4 col-lg-4'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Report Submitted Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                          disabled={!phase.testCompletedEndDate}
                                                        min={phase.testCompletedEndDate || ''}
                                                        value={phase.reportSubmissionEndDate}
                                                        onChange={(e) =>
                                                            handleChangePhaseInput(index, "reportSubmissionEndDate", e.target.value)
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Comments</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={phase.comments}
                                                onChange={(e) =>
                                                    handleChangePhaseInput(index, "comments", e.target.value)
                                                }
                                            />
                                        </Form.Group>
                                        <div style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <Button variant="primary" size="sm"onClick={handleSubmitAllPhases}>
                                                Submit Phases
                                            </Button>
                                             <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveStep(index)}
                                                className="mt-2"
                                                disabled={Phase.length === 1}
                                            >
                                                Remove Phase
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                       <div style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Button
                                variant="success"
                                onClick={handleAddStep}
                                disabled={isAddPhaseDisabled()}
                            >
                                Add Phase
                            </Button>
                             <Button variant="primary" onClick={handleSubmitAllPhases}>
                                Submit All Phases
                            </Button>
                        </div>

                    </div>
                )}

                <ToastContainer />
            </div>
        </div>
    );
};

export default Timeline;
