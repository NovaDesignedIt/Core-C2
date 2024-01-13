import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Config, Core } from '../api/apiclient'
import { Avatar, Button, Stack } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import BuildIcon from '@mui/icons-material/Build';
import { purple } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';

interface StyledTabProps {
    label: string;
}
interface StyledTabsProps {
    children:React.ReactNode;
}

const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} iconPosition='start'  sx= {{'&:MuiButtonBase-root .MuiTab-root':{
        maxHeight:"200px",
        height:"5px"
    }}}
        icon={  props.label === 'General'  ?
         <SettingsIcon fontSize='small' sx={{ color: "#7ff685" , height: '15px' }}></SettingsIcon> :
           props.label === 'Instances' ?  <BuildIcon fontSize='small' sx={{ color: "#7ff685" , height: '15px' }}></BuildIcon> : 
        <></>
    }
 
     />
))

(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        color: '#fff',
        backgroundColor:"#5E8061"
    },
    
    
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
   
    
}));

interface TabConfigurationProp {
core?:Core;
onSelectTab : (index: React.SetStateAction<number>) => void;
}


const CustomizedTabs:React.FC<TabConfigurationProp> = ( {core ,onSelectTab}) => {
    const [value, setValue] = React.useState(0);
    const user  = React.useRef(core !== undefined ?  core._user  : "" );

    const StyledTabs = styled((props: StyledTabsProps) => (
        <Tabs
            {...props}
            value={value}
            sx={{minHeight :"70px"}}
            onChange={handleChange}
            TabIndicatorProps={{
                children: <span className="MuiTabs-indicatorSpan"
                />
            }}
        />
    ))

        ({
            '&:MuiButtonBase-root .MuiTab-root':{
                maxHeight:"200px",
                height:"5px"
            },

            '& .MuiTabs-indicator': {
                display: 'flex',
                width: "100%",
                justifyContent: 'start',
                backgroundColor: 'transparent',
            },
            '& .MuiTabs-indicatorSpan': {
                maxWidth: 50,
                width: '100%',
                backgroundColor: "#fff",
                opacity: "0.2"
            },
        });


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        //alert(newValue);
        onSelectTab(newValue);
        setValue(newValue);
    };
    
    const themebutton = {
        height:"100%",
        width:"100%",
        border:" 1px solid #5E8061",
        color: '#5E8061',
        ":hover": {
            color: '#21fd0a',
            border:" 1px solid #21fd0a"
        },
        
        "&:hover":{backgroundColor:"transparent" }
    }

    return (


                <StyledTabs>
                    <StyledTab label="General" />
                    <StyledTab label="Instances" />
                    <div style={{ display: 'flex', padding: 5, gap: "15%" }}>
                        <Avatar sx={{ backgroundColor: "purple",cursor:"pointer", marginTop:"8px" }}>{user.current.substring(0, 2)}</Avatar>
                        <p style={{ color: "white",padding:"5%",cursor:"pointer", marginTop:"10px"}}>
                            {user.current}
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', padding: 6 }}>
                        <Button
                            variant='outlined'
                            disableRipple disableFocusRipple
                            onClick={() => alert('syncing cores')}
                            sx={themebutton}>
                            save
                            <CloudSyncIcon/>
                        </Button>
                    </div>
                </StyledTabs>
    


    );
}
export default CustomizedTabs ;


                    {/* <StyledTab label="Agents & Scripts & Routines" /> */}
                    {/* <StyledTab label="Permissions" /> */}
                    // Future Implementation