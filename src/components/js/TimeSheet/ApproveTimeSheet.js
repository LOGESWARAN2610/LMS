import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import CustomGrid from '../../Sub-Component/CustomeGrid';
import TableHead from '@mui/material/TableHead';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import { useAlert } from "react-alert";

export default function ApproveTimeSheet() {
    const [EmpList, setEmpList] = useState([]);
    const EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [Rows, setRows] = useState([]);
    const approvelRef = useRef();
    const [ApproveRejectAll, setApproveRejectAll] = useState(true);

    const TimesheetApprovelColumn = [
        { id: '', label: '', minWidth: 15, field: 'CheckBox', type: 5 },
        { id: 'FirstName', label: 'Employee Name', minWidth: 140, sort: true },
        { id: 'TotalHours', label: 'Total Hours', minWidth: 0, sort: true },
    ];
    const setIsApproveRejectAll = (param) => {
        setApproveRejectAll(param);
    }
    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'AB_WorkHoursApproval ' + EmpId }).then(result => {
            setRows(result.data[0]);
        });
        axios.post(nodeurl['nodeurl'], { query: 'LM_List_of_Emp ' + EmpId }).then(result => {
            setEmpList(result.data[0]);
        });
    }, []);

    return (
        <>
            <div style={{ float: 'right', marginTop: '10px', zIndex: 999, marginRight: '25px', display: 'inline-flex' }} >
                <div className="input-wrapper timeSheetDate" style={{ width: '200px', height: '35px', marginTop: '10px' }} >
                    <div className="input-holder">
                        <select className="input-input" style={{ width: '100%', fontSize: '17px' }} onChange={(e) => {
                            approvelRef.current.setSelectedEmpId_(e.target.value, 5)
                        }} name="taskDate">
                            <option key='-1' value='-1'>--Select--</option>
                            {EmpList.map((item, index) => (
                                <option key={index} value={item['value']}>{item['text']}</option>
                            ))}
                        </select>
                        <label className="input-label" style={{ height: '60px' }}>Employee</label>
                    </div>
                </div>
                <div style={{ display: 'inline-block', marginLeft: '10px' }}><button className="btn marginLeft-0 btnApproveRejectAll" style={{ margin: '5px 0 0 10px', width: '100px', padding: '10px' }}
                    onClick={
                        () => {
                            let Row_ = [];
                            if (ApproveRejectAll) Row_ = Rows;
                            else Row_ = Rows.filter((item) => { return item['checked'] })
                            Row_.forEach((item) => {
                                item['isApproved'] = 1;
                            });
                            axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'Ab_MgrApproval_Status', UpdateJson: JSON.stringify(Row_) }).then(result => {
                                alert.success('Approved Successfully.')
                                axios.post(nodeurl['nodeurl'], { query: 'AB_WorkHoursApproval ' + EmpId }).then(result => {
                                    setRows(result.data[0]);
                                    setIsApproveRejectAll(true);
                                });
                            });
                        }
                    }>Approve{ApproveRejectAll ? ' All' : ''}</button></div>
            </div>
            <div style={{ marginTop: '35px' }}>
                <div style={{ display: 'inline-block', margin: '20px 15px auto 0px' }}>
                    <Paper sx={{ width: '100%', overflow: 'auto', border: '1px solid ' + localStorage['BgColor'] }}>
                        <TableContainer className='scrollbar' >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {TimesheetApprovelColumn.map((headCell, index) => (
                                            <TableCell
                                                key={index}
                                                style={{ minWidth: headCell.minWidth, backgroundColor: localStorage['BgColor'], color: '#fff', padding: '10px' }}
                                            > {headCell['label']}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead >
                                <TableBody>
                                    {Rows['length'] > 0 ? Rows.map((row, index) => {
                                        return (
                                            <TableRow tabIndex={-1} key={index} style={{ backgroundColor: `${row['isCompleted'] ? 'pink' : ''}` }}>
                                                {TimesheetApprovelColumn.map((column, index_) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={index_} align={column.align} style={column.type === 6 ? { padding: '0' } : { padding: '9px' }}>
                                                            {column.type === 5 ?
                                                                <Switch size="small" name="checked" disabled={row['isCompleted']} checked={row['checked']} index={index} onChange={(e) => {
                                                                    const switch_ = e.target.closest('.MuiSwitch-switchBase')
                                                                    const Rows_ = Rows.map((obj, index) => {
                                                                        if (parseInt(switch_.attributes.index.value) === index)
                                                                            return { ...obj, 'checked': e.target.checked };
                                                                        return obj;
                                                                    });
                                                                    let arr = Rows_.filter((item) => { return item['checked'] });
                                                                    setRows(Rows_);
                                                                    if (arr['length'] === 0)
                                                                        setIsApproveRejectAll(true);
                                                                    else
                                                                        setIsApproveRejectAll(false);
                                                                }} /> : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    }) :
                                        <TableRow>
                                            <TableCell key={-1} colSpan={TimesheetApprovelColumn['length']} style={{ textAlign: "center" }}>No Rows Found...!</TableCell>
                                        </TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>

                <div style={{ display: 'inline-block', position: 'absolute', marginTop: '20px' }}>
                    <CustomGrid Columns={
                        [
                            { id: 'TaskDate', label: 'Date', minWidth: 100 },
                            { id: 'ProjectName', label: 'Project', minWidth: 100 },
                            { id: 'TaskDescription', label: 'Description', minWidth: 230 },
                            { id: 'ExpectedCompletiondate', label: 'Completion Date', minWidth: 100 },
                            { id: 'Status', label: 'Status', minWidth: 100 },
                            { id: 'Issues', label: 'Objects Changed', minWidth: 150 },
                            { id: 'Hours', label: 'Hours', minWidth: 80 }
                        ]
                    } ref={approvelRef} Rows={Rows} tab="viewEmpTimesheet" Pagination={true} />
                </div>
            </div>
        </>
    );
}
