import React, { useState, useEffect, useMemo } from 'react';
import {srpiEmpTypeListActive, srpiEmpTypeList, centreList, directoratesList,skillsMapping} from "../../api/syncEmp/syncEmp"
import ListView from '.././../components/listView/listView'
import {getProjectTypeList} from "../../api/projectTypeListApi/projectTypeListApi"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SkillMapping = () =>{
    const [selectedType, setSelectedType] = useState(null);
    const [selectedCentre, setSelectedCentre] = useState(null);
    const [totalCount, setTotalCount] = useState(0); 
    const [loader,setLoader] = useState(false)
    const [error, setError] = useState(null);
    const [data,setData] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [centreOptions, setCentreOptions] = useState([]);
    const [dirOptions, setDirOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [selecteddir, setSelectedDir] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [rows, setRows] = useState([])
    const [skillIndex, setSkillIndex] = useState([]);
    const [emp,setEmp] = useState()

    const selectNumericOption = [
        { value: '0', label: 'N/A' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
      ];

    const columns = useMemo(() => [
        // 'empid',
        'ename',
        ...(Array.isArray(projectTypes) ? projectTypes.map(type => type._id) : [])
      ], [projectTypes]);
      
      const columnNames = useMemo(() => ({
        // empid: 'Employee ID',
        ename: 'Employee Name',
        ...(Array.isArray(projectTypes)
          ? projectTypes.reduce((acc, type) => {
              acc[type._id] = type.ProjectTypeName;
              return acc;
            }, {})
          : {})
      }), [projectTypes]);


    useEffect(() => {
        fetchEmpList();
    }, [page, searchQuery, selectedCentre,selectedType,selecteddir]);

    const fetchEmpList = async() =>{
        setLoader(true);
        try{
            const response = await srpiEmpTypeListActive({page,limit:10,search:searchQuery.trim(),centre:selectedCentre?.value,etpe:selectedType?.value,dir:selecteddir?.value})
            if (response && response.data) {
                setData(response.data);
                setTotalCount(response.total);
                setTotalPages(response.totalPages);
            }
        }catch(error){
            console.error('Failed to fetch employee list:', error);
        }
        setLoader(false);  
    } 

    useEffect(() => {
        const fetchTypeData = async () => {
            setLoader(true);
            try {
                const response = await srpiEmpTypeList();
                const options = response.data.data.map((centre) => ({
                    value: centre,
                    label: centre,
                }));
                setTypeOptions(options);
            } catch (error) {
                console.error('Error fetching centre list:', error);
            } finally {
                setLoader(false);
            }
        };
        fetchTypeData();
    }, []);

     useEffect(() => {
        const fetchCentreData = async () => {
            setLoader(true);
            try {
                const response = await centreList();
                const options = response.data.data.map((centre) => ({
                    value: centre,
                    label: centre,
                }));
                setCentreOptions(options);
            } catch (error) {
                console.error('Error fetching centre list:', error);
            } finally {
                setLoader(false);
            }
        };
        fetchCentreData();
    }, []);
    
    useEffect(() => {
        const fetchDiretoratesData = async () => {
            setLoader(true);
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
                setLoader(false);
            }
        };
        fetchDiretoratesData();
    }, []);

    useEffect(() => {
        const fetchProjectTypeList = async () => {
            try {
                const response = await getProjectTypeList(); 
 
            
                setProjectTypes(response.data); 
               
                } catch (error) {
                console.error("Error fetching device list:", error);
            }
        };
        fetchProjectTypeList();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); 
    };

    const handleTypeChange = (e) =>{
        setSelectedType(e)
        setPage(1);
    }

    const handleCentreChange = (selectedOption) => {
        setSelectedCentre(selectedOption);
        setPage(1);
    };

    const handleDirChange = (selectedOption) => {
    setSelectedDir(selectedOption);
    setPage(1);
    };

    const handleProjectTypeChange = (empid, selectedOption) => {
        const updatedData = data.map((item) =>
          item.empid === empid ? { ...item, selectedProjectType: selectedOption } : item
        );
        setData(updatedData);
      };

      const handleButtonSkill = async(emp,newSkillIndex) => {

        const payload={
            _id:emp,
            skills:newSkillIndex
        }
        try{
            const response = await skillsMapping(payload);
            console.log(response)

            if (response.data.statuscode === 200){
                toast.success("Suceesfully Rated",{
                    className: 'custom-toast custom-toast-success'
                });
                setSkillIndex([]);
                fetchEmpList();
            }else if(response.data.statuscode === 400){
                toast.error("not Rated", {
                    className: "custom-toast custom-toast-error",
                });
            }
        }catch(error){
            toast.error('Failed to get Api Data.', {
                className: 'custom-toast custom-toast-error',
            });
        }     
      };

  
    const handleTableInput = (selected, col, rowIndex, item) => {  
        const updatedRows = [...rows];    
        const currentRow = updatedRows[rowIndex] ? { ...updatedRows[rowIndex] } : { ...item };
        currentRow[col] = selected ? selected.value : null;
        updatedRows[rowIndex] = currentRow;
        setRows(updatedRows);
      
        setSkillIndex(prevSkillIndex => {
          const newSkillIndex = [...prevSkillIndex];
      
          const existingIndex = newSkillIndex.findIndex(entry => entry[0] === col);
      
          if (existingIndex !== -1) {
            newSkillIndex[existingIndex][1] = selected ? selected.value : null;
          } else {
            newSkillIndex.push([col, selected ? selected.value : null]);
          }
      
          return newSkillIndex;
        });
        setEmp(item._id)
      };
    
     
    return(
        <div className='skill-Mapping'>
             <ToastContainer  position="top-center" autoClose={5000} hideProgressBar={false} />
            <ListView
                title="Skill Mapping"
                columns={columns}
                columnNames={columnNames}
                data={data}
                page={page}
                totalPages={totalPages}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange} 
                loading={loader}
                showFilters={true}
                etpeTypeName="Type"
                etpeOptions={typeOptions}
                selectedEtpe={selectedType}
                setSelectedEtpe={handleTypeChange}
                centreTittle="Centre"
                centreOptions={centreOptions}
                selectedCentre={selectedCentre}
                setSelectedCentre={handleCentreChange}
                dirTittle="Directorates"
                dirOptions={dirOptions}
                selecteddir={selecteddir}
                setSelecteddir={handleDirChange}
                selectNumericOption={selectNumericOption}
                onProjectTypeChange={handleProjectTypeChange}
                projectTypes={projectTypes}
                projectOptions={selectNumericOption}
                projectTypes={projectTypes}
                showbuttonSubmit={true}
                buttonClassthree={"btn-btn-primary"}
                onButtonThree={handleButtonSkill}
                handleTableInput={handleTableInput}
                onButtonThree={() => handleButtonSkill(emp,skillIndex)}
                
            />
            
        </div>
    )
}

export default SkillMapping;