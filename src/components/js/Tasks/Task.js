import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import setTheme from '../../Sub-Component/setTheme';
import TaskAssignment from './TaskAssignment';
import TaskMaster from './TaskMaster';
import CustomGrid from '../../Sub-Component/CustomeGrid';

export default function Task() {

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
        const ProjectColumns = [
            { id: 'ProjectName', label: 'Project Name', minWidth: 115, sort: true },
            { id: '', label: 'Active', minWidth: 10, field: 'CheckBox', type: 5 }
        ];

        return (
            <Box id="Task" sx={{ bgcolor: 'inherit' }}>
                <AppBar position="static" style={{ width: 'max-content', marginLeft: '25px', backgroundColor: '#fff' }} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}
                    >
                        <Tab label="Task Master" className='tab' {...a11yProps(0)} />
                        <Tab label="Task Assignment" className='tab'  {...a11yProps(1)} />
                        <Tab label="Project Approvel" className='tab'  {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0}>
                        <TaskMaster />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TaskAssignment />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <CustomGrid Columns={ProjectColumns} tab='ProjectApprovels' Pagination={true} checkBox={true} />
                    </TabPanel>
                </SwipeableViews >
            </Box >
        );
    }
    return (<FullWidthTabs />)

}
