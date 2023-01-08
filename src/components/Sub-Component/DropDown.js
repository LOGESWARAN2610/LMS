import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(() => ({
    formControl: {
        "& .MuiInputBase-root": {
            color: localStorage['BgColor'],
            borderColor: localStorage['BgColor'],
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "100px",
            minWidth: "120px",
            justifyContent: "center"
        },
        "& .MuiSelect-select.MuiSelect-select": {
            paddingRight: "0px"
        }
    },
    select: {
        width: "auto",
        fontSize: "12px",
        "&:focus": {
            backgroundColor: "transparent"
        }
    },
    selectIcon: {
        position: "relative",
        color: localStorage['BgColor'],
        fontSize: "14px"
    },
    paper: {
        borderRadius: 5,
        marginTop: 6
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0,
        "& li": {
            fontWeight: 200,
            paddingTop: 8,
            paddingBottom: 8,
            fontFamily: 'inherit',
            fontSize: "14px"
        }, "& li:hover": {
            color: localStorage['BgColor'],
            borderBottom: '1px solid ' + localStorage['BgColor']
        },
        "& li.Mui-selected": {
            color: "white",
            background: localStorage['BgColor']
        },
        "& li.Mui-selected:hover": {
            background: localStorage['BgColor']
        }
    }
}));

const DropDown = ({ value, handleChange, items, name }) => {
    const classes = useStyles();

    const menuProps = {
        classes: {
            list: classes.list,
            paper: classes.paper
        },
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "center"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "center"
        },
        getContentAnchorEl: null
    };

    return (
        <Select value={value} onChange={handleChange} disableUnderline MenuProps={menuProps} name={name}>
            {items.map((item) => (
                <MenuItem key={item.key} value={item.value} disabled={item.disabled}>
                    {item.key}
                </MenuItem>
            ))}
        </Select>
    );
};

export default DropDown;
