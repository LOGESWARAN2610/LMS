import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import setTheme from '../../Sub-Component/setTheme';
import PoliciesProc from './Policies&Proc';
import CustomGrid from '../../Sub-Component/CustomeGrid';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json';
import { useAlert } from "react-alert";
import moment from 'moment';
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function Portal() {
    useEffect(() => {
        setTheme();
    }, []);
    const alert = useAlert();
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
    const PaySlip = () => {
        const [paySlipMonth, setPaySlipMonth] = useState([]);
        const [option, setOption] = useState([]);

        const onMultiSelect = (selectedVal, value) => {
            setPaySlipMonth(selectedVal);
        }
        const onMultiRemove = (selectedVal, value) => {
            setPaySlipMonth(selectedVal);
        }
        const handelSubmit = () => {
            let month = paySlipMonth.map((item) => { return item['name'] });
            month = month.join(',');
            console.log(month)
            axios.post(nodeurl['nodeurl'], { query: "SP_ShowMonthandYear " + localStorage['EmpId'] + ",'" + month + "'" }).then(result => {
                alert.success("Your Sent Successfully.");
                alert.show("You will receive response soon.");
            });
        }
        axios.post(nodeurl['nodeurl'], { query: "AB_Sp_BindMonthAndYear" }).then(result => {
            let option_ = result.data[0];
            option_ = option_.map((item, index) => {
                return { name: item['Value'], id: index };
            });
            setOption(option_);
        });

        return <>
            <div style={{ height: '70vh', width: '80vh' }}>
                <p style={{ fontSize: '20px', marginBottom: '25px' }}>To request pay slip, select the months in the below dropdown and click on the Send Request Button.
                    The admin team will process the request and send you the requested pay slips to your email.</p>
                <div className="input-wrapper marginLeft-0" style={{ width: 'inherit', maxWidth: 'unset' }}>
                    <div className="input-holder">
                        <Multiselect
                            options={option}
                            // selectedValues={this.state.selectedValue}
                            onSelect={onMultiSelect}
                            onRemove={onMultiRemove}
                            displayValue="name" />
                        <label className="input-label" style={{ left: '2%' }}>Month</label>
                    </div>
                </div>
                <button className="btn marginRight-0" onClick={handelSubmit} style={{ float: 'right', marginTop: '25px' }}>Send Request</button>
            </div>
        </>;
    }

    const HoliDay = () => {
        var date = new Date();
        const [Details, setDetails] = useState({ HolidayName: '', HolidayDate: date, optional: false });
        const handelSubmitClick = () => {
            axios.post(nodeurl['nodeurl'], { query: "LM_InsertHoliDay '" + moment(Details['HolidayDate']).format('YYYY-MM-DD') + "','" + Details['HolidayName'] + "'," + Details['optional'] }).then(result => {
                alert.show('Inserted Successfully');
            });
        }
        const columns = [
            { id: 'Holiday_Date', label: 'Holiday Date', minWidth: 150, maxWidth: 150, sort: false },
            { id: 'Holiday_DateName', label: 'Holiday Day', minWidth: 150, maxWidth: 150, sort: false },
            { id: 'Holiday_Name', label: 'Holiday Name', minWidth: 150, maxWidth: 150, sort: false }
        ];

        const handelOnChange = (event) => {
            if (event.target.name === 'HolidayDate') {
                var date = new Date(event.target.value);
                date = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + date.getFullYear()
                setDetails({ ...Details, [event.target.name]: date });
            }
            else
                setDetails({ ...Details, [event.target.name]: event.target.value });
        }
        const [Rows, setRows] = useState([]);
        axios.post(nodeurl['nodeurl'], { query: 'Menus_HolidayList' }).then(result => {
            setRows(result.data[0]);
        });
        const isDisable = () => {
            let isValidate = false;
            if (Details['HolidayName'] === '' || Details['HolidayDate'] === '')
                isValidate = true;
            return { disabled: isValidate };
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <CustomGrid Columns={columns} Rows={Rows} tab='HoliDayList' Pagination={true} />
                {localStorage['IsManager'] === '1' && <>
                    <div style={{ width: '50px' }}></div>
                    <div style={{ width: '400px' }}>
                        <div className="input-wrapper marginLeft-0 marginRight-0">
                            <div className="input-holder  input-DatePicker">
                                <div className="input-holder">
                                    <DatePicker name="HolidayDate" showHoliDay={true} valueChange={handelOnChange} Value={Details['HolidayDate']} />
                                </div>
                                <label className="input-label">Holiday Date</label>
                            </div>
                        </div>
                        <div className="input-wrapper marginLeft-0 marginRight-0">
                            <div className="input-holder">
                                <input type="text" className="input-input" placeholder="Holiday Name" name="HolidayName" value={Details['HolidayName']} onChange={handelOnChange} />
                                <label className="input-label">Holiday Name</label>
                            </div>
                        </div>
                        <div className="input-wrapper marginLeft-0 marginRight-0" style={{ marginTop: 0 }}>
                            <div className="input-holder" style={{ backgroundColor: 'inherit' }}>
                                <FormControlLabel style={{ float: 'right', flexDirection: 'row-reverse' }} control={
                                    <Switch size="medium" name="checked" checked={Details['optional']} onChange={(e) => {
                                        setDetails({ ...Details, 'optional': !Details['optional'] })
                                    }} />
                                } label="Is Optional" />
                            </div>
                        </div>
                        <div className="input-wrapper marginLeft-0 marginRight-0" style={{ marginTop: 0 }}>
                            <div className="input-holder" style={{ backgroundColor: 'inherit' }}>
                                <button className="btn marginLeft-0 marginRight-0" {...isDisable()} style={{ float: 'right', margin: 0 }} onClick={handelSubmitClick}>Add</button>
                            </div>
                        </div>
                    </div>
                </>}
            </div>)

    }
    function FullWidthTabs(props) {
        const [value, setValue] = useState(1);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        const handleChangeIndex = (index) => {
            setValue(index);
        };

        return (
            <Box sx={{ bgcolor: 'inherit' }} id="EmployeePortal">
                <AppBar position="static" style={{ width: 'max-content', marginLeft: '25px', backgroundColor: '#fff' }} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}>
                        <Tab label="Policies & Procedures" className='tab' {...a11yProps(0)} />
                        <Tab label="Request PaySlips" className='tab'  {...a11yProps(1)} />
                        <Tab label="Holiday List" className='tab'  {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    index={value}
                    onChangeIndex={handleChangeIndex}
                    className="scrollbar"
                >
                    <TabPanel value={value} index={0}>
                        <PoliciesProc />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <PaySlip />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <HoliDay />
                    </TabPanel>
                </SwipeableViews >
            </Box >
        );
    }
    return (<FullWidthTabs />)
}
