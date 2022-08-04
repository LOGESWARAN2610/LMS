import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const ToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#383232',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#383232',
        color: "#f1f3f4",
        boxShadow: "0px 1px 5px 0px #000c2f4d",
        opacity: 0.3,
        fontSize: 20,
        padding: "10px 15px",
    },
}));
export default ToolTip;