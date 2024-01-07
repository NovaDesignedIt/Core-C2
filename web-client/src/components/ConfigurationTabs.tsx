import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Config, Core } from '../api/apiclient'
import { Button, Stack } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import BuildIcon from '@mui/icons-material/Build';

interface StyledTabProps {
    label: string;
}


const StyledTabs = styled((props: StyledTabProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        width: "100%",
        
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 50,
        width: '100%',
        backgroundColor:"#fff",
        opacity:"0.2"
    },
});


const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} 
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        //alert(newValue);
        onSelectTab(newValue);
        setValue(newValue);
    };
    const themebutton = {
        backgroundColor: '#202c22',
        color: '#21fd0a',
        ":hover": {
            backgroundColor: '#202c22',
        }
        
    }
    return (
        <Box sx={{ width: '100%' }}>

            <Box sx={{ bgcolor: '#202c22' }}>
                <StyledTabs
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs example">
                    <StyledTab label="General"/>
                        
                    <StyledTab label="Instances"/>
                    {/* <div style={{ marginLeft: 'auto',height:"100%", display:'flex'}}>
                        <div style={{ width: "100%", flexDirection: 'row', display: 'flex' }}> */}
                           <div style={{ marginLeft:'auto', display:'flex',padding:6}}>
                            <Button
                            onClick={()=> alert('syncing cores')}
                                sx={themebutton}
                            >
                                Sync/Save Core
                                <CloudSyncIcon />
                            </Button>
                            </div>
                        {/* </div>
                    </div> */}
                </StyledTabs>
            </Box>
        </Box>

    );
}
export default CustomizedTabs ;


                    {/* <StyledTab label="Agents & Scripts & Routines" /> */}
                    {/* <StyledTab label="Permissions" /> */}
                    // Future Implementation