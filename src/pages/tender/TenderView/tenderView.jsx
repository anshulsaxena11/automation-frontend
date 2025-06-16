import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { TiArrowBack } from "react-icons/ti";
import {getTrackingById} from '../../../api/TenderTrackingAPI/tenderTrackingApi'

const TenderTrackingView =({ID}) =>{
    const { register, handleSubmit, setValue, reset, getValues } = useForm();

    const { id } = useParams();
    const trackingId = ID || id;
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchTrackingTenderDetails = async() =>{
            try{
                const data= await getTrackingById(trackingId)
                const fetchedData = data.data
                if(fetchedData){
                    const formattedLastDate = fetchedData.lastDate
                        ? fetchedData.lastDate.split("T")[0]
                        : "";

                     reset({
                        ...fetchedData,
                        lastDate: formattedLastDate,
                    });

                }
                console.log(fetchedData)

            }catch(error){
                  console.error("Error fetching project details:");
            }finally{
            }
        }
        fetchTrackingTenderDetails()
    },[])

    const handleBackClick = ()=>{
        navigate(`/tender-list`) 
    }

    return(
        <div className="container-fluid">
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
            <form>
                <div className="row pt-4" >
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Tender Name<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("tenderName")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Organization Name<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("organizationName")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">State<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("state")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                            <Form.Label className="fs-5 fw-bolder">Task Force Member<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("taskForce")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <Form.Group className="pt-4">
                             <Form.Label className="fs-5 fw-bolder">Value (INR)<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("valueINR")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="pt-4">
                             <Form.Label className="fs-5 fw-bolder">Status<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("status")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                         <Form.Group className="pt-4">
                             <Form.Label className="fs-5 fw-bolder">Last Date<span className="text-danger">*</span></Form.Label>
                             <Form.Control
                                type="text" 
                                {...register("lastDate")} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                    </div>
                </div>
                <Button variant="danger" className='btn btn-success my-5' onClick={handleBackClick}>
                    <TiArrowBack />BACK
                </Button>
            </form>
        </div>
    )
}

export default TenderTrackingView

