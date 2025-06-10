import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { postTenderTrackingData } from '../../api/TenderTrackingAPI/tenderTrackingApi'
const TenderTracking = () => {
  const [formData, setFormData] = useState({
    tenderName: "",
    organizationName: "",
    state: "",
    taskForce: "",
    valueINR: "",
    rawValueINR: "",
    status: "",
    tenderDocument: null,
    lastDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  const formatIndianNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "valueINR") {
      const raw = value.replace(/,/g, "").replace(/\D/g, "");
      const formatted = raw ? formatIndianNumber(raw) : "";
      setFormData((prev) => ({
        ...prev,
        valueINR: formatted,
        rawValueINR: raw,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }

    // Clear error on change
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenderName.trim()) newErrors.tenderName = "Tender name is required.";
    if (!formData.organizationName.trim()) newErrors.organizationName = "Organization name is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.taskForce) newErrors.taskForce = "Task force must be selected.";
    if (!formData.valueINR.trim()) newErrors.valueINR = "Value is required.";
    if (!formData.status) newErrors.status = "Status must be selected.";
    if (!formData.tenderDocument) newErrors.tenderDocument = "Document upload is required.";
    if (!formData.lastDate) newErrors.lastDate = "Last date is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormdataSubmit = async (data) => {
    console.log('ceccecee');
    const payload = {
      tenderName: data.tenderName,
      organizationName: data.organizationName,
      state: data.state,
      taskForce: data.taskForce,
      valueINR: data.rawValueINR || data.valueINR,
      status: data.status,
      tenderDocument: data.tenderDocument,
      lastDate: data.lastDate,
    };

    console.log("Payload to Submit:", payload);
    setLoading(true);
        try{
          const response = await postTenderTrackingData(payload);
         console.log(response.data)
         if(response.statusCode === 200){
         toast.success('Tender submitted successfully!', {
                   className: 'custom-toast custom-toast-success',
                 });
        }
        }catch(error){
              toast.error('Failed to submit the form.', {
                className: 'custom-toast custom-toast-error',
        });
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleFormdataSubmit(formData);
    } else {
      console.warn("Validation failed");
    }
  };

  const renderError = (field) =>
    errors[field] && <div className="text-danger small">{errors[field]}</div>;

  return (
    <div className="container mt-4">
      <h3>Tender Tracking Form</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label>Tender Name</label>
              <input
                type="text"
                name="tenderName"
                className="form-control"
                value={formData.tenderName}
                onChange={handleChange}
              />
              {renderError("tenderName")}
            </div>

            <div className="form-group mb-3">
              <label>Organization Name</label>
              <input
                type="text"
                name="organizationName"
                className="form-control"
                value={formData.organizationName}
                onChange={handleChange}
              />
              {renderError("organizationName")}
            </div>

            <div className="form-group mb-3">
              <label>State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleChange}
              />
              {renderError("state")}
            </div>

            <div className="form-group mb-3">
              <label>Task Force</label>
              <select
                name="taskForce"
                className="form-control"
                value={formData.taskForce}
                onChange={handleChange}
              >
                <option value="">Select Task Force</option>
                <option value="Om Shanker Soni">Om Shanker Soni</option>
                <option value="Pavitra Aggarwal">Pavitra Aggarwal</option>
              </select>
              {renderError("taskForce")}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label>Value (INR)</label>
              <input
                type="text"
                name="valueINR"
                className="form-control"
                value={formData.valueINR}
                onChange={handleChange}
                placeholder="e.g. 2,22,000"
              />
              {renderError("valueINR")}
            </div>

            <div className="form-group mb-3">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="upload">Upload</option>
                <option value="bidding">Bidding</option>
                <option value="not bidding">Not Bidding</option>
              </select>
              {renderError("status")}
            </div>

            <div className="form-group mb-3">
              <label>Document Upload (PDF, DOC, Image)</label>
              <input
                type="file"
                name="tenderDocument"
                className="form-control"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleChange}
              />
              {renderError("tenderDocument")}
            </div>

            <div className="form-group mb-3">
              <label>Last Day of Bidding</label>
              <input
                type="date"
                name="lastDate"
                className="form-control"
                value={formData.lastDate}
                onChange={handleChange}
              />
              {renderError("lastDate")}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TenderTracking;
