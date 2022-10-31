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
import DatePicker from './../../Sub-Component/DatePicker/DatePicker';
import { confirm } from "react-confirm-box";

export default function EnterTimeSheet() {
    const EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [expanded, setExpanded] = useState(false);
    const [Details, setDetails] = useState([]);
    const [Project, setProject] = useState([]);
    const [Module, setModule] = useState([]);
    const [Tasks, setTasks] = useState([]);
    const [Status, setStatus] = useState([]);
    const [totalHours, setTotalHours] = useState(0.00);
    const [taskDate, setTaskDate] = useState((new Date().toLocaleDateString()).toString());
    // const [holiDays, setHoliDays] = useState([]);
    const [holiDayList, setHoliDayList] = useState([]);
    const optionsWithLabelChange = {
        closeOnOverlayClick: true,
        labels: {
            confirmable: "Confirm",
            cancellable: "Cancel"
        }
    };
    // const taskDateArr = [
    //     (new Date(new Date().setDate(new Date().getDate())).toLocaleDateString()).toString(),
    //     (new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()).toString(),
    //     (new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString()).toString(),
    //     (new Date(new Date().setDate(new Date().getDate() - 3)).toLocaleDateString()).toString(),
    //     (new Date(new Date().setDate(new Date().getDate() - 4)).toLocaleDateString()).toString(),
    // ];

    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'AB_Inprogressgrid ' + EmpId + ',"' + taskDate + '",0' }).then(result => {
            setProject(result.data[1]);
            setStatus(result.data[3]);
            if (result.data[0].length === 0 && taskDate === (new Date().toLocaleDateString()).toString()) {
                setDetails([{
                    Row: 0, EmpId: EmpId, Id: 0, ProjectName: '--Select--', ProjectId: '-1', ModuleId: '-1',
                    ModuleName: '--Select--', TaskName: '--Select--', TaskId: '-1', TaskDate: moment(new Date(taskDate)).format('YYYY-MM-DD'), Issues: '',
                    Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2, CompletionDate: new Date()
                }]);
                setExpanded(0);
                setModule([]);
                setTasks([]);
            }
            else {
                setDetails(result.data[0]);
                setModule(result.data[2]);
            }
        });
        axios.post(nodeurl['nodeurl'], { query: 'Menus_HolidayList' }).then(result => {
            setHoliDayList(result.data[0]);
            // setHoliDays(result.data[0].map(function (item) { return moment(item['Holiday_Date']).format('MM-DD-YYYY') }));
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
        let index = Details['length'];
        let newArr = [...Details, {
            Row: index, EmpId: EmpId, Id: 0, ProjectName: '--Select--', ProjectId: '-1', ModuleId: '-1',
            ModuleName: '--Select--', TaskName: '--Select--', TaskId: '-1', TaskDate: moment(new Date(taskDate)).format('YYYY-MM-DD'), Issues: '',
            Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2, CompletionDate: new Date()
        }];
        setDetails(newArr);
        setExpanded(index);
        setModule([]);
        setTasks([]);
        // setTimeout(() => {
        //     let ele = document.querySelector('select[name="ProjectId"][index="' + index + '"]');
        //     ele.dispatchEvent(new Event('change', { bubbles: true }));
        // }, 100);
    }
    const handelConfirm = async (msg) => {
        if (await confirm(msg, optionsWithLabelChange)) {
            handelSave();
        }
    }
    const handelSave = () => {
        for (let i = 0; i < Details.length; i++) {
            Details[i] = { ...Details[i], TaskDate: moment(new Date(taskDate)).format('YYYY-MM-DD') }
        }
        axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'AB_SaveTimesheetDetail ', UpdateJson: JSON.stringify(Details) }).then(result => {
            setExpanded(-1);
            alert.success("Details Saved successfully.");
        });
    }
    const handelClick = () => {
        let dayName = '', day = new Date(taskDate).getDay();
        if (day === 0) dayName = 'Sunday'
        else if (day === 6) dayName = 'Saturday';
        if (dayName === '')
            holiDayList.each((item) => { if (moment(taskDate).format('MM-DD-YYYY') === moment(item['Holiday_Date']).format('MM-DD-YYYY')) dayName = 'Holiday(' + item['Holiday_Name'] + ')' });
        if (dayName !== '') {
            let msg = <>The selected day is <b>{dayName}. </b><br /> Are you Sure want to continue the timesheet entry for the day ?</>;
            handelConfirm(msg);
        } else {
            handelSave();
        }
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
        let totalHours = 0.00;
        newState.each((item) => { totalHours += parseFloat(item['Hours']) });
        totalHours = isNaN(totalHours) ? 0.00 : totalHours;
        setTotalHours(totalHours.toFixed(2));
        setDetails(newState);
    }

    const handelProjectChange = (event) => {
        if (event.target.value === '-1') {
            const newState = Details.map((obj, index_) => {
                if (parseInt(event.target.attributes.index.value) === index_)
                    return { ...obj, 'ModuleId': '-1', 'ModuleName': '--Select--', 'ProjectName': '--Select--', 'ProjectId': '-1', 'TaskId': '-1', 'TaskName': '--Select--' };
                return obj;
            });
            setModule([]);
            setTasks([]);
            setDetails(newState);
            return;
        }
        handelOnChange(event);
        axios.post(nodeurl['nodeurl'], { query: 'AB_ModuleList ' + event.target.value }).then(Module_ => {
            setModule(Module_.data[0]);
            setTimeout(() => {
                axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + event.target.value + ',' + Module_.data[0][0]['ModuleId'] + ',' + 0 + ',' + EmpId }).then(Tasks_ => {
                    setTasks(Tasks_.data[0]);
                    setTimeout(() => {
                        const newState = Details.map((obj, index_) => {
                            if (parseInt(event.target.attributes.index.value) === index_)
                                return { ...obj, 'ModuleId': Module_.data[0][0]['ModuleId'], 'ModuleName': Module_.data[0][0]['ModuleName'], 'ProjectName': event.target.options[event.target.selectedIndex].text, 'ProjectId': event.target.value, 'TaskId': Tasks_.data[0][0]['TaskId'], 'TaskName': Tasks_.data[0][0]['TaskName'] };
                            return obj;
                        });
                        setDetails(newState);
                    }, 0);
                });
            }, 0);
        });
    }
    const handelModuleChange = (event) => {
        if (event.target.value === '-1') {
            const newState = Details.map((obj, index_) => {
                if (parseInt(event.target.attributes.index.value) === index_)
                    return { ...obj, 'ModuleId': '-1', 'ModuleName': '--Select--', 'TaskId': '-1', 'TaskName': '--Select--' };
                return obj;
            });
            setTasks([]);
            setDetails(newState);
            return;
        }
        handelOnChange(event);
        axios.post(nodeurl['nodeurl'], { query: 'AB_TaskList ' + Details[parseInt(event.target.attributes.index.value)]['ProjectId'] + ',' + event.target.value + ',' + 0 + ',' + EmpId }).then(result => {
            setTasks(result.data[0]);
            const newState = Details.map((obj, index_) => {
                if (parseInt(event.target.attributes.index.value) === index_) {
                    let TaskId = '-1', TaskName = '--Select--';
                    if (result.data[0].length > 0) {
                        TaskId = result.data[0][0]['TaskId'] || '-1';
                        TaskName = result.data[0][0]['TaskName'] || '--Select--';
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
            if (result.data[0].length === 0 && taskDate === (new Date().toLocaleDateString()).toString()) {
                setDetails([{
                    Row: Details.length, EmpId: EmpId, Id: 0, ProjectName: '--Select--', ProjectId: '-1', ModuleId: '-1',
                    ModuleName: '--Select--', TaskName: '--Select--', TaskId: '-1', TaskDate: moment(new Date(taskDate)).format('YYYY-MM-DD'), Issues: '',
                    Object: '', TaskDescription: '', Hours: '0.00', Status: 'In Progress', StatusId: 2, CompletionDate: new Date()
                }]);
                setExpanded(0);
                setModule([]);
                setTasks([]);
            }
            else {
                setDetails(result.data[0]);
                setExpanded(-1);
            }
        });
    }
    const isDisable = (flag) => {
        let isValidate = false;
        if (flag === 0 && Details.length > 0) {
            let lastRow = Details[Details.length - 1];
            if (lastRow['ProjectId'] === '-1' || lastRow['ModuleId'] === '-1' || lastRow['TaskId'] === '-1' ||
                lastRow['TaskDescription'] === '' || lastRow['StatusId'] === '0') {
                isValidate = true;
            }
        } else if (flag === 1 && Details.length > 0) {
            for (let i = 0; i < Details.length; i++) {
                let row = Details[i];
                if (row['ProjectId'] === '-1' || row['ModuleId'] === '-1' || row['TaskId'] === '-1' ||
                    row['TaskDescription'] === '' || row['StatusId'] === '0') {
                    isValidate = true;
                }
            }
        }
        return { disabled: isValidate };
    }
    return (
        <>
            <div style={{ textAlign: 'right', marginRight: '10px' }}>
                <div className="input-wrapper timeSheetDate" style={{ width: '15%', height: '35px' }} >
                    <div className="input-holder">
                        {/* <select className="input-input" style={{ width: '100%', fontSize: '17px' }} onChange={handelTaskDateChange} value={taskDate} name="taskDate">
                            {taskDateArr.map((item, index) => (
                                <option key={index} value={item}>{moment(new Date(item.replaceAll('/', '-'))).format('DD-MM-YYYY')}</option>
                            ))}
                        </select> */}
                        <DatePicker name="taskDate" isWeekEndDisable={false} showHoliDay={true} minDate_={new Date(new Date().setDate(new Date().getDate() - 5))} Value={new Date()} valueChange={handelTaskDateChange} />
                        <label className="input-label" style={{ height: '60px' }}>Task Date</label>
                    </div>
                </div>
            </div>
            <div className="body-Container" style={{ marginTop: '20px', maxHeight: 'calc(100vh - 245px)' }}>
                <div id="EnterTimeSheet" style={{ border: '1px solid' + localStorage['BgColor'], borderTopRightRadius: '5px', borderTopLeftRadius: '5px', marginRight: '10px' }}>
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
                                    {(parseFloat(column['Hours'])).toFixed(2)}
                                </Typography>
                                <div className='Remove' style={{ marginTop: '10px' }} index={index} onClick={handlePanelChange(-1)}>
                                    <FontAwesomeIcon icon={faTrashAlt} index={index} style={{ color: localStorage['BgColor'], fontSize: '18px' }} onClick={handlePanelChange(-1)} className="icon" />
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
                                                            <select className={"input-input " + (Details[index]['ProjectId'] === '-1' ? 'input-warning' : '')} name="ProjectId" index={index} value={Details[index]['ProjectId']} onChange={handelProjectChange}>
                                                                <option key={-1} value={-1}>--Select--</option>
                                                                {Project.map((item, index) => (
                                                                    <option key={index} value={item['ProjectId']}>{item['ProjectName']}</option>
                                                                ))}
                                                            </select>
                                                            <label className="input-label">Project</label>
                                                        </div>
                                                    </div>

                                                    <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                        <div className="input-holder">
                                                            <select className={"input-input " + (Details[index]['ModuleId'] === '-1' ? 'input-warning' : '')} name="ModuleId" index={index} value={Details[index]['ModuleId']} onChange={handelModuleChange} >
                                                                <option key={-1} value={-1}>--Select--</option>
                                                                {Module.map((item, index) => (
                                                                    <option key={index} value={item['value']}>{item['text']}</option>
                                                                ))}
                                                            </select>
                                                            <label className="input-label">Module</label>
                                                        </div>
                                                    </div>
                                                    <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                        <div className="input-holder">
                                                            <select className={"input-input " + (Details[index]['TaskId'] === '-1' ? 'input-warning' : '')} name="TaskId" index={index} value={Details[index]['TaskId']} onChange={handelOnChange}>
                                                                <option key={-1} value={-1}>--Select--</option>
                                                                {Tasks.map((item, index) => (
                                                                    <option key={index} value={item['value']}>{item['text']}</option>
                                                                ))}
                                                            </select>
                                                            <label className="input-label">Task</label>
                                                        </div>
                                                    </div>

                                                    <div className="input-wrapper marginLeft-0" style={{ width: '20%' }}>
                                                        <div className="input-holder">
                                                            <select className={"input-input " + (Details[index]['StatusId'] === '0' ? 'input-warning' : '')} name="StatusId" index={index} value={Details[index]['StatusId']} onChange={handelOnChange}>
                                                                {Status.map((item, index) => (
                                                                    <option key={index} value={item['TypeOptionID']}>{item['TypeName']}</option>
                                                                ))}
                                                            </select>
                                                            <label className="input-label">Status</label>
                                                        </div>
                                                    </div>
                                                    <div className="input-wrapper marginLeft-0" style={{ width: '30%' }}>
                                                        <div className="input-holder">
                                                            <input type="text" className="input-input" name="Issues" placeholder="Facing Issues?" index={index} value={Details[index]['Issues']} onChange={handelOnChange} />
                                                            <label className="input-label">Issue</label>
                                                        </div>
                                                    </div>
                                                    <div className="input-wrapper marginLeft-0" style={{ width: '20%' }}>
                                                        <div className="input-holder">
                                                            <DatePicker name="CompletionDate" isWeekEndDisable={false} minDate_={new Date()} Value={new Date(Details[index]['CompletionDate'])} index={index} valueChange={handelOnChange} />
                                                            <label className="input-label">Completion Date</label>
                                                        </div>
                                                    </div>
                                                    <div className="input-wrapper marginLeft-0" style={{ width: '20%' }}>
                                                        <div className="input-holder">
                                                            <input type="text" className="input-input" name="Hours" index={index}
                                                                onBlur={(e) => {
                                                                    if (e.target.value === '') e.target.value = 0.00;
                                                                    e.target.value = parseFloat(e.target.value).toFixed(2);
                                                                    handelOnChange(e);
                                                                }}
                                                                value={Details[index]['Hours']}
                                                                onChange={(event) => {
                                                                    let value = event.target.value;
                                                                    if ((isNaN(value.substr(value.length - 1)) && value.substr(value.length - 1) !== '.')) return;
                                                                    handelOnChange(event);
                                                                }
                                                                } />
                                                            <label className="input-label">Hours</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '35%' }}>
                                                    <div className="input-wrapper marginLeft-0" style={{ width: '100%', zIndex: 0 }} >
                                                        <div className="input-holder">
                                                            <textarea type="text" className={"input-input " + (Details[index]['TaskDescription'] === '' ? 'input-warning' : '')} name="TaskDescription" placeholder="Start Typing your Description" index={index} value={Details[index]['TaskDescription']} onChange={handelOnChange} style={{ height: '155px' }} />
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
                                <Typography component={"span"} sx={{ width: '100%', textAlign: 'center' }} style={{ height: '35px' }}>
                                    No Rows Found...!
                                </Typography>
                            </AccordionSummary>
                        </Accordion>
                    }
                </div>
            </div>
            <div style={{ textAlign: 'right', marginRight: '10px' }}>
                <h4 style={{ display: 'inline-block' }}>Total Hours:<h1 style={{ color: 'inherit', textAlign: 'right', marginRight: '20px', display: 'inline-block', padding: '0 0 0 5px' }}>{totalHours}</h1></h4>
                <button className="btn marginLeft-0 " {...isDisable(1)} onClick={handelAddClick}>Add Row</button>
                <button className="btn marginLeft-0 marginRight-0 " {...isDisable(1)} onClick={handelClick}>Save</button>
            </div>
        </>
    );
}