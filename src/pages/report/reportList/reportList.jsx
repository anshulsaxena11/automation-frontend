// pages/ProjectListPage.js
import React, { useState, useEffect } from 'react';
import { getReportList } from '../../../api/reportApi/reportApi';
import ListView from '../../../components/listView/listView';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'

const ReportList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // Total item count for pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define columns and a mapping for the column names
  const columns = [
    'projectName',
    'projectType',
    'vulnerabilityName',
    'sevirty',
    'createdAt', 
  ];

  const columnNames = {
    projectName: 'Project Name',
    projectType: 'Project Type',
    vulnerabilityName: 'vulnerability Name',
    sevirty: 'sevirty',
    createdAt: 'created At',
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getReportList({
        page,
        search: searchQuery.trim(), 
        limit: 10
      });
      const transformedData = response.data.map(item => ({
        ...item,
        projectType: Array.isArray(item.projectType) && item.projectType.length > 0
          ? item.projectType[0]?.ProjectTypeName || 'N/A'
          : item.projectType || 'N/A',
          createdAt: item.createdAt ? dayjs(item.createdAt).format('DD-MM-YYYY') : 'N/A',
      }));

      setData(transformedData);
      setTotalCount(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]); 

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); 
  };

  const handleAddNewClick = () => {
    navigate("/newReport");  
  };
  const handleViewClick = (data) => {
    const id = data._id
    navigate(`/newReportView/${id}`);  
  };
  const handleEditClick = (data)=>{
    const id =data._id
    navigate(`/editReport/${id}`); 
  }

  return (
    <div>
      <ListView
        title="Report List"
        buttonName="Add New"
        onAddNewClick={handleAddNewClick}
        columns={columns}
        columnNames={columnNames}
        data={data}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        loading={loading}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        showEditView={true}
      />
    </div>
  );
};

export default ReportList;
