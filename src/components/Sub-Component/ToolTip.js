import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#f1f3f4",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f1f3f4",
    color: localStorage["BgColor"],
    boxShadow: "0px 1px 5px 0px #000c2f4d",
    fontSize: 20,
    padding: "10px 15px",
  },
}));
export default BootstrapTooltip;
// function CustomizedTooltips(props) {
//   return (
//     <div>
//       {props["IsOpen"] ? (
//         <BootstrapTooltip title="Add">{props["Link"]}</BootstrapTooltip>
//       ) : (
//         <></>
//       )}
//     </div>
//   );
// }
