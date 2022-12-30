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
import CustomGrid from '../../Sub-Component/CustomeGrid'
export default function Portal() {
    useEffect(() => {
        setTheme();
    }, []);
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
        const [value, setValue] = useState(0);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        const handleChangeIndex = (index) => {
            setValue(index);
        };
        const columns = [
            { id: 'Holiday_Date', label: 'Holiday Date', minWidth: 150, sort: false },
            { id: 'Holiday_Name', label: 'Holiday Day', minWidth: 250, sort: false }
        ];
        return (
            <Box sx={{ bgcolor: 'inherit' }} id="EmployeePortal">
                <AppBar position="static" style={{ width: 'max-content', marginLeft: '25px', backgroundColor: '#fff' }} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}
                    >
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
                        <div >
                            <h1>Under Construction</h1>
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
