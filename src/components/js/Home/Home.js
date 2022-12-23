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
import PieChart from '../../Sub-Component/PieChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json';

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
    const [IsInclude, SetIsInclude] = useState(false);

    const [ClientData, SetClientData] = useState([]);
    const [weeklyData, SetWeeklyData] = useState([]);
    const [monthlyData, SetMonthlyData] = useState([]);
    const EmpId = localStorage['EmpId'];
    let toDay = new Date();
    let first = toDay.getDate() - toDay.getDay();
    let last = first + 6;
    let weekStart = moment(new Date(toDay.setDate(first))).format('YYYY-MM-DD');
    let weekEnd = moment(new Date(toDay.setDate(last))).format('YYYY-MM-DD');
    let monthStart = moment(new Date(toDay.getFullYear(), toDay.getMonth(), 1)).format('YYYY-MM-DD');
    let monthEnd = moment(new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0)).format('YYYY-MM-DD');
    // function getISOWeek(w, y) {
    //     var simple = new Date(y, 0, 1 + (w - 1) * 7);
    //     var dow = simple.getDay();
    //     var ISOweekStart = simple;
    //     if (dow <= 4)
    //         ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    //     else
    //         ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    //     const temp = {
    //         d: ISOweekStart.getDate(),
    //         m: ISOweekStart.getMonth(),
    //         y: ISOweekStart.getFullYear(),
    //     }
    //     //console.log(ISOweekStart)
    //     const numDaysInMonth = new Date(temp.y, temp.m + 1, 0).getDate()

    //     return Array.from({ length: 7 }, _ => {
    //         if (temp.d > numDaysInMonth) {
    //             temp.m += 1;
    //             temp.d = 1;
    //             // not needed, Date(2020, 12, 1) == Date(2021, 0, 1)
    //             /*if (temp.m >= 12){
    //               temp.m = 0
    //               temp.y +=1
    //             }*/
    //         }
    //         return new Date(temp.y, temp.m, temp.d++).toUTCString()
    //     });
    // }
    // function getWeekNumbers(month, year) {
    //     var first, last, weeks = [];
    //     first = moment().month(month - 1).year(year).startOf('month').isoWeek();
    //     last = moment().month(month - 1).year(year).endOf('month').isoWeek();
    //     for (var i = first; i <= last; i++) {
    //         weeks.push(getISOWeek(i, year));
    //     }
    //     return weeks;
    // }
    // console.log(getWeekNumbers(12, 2022))
    useEffect(() => {
        setTheme();
        axios.post(nodeurl['nodeurl'], { query: "GetChartData_Onload " + EmpId + ",'" + weekStart + "','" + weekEnd + "','" + monthStart + "','" + monthEnd + "'" }).then(result => {
            SetWeeklyData(result.data[0]);
            SetMonthlyData(result.data[1]);
            SetClientData(result.data[2]);
        });
    }, [EmpId, weekStart, weekEnd, monthStart, monthEnd]);


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
            <Box sx={{ bgcolor: 'inherit' }} id="home_">
                <AppBar position="static" style={{ width: 'max-content', display: 'inline-block', marginLeft: '25px', backgroundColor: '#fff' }} >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}
                    >
                        <Tab label="Summary" className='tab'  {...a11yProps(0)} />
                        <Tab label="Task DashBoard" className='tab'  {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                {value === 1 ? <div style={{ textAlign: 'right', padding: '0 10px', display: 'inline-block', float: 'right' }} >
                    <FormControlLabel control={<Checkbox color="default" checked={IsInclude} onChange={() => SetIsInclude(!IsInclude)} />} label="Include Completed Task" />
                </div> : null}
                <SwipeableViews
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0}>
                        <div id="summaryChart">
                            {weeklyData['length'] > 0 ? <PieChart title={'Weekly - (' + (moment(weekStart).format("Do MMM")) + ' to ' + (moment(weekEnd).format("Do MMM")) + ')'} id="week" data={weeklyData} outerRadius={100} innerRadius={50} /> : null}
                            {monthlyData['length'] > 0 ? <PieChart title={'Monthly - (' + moment(new Date()).format('MMMM') + ')'} id="month" data={monthlyData} label={'empty'} outerRadius={100} innerRadius={50} /> : null}
                            {ClientData['length'] > 0 ? <PieChart title={'Client'} id="client" data={ClientData} outerRadius={100} innerRadius={50} /> : null}
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <CustomGrid Columns={columns} tab='TaskDashBoard' IsInclude={IsInclude} Pagination={true} />
                    </TabPanel>
                </SwipeableViews>
            </Box>
        );
    }
    return (<FullWidthTabs />);
}