import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Spinner} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import PreviewModal from '../../../components/previewfile/preview';  
import Select from "react-select";
import { TiArrowBack } from "react-icons/ti";
import { PiImagesSquareBold } from "react-icons/pi";
import {getTrackingById,updateTenderById,updatetendermessage} from '../../../api/TenderTrackingAPI/tenderTrackingApi'
import { getStateList } from '../../../api/stateApi/stateApi';
import { getEmpList } from '../../../api/TenderTrackingAPI/tenderTrackingApi';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2'

const TenderTrackingEdit =({ID}) =>{
    const { register, handleSubmit, setValue, reset, getValues } = useForm();
    const [loading, setLoading] = useState(false); 
    const [stateOption,setStateOption] =useState([])
    const [selectedStateOption, setSelectedStateOption] = useState([])
    const [empListOption, setEmpListOption] =useState([])
    const [selectedEmpList, setSelectedEmpList] =useState([])
    const [slectedStatus, setSelectedStatus] = useState([])
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState("");
    const [previewFileType, setPreviewFileType] = useState("");
    const [oneTime,setOneTime]=useState(true)
    const [oneTimeStatus,setOneTimeStatus]=useState(true)
    const [oneTimeTaskForce,setOneTimeTaskForce]=useState(true)
    const [oneTimeFull,setOneTimeFull]=useState(true)
    const [showModal, setShowModal] = useState(false);
    const MySwal = withReactContent(Swal);
    const StatusOption =[
        {value:"Upload",label:"Upload"},
        {value:"Bidding",label:"Bidding"},
        {value:"Not Bidding",label:"Not Bidding"},
    ]

    const { id } = useParams();
    const trackingId = ID || id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpList = async() =>{
          setLoading(true);
          try{
            const data = await getEmpList()
            const response=data.data
            if(response.statusCode === 200 && response.data && Array.isArray(response.data)){
              const option = response.data.map((state)=>({
                value:state._id,
                label:state.ename
              }))
              setEmpListOption(option)
            }
    
          }catch(error){
    
          }finally{
            setLoading(false);
          }
        }
        fetchEmpList();
    }, []);

    useEffect(()=>{
        const fetchStateList = async() =>{
        setLoading(true);
        try{
            const response = await getStateList();
            if(response.data && Array.isArray(response.data.data)){
            const option = response.data.data.map((state)=>({
                value:state._id,
                label:state.stateName
            }))
            setStateOption(option)
            }else{
            console.log("Expect an Array")
            }
        }catch(error){
            console.error("Error fetching State:");
        } finally{
            setLoading(false);
        }
        }
        fetchStateList()
    },[])

    useEffect(()=>{
        const fetchTrackingTenderDetails = async() =>{
            setLoading(true);
            try{
                const data= await getTrackingById(trackingId)
                const fetchedData = data.data
                if(oneTimeFull){
                 if (fetchedData.tenderDocument) {
                    const fullUrl = fetchedData.tenderDocument.startsWith("http")
                        ? fetchedData.tenderDocument
                        : `${window.location.origin}${fetchedData.tenderDocument}`;
                        setFileUrl(fullUrl)
                        setFilePreviewUrl(fullUrl)
                    }
                if(fetchedData){
                    const formattedLastDate = fetchedData.lastDate
                        ? fetchedData.lastDate.split("T")[0]
                        : "";

                    reset({
                        ...fetchedData,
                        lastDate: formattedLastDate,
                    });
                
                   
                        if (oneTime && fetchedData?.state && stateOption.length > 0) {
                            const selectState = Array.isArray(fetchedData.state) ? fetchedData.state : [fetchedData.state];
                            const matchedState = selectState
                                .map((state) => stateOption.find((item) => item.label === state))
                                .filter(Boolean);
            
                                setSelectedStateOption(matchedState);
                                setValue("state", fetchedData?.state);
                                setOneTime(false)
                        }

                        if (oneTimeTaskForce && fetchedData?.taskForce && empListOption.length > 0) {
                            const selectTaskForce = Array.isArray(fetchedData.taskForce) ? fetchedData.taskForce : [fetchedData.taskForce];
                            const matchedEmpList = selectTaskForce
                                .map((taskForce) => empListOption.find((item) => item.label === taskForce))
                                .filter(Boolean);

                                setSelectedEmpList(matchedEmpList);
                                setValue("taskForce", fetchedData?.taskForce);
                                setOneTimeTaskForce(false)
                        }

                        if (oneTimeStatus && fetchedData?.status && StatusOption.length > 0) {
                            const selectStatus = Array.isArray(fetchedData.status) ? fetchedData.status : [fetchedData.status];
                            const matchedStatus = selectStatus
                                .map((status) => StatusOption.find((item) => item.label === status))
                                .filter(Boolean);

                                setSelectedStatus(matchedStatus);
                                setValue("status", fetchedData?.status);
                                setOneTimeStatus(false)
                        }
                    }
                   
                    setOneTimeFull(false)
                
                    
                }
            }catch(error){
                  console.error("Error fetching project details:");
            }finally{
                setLoading(false);
            }
        }
        if(oneTimeFull){
        fetchTrackingTenderDetails()
        }
            
    },[stateOption, empListOption, StatusOption, oneTimeFull,oneTime,oneTimeStatus,oneTimeTaskForce])

    const handleBackClick = ()=>{
        navigate(`/tender-list`) 
    }
    const onSubmit = async (formData) => {
        setLoading(true); 
        try{
            const formDataToSubmit = new FormData();
            const tenderName = formData.tenderName || getValues("tenderName")
            const organizationName = formData.organizationName || getValues("organizationName")
            const state = formData.state || getValues("state")
            const taskForce = formData.taskForce || getValues("taskForce")
            const valueINR = formData.valueINR || getValues("valueINR")
            const status = formData.status || getValues("status")
            const lastDate = formData.lastDate || getValues("lastDate")
            const tenderid = getValues("_id")
            const statusmssg = getValues("messageStatus")

            formDataToSubmit.append("tenderName",tenderName)
            formDataToSubmit.append("organizationName",organizationName)
            formDataToSubmit.append("state",state)
            formDataToSubmit.append("taskForce",taskForce)
            formDataToSubmit.append("valueINR",valueINR)
            formDataToSubmit.append("status",status)
            formDataToSubmit.append("lastDate",lastDate)

             if (file && file instanceof Blob) {
                formDataToSubmit.append("tenderDocument", file, file.name);
            } 

                if (status === 'Bidding' && statusmssg !== 'Lost') {
                    const result = await MySwal.fire({
                    title: 'Are you sure?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Lost',
                    cancelButtonText: 'Want'
                });

                if (!result.isConfirmed) {
                    return;
                }

                const messageResult = await Swal.fire({
                    title: "Submit your Message",
                    input: "text",
                    inputAttributes: {
                    autocapitalize: "off"
                    },
                    showCancelButton: true,
                    confirmButtonText: "Submit",
                    showLoaderOnConfirm: true,
                    preConfirm: async (message) => {
                    try {
                        console.log('Submitting message...');
                        const response = await updatetendermessage(tenderid, message); // Axios call
                        console.log('Response:', response);

                        if (response.status !== 200 && response.status !== 201) {
                        return Swal.showValidationMessage(`Error: ${response.statusText}`);
                        }

                        return response.data; // Send parsed data to .then(result.value)
                    } catch (error) {
                        return Swal.showValidationMessage(
                        `Request failed: ${error?.response?.data?.message || error.message}`
                        );
                    }
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                });

                if (messageResult.isConfirmed) {
                    Swal.fire({
                    title: 'Message submitted successfully!',
                    text: messageResult.value?.message || 'Your message was recorded.',
                    icon: 'success'
                    });
                    return;
                }
                }



           const response = await updateTenderById(trackingId,formDataToSubmit)
           if (response.data.statusCode === 200){
            setOneTimeFull(true)
            setOneTime(true)
            toast.success('Form Updated successfully!', {
                className: 'custom-toast custom-toast-success',
            });
           } else{
            setOneTimeFull(true)
            setOneTime(true)
            toast.error('Failed to submit the form.', {
                className: 'custom-toast custom-toast-error',
            });
           }

        }catch(error){

        }finally{
            setLoading(false);
        }
    }
    const handleState =(selected)=>{
        setSelectedStateOption(selected)
        const selectedValues = selected?.label
        setValue("state", selectedValues);
    }

    const handlePreviewClick = (url) => {
        const fileType = getFileTypeFromUrl(url);
        setFilePreviewUrl(url);
        setPreviewFileType(fileType);
        setShowModal(true);
    };

     const getFileTypeFromUrl = (url) => {
        const extension = url?.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
        return 'image/';
        } else if (extension === 'pdf') {
        return 'application/pdf';
        } else {
        return 'unknown';
        }
    };

    const handleTaskForcwMemberChange = (selected)=>{
      setSelectedEmpList(selected)
      const selectedValues = selected?.label
      setValue("taskForce", selectedValues);
    }

    const handleStatusChange = (selected) =>{
        setSelectedStatus(selected)
        const selectedValues = selected?.label
        setValue("status", selectedValues);
    }

    return(
        <div className="container-fluid">
            <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
            <div className="row">
                <div className="col-sm-10 col-md-10 col-lg-10">
                     <h1 className="fw-bolder">Tender Tracking Edit</h1>
                </div>
                <div className="col-sm-2 col-md-2 col-lg-2">
                    <Button variant="danger" className='btn btn-success ' onClick={handleBackClick}>
                        <TiArrowBack />BACK
                    </Button>
                </div>
            </div>
            <hr className="my-3" style={{ height: '4px', backgroundColor: '#000', opacity: 1 }}></hr>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row pt-4" >
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Tender Name<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("tenderName")} 
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Organization Name<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("organizationName")} 
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">State<span className="text-danger">*</span></Form.Label>
                             <Select
                                options={stateOption}
                                value={selectedStateOption}
                                isClearable
                                isDisabled={loading}
                                placeholder="Select State"
                                onChange={handleState}
                            />
                        </Form.Group>
                        <Form.Group className="pt-5 ">
                            <Form.Label className="fs-5 fw-bolder">Task Force Member<span className="text-danger">*</span></Form.Label>
                             <Select
                                options={empListOption}
                                value={selectedEmpList}
                                placeholder="Select Tak Force Member"
                                onChange ={handleTaskForcwMemberChange}
                                isClearable
                                isDisabled={loading}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <Form.Group className="pt-4">
                             <Form.Label className="fs-5 fw-bolder">Value (INR)<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("valueINR")} 
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Status<span className="text-danger">*</span></Form.Label>
                            <Select
                                options={StatusOption}
                                value={slectedStatus}
                                placeholder="Select Statusr"
                                onChange ={handleStatusChange}
                                isClearable
                                isDisabled={loading}
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Tender Document Upload (PDF, DOC, Image)<span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                            type="file" 
                            accept=".jpg,.png,.pdf" 
                            onChange={(e) => setFile(e.target.files[0])} 
                        />
                         {fileUrl && (
                            <div className="mt-2" style={{ cursor: "pointer" }}>
                                <h6 onClick={() => handlePreviewClick(filePreviewUrl)}>
                                <PiImagesSquareBold style={{ marginRight: "8px" }} />
                                Preview Uploaded File
                                </h6>
                            </div>
                            )}
                            <PreviewModal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            preview={filePreviewUrl}
                            fileType={previewFileType}
                            />
                        </Form.Group>
                         <Form.Group className="pt-3">
                             <Form.Label className="fs-5 fw-bolder">Last Date<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="date" 
                                {...register("lastDate")} 
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3 ">
                <Button type="submit" className=" my-5 ml-4" variant="primary" onClick={onSubmit} disabled={loading}>
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                        ) : (
                        'Edit'
                        )}
                </Button>
                <Button variant="danger" className='btn btn-success my-5' onClick={handleBackClick}>
                    <TiArrowBack />BACK
                </Button>
                </div>
            </form>
        </div>
    )
}

export default TenderTrackingEdit

