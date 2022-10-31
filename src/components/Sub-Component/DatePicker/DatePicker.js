import React, { useEffect, useState } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';

export default function DatePicker_(props) {
    const [Date_, setDate] = useState(new Date(props['Value']));
    const valueChange = props['valueChange'];
    const minDate = props['minDate_'] || null;
    const isWeekEndDisable = props['isWeekEndDisable'];
    const showHoliDay = props['showHoliDay'] || false;
    const [holiDays, setHoliDays] = useState([]);
    const [holiDayList, setHoliDayList] = useState([]);
    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'Menus_HolidayList' }).then(result => {
            setHoliDayList(result.data[0]);
            setHoliDays(result.data[0].map(function (item) { return Moment(item['Holiday_Date']).format('MM-DD-YYYY') }));
        });
    }, []);

    const handelDateChange = (value, e) => {
        var text = Moment(value).format('MM-DD-YYYY').toString();
        setDate(value);
        valueChange({ target: { name: props['name'], attributes: { index: { value: props['index'] || 0 } }, value: text } })
    }
    const getWeekEnd = (date) => {
        const day = date.getDay();
        let className = '';
        if ((isWeekEndDisable || isWeekEndDisable === undefined)) {
            if (!(day !== 0 && day !== 6) && minDate < date)
                className += "disabled";
        }
        if (showHoliDay || showHoliDay === undefined) {
            if (holiDays.indexOf(Moment(date).format('MM-DD-YYYY')) !== -1)
                className += " holiDay";
            if (!(day !== 0 && day !== 6))
                className += " random";
        }
        return className;
    }

    const isDisableWeekEnd = () => {
        return { dayClassName: getWeekEnd };
    }
    const renderDayContents = (day, date) => {
        let tooltipText = '';
        holiDayList.forEach((item) => { if (Moment(date).format('MM-DD-YYYY') === Moment(item['Holiday_Date']).format('MM-DD-YYYY')) tooltipText = item['Holiday_Name'] });
        return <span title={tooltipText}>{date.getDate()}</span>;
    };
    return (
        // showYearDropdown,showMonthDropdown
        <DatePicker name={props['name']}
            {...isDisableWeekEnd()}
            renderDayContents={renderDayContents}
            closeOnScroll={(e) => e.target === document}
            minDate={minDate}
            selected={Date_}
            onChange={handelDateChange} />
    );
}
