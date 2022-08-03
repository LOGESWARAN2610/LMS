import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function EnterTimeSheet() {
    const EmpId = localStorage['EmpId'];
    const [expanded, setExpanded] = useState(false);
    const [ActiveTab, setActiveTab] = useState(1);
    const [Details, setDetails] = useState([]);
    const [Project, setProject] = useState([]);
    const [Module, setModule] = useState([]);
    const [Tasks, setTasks] = useState([]);
    const [Status, setStatus] = useState([]);
    const taskDate = (new Date().toLocaleDateString()).toString();

    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'AB_Inprogressgrid ' + EmpId + ',"' + taskDate + '"' }).then(result => {
            setDetails(result.data[0]);
            setProject(result.data[1]);
            setModule(result.data[2]);
            setStatus(result.data[3]);
        });
    }, [EmpId, taskDate]);
    const handlePanelChange = (panel) => (event, isExpanded) => {
        if (panel === -1) return;
        debugger
        axios.post(nodeurl['nodeurl'], { query: 'AB_ModuleList ' + Details[panel]['ProjectId'] }).then(result => {
            setModule(result.data[0]);
        });
        axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + Details[panel]['ProjectId'] + ',' + Details[panel]['ModuleId'] + ',' + 0 + ',' + EmpId }).then(result => {
            setTasks(result.data[0]);
        });
        setExpanded(isExpanded ? panel : false);
        setActiveTab(panel + 1);
    };
    const handelClick = () => {
        for (let i = 0; i < Details.length; i++) {
            debugger
            axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'AB_SaveTimesheetDetail ', UpdateJson: JSON.stringify(Details[i]) }).then(result => {
                alert()
            });
        }
    }
    const TimeSheetTab = (index) => {

        if (index === undefined) return;
        else index = index['index']

        const handelOnChange = (event) => {
            const newState = Details.map((obj, index_) => {
                if (index === index_)
                    return { ...obj, [event.target.name]: event.target.value };
                return obj;
            });
            setDetails(newState);
        }

        const handelProjectChange = (event) => {
            axios.post(nodeurl['nodeurl'], { query: 'AB_ModuleList ' + event.target.value }).then(Module_ => {
                setModule(Module_.data[0]);
                axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + event.target.value + ',' + Module_.data[0][0]['ModuleId'] + ',' + 0 + ',' + EmpId }).then(Tasks_ => {
                    setTasks(Tasks_.data[0]);
                    const newState = Details.map((obj, index_) => {
                        if (index === index_)
                            return { ...obj, 'ModuleId': Module_.data[0][0]['ModuleId'], 'ProjectId': event.target.value, 'TaskId': Tasks_.data[0][0]['TaskId'] };
                        return obj;
                    });
                    setDetails(newState);
                });
            });
            handelOnChange(event);

        }
        const handelModuleChange = (event) => {
            handelOnChange(event);
            axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + Details[index]['ProjectId'] + ',' + event.target.value + ',' + 0 + ',' + EmpId }).then(result => {
                setTasks(result.data[0]);
            });
        }

        return (
            <>
                <div style={{ margin: '15px 0 0 0', width: '99%' }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '70%' }}>
                            <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                <div className="input-holder">
                                    <select className="input-input" name="ProjectId" value={Details[index]['ProjectId']} onChange={handelProjectChange}>
                                        {Project.map((item, index) => (
                                            <option key={index} value={item['ProjectId']}>{item['ProjectName']}</option>
                                        ))}
                                    </select>
                                    <label className="input-label">Project</label>
                                </div>
                            </div>

                            <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                <div className="input-holder">
                                    <select className="input-input" name="ModuleId" value={Details[index]['ModuleId']} onChange={handelModuleChange} >
                                        {Module.map((item, index) => (
                                            <option key={index} value={item['ModuleId']}>{item['ModuleName']}</option>
                                        ))}
                                    </select>
                                    <label className="input-label">Module</label>
                                </div>
                            </div>
                            <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                <div className="input-holder">
                                    <select className="input-input" name="TaskId" value={Details[index]['TaskId']} onChange={handelOnChange}>
                                        {Tasks.map((item, index) => (
                                            <option key={index} value={item['TaskId']}>{item['TaskName']}</option>
                                        ))}
                                    </select>
                                    <label className="input-label">Task</label>
                                </div>
                            </div>

                            <div className="input-wrapper marginLeft-0" style={{ width: '40%' }}>
                                <div className="input-holder">
                                    <select className="input-input" name="StatusId" value={Details[index]['StatusId']} onChange={handelOnChange}>
                                        {Status.map((item, index) => (
                                            <option key={index} value={item['TypeOptionID']}>{item['TypeName']}</option>
                                        ))}
                                    </select>
                                    <label className="input-label">Status</label>
                                </div>
                            </div>
                            <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                <div className="input-holder">
                                    <input type="text" className="input-input" name="Issues" value={Details[index]['Issues']} onChange={handelOnChange} />
                                    <label className="input-label">Issue</label>
                                </div>
                            </div>
                            <div className="input-wrapper marginLeft-0" style={{ width: '20%' }}>
                                <div className="input-holder">
                                    <input type="text" className="input-input" name="Hours" value={Details[index]['Hours']} onChange={handelOnChange} />
                                    <label className="input-label">Hours</label>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '35%' }}>
                            <div className="input-wrapper marginLeft-0" style={{ width: '100%' }} >
                                <div className="input-holder">
                                    <textarea type="text" className="input-input" name="TaskDescription" value={Details[index]['TaskDescription']} onChange={handelOnChange} style={{ height: '155px' }} />
                                    <label className="input-label">Task Description</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            <div style={{ width: '95%', border: '1px solid' + localStorage['BgColor'], borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}>
                <Accordion expanded="false" onChange={handlePanelChange(-1)}>
                    <AccordionSummary style={{ color: localStorage['Color'], backgroundColor: localStorage['BgColor'], }}>
                        <Typography component={"span"} sx={{ width: '10%', flexShrink: 0 }}>
                            Project
                        </Typography>
                        <Typography component={"span"} sx={{ width: '12%', flexShrink: 0 }}>
                            Module
                        </Typography>
                        <Typography component={"span"} sx={{ width: '12%', flexShrink: 0 }}>
                            Task
                        </Typography>
                        <Typography component={"span"} sx={{ width: '28%', flexShrink: 0 }}>
                            Task Description
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Status
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Hours
                        </Typography>
                    </AccordionSummary>

                </Accordion>

                {Array.isArray(Details) ? Details.map((column, index) => (
                    <Accordion key={index} expanded={expanded === index} className={expanded === index ? 'activeAcc' : ''} onChange={column['LeaveType'] === 'Total' ? handlePanelChange(-1) : handlePanelChange(index)} >
                        <AccordionSummary className={expanded === index ? 'activeAccSum' : ''}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography component={"span"} sx={{ width: '7%', flexShrink: 0 }}>
                                {column['ProjectName']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: '12%', flexShrink: 0, padding: '0 30px' }}>
                                {column['ModuleName']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: '12%', flexShrink: 0, padding: '0 30px' }}>
                                {column['TaskName']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: '30%', flexShrink: 0, padding: '0 30px' }}>
                                {column['TaskDescription']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: '16%', flexShrink: 0, padding: '0 30px' }}>
                                {column['Status']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: '16%', flexShrink: 0, padding: '0 30px' }}>
                                {column['Hours']}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component={"span"}>
                                {index !== undefined ? <TimeSheetTab index={index} /> : <></>}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                )) : null}
            </div>
            <div>
                <button className="btn" style={{ margin: '0' }} onClick={handelClick}>Apply</button>
            </div>
        </>
    );
}