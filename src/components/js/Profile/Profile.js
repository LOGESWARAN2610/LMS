import React, { useState, useEffect } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ChangePassword from './ChangePassword';
import setTheme from '../../Sub-Component/setTheme';
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const EmpId = localStorage['EmpId'];
    const [value, setValue] = useState(0);
    const alert = useAlert();
    // if (localStorage['isProfileChanged']) console.log('fds');
    const navigate = useNavigate();
    const Navigate = (path) => {
        navigate(path);
    }
    const DetailsFields = () => {
        var date = new Date();
        date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + date.getFullYear()
        const [Details, setDetails] = useState({ SurName: 'Mr.', Empid: 0, FirstName: '', LastName: '', PhoneNumber: '', EmailID: '', Address: '', DateOfBirth: date, EmgContactNumber: '', EmgContactName: '', DateOfJoin: date, UserName: '', Password: '', Gender: 2, Hintans: '', Question: 1, IsUpdate: value, ReportsTo: 62 });
        const [ManagerOption, setManagerOption] = useState([]);

        useEffect(() => {
            let query = 'SELECT ED.empid AS value,ED.FirstName AS label FROM LM_Reportingmanagers RM INNER JOIN EmployeeDetails ED ON ED.empid = RM.empid'
            axios.post(nodeurl['nodeurl'], { query: query }).then(result => {
                setManagerOption(result.data[0]);
            });
        }, [])
        useEffect(() => {
            setTheme();

            if (value === 0) {
                axios.post(nodeurl['nodeurl'], { query: 'AB_ViewEmpProfile ' + EmpId }).then(result => {
                    setDetails(result.data[0][0]);
                });
            } else {

                setDetails({ SurName: 'Mr.', Empid: 0, FirstName: '', LastName: '', PhoneNumber: '', EmailID: '', Address: '', DateOfBirth: date, EmgContactNumber: '', EmgContactName: '', DateOfJoin: date, UserName: '', Password: '', Gender: 2, Hintans: '', Question: 1, IsUpdate: value, ReportsTo: 62 });
            }
        }, [value]);
        const handelOnChange = (event) => {
            if (event.target.name === 'DateOfBirth') {
                var date = new Date(event.target.value);
                date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + date.getFullYear()
                setDetails({ ...Details, [event.target.name]: date });
            }
            else
                setDetails({ ...Details, [event.target.name]: event.target.value });
        }
        const handelClick = () => {
            Details['IsUpdate'] = value;
            axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'AB_UpdateEmployeeDetail ', UpdateJson: JSON.stringify(Details) }).then(result => {
                if (value === 0) {
                    let Details = result['data']['recordset'][0];
                    setDetails(Details);
                    localStorage.setItem('Name', Details['SurName'] + ' ' + Details['AliceName']);
                    localStorage.setItem('Gender', Details['Gender'] === '1' ? 'Female' : 'Male');
                    localStorage.setItem('isProfileChanged', true);
                    alert.success("Your details Updated successfully.");
                    Navigate('/Profile');
                } else {
                    alert.success("Regeistred successfully.");
                    setDetails({ SurName: 'Mr.', Empid: 0, FirstName: '', LastName: '', PhoneNumber: '', EmailID: '', Address: '', DateOfBirth: date, EmgContactNumber: '', EmgContactName: '', DateOfJoin: date, UserName: '', Password: '', Gender: 2, Hintans: '', Question: 1, IsUpdate: value, ReportsTo: 62 });
                }
            });
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
            if (Details['FirstName'] === '' || Details['LastName'] === '' || Details['AliceName'] === '' || Details['PhoneNumber'] === '' || Details['Hintans'] === '' || Details['EmgContactName'] === '' || Details['EmgContactNumber'] === '')
                isValidate = true;
            return { disabled: isValidate };
        }
        return (
            <div id="profile" style={{ width: '99%' }}>

                {value === 1 ? <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <select className="input-input" name="Question" value={Details['ReportsTo']} onChange={handelOnChange}>
                            {ManagerOption.map((item, index) => (
                                <option key={index} value={item['value']}>{item['label']}</option>
                            ))}
                        </select>
                        <label className="input-label">Reports To</label>
                    </div>
                </div> : null}
                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder input2-holder" style={{ boxShadow: '#000c2f4d 1px 2px 5px 0px' }} >
                        <select id="exampleList" className="input-input" name="SurName" value={Details['SurName']} onChange={handelOnChange} style={{ border: 'none', height: '48px', boxShadow: 'none', width: '20%', padding: '0 0 0 10px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                            <option selected >Mr.</option>
                            <option>Mrs.</option>
                            <option>Ms.</option>
                            <option>Miss.</option>
                        </select>
                        <input type="text" placeholder="First Name" className="input-input" list="exampleList" style={{ border: 'none', height: '47px', boxShadow: 'none', width: '80%', padding: '0 10px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} name="FirstName" value={Details['FirstName']} onChange={handelOnChange} />
                        <label className="input-label">First Name</label>
                    </div>
                </div>

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" name="LastName" placeholder="Last Name" value={Details['LastName']} onChange={handelOnChange} />
                        <label className="input-label">Last Name</label>
                    </div>
                </div>

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" placeholder="Alice Name" name="AliceName" value={Details['AliceName']} onChange={handelOnChange} />
                        <label className="input-label">Alice Name</label>
                    </div>
                </div>

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder  input-DatePicker" style={{ width: '48%', float: 'left' }}>
                        {Details['DateOfBirth'] ? <DatePicker name="DateOfBirth" isWeekEndDisable={false} dd={(Details['DateOfBirth'])} Value={((Details['DateOfBirth']).split('-').reverse().join('-'))} valueChange={handelOnChange} /> : <></>}
                        <label className="input-label">Date Of Birth</label>
                    </div>
                    <div className="input-holder" style={{ width: '48%', float: 'right', position: 'relative', zIndex: 11 }}>
                        {Details['DateOfJoin'] && value === 1 ? <DatePicker name="DateOfJoin" isWeekEndDisable={true} dd={(Details['DateOfJoin'])} Value={((Details['DateOfJoin']).split('-').reverse().join('-'))} valueChange={handelOnChange} /> : <></>}
                        {value === 0 ? <input type="text" className="input-input" style={{ width: '100%' }} disabled name="DateOfJoin" value={Details['DateOfJoin']} onChange={handelOnChange} /> : null}
                        <label className="input-label">Date Of Joining</label>
                    </div>
                </div>

                {/* <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" disabled name="DateOfJoin" value={Details['DateOfJoin']} onChange={handelOnChange} />
                        <label className="input-label">Date Of Joining</label>
                    </div>
                </div> */}

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="number" placeholder="PhoneNumber" className="input-input" name="PhoneNumber" value={Details['PhoneNumber']} onChange={handelOnChange} />
                        <label className="input-label">Mobile No.</label>
                    </div>
                </div>

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder" style={{ backgroundColor: 'inherit' }}>
                        <RadioGroup
                            className='radio'
                            aria-labelledby="Gender"
                            name="Gender"
                            value={Details['Gender']}
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
                        <input type="text" placeholder="Personal Email Id" className="input-input" name="EmailID" value={Details['EmailID']} onChange={handelOnChange} />
                        <label className="input-label">Personal Email Id</label>
                    </div>
                </div>

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <textarea className="input-input textarea" placeholder="Enter Address" name="Address" value={Details['Address']} onChange={handelOnChange} />
                        <label className="input-label">Address</label>
                    </div>
                </div>

                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" disabled={value === 0} name="UserName" value={Details['UserName']} onChange={handelOnChange} />
                        <label className="input-label">Official Mail ID(User Name)</label>
                    </div>
                </div>
                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" name="EmgContactName" value={Details['EmgContactName']} onChange={handelOnChange} />
                        <label className="input-label">Emergency Contact Person Name</label>
                    </div>
                </div>
                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" name="EmgContactNumber" value={Details['EmgContactNumber']} onChange={handelOnChange} />
                        <label className="input-label">Emergency Contact Person Number</label>
                    </div>
                </div>
                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <select className="input-input" name="Question" value={Details['Question']} onChange={handelOnChange}>
                            <option value="1">What is your favourite color?</option>
                            <option value="2">What is your favourite place?</option>
                            <option value="3">What is your favourite teachers name?</option>
                            <option value="4">Who is your favourite film actor?</option>
                            <option value="5">What was your childhood nickname?</option>
                            <option value="6">What is the name of the company of your first job?</option>
                        </select>
                        <label className="input-label">Select security question?</label>
                    </div>
                </div>
                <div className="input-wrapper marginLeft-0">
                    <div className="input-holder">
                        <input type="text" className="input-input" name="Hintans" value={Details['Hintans']} onChange={handelOnChange} />
                        <label className="input-label">Answer</label>
                    </div>
                </div>
                <div>
                    <button className="btn marginLeft-0" {...isDisable()} onClick={handelClick}>{value === 0 ? 'Save Details' : 'Register'}</button>
                </div>
            </div>
        );
    }

    function TabPanel(props) {

        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography component={"span"} variant={"body2"}>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    function FullWidthTabs(props) {

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        const handleChangeIndex = (index) => {
            setValue(index);
        };

        return (
            <Box sx={{ bgcolor: 'inherit' }}>
                <AppBar position="static" style={{ width: 'max-content', marginLeft: '25px', backgroundColor: '#fff' }} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}
                    >
                        <Tab label="Profile" className='tab' {...a11yProps(0)} />
                        <Tab label="New Registration" className='tab' {...a11yProps(1)} />
                        {/* <Tab label="Change Password" className='tab'  {...a11yProps(1)} /> */}
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    //axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0}>
                        <DetailsFields />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <DetailsFields />
                    </TabPanel>
                    {/* <TabPanel value={value} index={1}>
                        <ChangePassword />
                    </TabPanel> */}

                </SwipeableViews >
            </Box >
        );
    }
    return (<FullWidthTabs />)
}
