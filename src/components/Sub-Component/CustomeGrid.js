import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import axios from 'axios';
import nodeurl from '../../nodeServer.json'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Moment from 'moment';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow, faXmark } from "@fortawesome/free-solid-svg-icons";
import Switch from '@mui/material/Switch';
import { useAlert } from "react-alert";
import { confirm } from "react-confirm-box";

const StickyHeadTable = forwardRef((props, ref) => {

    let EmpId = localStorage['EmpId'];
    var columns = props['Columns'];
    const tab = props['tab'];
    const alert = useAlert();
    const [rows, setRows] = useState([]);

    const selectedEmpId = 0;
    const [paperWidth, setPaperWidth] = useState('100%');
    const Pagination = props['Pagination'];
    const handleAction = props['onclick'];
    const IsInclude = props['IsInclude']
    const setIsApproveRejectAll = props['setIsApproveRejectAll'];
    //  const [isheaderChecked, setIsheaderChecked] = useState(true);

    useEffect(() => {
        if (tab === 'LeaveHistory') {
            axios.post(nodeurl['nodeurl'], { query: 'SP_LM_LeaveHistory ' + EmpId + '' }).then(result => {
                setRows(result.data[0]);
            });
        }
        else if (tab === 'PermissionHistory') {
            axios.post(nodeurl['nodeurl'], { query: 'LM_PM_PermissionHistory ' + EmpId + '' }).then(result => {
                setRows(result.data[0]);
            });
        }
        else if (tab === 'TaskDashBoard') {
            let IsInclude_ = 1;
            if (IsInclude) IsInclude_ = 0;
            axios.post(nodeurl['nodeurl'], { query: 'AB_Employee_Tasksummary ' + EmpId + ',' + IsInclude_ }).then(result => {
                setRows(result.data[0]);
            });
        }
        else if (tab === 'ProjectApprovels') {
            setPaperWidth('35%');
            axios.post(nodeurl['nodeurl'], { query: 'AB_ProjectListAll' }).then(result => {
                setRows(result.data[0]);
            });
        }
        else if (tab === 'HoliDayList') {
            setPaperWidth('35%');
            axios.post(nodeurl['nodeurl'], { query: 'Menus_HolidayList' }).then(result => {
                setRows(result.data[0]);
            });
        } else if (tab === 'LeaveApprovels') {
            axios.post(nodeurl['nodeurl'], { query: 'SP_LM_LEAVEDECISION ' + EmpId }).then(result => {
                setRows(result.data[0]);
            });
        } else if (tab === 'PermissionApprovels') {
            axios.post(nodeurl['nodeurl'], { query: 'LM_PM_PermissionApproval ' + EmpId }).then(result => {
                setRows(result.data[0]);
            });
        }
        else if (tab === 'LOP') {
            axios.post(nodeurl['nodeurl'], { query: 'SP_LM_Lop_Bind ' + EmpId }).then(result => {
                setRows(result.data[0]);
            });
        }
        //  else if (tab == 'TimesheetApprovels') {
        //     // setPaperWidth('25%');
        //     axios.post(nodeurl['nodeurl'], { query: 'AB_WorkHoursApproval ' + EmpId }).then(result => {
        //         console.log(result.data[0]);
        //         setRows(result.data[0]);
        //     });
        // }
    }, [EmpId, tab, IsInclude]);
    useEffect(() => {
        if (tab === 'viewTimesheet') {
            setRows(props['Rows']);
        }
    }, [props['Rows']]);

    const handleActiveStatus = (ProjectId, event) => {
        axios.post(nodeurl['nodeurl'], { query: "update ProjectList set Active=" + (event.target.checked ? 1 : 0) + " where ProjectId=" + ProjectId }).then(result => {
        });
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [LopDetails, setLopDetails] = useState({ EmpId: EmpId, StartDate: '', EndDate: '', EmpLeaveApplicationId: 0, Reason: '', TimesheetHrs: 0.00, TotalLeaveHrs: 0.00, TotalHrs: 0.00 });
    const handleLopModel = async (lopDetails_, row_) => {
        //setLopDetails({ ...LopDetails, StartDate: row_['StartDate'], EndDate: row_['EndDate'], EmpLeaveApplicationId: row_['EmpleaveApplicationID'], TimesheetHrs: lopDetails_['TimesheetHrs'], TotalLeaveHrs: lopDetails_['TotalLeaveHrs'] });
        const optionsWithLabelChange = {
            closeOnOverlayClick: true,
            labels: { confirmable: <span>Apply</span>, cancellable: "Cancel" }
        };

        const result = await confirm(<div id='lopCancel'>
            <h1>LOP Cancel</h1>
            <div><span>Date : </span><strong>{row_['StartDate']}</strong> - <strong>{row_['EndDate']}</strong></div>
            <div><span>TimeSheet Hours : </span><strong>{lopDetails_['TimesheetHrs'].toFixed(2)}</strong></div>
            <div><span>Leave Hours : </span><strong>{lopDetails_['TotalLeaveHrs'].toFixed(2)}</strong></div >
            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <input type="text" className="input-input" placeholder="Action Taken" onChange={(e) => {
                        setLopDetails({ ...LopDetails, Reason: e.target.value });
                    }} />
                    <label className="input-label">Action Taken :</label>
                </div>
            </div>
        </div>, optionsWithLabelChange);
        if (result) {
            let details = { EmpId: EmpId, StartDate: row_['StartDate'], EndDate: row_['EndDate'], EmpLeaveApplicationId: row_['EmpleaveApplicationID'], TimesheetHrs: lopDetails_['TimesheetHrs'], TotalLeaveHrs: lopDetails_['TotalLeaveHrs'], Reason: 'Forgot to fill' }
            axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'SP_LM_LOP_Cancel_Request ', UpdateJson: JSON.stringify(details) }).then(result => {
            });
        }
    }
    const handlePostCancel = async (id, type) => {
        const result = await handleAction(id, type);
        if (result) {
            setTimeout(() => {
                if (type === '1') {
                    axios.post(nodeurl['nodeurl'], { query: 'SP_LM_LeaveHistory ' + EmpId + '' }).then(result => {
                        setRows(result.data[0]);
                    });
                }
                else if (type === '4') {
                    axios.post(nodeurl['nodeurl'], { query: 'LM_PM_PermissionHistory ' + EmpId + '' }).then(result => {
                        setRows(result.data[0]);
                    });
                }
            }, 200);
        }
    }

    const handleCancelAction = (e) => {
        let id, type;
        if (e.target.tagName === 'path') {
            id = e.target.parentElement.id
            type = e.target.parentElement.attributes.clicktype.value;
        } else {
            id = e.target.id;
            type = e.target.attributes.clicktype.value;
        }
        handlePostCancel(id, type);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }
    const getLastWeekMonday = (dayNo) => {
        let date = new Date();
        let currentWeekMonday = date.getDate() - date.getDay() + 1;
        return new Date(date.setDate(currentWeekMonday - dayNo));
    }
    useImperativeHandle(ref, () => ({
        setSelectedEmpId_(selectedEmpId, tab) {
            if (selectedEmpId !== 0 && tab === 3) {
                axios.post(nodeurl['nodeurl'], { query: 'LM_Emp_LeaveHistory ' + selectedEmpId + '' }).then(result => {
                    setRows(result.data[0]);
                });
            } else if (selectedEmpId !== 0 && tab === 4) {
                axios.post(nodeurl['nodeurl'], { query: 'LM_PM_EmpPermissionHistory ' + selectedEmpId + '' }).then(result => {
                    setRows(result.data[0]);
                });
            } else if (selectedEmpId !== 0 && tab === 5) {
                axios.post(nodeurl['nodeurl'], { query: 'AB_GetTimesheet "Range",' + selectedEmpId + ',"' + Moment(getLastWeekMonday(7)).format('YYYY-MM-DD') + '","' + Moment(getLastWeekMonday(2)).format('YYYY-MM-DD') + '",0,0' }).then(result => {
                    setRows(result.data[0]);
                });
            }
        }
        ,
        handleApproveReject(isAll, isApprove, tab) {
            debugger
            let Row_ = [];
            if (isAll) {
                Row_ = rows;
            } else {
                Row_ = rows.filter((item) => { return item['checked'] })
            }
            Row_.forEach((item) => {
                item['isApproved'] = isApprove;
            });
            let SP = '';
            if (tab === 0) SP = 'LM_LeaveApproveReject_Wrapper';
            else if (tab === 1) SP = 'LM_PremessionApproveReject_Wrapper';
            else if (tab === 2) SP = 'Sp_LM_Lop_Lopupdate_Wrapper';
            axios.post(nodeurl['nodeurl'] + 'Update', { SP: SP, UpdateJson: JSON.stringify(Row_) }).then(result => {
                if (isApprove === 1) alert.success('Approved Successfully.')
                else alert.show('Rejected Successfully.');
                let SP = '';
                if (tab === 0) SP = 'SP_LM_LEAVEDECISION ';
                else if (tab === 1) SP = 'LM_PM_PermissionApproval ';
                else if (tab === 2) SP = 'SP_LM_Lop_Bind ';

                axios.post(nodeurl['nodeurl'], { query: SP + EmpId }).then(result => {
                    setRows(result.data[0]);
                });
            });
        },

    }));

    const getPagination = () => {
        if (Pagination)
            return (<TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />);
    }
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    function EnhancedTableHead(props) {
        const { order, orderBy, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {columns.map((headCell, index) => (
                        <TableCell
                            key={index}
                            style={{ minWidth: headCell.minWidth, backgroundColor: localStorage['BgColor'], color: '#fff', padding: '10px' }}
                            sortDirection={orderBy === headCell['id'] ? order : false}
                        >
                            {/* {headCell['field'] === 'CheckBox' && headCell['type'] === 5 ? <input type="checkbox"
                                checked={isheaderChecked}
                                onChange={(e) => {
                                    setIsheaderChecked(e.target.checked);
                                    for (let i = 0; i < rows.length; i++) {
                                        rows[i]['checked'] = e.target.checked;
                                    }
                                }}></input> : null} */}
                            {
                                headCell['sort'] ? <TableSortLabel
                                    active={orderBy === headCell['id']}
                                    direction={orderBy === headCell['id'] ? order : 'asc'}
                                    onClick={createSortHandler(headCell['id'])}
                                >
                                    {headCell['label']}
                                    {orderBy === headCell['id'] ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel> : (headCell['label'])}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead >
        );
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    EnhancedTableHead.propTypes = {
        // numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        // onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        // rowCount: PropTypes.number.isRequired,
    };
    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    return (
        <>
            <Paper sx={{ width: paperWidth, overflow: 'auto', border: '1px solid ' + localStorage['BgColor'], height: 'auto' }}>
                <TableContainer className='scrollbar' >
                    <Table stickyHeader aria-label="sticky table">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {rows['length'] > 0 ? stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow tabIndex={-1} key={index} style={{ backgroundColor: `${row['isCompleted'] ? 'pink' : ''}` }}>
                                            {columns.map((column, index_) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={index_} align={column.align} style={column.type === 6 ? { padding: '0' } : { padding: '9px' }}>
                                                        {column.type === 1 ? <button className='btnAction' ><FontAwesomeIcon id={row.EmpleaveApplicationID} clicktype={column.type} onClick={handleCancelAction} icon={faXmark} /></button> : value}
                                                        {column.type === 2 && row.Reason === 'Timesheet not filled' ? <><button className='btnAction' ><FontAwesomeIcon id={row.EmpleaveApplicationID} clicktype={column.type} onClick={
                                                            (e) => {
                                                                let id, type;
                                                                if (e.target.tagName === 'path') {
                                                                    id = e.target.parentElement.id
                                                                    type = e.target.parentElement.attributes.clicktype.value;
                                                                } else {
                                                                    id = e.target.id;
                                                                    type = e.target.attributes.clicktype.value;
                                                                }
                                                                axios.post(nodeurl['nodeurl'], { query: "SP_LM_LOP_TimesheetHrs " + EmpId + ",'" + row.StartDate + "'," + id }).then(result => {
                                                                    handleLopModel(result.data[0][0], row);
                                                                });
                                                            }

                                                        } icon={faLocationArrow} /></button>
                                                        </> : null}
                                                        {column.type === 3 && row.LeaveType !== 'Total' ? <button className='btnAction' id={row.LeaveID} clicktype={column.type} onClick={handleCancelAction}>{column.button}</button> : ''}
                                                        {column.type === 4 ? <button className='btnAction' ><FontAwesomeIcon id={row.PermissionApplicationID} clicktype={column.type} onClick={handleCancelAction} icon={faXmark} /></button> : ''}
                                                        {column.type === 5 ?
                                                            <Switch size="small" name="checked" disabled={row['isCompleted']} checked={row['checked']} index={index} onChange={(e) => {
                                                                const switch_ = e.target.closest('.MuiSwitch-switchBase')
                                                                const Rows_ = rows.map((obj, index) => {
                                                                    if (parseInt(switch_.attributes.index.value) === index)
                                                                        return { ...obj, 'checked': e.target.checked };
                                                                    return obj;
                                                                });
                                                                setRows(Rows_);
                                                                let arr = Rows_.filter((item) => { return item['checked'] });
                                                                if (tab === 'ProjectApprovels') {
                                                                    handleActiveStatus(row['ProjectId'], e);
                                                                }
                                                                else {
                                                                    if (arr['length'] === 0)
                                                                        setIsApproveRejectAll(true);
                                                                    else
                                                                        setIsApproveRejectAll(false);
                                                                }
                                                            }} /> : null}
                                                        {column.type === 6 ? <textarea value={row.comments} index={index} name="comments" onChange={(e) => {
                                                            const Row_ = rows.map((item, index) => {
                                                                if (index === parseInt(e.target.attributes.index.value)) {
                                                                    return { ...item, [e.target.name]: e.target.value };
                                                                }
                                                                return item;
                                                            });
                                                            setRows(Row_);
                                                        }} rows={2} cols={15} /> : ''}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                }) :
                                <TableRow>
                                    <TableCell key={-1} colSpan={columns['length']} style={{ textAlign: "center", height: '35px' }}>No Rows Found...!</TableCell>
                                </TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                {rows['length'] > 0 && getPagination()}
            </Paper >

        </>
    );
});
export default StickyHeadTable