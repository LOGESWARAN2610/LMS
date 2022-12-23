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
import CustomGrid from '../../Sub-Component/CustomeGrid';
import setTheme from '../../Sub-Component/setTheme';
import Permission from './Permission';
import LeaveBalanceTab from './LeaveBalance';
import { useAlert } from "react-alert";
import { confirm } from "react-confirm-box";

export default function Lms() {
    const alert = useAlert();
    // const EmpId = localStorage['EmpId'];
    const optionsWithLabelChange = {
        closeOnOverlayClick: true,
        labels: {
            confirmable: "Confirm",
            cancellable: "Cancel"
        }
    };

    useEffect(() => {
        setTheme();
    }, []);

    const handelConfirm = async (msg, id, type, query) => {
        const result = await confirm(msg, optionsWithLabelChange);
        if (result) {
            axios.post(nodeurl['nodeurl'], { query: query + ' ' + id }).then(result => {
                let status = result.data[0][0]['Result'];
                if (type === '1') {
                    if (status === 0) alert.show("Leave Cancellation Request has been sent to the Reporting Manager.");
                    else if (status === 1) alert.success("Leave has been cancelled successfully.");
                    else alert.error("You are Not Allowed to Cancel this Leave.");
                }
                else if (type === '2') {

                } else if (type === '4') {
                    if (status === 0) { alert.show("Permission Cancellation Request has been Sent to the Reporting Manager."); }
                    else if (status === 1) { alert.success("Permission has been Cancelled Successfully.") }
                    else { alert.error("You are Not Allowed to Cancel this Leave.") }
                }
            });
        }
        return result;
    };
    const handelAction = async (id, type, msg_) => {
        let query = '', msg = <div id='lopCancel'>
            <h1>Confirmation</h1>
            <div><span>Are you sure want to cancel ?</span></div>
            <div><span>Date : </span><strong>{msg_.split('~~')[0]}</strong></div>
            <div><span>{type === '1' ? 'No. of Days : ' : 'Duration : '}</span><strong>{msg_.split('~~')[1]}</strong></div>
        </div>
        //'Are you surely want to cancel?';
        if (type === '1') {
            query = 'SP_LM_CheckCancelStatus';
        }
        else if (type === '2') {
            query = 'SP_LM_LOP_Cancel_Request';
        }
        else if (type === '4') {
            query = 'LM_PM_ReturnCancelStatus';
        }
        return handelConfirm(msg, id, type, query);
    }

    const LeaveHistoryColumn = [
        { id: 'LeaveType', label: 'Leave Type', minWidth: 115, sort: true },
        { id: 'StartDate', label: 'Start Date', minWidth: 110, sort: true },
        { id: 'EndDate', label: 'End Date', minWidth: 100, sort: true },
        { id: 'AppliedOn', label: 'Applied On', minWidth: 115, sort: true },
        { id: 'No_Of_Days', label: 'No. of Days', minWidth: 110, sort: true },
        { id: 'status', label: 'Status', minWidth: 120, sort: true },
        { id: 'Reason', label: 'Reason', minWidth: 180 },
        { id: 'Leaveoptions', label: 'Leave Option', minWidth: 200, sort: true },
        { id: '', label: 'Action / LOP', minWidth: 100, button: 'Cancel', type: 1 },
        // { id: '', label: 'LOP', minWidth: 70, button: 'Cancel', type: 2 }
    ];
    const PermissionHistoryColumn = [
        { id: 'PermissionType', label: 'Permission Type', minWidth: 200, sort: true },
        { id: 'StartDate', label: 'Start Date Time', minWidth: 160, sort: true },
        { id: 'EndDate', label: 'End Date Time', minWidth: 160, sort: true },
        { id: 'AppliedOn', label: 'Applied On', minWidth: 120, sort: true },
        { id: 'No_of_days', label: 'Hours', minWidth: 90 },
        { id: 'Status', label: 'Status', minWidth: 130, sort: true },
        { id: 'Reason', label: 'Reason', minWidth: 180 },
        { id: '', label: 'Action', minWidth: 100, button: 'Cancel', type: 4, onclick: handelAction },
    ];
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

        return (
            <>
                <Box sx={{ bgcolor: 'inherit' }} id="LmsWrapper">
                    <AppBar position="static" style={{ width: 'max-content', marginLeft: '25px', backgroundColor: '#fff' }} >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            textColor="inherit"
                            style={{ color: localStorage['BgColor'] }}>
                            <Tab label="Leave History" className='tab' {...a11yProps(0)} />
                            <Tab label="Apply Leave" className='tab'  {...a11yProps(1)} />
                            <Tab label="Permission History" className='tab'  {...a11yProps(2)} />
                            <Tab label="Apply Permission" className='tab'  {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        index={value}
                        onChangeIndex={handleChangeIndex} >
                        <TabPanel value={value} index={0}>
                            <CustomGrid Columns={LeaveHistoryColumn} tab='LeaveHistory' Pagination={true} onclick={handelAction} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            < LeaveBalanceTab />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <CustomGrid Columns={PermissionHistoryColumn} tab='PermissionHistory' Pagination={true} onclick={handelAction} />
                        </TabPanel>
                        <TabPanel value={value} index={3} style={{ width: '100%' }}>
                            <Permission />
                        </TabPanel>

                    </SwipeableViews >
                </Box >
            </>
        );
    }

    return (<FullWidthTabs val="2" />);
}
