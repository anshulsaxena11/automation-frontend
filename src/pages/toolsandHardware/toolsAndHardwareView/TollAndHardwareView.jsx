import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, Button} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { putToolsAndHardware, getToolsAndHardwareMappping } from "../../../api/toolsAndHardware/toolsAndHardware"
import { directoratesList } from '../../../api/syncEmp/syncEmp'
import { TiArrowBack } from "react-icons/ti";

const ToolsAndHardwareView = ({ID}) => {
        const { register, handleSubmit, setValue, reset, getValues } = useForm();
        const [loading, setLoading] = useState(false);
        const [data,setData] = useState([])
        const [dirOptions, setDirOptions] = useState([]);
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




        
    return(
        <div>
           <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
            <div className="row">
                <div className="col-sm-11 col-md-11 col-lg-11">
                    <h1>View Tools And Hardware</h1>
                </div>
                <div className="col-sm-1 col-md-1 col-lg-1">
                    <Button variant="danger" className='btn btn-success ' onClick={handleBackClick}>
                        <TiArrowBack />BACK
                    </Button>
                </div>
                <hr></hr>
                <form  className="edit-project-form">
                    <div className="row pt-4" >
                        <div className="col-sm-4 col-md-4 col-lg-4">
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Type<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text" 
                                    readOnly
                                    {...register("tollsName")} 
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Assigned Directorates<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text" 
                                    readOnly
                                    {...register("directorates")} 
                                />
                            </Form.Group>
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4">
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Quantity<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly 
                                    {...register("quantity")} 
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="fs-5 fw-bolder">Purchased Order<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text" 
                                    readOnly
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
                                            type="text"
                                            readOnly 
                                            {...register("startDate ")} 
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-6">
                                    <Form.Group controlId="endDate">
                                    <Form.Label className="fs-5 fw-bolder">End Date<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text" 
                                        readOnly
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
                                    readOnly
                                    as='textarea'
                                    {...register("description")} 
                                />
                            </Form.Group>
                    </div>
                    <Button variant="danger" className='mt-4' onClick={handleBackClick}>
                       <TiArrowBack /> BACK
                    </Button>
                </form>
            </div>
        </div> 

    )
}

export default ToolsAndHardwareView;