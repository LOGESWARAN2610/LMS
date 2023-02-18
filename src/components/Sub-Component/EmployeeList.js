import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nodeurl from '../../nodeServer.json';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import setTheme from './setTheme';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import moment from 'moment';
import { useAlert } from "react-alert";
import DatePicker from './DatePicker/DatePicker'
import { confirm } from "react-confirm-box";

export default function EmployeeList() {
    var date = new Date();
    date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + date.getFullYear()
    const [Details, setDetails] = useState([]);
    const [DescDetails, setDescDetails] = useState([]);
    const [ReportManagers, setReportManagers] = useState([]);
    const [EmployeeList, setEmployeeList] = useState([]);
    const EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'LM_GetEmployeeDetails ' + EmpId }).then(result => {
            let arr = result.data[0];
            arr.forEach((item, index) => { item['Active'] === 1 ? item['Active'] = true : item['Active'] = false })
            setDetails(arr);
            setDescDetails(result.data[1]);
            setReportManagers(result.data[2]);
            setEmployeeList(result.data[3]);
        });
        setTheme();
    }, [EmpId]);
    const handelOnChange = () => {

    }
    const getManagerName = (value) => {
        let arr = ReportManagers.filter((item) => { return parseInt(item['value']) === parseInt(value) });
        if (arr.length > 0) return arr[0]['text'];
        else return '';
    }
    const getDescName = (value) => {
        let arr = DescDetails.filter((item) => { return parseInt(item['value']) === parseInt(value) });
        if (arr.length > 0) return arr[0]['text'];
        else return '';
    }
    const getAddReportName = (value) => {
        value = ',' + value + ',';
        let arr = [];
        EmployeeList.map((item, index) => {
            let id = ',' + item['id'] + ',';
            if (value.indexOf(id) !== -1)
                arr.push(item['name']);
        });
        return arr.join(',');
    }

    const handlePanelChange = (panel) => (event, isExpanded) => {
        if ((event.target.tagName === 'path' || event.target.tagName === 'div' || event.target.tagName === 'svg')) {
            if (event.target.tagName === 'path') {
                if (event.target.attributes.fill !== undefined) {
                    if (event.target.parentNode.attributes.index !== undefined) {
                        handleRemove(event.target.parentNode.attributes.index.value)
                        event.preventDefault()
                        return false;
                    }
                }
            }
            if (event.target.tagName === 'svg') {
                if (event.target.parentNode.attributes.index !== undefined) {
                    handleRemove(event.target.parentNode.attributes.index.value);
                    event.preventDefault()
                    return false;
                }
            }
            if (event.target.tagName === 'div') {
                if (event.target.parentNode.attributes.index !== undefined) {
                    handleRemove(event.target.parentNode.attributes.index.value)
                    event.preventDefault()
                    return false;
                }
            }
        } else if (event.target.tagName === 'INPUT') {
            panel = true;
        }
        if (panel === -1) setExpanded(false);
        else setExpanded(isExpanded ? panel : false);
    };
    const handleInActive = async (value, active) => {
        let arr = Details.filter((item) => { return parseInt(item['Empid']) === parseInt(value) });
        let html = <>
            <h2>Confirmation</h2>
            <div>
                Do you want to make <b>{arr[0]['FirstName']}</b> as InActive Employee?
            </div></>
        if (await confirm(html, { closeOnOverlayClick: true, labels: { confirmable: "Confirm", cancellable: "Cancel" } })) {
            axios.post(nodeurl['nodeurl'], { query: 'UPDATE EmployeeDetails SET Active=0 WHERE Empid =' + arr[0]['Empid'] }).then(result => {
                alert.success("Deleted successfully.");
                let arr = Details;
                arr = arr.map((item, index) => {
                if (item['Empid'] === parseInt(value)) {
                    item['Active'] = !item['Active'];
                }
                return item;
            });
            setDetails(arr);
            });
        }
    }
    const handleRemove = async (value) => {
        let arr = Details.filter((item) => { return parseInt(item['Empid']) === parseInt(value) });
        let html = <>
            <h2>Confirmation</h2>
            <div>
                Do you want to permanently delete <b>{arr[0]['FirstName']}</b> ?
            </div></>
        if (await confirm(html, { closeOnOverlayClick: true, labels: { confirmable: "Confirm", cancellable: "Cancel" } })) {
            axios.post(nodeurl['nodeurl'], { query: 'DELETE FROM EmployeeDetails WHERE Empid =' + arr[0]['Empid'] }).then(result => {
                alert.success("Deleted successfully.");
                let arr = Details;
                arr = arr.filter((item) => { return parseInt(item['Empid']) !== parseInt(value) });
                setDetails(arr);
            });
        }
    }

    const DetailsFields = (props) => {
        const [rowDetails, setRowDetails] = useState({ SurName: 'Mr.', Empid: 0, FirstName: '', LastName: '', PhoneNumber: '', EmailID: '', Address: '', DateOfBirth: date, EmgContactNumber: '', EmgContactName: '', DateOfJoin: date, UserName: '', Password: '', Gender: 2, Hintans: '', Question: 1, ReportsTo: 0 });

        useEffect(() => {
            axios.post(nodeurl['nodeurl'], { query: 'AB_ViewEmpProfile ' + props['EmpId'] }).then(result => {
                setRowDetails(result.data[0][0]);
            });
        }, [props['EmpId']]);

        const handelClick = () => {
            axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'AB_UpdateEmployeeDetail ', UpdateJson: JSON.stringify(rowDetails) }).then(result => {
                alert.success("Updated successfully.");
                setExpanded(false);
            });
        }
        const handelOnChange = (event) => {
            event.target.value = (event.target.value).trim();
            if (event.target.name === 'DateOfBirth') {
                var date = new Date(event.target.value);
                date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + date.getFullYear()
                setRowDetails({ ...rowDetails, [event.target.name]: date });
            }
            else
                setRowDetails({ ...rowDetails, [event.target.name]: event.target.value });
        }

        const Color = () => {
            return {
                sx: {
                    color: localStorage['BgColor'],
                    '&.Mui-checked': {
                        color: localStorage['BgColor'],
                    }
                }
            }
        }
        const isDisable = () => {
            let isValidate = false;
            if (rowDetails['FirstName'] === '' || rowDetails['LastName'] === '' || rowDetails['AliceName'] === '' || rowDetails['PhoneNumber'] === '' || rowDetails['Hintans'] === '' || rowDetails['EmgContactName'] === '' || rowDetails['EmgContactNumber'] === '')
                isValidate = true;
            return { disabled: isValidate };
        }
        return (
            <>
                <div id="profile" style={{ width: '99%' }}>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <select className="input-input" name="Question" value={rowDetails['ReportsTo']} onChange={handelOnChange}>
                                {ReportManagers.map((item, index) => (
                                    <option key={index} value={item['value']}>{item['text']}</option>
                                ))}
                            </select>
                            <label className="input-label">Reports To</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder input2-holder" style={{ boxShadow: '#000c2f4d 1px 2px 5px 0px' }} >
                            <select id="exampleList" className="input-input" name="SurName" value={rowDetails['SurName']} onChange={handelOnChange} style={{ border: 'none', height: '48px', boxShadow: 'none', width: '20%', padding: '0 0 0 10px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                                <option selected >Mr.</option>
                                <option>Mrs.</option>
                                <option>Ms.</option>
                                <option>Miss.</option>
                            </select>
                            <input type="text" placeholder="First Name" className="input-input" list="exampleList" style={{ border: 'none', height: '47px', boxShadow: 'none', width: '80%', padding: '0 10px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} name="FirstName" value={rowDetails['FirstName']} onChange={handelOnChange} />
                            <label className="input-label">First Name</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" className="input-input" name="LastName" placeholder="Last Name" value={rowDetails['LastName']} onChange={handelOnChange} />
                            <label className="input-label">Last Name</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" className="input-input" placeholder="Alice Name" name="AliceName" value={rowDetails['AliceName']} onChange={handelOnChange} />
                            <label className="input-label">Alice Name</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder  input-DatePicker" style={{ width: '48%', float: 'left' }}>
                            {rowDetails['DateOfBirth'] ? <DatePicker name="DateOfBirth" isWeekEndDisable={false} dd={(rowDetails['DateOfBirth'])} Value={((rowDetails['DateOfBirth']).split('-').reverse().join('-'))} valueChange={handelOnChange} /> : <></>}
                            <label className="input-label">Date Of Birth</label>
                        </div>
                        <div className="input-holder" style={{ width: '48%', float: 'right', position: 'relative', zIndex: 11 }}>
                            {rowDetails['DateOfJoin'] ? <DatePicker name="DateOfJoin" dd={(rowDetails['DateOfJoin'])} Value={((rowDetails['DateOfJoin']).split('-').reverse().join('-'))} valueChange={handelOnChange} /> : null}
                            {/* <input type="text" className="input-input" style={{ width: '100%' }} isWeekEndDisable={true} name="DateOfJoin" value={rowDetails['DateOfJoin']} onChange={handelOnChange} /> */}
                            <label className="input-label">Date Of Joining</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="number" placeholder="PhoneNumber" className="input-input" name="PhoneNumber" value={rowDetails['PhoneNumber']} onChange={handelOnChange} />
                            <label className="input-label">Mobile No.</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder" style={{ backgroundColor: 'inherit' }}>
                            <RadioGroup
                                className='radio'
                                aria-labelledby="Gender"
                                name="Gender"
                                value={rowDetails['Gender']}
                                onChange={handelOnChange}
                            >
                                <FormControlLabel value="2" control={<Radio {...Color()} />} label="Male" />
                                <FormControlLabel value="1" control={<Radio {...Color()} />} label="Female" />
                            </RadioGroup>
                            <label className="input-label">Gender</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" placeholder="Personal Email Id" className="input-input" name="EmailID" value={rowDetails['EmailID']} onChange={handelOnChange} />
                            <label className="input-label">Personal Email Id</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <textarea className="input-input textarea" placeholder="Enter Address" name="Address" value={rowDetails['Address']} onChange={handelOnChange} />
                            <label className="input-label">Address</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" className="input-input" name="UserName" value={rowDetails['UserName']} onChange={handelOnChange} />
                            <label className="input-label">Official Mail ID(User Name)</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" className="input-input" name="EmgContactName" value={rowDetails['EmgContactName']} onChange={handelOnChange} />
                            <label className="input-label">Emergency Contact Person Name</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" className="input-input" name="EmgContactNumber" value={rowDetails['EmgContactNumber']} onChange={handelOnChange} />
                            <label className="input-label">Emergency Contact Person Number</label>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '-25px' }}>
                        <button className="btn marginLeft-0 marginRight-0 " onClick={handelClick}>Save</button>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>

            <div className="body-Container" style={{ maxHeight: 'calc(100vh - 165px)', overflowY: 'auto' }}>
                <div id="EmployeeList" style={{ border: '1px solid' + localStorage['BgColor'], borderTopRightRadius: '5px', borderTopLeftRadius: '5px', marginRight: '10px' }}>
                    <Accordion expanded={false} >
                        <AccordionSummary style={{ color: localStorage['Color'], backgroundColor: localStorage['BgColor'], maxHeight: '48px', minHeight: '48px' }}>
                            <Typography component={"span"} sx={{ width: '6%', flexShrink: 0 }}>
                                Id
                            </Typography>
                            <Typography component={"span"} sx={{ width: '12%', flexShrink: 0 }}>
                                Name
                            </Typography>
                            <Typography component={"span"} sx={{ width: '12%', flexShrink: 0 }}>
                                Reporting Manager
                            </Typography>
                            <Typography component={"span"} sx={{ width: '29%', flexShrink: 0 }}>
                                Designation
                            </Typography>
                            <Typography component={"span"} sx={{ width: '15%', flexShrink: 0 }}>
                                Addtional Notifications
                            </Typography>
                            <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                                Active
                            </Typography>
                        </AccordionSummary>
                    </Accordion>

                    {Details.length > 0 ? Details.map((column, index) => (
                        <Accordion key={index} index={index} expanded={expanded === index} className={expanded === index ? 'activeAcc' : ''} onChange={handlePanelChange(index)} >
                            <AccordionSummary className={expanded === index ? 'activeAccSum' : ''}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography component={"span"} sx={{ width: '6%', flexShrink: 0 }}>
                                    {column['Empid']}
                                </Typography>
                                <Typography component={"span"} sx={{ width: '12%', flexShrink: 0, padding: '0 30px' }}>
                                    {column['FirstName']}
                                </Typography>
                                <Typography component={"span"} sx={{ width: '12%', flexShrink: 0, padding: '0 10px' }}>
                                    {getManagerName(column['Rpts_to'])}
                                </Typography>
                                <Typography component={"span"} sx={{ width: '30%', flexShrink: 0, padding: '0 10px' }}>
                                    {getDescName(column['DescId'])}
                                </Typography>
                                <Typography component={"span"} sx={{ width: '16%', flexShrink: 0, padding: '0 10px' }}>
                                    {getAddReportName(column['Add_Rpts_to'])}
                                </Typography>
                                <Typography component={"span"} sx={{ width: '12%', flexShrink: 0, padding: '0 10px' }}>
                                    <Switch size="small" name="checked" checked={column['Active']} index={column['Empid']} onChange={(e) => {
                                        if (column['Active']) {
                                            handleInActive(column['Empid'], !column['Active']);
                                        }
                                        else {
                                            axios.post(nodeurl['nodeurl'], { query: 'UPDATE EmployeeDetails SET Active=1 WHERE Empid =' + column['Empid'] }).then(result => {
                                                alert.success("Saved successfully.");
                                                let arr = Details;
                                                arr = arr.map((item, index) => {
                                                if (item['Empid'] === column['Empid']) {
                                                    item['Active'] = !item['Active'];
                                                }
                                                return item;
                                            });
                                            setDetails(arr);
                                            });
                                            
                                        }
                                    }} />
                                </Typography>
                                <div className='Remove' style={{ marginTop: '-5px' }} index={column['Empid']} onClick={handlePanelChange(-1)}>
                                    <FontAwesomeIcon icon={faTrashAlt} index={column['Empid']} onClick={handlePanelChange(-1)} style={{ color: localStorage['BgColor'], fontSize: '18px' }} className="icon" />
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography component={"span"}>
                                    {expanded === index && <DetailsFields EmpId={column['Empid']} />}
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
        </>)
}