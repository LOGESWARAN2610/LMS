import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import { useAlert } from "react-alert";

export default function TaskAssignment() {

    const EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [Client, setClient] = useState([]);
    const [Employee, setEmployee] = useState([]);
    const [Project, setProject] = useState([]);
    const [Module, setModule] = useState([]);
    const [Task, setTask] = useState([]);
    const [TaskCategory, setTaskCategory] = useState([]);
    const [TaskPriority, setTaskPriority] = useState([]);
    const [Details, setDetails] = useState({
        AssignedBy: EmpId, AssignedTo: 0, ClientID: 0, Project: 0, Module: 0, TaskId: 0, Priority: 0, taskcategoryid: 0,
        PlannedStartDate: new Date(), ExpectedCompDate: (new Date(new Date().setDate(new Date().getDate() + 1))), PlannedEffort: '0.00'
    })

    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'AB_GetClientId ' }).then(result => {
            setClient(result.data[0]);
        });
        axios.post(nodeurl['nodeurl'], { query: 'LM_List_of_Emp ' }).then(result => {
            setEmployee(result.data[0]);
        });
        axios.post(nodeurl['nodeurl'], { query: 'AB_GetTaskCategory ' }).then(result => {
            setTaskCategory(result.data[0]);
        });
        axios.post(nodeurl['nodeurl'], { query: 'AB_Priority ' }).then(result => {
            setTaskPriority(result.data[0]);
        });
    }, []);

    const handelClick = () => {
        axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'AB_SaveEmpParent ', UpdateJson: JSON.stringify(Details) }).then(result => {
            let value = result.data.recordset[0]['Result'], msg = "Task Assigned successfully.";
            if (value === 1)
                msg = "Task Updated successfully."
            alert.success(msg);
        });
    }
    const handelOnChange = (event) => {
        setDetails({ ...Details, [event.target.name]: event.target.value });
    }
    const isDisable = () => {
        let isValidate = false;
        if (Details['AssignedTo'] === '-1' || Details['ClientID'] === '-1' || Details['Project'] === '-1' || Details['TaskId'] === '-1'
            || Details['taskcategoryid'] === '-1' || Details['Priority'] === '-1' || Details['PlannedEffort'] === '0.00')
            isValidate = true;
        return { disabled: isValidate };
    }

    const SelectDD = (props) => {
        return (
            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <select className="input-input" name={props['name']} value={Details[props['name']]} onChange={props['OnChange']}>
                        <option key="-1" value="-1">--Select--</option>
                        {props['option'].map((item, index) => (
                            <option key={index} value={item['value']}>{item['text']}</option>
                        ))}
                    </select>
                    <label className="input-label">{props['label']}</label>
                </div>
            </div>
        );
    }
    const handelClientChange = (e) => {
        setDetails({ ...Details, [e.target.name]: parseInt(e.target.value) });
        axios.post(nodeurl['nodeurl'], { query: 'AB_ProjectddList ' + e.target.value }).then(result => {
            setProject(result.data[0]);
            setModule([]);
            setTask([]);
        });
    }
    const handelProjectChange = (e) => {
        setDetails({ ...Details, [e.target.name]: e.target.value });
        axios.post(nodeurl['nodeurl'], { query: 'AB_ModuleList ' + e.target.value }).then(result => {
            setModule(result.data[0]);
            setTask([]);
        });
    }
    const handelModuleChange = (e) => {
        setDetails({ ...Details, [e.target.name]: e.target.value });
        axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + Details['Project'] + ',' + Details['Module'] + ',0,' + Details['AssignedTo'] }).then(result => {
            setTask(result.data[0]);
        });
    }

    return (
        <div className="body-Container">

            <SelectDD name="AssignedTo" label="Employee" option={Employee} OnChange={handelOnChange} />
            <SelectDD name="ClientID" label="Client" option={Client} OnChange={handelClientChange} />
            <SelectDD name="Project" label="Project" option={Project} OnChange={handelProjectChange} />
            <SelectDD name="Module" label="Module" option={Module} OnChange={handelModuleChange} />
            <SelectDD name="TaskId" label="Task" option={Task} OnChange={handelOnChange} />
            <SelectDD name="taskcategoryid" label="TaskCategory" option={TaskCategory} OnChange={handelOnChange} />
            <SelectDD name="Priority" label="TaskPriority" option={TaskPriority} OnChange={handelOnChange} />

            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <input type="text" className="input-input"
                        onBlur={(e) => {
                            if (e.target.value === '') e.target.value = 0.00;
                            e.target.value = parseFloat(e.target.value).toFixed(2);
                            handelOnChange(e);
                        }} name="PlannedEffort" value={Details['PlannedEffort']} onChange={(event) => {
                            let value = event.target.value;
                            if ((isNaN(value.substr(value.length - 1)) && value.substr(value.length - 1) !== '.')) return;
                            handelOnChange(event);
                        }
                        } />
                    <label className="input-label">Planned Effort Hours</label>
                </div>
            </div>

            <div className="input-wrapper marginLeft-0">
                <div className="input-holder  input-DatePicker" >
                    <DatePicker name="PlannedStartDate" Value={(Details['PlannedStartDate'])} valueChange={handelOnChange} />
                    <label className="input-label">Planned Start Date</label>
                </div>
            </div>
            <div className="input-wrapper marginLeft-0">
                <div className="input-holder  input-DatePicker" >
                    <DatePicker name="ExpectedCompDate" minDate_={(new Date(Details['PlannedStartDate']))} Value={(Details['ExpectedCompDate'])} valueChange={handelOnChange} />
                    <label className="input-label">Expected Completion Date</label>
                </div>
            </div>

            <div>
                <button className="btn marginLeft-0" {...isDisable()} onClick={handelClick}>Assign</button>
            </div>
        </div>
    );
}
