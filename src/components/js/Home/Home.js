import React, { useState, useEffect, } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../../css/style.css'
import CustomGrid from '../../Sub-Component/CustomeGrid';
import setTheme from '../../Sub-Component/setTheme';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function Home() {
    const columns = [
        { id: 'Client', label: 'Client', minWidth: 70, sort: true },
        { id: 'AssignedBY', label: 'Assigned By', minWidth: 70 },
        { id: 'AssignedTo', label: 'Assigned To', minWidth: 70 },
        { id: 'ProjectName', label: 'Project', minWidth: 70, sort: true },
        { id: 'ModuleName', label: 'Module', minWidth: 70 },
        { id: 'TaskName', label: 'Task', minWidth: 70 },
        { id: 'TaskPriority', label: 'Priority', minWidth: 80, sort: true },
        { id: 'TaskStatus', label: 'Status', minWidth: 120, sort: true },
        { id: 'ExpCompDate', label: 'Expected Completed Date', minWidth: 120, sort: true },
        { id: 'FTR', label: 'FTR', minWidth: 70 },
        { id: 'OTD', label: 'OTD', minWidth: 70 },
        { id: 'Create Sub-Task', label: 'Create Sub-Task', minWidth: 70, button: 'Re-Work', onclick: 'onclick("alert()")' }
    ];
    const [IsInclude, SetIsInclude] = useState(false)
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

    function FullWidthTabs() {
        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        const handleChangeIndex = (index) => {
            setValue(index);
        };

        return (
            <Box sx={{ bgcolor: 'inherit' }} id="home">
                <AppBar position="static" style={{ width: 'max-content', display: 'inline-block', marginLeft: '25px', backgroundColor: '#fff' }} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}
                    >
                        <Tab label="Task DashBoard" style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '16px' }} {...a11yProps(0)} />
                    </Tabs>
                </AppBar>
                <div style={{ textAlign: 'right', padding: '0 10px', display: 'inline-block', float: 'right' }} >
                    <FormControlLabel control={<Checkbox color="default" checked={IsInclude} onChange={() => SetIsInclude(!IsInclude)} />} label="Include Completed Task" />
                </div>
                <SwipeableViews
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0}>

                        <CustomGrid Columns={columns} tab='TaskDashBoard' IsInclude={IsInclude} Pagination={true} />
                    </TabPanel>
                </SwipeableViews>
            </Box>
        );
    }
    return (<FullWidthTabs />);
}
