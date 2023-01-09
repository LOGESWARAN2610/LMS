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

    function FullWidthTabs(props) {
        const [value, setValue] = useState(1);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        const handleChangeIndex = (index) => {
            setValue(index);
        };
        const columns = [
            { id: 'Holiday_Date', label: 'Holiday Date', minWidth: 150, minWidth: 150, sort: false },
            { id: 'Holiday_Name', label: 'Holiday Day', minWidth: 150, minWidth: 150, sort: false }
        ];
        var paySlipMonth = [];
        const onMultiSelect = (selectedVal, value) => {
            paySlipMonth = selectedVal
        }
        const onMultiRemove = (selectedVal, value) => {
            paySlipMonth = selectedVal
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
        const [option, setOption] = useState([]);
        axios.post(nodeurl['nodeurl'], { query: "AB_Sp_BindMonthAndYear" }).then(result => {
            let option_ = result.data[0];
            option_ = option_.map((item, index) => {
                return { name: item['Value'], id: index };
            });
            setOption(option_);
        });

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
                        <Tab label="Holiday List" className='tab'  {...a11yProps(1)} />
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
                        <div style={{ height: '70vh', width: '80vh' }}>
                            <p style={{ fontSize: '20px', marginBottom: '25px' }}>To request pay slip, select the months in the below dropdown and click on the Send Request Button.
                                The admin team will process the request and send you the requested pay slips to your email.</p>
                            <Multiselect
                                options={option}
                                // selectedValues={this.state.selectedValue}
                                onSelect={onMultiSelect}
                                onRemove={onMultiRemove}
                                displayValue="name" />
                            <button className="btn marginRight-0" onClick={handelSubmit} style={{ float: 'right', marginTop: '25px' }}>Send Request</button>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <CustomGrid Columns={columns} tab='HoliDayList' Pagination={false} />
                    </TabPanel>
                </SwipeableViews >
            </Box >
        );
    }
    return (<FullWidthTabs />)
}
