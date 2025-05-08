import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, Button, Spinner} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { putToolsAndHardware, getToolsAndHardwareMappping } from "../../../api/toolsAndHardware/toolsAndHardware"
import { directoratesList } from '../../../api/syncEmp/syncEmp'
import { FaEdit } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import Select from "react-select";

const ToolsAndHardwareEdit = ({ID}) => {
        const { register, handleSubmit, setValue, reset, getValues } = useForm();
        const [loading, setLoading] = useState(false);
        const [toolsData, setToolsDatas] = useState([]);
        const [data,setData] = useState([])
        const [selectedDir, setSelectedDir] = useState(null);
        const [dirOptions, setDirOptions] = useState([]);
        const [selectedTool, setSelectedTool] = useState(null);
        const { id } = useParams();
        const projectId = ID || id;
        const navigate = useNavigate();
        const handleBackClick = ()=>{
            navigate(`/Tools-Hardware-list`) 
        }
        useEffect(() => {
            fetchData();
        }, []); 

         useEffect(() => {
                const fetchProject = async () => {
                    try {
                        const response = await putToolsAndHardware(projectId, {});
                        const fetchedData = response?.data?.projectDetails;
                        console.log(fetchedData)
                        if (fetchedData) {
                            const formattedStartDate = fetchedData.startDate
                            ? fetchedData.startDate.split("T")[0]
                            : "";
        
                             const formattedEndDate = fetchedData.endDate
                                ? fetchedData.endDate.split("T")[0]
                                : "";
                            reset({
                                ...fetchedData,
                                startDate: formattedStartDate,
                                endDate: formattedEndDate,
                            });
            
            
                           
                            if (fetchedData?.tollsName && data.length > 0) {
                                const selectToolsAndHardware = Array.isArray(fetchedData.tollsName) ? fetchedData.tollsName : [fetchedData.tollsName];
                                const matchedToolsAndHardware = selectToolsAndHardware
                                    .map((tollsName) => data.find((item) => item.label === tollsName));
                
                                setSelectedTool(matchedToolsAndHardware);
                                setValue("tollsName",fetchedData?.tollsName)
                            }

                            if (fetchedData?.directorates && dirOptions.length > 0) {
                                const selectToolsAndHardware = Array.isArray(fetchedData.directorates) ? fetchedData.directorates : [fetchedData.directorates];
                                const matchedToolsAndHardware = selectToolsAndHardware
                                    .map((directorates) => dirOptions.find((item) => item.label === directorates));
                
                                setSelectedDir(matchedToolsAndHardware);
                                setValue("directorates",fetchedData?.directorates)
                            }
                            
             
                        }
                    } catch (error) {
                        console.error("Error fetching project details:", error);
                    }
                };
            
                if (projectId) fetchProject();
            }, [projectId, reset, setValue,data,dirOptions]);

             useEffect(() => {
                    const fetchDiretoratesData = async () => {
                      setLoading(true);
                        try {
                            const response = await directoratesList();
                            const options = response.data.data.map((dir) => ({
                                value: dir,
                                label: dir,
                            }));
                            setDirOptions(options);
                        } catch (error) {
                            console.error('Error fetching Directorates list:', error);
                        } finally {
                          setLoading(false);
                        }
                    };
                    fetchDiretoratesData();
                }, []);

            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await getToolsAndHardwareMappping();
                    const fetchDatas = response.data;
                    setToolsDatas(fetchDatas)   
                    if (fetchDatas && Array.isArray(fetchDatas)){
                    const option = fetchDatas.map((item)=>({
                        value:item._id,
                        label:item.tollsName
                    }))            
                    setData(option);
                    } 
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };

        const onSubmit = async (formData) => {
            setLoading(true); 
            try{
                const formDataToSubmit = new FormData();
                const tollsName = formData.tollsName || getValues("tollsName")
                const quantity = formData.quantity || getValues("quantity")
                const startDate = formData.startDate || getValues("startDate")
                const endDate = formData.endDate || getValues("endDate")
                const directorates = formData.directorates || getValues("directorates")
                const purchasedOrder = formData.purchasedOrder || getValues("purchasedOrder")
                const description = formData.description || getValues("description")

                formDataToSubmit.append("tollsName",tollsName)
                formDataToSubmit.append("quantity",quantity)
                formDataToSubmit.append("startDate",startDate)
                formDataToSubmit.append("endDate",endDate)
                formDataToSubmit.append("directorates",directorates)
                formDataToSubmit.append("purchasedOrder",purchasedOrder)
                formDataToSubmit.append("description",description)

                await putToolsAndHardware(projectId, formDataToSubmit);
                toast.success('Form Updated successfully!', {
                    className: 'custom-toast custom-toast-success',
                });
            }catch(error){
                 console.error("Update failed:", error);
                    toast.error('Failed to submit the form.',error, {
                        className: 'custom-toast custom-toast-error',
                    });
            }
             setLoading(false)
        }

        const handleToolsAndHardwareChange=(selected) =>            
        {
            setSelectedTool(selected);
            const toolsAndHardwareName = selected.value
            setValue('tollsName',toolsAndHardwareName)
        }

        const handleDir = (selected)=>{
            setSelectedDir(selected)
            const directorates = selected.value
            setValue("directorates",directorates )    
        }
        
    return(
        <div>
           <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
            <div className="row">
                <div className="col-sm-11 col-md-11 col-lg-11">
                    <h1>Edit Tools And Hardware m</h1>
                </div>
                <div className="col-sm-1 col-md-1 col-lg-1">
                    <Button variant="danger" className='btn btn-success ' onClick={handleBackClick}>
                        <TiArrowBack />BACK
                    </Button>
                </div>
                <hr></hr>
                <form onSubmit={handleSubmit(onSubmit)} className="edit-project-form">
                    <div className="row pt-4" >
                        <div className="col-sm-4 col-md-4 col-lg-4">
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Type<span className="text-danger">*</span></Form.Label>
                                <Select
                                    name="tollsName"
                                    options={data}
                                    value={selectedTool}
                                    onChange={handleToolsAndHardwareChange}
                                    isLoading={loading}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Assigned Directorates<span className="text-danger">*</span></Form.Label>
                                <Select
                                    name="directorates"
                                    options={dirOptions}
                                    value={selectedDir}
                                    onChange={handleDir}
                                    isLoading={loading}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4">
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Quantity<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text" 
                                    {...register("quantity")} 
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Purchased Order<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text" 
                                    {...register("purchasedOrder")} 
                                />
                            </Form.Group>
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4">
                            <div className="row ">
                                <div className="col-sm-6 col-md-6 col-lg-6">
                                        <Form.Group className="mb-3" controlId="StartDate">
                                            <Form.Label className="fs-5 fw-bolder">Start Date<span className="text-danger">*</span></Form.Label>
                                            <Form.Control 
                                            type="date"
                                            {...register("startDate")}                      
                                        />
                                        </Form.Group>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-6">
                                    <Form.Group controlId="endDate">
                                    <Form.Label className="fs-5 fw-bolder">End Date<span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="date"
                                        {...register("endDate")} 
                                    />
                                        </Form.Group>
                                </div>
                            </div>
                        </div>
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Description<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                    type="text" 
                                    as='textarea'
                                    {...register("description")} 
                                />
                            </Form.Group>
                    </div>
                    <Button type="submit" className="mt-4 ml-4" variant="primary" onClick={onSubmit} disabled={loading}>
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                            ) : (
                                <>
                                <FaEdit /> Edit
                            </>
                            )}
                    </Button>
                    <Button variant="danger" className='mt-4 mx-4' onClick={handleBackClick}>
                       <TiArrowBack /> BACK
                    </Button>
                </form>
            </div>
        </div> 

    )
}

export default ToolsAndHardwareEdit;