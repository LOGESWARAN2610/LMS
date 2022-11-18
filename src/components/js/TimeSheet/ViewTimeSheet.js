import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import nodeurl from '../../../nodeServer.json'
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@mui/material/Typography';
import DatePicker from '../../Sub-Component/DatePicker/CustomeDatePicker';
import DateRangePicker from '../../Sub-Component/DatePicker/CustomeDateRange';
import '../../css/style.css'
import Moment from 'moment';
import CustomeGrid from '../../Sub-Component/CustomeGrid';
import { ExcelLibraryWorkingWithCells } from '../../Sub-Component/Excel/ExportExcel.tsx'
import { useAlert } from "react-alert";

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
export default function ViewTimeSheet() {
    const alert = useAlert();
    const [date, setDate] = useState(new Date());
    const firstDate = useMemo(() => (new Date(date.getFullYear(), date.getMonth(), 1)), [date]);
    const [value, setValue] = useState(1);
    const [monthYear, setMonthYear] = useState({ Month: date.getMonth(), Year: date.getFullYear() });
    const [dateRange, setDateRange] = useState([{ startDate: firstDate, endDate: new Date(), key: 'selection' }]);
    const [Rows, setRows] = useState([]);
    const [TotalHours, setTotalHours] = useState(0.00);
    function generateArrayOfYears() {
        var max = date.getFullYear();
        var min = max - 5;
        var years = [];
        for (var i = max; i >= min; i--) { years.push(i) }
        return years;
    }
    const calculateTotalHours = (arr) => {
        let hours = 0.00;
        arr.map((item) => { hours += parseFloat(item.Hours) });
        setTotalHours(hours);
    };
    const handelExport = () => {
        let FileName = '';
        if (value === 0) {
            FileName = Moment(date).format('DD-MM-YYYY');
        } else if (value === 1) {
            FileName = Moment(dateRange['startDate']).format('DD-MM-YYYY') + '_' + Moment(dateRange['endDate']).format('DD-MM-YYYY');
        } else if (value === 2) {
            let SelectedMonth = document.querySelector('.input-input[name="Month"]').selectedOptions[0].text;
            FileName = SelectedMonth + ' ' + monthYear['Year'];
        }
        FileName = 'Effort Metrics - ' + FileName;
        alert.success('Please Wait...');
        let type = 'Month';
        axios.post(nodeurl["nodeurl"], { query: "LM_GetExcelSheetInfo " + localStorage["EmpId"] + ",'" + type + "','" + JSON.stringify(monthYear) + "'" }).then((result) => {
            ExcelLibraryWorkingWithCells.workbookCreate(Rows, result.data[0][0]['WorkingDaysCount'], result.data[1], FileName);
        });
    }
    const Years = generateArrayOfYears();
    const Month = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" }
    ];

    let option = Month;
    if (monthYear['Year'] === date.getFullYear())
        option = Month.slice(0, date.getMonth() + 1).reverse();

    const Columns = [
        { id: 'TaskDate', label: 'Date', minWidth: 100 },
        { id: 'ProjectName', label: 'Project', minWidth: 120 },
        { id: 'TaskDescription', label: 'Description', minWidth: 250 },
        { id: 'ExpectedCompletiondate', label: 'Completion Date', minWidth: 120 },//Actual / Estimated
        { id: 'Status', label: 'Status', minWidth: 100 },
        { id: 'Issues', label: 'Objects Changed', minWidth: 150 },
        { id: 'Hours', label: 'Hours', minWidth: 80 }
    ];
    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Range",' + localStorage['EmpId'] + ',"' + Moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD') + '","' + Moment(new Date()).format('YYYY-MM-DD') + '",0,0' }).then(result => {
            setRows(result.data[0]);
            calculateTotalHours(result.data[0]);
        });
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Day",' + localStorage['EmpId'] + ',"' + Moment(new Date()).format('YYYY-MM-DD') + '","' + Moment(new Date()).format('YYYY-MM-DD') + '",' + monthYear['Month'] + ',' + monthYear['Year'] }).then(result => {
                setRows(result.data[0]);
                calculateTotalHours(result.data[0]);
            });
        }
        else if (newValue === 1) {
            axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Range",' + localStorage['EmpId'] + ',"' + Moment(firstDate).format('YYYY-MM-DD') + '","' + Moment(new Date()).format('YYYY-MM-DD') + '",0,0' }).then(result => {
                setRows(result.data[0]);
                calculateTotalHours(result.data[0]);
            });
        }
        else if (newValue === 2) {
            let date = new Date();
            setMonthYear({ Month: date.getMonth(), Year: date.getFullYear() });
            axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Month",' + localStorage['EmpId'] + ',"' + Moment(monthYear['Month']).format('YYYY-DD-MM') + '","' + Moment(monthYear['Year']).format('YYYY-DD-MM') + '",' + (parseInt(date.getMonth())) + ',' + date.getFullYear() }).then(result => {
                setRows(result.data[0]);
                calculateTotalHours(result.data[0]);
            });
        }
    };
    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const handelDateChange = (date) => {
        setDate(date);
        axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Day",' + localStorage['EmpId'] + ',"' + Moment(date).format('YYYY-MM-DD') + '","' + Moment(date).format('YYYY-MM-DD') + '",' + monthYear['Month'] + ',' + monthYear['Year'] }).then(result => {
            setRows(result.data[0]);
            calculateTotalHours(result.data[0]);
        });
    }
    const handelMonthYearChange = (event) => {
        setMonthYear({ ...monthYear, [event.target.name]: parseInt(event.target.value) });
        let month = date.getMonth() + 1, year = date.getFullYear();
        if (event.target.name === 'Month') {
            month = parseInt(event.target.value);
            year = monthYear['Year'];
        }
        else if (event.target.name === 'Year') {
            month = monthYear['Month'];
            year = parseInt(event.target.value);
        }
        axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Month",' + localStorage['EmpId'] + ',"' + Moment(date).format('YYYY-DD-MM') + '","' + Moment(date).format('YYYY-DD-MM') + '",' + month + ',' + year }).then(result => {
            setRows(result.data[0]);
            calculateTotalHours(result.data[0]);
        });
    }
    const handelDateRangeChange = (event) => {
        setDateRange([event['selection']]);
        axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Range",' + localStorage['EmpId'] + ',"' + Moment(event['selection']['startDate']).format('YYYY-MM-DD') + '","' + Moment(event['selection']['endDate']).format('YYYY-MM-DD') + '",0,0' }).then(result => {
            setRows(result.data[0]);
            calculateTotalHours(result.data[0]);
        });
    }

    return (
        <>
            <div style={{ textAlign: 'right', marginTop: '-25px' }} >
                <span style={{ display: 'inline-block', fontSize: '18px', margin: '10px', padding: ' 10px 0' }}>Total Hours:<span style={{ textAlign: 'right', marginRight: '20px', display: 'inline-block', padding: '0 0 0 5px', fontSize: '18px', fontWeight: 'bold' }}>{TotalHours.toFixed(2)}</span></span>
                <button className={`${value === 2 ? '' : 'toggle'} btn marginLeft-0 marginRight-0`} onClick={handelExport}>Export To Excel</button>
            </div>
            <div id="viewTimesheet" style={{ flexDirection: 'row', display: 'flex' }}>
                <Box style={{ display: 'inline-block', marginRight: '-20px' }}>
                    <Tabs sx={{ maxWidth: { xs: 320, sm: 170 }, bgcolor: 'background.paper' }}
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        textColor="inherit"
                        style={{ color: localStorage['BgColor'] }}
                    >
                        <Tab className='tab' label="Date"  {...a11yProps(0)} />
                        <Tab className='tab' label="Range"  {...a11yProps(1)} />
                        <Tab className='tab' label="Month"  {...a11yProps(2)} />
                    </Tabs>
                    <SwipeableViews
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0}>
                            <DatePicker Date={date} OnChange={handelDateChange} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <DateRangePicker DateRange={dateRange} OnChange={handelDateRangeChange} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '270px', marginTop: '20px' }}>
                                    <div className="input-wrapper marginLeft-0" style={{ width: '89%', marginRight: '0' }}>
                                        <div className="input-holder">
                                            <select className="input-input" name="Year" value={monthYear['Year']} onChange={handelMonthYearChange}>
                                                {Years.map((item, index) => (
                                                    <option key={index} value={item}>{item}</option>
                                                ))}
                                            </select>
                                            <label className="input-label">Year</label>
                                        </div>
                                    </div>
                                    <div className="input-wrapper marginLeft-0" style={{ width: '89%', marginRight: '0' }}>
                                        <div className="input-holder">
                                            <select className="input-input" name="Month" value={monthYear['Month']} onChange={handelMonthYearChange}>
                                                {option.map((item, index) => (
                                                    <option key={index} value={item['value']}>{item['label']}</option>
                                                ))}
                                            </select>
                                            <label className="input-label">Month</label>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </TabPanel>

                    </SwipeableViews >
                </Box>
                <div id='IdViewTimeSheetGrid' style={{ marginTop: '20px', display: 'contents' }}>
                    <CustomeGrid Columns={Columns} Rows={Rows} tab="viewTimesheet" Pagination={true} />
                </div>
            </div>
        </>
    );
}
