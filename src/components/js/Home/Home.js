import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../../css/style.css'
import CustomGrid from '../../Sub-Component/CustomeGrid';
import setTheme from '../../Sub-Component/setTheme';
import PieChart from '../../Sub-Component/PieChart';
import BarChart from '../../Sub-Component/DatePicker/BarChart/BarChart';
import DropDown from '../../Sub-Component/DropDown';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import moment from 'moment';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json';
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const Navigate = (path) => {
        navigate(path);
    }
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
    let toDay = new Date();

    const [ClientData, SetClientData] = useState([]);
    const [weeklyData, SetWeeklyData] = useState([]);
    const [monthlyData, SetMonthlyData] = useState([]);
    const [monthYear, SetMonthYear] = useState({ Month: toDay.getMonth(), Year: toDay.getFullYear() });
    const EmpId = localStorage['EmpId'];

    let first = toDay.getDate() - toDay.getDay();
    let last = first + 6;
    const [weekStart, setWeekStart] = useState(moment(new Date(toDay.setDate(first))).format('YYYY-MM-DD'));
    const [weekEnd, setWeekEnd] = useState(moment(new Date(toDay.setDate(last))).format('YYYY-MM-DD'));
    let monthStart = moment(new Date(toDay.getFullYear(), toDay.getMonth(), 1)).format('YYYY-MM-DD');
    let monthEnd = moment(new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0)).format('YYYY-MM-DD');

    let val = `${moment(weekStart).format("Do MMM")} to ${moment(weekEnd).format("Do MMM")}`
    const [weekValue, setWeekValue] = useState(val);

    let date = new Date();
    function generateArrayOfYears() {
        let max = date.getFullYear();
        let min = max - 5;
        let years = [];
        for (let i = max; i >= min; i--) { years.push(i) }
        return years;
    }
    let yearArr = generateArrayOfYears();
    const Years = yearArr.map((item, index) => {
        return { index: index, key: item, value: item }
    });
    const Month = [
        { index: 0, key: "January", value: 0 },
        { index: 1, key: "February", value: 1 },
        { index: 2, key: "March", value: 2 },
        { index: 3, key: "April", value: 3 },
        { index: 4, key: "May", value: 4 },
        { index: 5, key: "June", value: 5 },
        { index: 6, key: "July", value: 6 },
        { index: 7, key: "August", value: 7 },
        { index: 8, key: "September", value: 8 },
        { index: 9, key: "October", value: 9 },
        { index: 10, key: "November", value: 10 },
        { index: 11, key: "December", value: 11 }
    ];
    Date.prototype.getWeek = function (dowOffset) {
        let nYear, nday;
        dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
        var newYear = new Date(this.getFullYear(), 0, 1);
        var day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        var daynum = Math.floor((this.getTime() - newYear.getTime() -
            (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
        var weeknum;
        if (day < 4) {
            weeknum = Math.floor((daynum + day - 1) / 7) + 1;
            if (weeknum > 52) {
                nYear = new Date(this.getFullYear() + 1, 0, 1);
                nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum + day - 1) / 7);
        }
        return weeknum;
    };
    let option = Month;
    if (monthYear['Year'] === date.getFullYear())
        option = Month.slice(0, date.getMonth() + 1).reverse();

    function getISOWeek(w, y) {
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        const temp = {
            d: ISOweekStart.getDate(),
            m: ISOweekStart.getMonth(),
            y: ISOweekStart.getFullYear(),
        }
        //console.log(ISOweekStart)

        const numDaysInMonth = new Date(temp.y, temp.m + 1, 0).getDate()

        return Array.from({ length: 7 }, _ => {
            if (temp.d > numDaysInMonth) {
                temp.m += 1;
                temp.d = 1;
                // not needed, Date(2020, 12, 1) == Date(2021, 0, 1)
                /*if (temp.m >= 12){
                  temp.m = 0
                  temp.y +=1
                }*/
            }
            return new Date(temp.y, temp.m, temp.d++).toUTCString()
        });
    }
    function getWeekNumbers(month, year) {
        var first, last, weeks = [];
        first = moment().month(month - 1).year(year).startOf('month').isoWeek();
        first = first === 52 ? 1 : first;
        last = moment().month(month - 1).year(year).endOf('month').isoWeek();
        for (var i = first; i <= last; i++) {
            weeks.push(getISOWeek(i, year));
        }
        return weeks;
    }
    // console.log(getWeekNumbers(1, 2023))
    let month = (new Date().getMonth()) + 1;
    let year = new Date().getFullYear();
    const week = getWeekNumbers(month, year);
    const weekList = week.map((item, index) => {
        let weekNo = new Date().getWeek();
        return {
            index: index,
            value: moment(new Date(item[0]) - 1).format("Do MMM") + ' to ' + moment(new Date(item[6]) - 1).format("Do MMM"),
            key: moment(new Date(item[0]) - 1).format("Do MMM") + ' to ' + moment(new Date(item[6]) - 1).format("Do MMM"),
            disabled: (index + 1) > weekNo ? true : false
        }
    })
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
        const [IsInclude, SetIsInclude] = useState(false);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        const handleChangeIndex = (index) => {
            setValue(index);
        };

        const handleWeekChange = (e) => {
            let week_ = weekList.filter((item) => { return item['value'] === e.target.value });
            let index = week_[0]['index'];
            let weekStart = moment(new Date(week[index][0]) - 1).format('YYYY-MM-DD');
            let weekEnd = moment(new Date(week[index][6]) - 1).format('YYYY-MM-DD');
            axios.post(nodeurl['nodeurl'], { query: "GetChartData_Onload " + EmpId + ",'" + weekStart + "','" + weekEnd + "','',''" }).then(result => {
                SetWeeklyData(result.data[0]);
                weekStart = moment(weekStart).format("Do MMM");
                weekEnd = moment(weekEnd).format("Do MMM");
                let val = `${weekStart} to ${weekEnd}`;
                setWeekValue(val);
            });
        }

        const handleMonthYearClick = (e) => {
            let value = e.target.value;
            let name = e.target.name;
            let toDay = new Date();

            if (name === 'Year' && value === toDay.getFullYear() && monthYear['Month'] > toDay.getMonth()) {

            } else if (name === 'Month') {
                toDay.setMonth(value);
                toDay.setFullYear(monthYear['Year']);
            } else if (name === 'Year') {
                toDay.setMonth(monthYear['Month']);
                toDay.setFullYear(value)
            }
            let monthStart = moment(new Date(toDay.getFullYear(), toDay.getMonth(), 1)).format('YYYY-MM-DD');
            let monthEnd = moment(new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0)).format('YYYY-MM-DD');

            axios.post(nodeurl['nodeurl'], { query: "GetChartData_Onload " + EmpId + ",'','','" + monthStart + "','" + monthEnd + "'" }).then(result => {
                SetMonthlyData(result.data[1]);
                SetMonthYear({ Month: toDay.getMonth(), Year: toDay.getFullYear() });
            });
        }
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
                    onChangeIndex={handleChangeIndex}>
                    <TabPanel value={value} index={0}>
                        <div id="summaryChart">
                            {monthlyData['length'] === 0 && ClientData['length'] === 0 && weeklyData['length'] === 0 ?
                                <div style={{ height: '80vh' }}>
                                    <div style={{ top: '40%', left: '40%', display: 'inline-block', textAlign: 'center' }}>
                                        <h1 style={{ color: '#111', fontSize: '35px' }}>No Datas to Show...!</h1>
                                        <h3 style={{ fontSize: '15px', cursor: 'pointer', color: 'blue' }} onClick={() => {
                                            Navigate('/EnterTimeSheet');
                                        }}>Click to Fill TimeSheet for missing days.</h3>
                                    </div>
                                </div>
                                :
                                <><>
                                    <div style={{ 'display': 'inline-block', width: 'auto', 'textAlign': 'center' }}>
                                        <div className='pie-label'>
                                            Weekly - ( {<DropDown name="Week" value={weekValue} handleChange={handleWeekChange} items={weekList} />})
                                        </div>
                                        <PieChart id="week" data={weeklyData} outerRadius={100} innerRadius={50} />
                                    </div>
                                </>
                                    <>
                                        <div style={{ 'display': 'inline-block', width: 'auto', 'textAlign': 'center' }}>
                                            <div className='pie-label'>Client</div>
                                            <PieChart id="client" data={ClientData} outerRadius={100} innerRadius={50} />
                                        </div>
                                    </>
                                    <>
                                        <div style={{ 'display': 'inline-block', width: '100%', 'textAlign': 'center' }}>
                                            <div className='pie-label'>
                                                Monthly - ( {
                                                    <>
                                                        <DropDown name="Year" value={monthYear['Year']} handleChange={handleMonthYearClick} items={Years} />
                                                        <DropDown name="Month" value={monthYear['Month']} handleChange={handleMonthYearClick} items={option} />
                                                    </>
                                                })
                                            </div>
                                        </div>
                                        <BarChart id="month" data_={monthlyData} label={'label1'} />
                                    </></>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <CustomGrid Columns={columns} tab='TaskDashBoard' IsInclude={IsInclude} Pagination={true} />
                    </TabPanel>
                </SwipeableViews>
            </Box >
        );
    }
    return (<FullWidthTabs />);
}