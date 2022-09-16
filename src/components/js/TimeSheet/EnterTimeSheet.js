import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useAlert } from "react-alert";

export default function EnterTimeSheet() {
    const EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [expanded, setExpanded] = useState(false);
    // const [ActiveTab, setActiveTab] = useState(1);
    const [Details, setDetails] = useState([]);
    const [Project, setProject] = useState([]);
    const [Module, setModule] = useState([]);
    const [Tasks, setTasks] = useState([]);
    const [Status, setStatus] = useState([]);
    const [taskDate, setTaskDate] = useState((new Date().toLocaleDateString()).toString());
    const taskDateArr = [
        // (new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()).toString(),
        (new Date(new Date().setDate(new Date().getDate())).toLocaleDateString()).toString(),
        (new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()).toString(),
        (new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString()).toString(),
        (new Date(new Date().setDate(new Date().getDate() - 3)).toLocaleDateString()).toString(),
        (new Date(new Date().setDate(new Date().getDate() - 4)).toLocaleDateString()).toString(),
        // (new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString()).toString(),
        // (new Date(new Date().setDate(new Date().getDate() - 6)).toLocaleDateString()).toString(),
        // (new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString()).toString(),
        // (new Date(new Date().setDate(new Date().getDate() - 8)).toLocaleDateString()).toString(),
        // (new Date(new Date().setDate(new Date().getDate() - 9)).toLocaleDateString()).toString(),
        // (new Date(new Date().setDate(new Date().getDate() - 10)).toLocaleDateString()).toString(),
    ];

    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'AB_Inprogressgrid ' + EmpId + ',"' + taskDate + '",0' }).then(result => {
            if (result.data[0].length === 0) {
                let index = 0;
                // setDetails([{
                //     Row: index, EmpId: EmpId, Id: 0, ProjectName: '', ProjectId: 1, ModuleId: 1,
                //     ModuleName: '', TaskName: '', TaskId: 1, TaskDate: moment(taskDate).format('YYYY-MM-DD'), Issues: '',
                //     Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2
                // }]);
                setTimeout(() => {
                    // setExpanded(index);
                    let ele = document.querySelector('select[name="ProjectId"][index="' + index + '"]');
                    if (ele !== null)
                        ele.dispatchEvent(new Event('change', { bubbles: true }));
                }, 100);
            }
            else {
                setDetails(result.data[0]);
            }
            setProject(result.data[1]);
            setModule(result.data[2]);
            setStatus(result.data[3]);
        });
    }, [EmpId, taskDate]);
    const handleRemove = (index) => {
        axios.post(nodeurl['nodeurl'], { query: 'Delete FROM ABMonthlyTimesheet WHERE Id=' + Details[index]['Id'] + ' AND Empid=' + EmpId }).then(result => {
            setDetails(Details_ =>
                Details_.filter((item, index_) => {
                    return parseInt(index) !== index_;
                }),
            );
        });

    }
    const handlePanelChange = (panel) => (event, isExpanded) => {
        if ((event.target.tagName === 'path' || event.target.tagName === 'div' || event.target.tagName === 'svg') && panel === -1) {
            if (event.target.tagName === 'path') {
                if (event.target.attributes.fill !== undefined) {
                    if (event.target.parentNode.attributes.index !== undefined) {
                        handleRemove(event.target.parentNode.attributes.index.value)
                        return;
                    }
                }
            }
            if (event.target.tagName === 'svg') {
                if (event.target.parentNode.attributes.index !== undefined) {
                    handleRemove(event.target.parentNode.attributes.index.value)
                    return;
                }
            }
            if (event.target.tagName === 'div') {
                if (event.target.parentNode.attributes.index !== undefined) {
                    handleRemove(event.target.parentNode.attributes.index.value)
                    return;
                }
            }
        }
        axios.post(nodeurl['nodeurl'], { query: 'AB_ModuleList ' + Details[panel]['ProjectId'] }).then(result => {
            setModule(result.data[0]);
        });
        axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + Details[panel]['ProjectId'] + ',' + Details[panel]['ModuleId'] + ',' + 0 + ',' + EmpId }).then(result => {
            setTasks(result.data[0]);
        });
        setExpanded(isExpanded ? panel : false);
        // setActiveTab(panel + 1);
    };
    const handelAddClick = () => {
        let newRow = Details[Details.length - 1] || -1;
        let index = Details.length;
        if (newRow === -1) {
            setDetails([...Details, {
                Row: index, EmpId: EmpId, Id: 0, ProjectName: '', ProjectId: 1, ModuleId: 1,
                ModuleName: '', TaskName: '', TaskId: 1, TaskDate: moment(taskDate).format('YYYY-MM-DD'), Issues: '',
                Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2
            }]);
        } else {
            setDetails([...Details, {
                Row: Details.length, EmpId: EmpId, Id: 0, ProjectName: newRow['ProjectName'], ProjectId: newRow['ProjectId'], ModuleId: newRow['ModuleId'],
                ModuleName: newRow['ModuleName'], TaskName: newRow['TaskName'], TaskId: newRow['TaskId'], TaskDate: moment(taskDate).format('YYYY-MM-DD'), Issues: '',
                Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2
            }]);
        }
        setTimeout(() => {
            setExpanded(index);
            let ele = document.querySelector('select[name="ProjectId"][index="' + index + '"]');
            ele.dispatchEvent(new Event('change', { bubbles: true }));
        }, 100);
    }
    const handelClick = () => {
        for (let i = 0; i < Details.length; i++) {
            Details[i] = { ...Details[i], TaskDate: moment(taskDate).format('YYYY-MM-DD') }
        }
            axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'AB_SaveTimesheetDetail ', UpdateJson: JSON.stringify(Details) }).then(result => {
                setExpanded(-1);
                alert.success("Details Saved successfully.");
            });
    }
    const handelOnChange = (event) => {
        const newState = Details.map((obj, index_) => {
            if (parseInt(parseInt(event.target.attributes.index.value)) === index_) {
                if (event.target.name === 'ProjectId') {
                    return { ...obj, [event.target.name]: event.target.value, 'ProjectName': event.target.options[event.target.selectedIndex].text };
                } else if (event.target.name === 'ModuleId') {
                    return { ...obj, [event.target.name]: event.target.value, 'ModuleName': event.target.options[event.target.selectedIndex].text };
                } else if (event.target.name === 'TaskId') {
                    return { ...obj, [event.target.name]: event.target.value, 'TaskName': event.target.options[event.target.selectedIndex].text };
                } else if (event.target.name === 'StatusId') {
                    return { ...obj, [event.target.name]: event.target.value, 'Status': event.target.options[event.target.selectedIndex].text };
                }
                return { ...obj, [event.target.name]: event.target.value };
            }
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
                    if (parseInt(event.target.attributes.index.value) === index_)
                        return { ...obj, 'ModuleId': Module_.data[0][0]['ModuleId'], 'ModuleName': Module_.data[0][0]['ModuleName'], 'ProjectName': event.target.options[event.target.selectedIndex].text, 'ProjectId': event.target.value, 'TaskId': Tasks_.data[0][0]['TaskId'], 'TaskName': Tasks_.data[0][0]['TaskName'] };
                    return obj;
                });
                setDetails(newState);
            });
        });
        handelOnChange(event);

    }
    const handelModuleChange = (event) => {
        handelOnChange(event);
        axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + Details[parseInt(event.target.attributes.index.value)]['ProjectId'] + ',' + event.target.value + ',' + 0 + ',' + EmpId }).then(result => {
            setTasks(result.data[0]);
            const newState = Details.map((obj, index_) => {
                if (parseInt(event.target.attributes.index.value) === index_) {
                    let TaskId = '', TaskName = '';
                    if (result.data[0].length > 0) {
                        TaskId = result.data[0][0]['TaskId'];
                        TaskName = result.data[0][0]['TaskName'];
                    } else {
                        TaskId = ''; TaskName = '';
                    }
                    return { ...obj, [event.target.name]: event.target.value, 'ModuleName': event.target.options[event.target.selectedIndex].text, 'TaskId': TaskId, 'TaskName': TaskName };
                }
                return obj;
            });
            setDetails(newState);
        });
    }
    const handelTaskDateChange = (e) => {
        setTaskDate(e.target.value);
        axios.post(nodeurl['nodeurl'], { query: 'AB_Inprogressgrid ' + EmpId + ',"' + e.target.value + '",1' }).then(result => {
            if (result.data[0].length === 0) {
                let index = 0;
                // setDetails([{
                //     Row: index, EmpId: EmpId, Id: 0, ProjectName: '', ProjectId: 1, ModuleId: 1,
                //     ModuleName: '', TaskName: '', TaskId: 1, TaskDate: moment(e.target.value).format('YYYY-MM-DD'), Issues: '',
                //     Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2
                // }]);
                setDetails(result.data[0]);

                setTimeout(() => {
                    // setExpanded(index);
                    let ele = document.querySelector('select[name="ProjectId"][index="' + index + '"]');
                    ele.dispatchEvent(new Event('change', { bubbles: true }));
                }, 100);
            }
            else {
                setDetails(result.data[0]);
            }
        });
    }
    return (
        <>
            <div style={{ textAlign: 'right' }}>
                <div className="input-wrapper timeSheetDate" style={{ width: '15%', height: '35px' }} >
                    <div className="input-holder">
                        <select className="input-input" style={{ width: '100%', fontSize: '17px' }} onChange={handelTaskDateChange} value={taskDate} name="taskDate">
                            {taskDateArr.map((item, index) => (
                                <option key={index} value={item}>{moment(item).format('DD-MM-YYYY')}</option>
                            ))}
                        </select>
                        <label className="input-label" style={{ height: '60px' }}>Task Date</label>
                    </div>
                </div>
            </div>
            <div id="EnterTimeSheet" style={{ marginTop: '20px', border: '1px solid' + localStorage['BgColor'], borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}>
                <Accordion expanded={false} onChange={handlePanelChange(-1)}>
                    <AccordionSummary style={{ color: localStorage['Color'], backgroundColor: localStorage['BgColor'], maxHeight: '48px', minHeight: '48px' }}>
                        <Typography component={"span"} sx={{ width: '10%', flexShrink: 0 }}>
                            Project
                        </Typography>
                        <Typography component={"span"} sx={{ width: '12%', flexShrink: 0 }}>
                            Module
                        </Typography>
                        <Typography component={"span"} sx={{ width: '12%', flexShrink: 0 }}>
                            Task
                        </Typography>
                        <Typography component={"span"} sx={{ width: '29%', flexShrink: 0 }}>
                            Task Description
                        </Typography>
                        <Typography component={"span"} sx={{ width: '15%', flexShrink: 0 }}>
                            Status
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Hours
                        </Typography>

                    </AccordionSummary>
                </Accordion>

                {Details.length > 0 ? Details.map((column, index) => (
                    <Accordion key={index} expanded={expanded === index} className={expanded === index ? 'activeAcc' : ''} onChange={handlePanelChange(index)} >
                        <AccordionSummary className={expanded === index ? 'activeAccSum' : ''}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography component={"span"} sx={{ width: '10%', flexShrink: 0 }}>
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
                            <Typography component={"span"} sx={{ width: '12%', flexShrink: 0, padding: '0 30px' }}>
                                {column['Hours']}
                            </Typography>
                            <div className='Remove' style={{ marginTop: '10px' }} index={index} onClick={handlePanelChange(-1)}>
                                <FontAwesomeIcon icon={faTrashAlt} index={index} style={{ color: localStorage['BgColor'], fontSize: '18px' }} className="icon" />
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component={"span"}>
                                {
                                    <div style={{ margin: '15px 0 0 0' }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: '70%' }}>
                                                <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                    <div className="input-holder">
                                                        <select className="input-input" name="ProjectId" index={index} value={Details[index]['ProjectId']} onChange={handelProjectChange}>
                                                            {Project.map((item, index) => (
                                                                <option key={index} value={item['ProjectId']}>{item['ProjectName']}</option>
                                                            ))}
                                                        </select>
                                                        <label className="input-label">Project</label>
                                                    </div>
                                                </div>

                                                <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                    <div className="input-holder">
                                                        <select className="input-input" name="ModuleId" index={index} value={Details[index]['ModuleId']} onChange={handelModuleChange} >
                                                            {Module.map((item, index) => (
                                                                <option key={index} value={item['ModuleId']}>{item['ModuleName']}</option>
                                                            ))}
                                                        </select>
                                                        <label className="input-label">Module</label>
                                                    </div>
                                                </div>
                                                <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                    <div className="input-holder">
                                                        <select className="input-input" name="TaskId" index={index} value={Details[index]['TaskId']} onChange={handelOnChange}>
                                                            {Tasks.map((item, index) => (
                                                                <option key={index} value={item['TaskId']}>{item['TaskName']}</option>
                                                            ))}
                                                        </select>
                                                        <label className="input-label">Task</label>
                                                    </div>
                                                </div>

                                                <div className="input-wrapper marginLeft-0" style={{ width: '40%' }}>
                                                    <div className="input-holder">
                                                        <select className="input-input" name="StatusId" index={index} value={Details[index]['StatusId']} onChange={handelOnChange}>
                                                            {Status.map((item, index) => (
                                                                <option key={index} value={item['TypeOptionID']}>{item['TypeName']}</option>
                                                            ))}
                                                        </select>
                                                        <label className="input-label">Status</label>
                                                    </div>
                                                </div>
                                                <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                    <div className="input-holder">
                                                        <input type="text" className="input-input" name="Issues" index={index} value={Details[index]['Issues']} onChange={handelOnChange} />
                                                        <label className="input-label">Issue</label>
                                                    </div>
                                                </div>
                                                <div className="input-wrapper marginLeft-0" style={{ width: '20%' }}>
                                                    <div className="input-holder">
                                                        <input type="text" className="input-input" name="Hours" index={index} value={Details[index]['Hours']} onChange={handelOnChange} />
                                                        <label className="input-label">Hours</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ width: '35%' }}>
                                                <div className="input-wrapper marginLeft-0" style={{ width: '100%' }} >
                                                    <div className="input-holder">
                                                        <textarea type="text" className="input-input" name="TaskDescription" index={index} value={Details[index]['TaskDescription']} onChange={handelOnChange} style={{ height: '155px' }} />
                                                        <label className="input-label">Task Description</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                )) :
                    <Accordion expanded={false} onChange={handlePanelChange(-1)}>
                        <AccordionSummary style={{ maxHeight: '48px', minHeight: '48px' }}>
                            <Typography component={"span"} sx={{ width: '100%', textAlign: 'center' }}>
                                No Rows Found...!
                            </Typography>
                        </AccordionSummary>
                    </Accordion>
                }
            </div>
            <div style={{ textAlign: 'right' }}>
                <button className="btn marginLeft-0 " onClick={handelAddClick}>Add New</button>
                <button className="btn marginLeft-0 marginRight-0 " onClick={handelClick}>Save Details</button>
            </div>
        </>
    );
}