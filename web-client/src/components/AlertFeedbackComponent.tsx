import { WidthFull } from "@mui/icons-material";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useEffect } from "react";

interface AlertProp {
    open: boolean;
    msg: string;
    type:  AlertColor;
    closeParent:(e:boolean)=>void;
}

export const DynamicAlert: React.FC<AlertProp> = ({ open, msg, type,closeParent}) => {
    
    const [isopen,setOpen] = React.useState(false);
    useEffect(() => {
        setOpen(open);
      }, [{open,msg,type}]);
    
    const handleClose = () => {
        setOpen( false);
        closeParent(false)
        
    }
    return (
        <Snackbar open={isopen} autoHideDuration={2500} onClose={handleClose} sx={{ width:"10%"}}>
            <Alert onClose={handleClose} variant="filled" severity={type} sx={{ width: '100%' }}>
                {msg}
            </Alert >
        </Snackbar>
    );

}

