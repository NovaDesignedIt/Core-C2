import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import CircleIcon from '@mui/icons-material/Circle';
import { Core, Instance } from '../api/apiclient';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { BottomNavigation, BottomNavigationAction, Button } from '@material-ui/core';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ObjectView from './ObjectView'
import LiveView from './LiveView'
import { useAppSelector } from '../store/store';
import Splitter, { SplitDirection } from '@devbookhq/splitter'

export function liveView(value: number) {

  return (
    <Box sx={{ color: '#fff' }}>
      <Box sx={{
        height: '20%',
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#111',
        padding: '2%',
        JustifyContent: "center",
        display: 'flex',
        flexWrap: 'nowrap',
        fontSize: "10px"
      }}>
        {value == 1 ? <p >live View</p> : <p >Object</p>}
      </Box>

      <List sx={{ gap: '10px' }} >
        <ListItem sx={{
          ":Hover": { opacity: '0.8' },
          borderRadius: '0px', marginBottom: '1%', backgroundColor: '#222', gap: '1px'
        }}>
          <ListItemIcon >
            <CircleIcon sx={{ fontSize: '10px', color: '#21fd0a', width: '10px' }} />
          </ListItemIcon>
          <div style={{ flexDirection: 'column', display: 'flex', }}>
            <ListItemText style={{ color: '#fff' }}>
              <Typography
                style={{
                  color: '#fff',
                  fontSize: '10px',
                }}
              >
                TARGET : (GET)
              </Typography>
            </ListItemText>
            <div style={{ gap: '10px', flexDirection: 'row', display: 'flex', }}>
              <ListItemText style={{ color: '#fff' }}>
                <Typography
                  style={{
                    color: '#fff',
                    fontSize: '10px',

                  }}
                >
                  MACHINE-01
                </Typography>
              </ListItemText>
              <ListItemText >
                <Typography
                  style={{
                    color: '#fff',
                    fontSize: '8px'
                  }}
                >
                  2023/12/27 16:20:11
                </Typography>
              </ListItemText>
            </div>
          </div>
        </ListItem>
      </List>
    </Box>
  )
}



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const tabpanel: React.FC<TabPanelProps> = ({ children, index, value }) => {


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}

    >
      {value === index && (
        <Box sx={{ p: 0, height: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

interface InstanceContainerProps {
  url: string;
  objs: any;
  instance?: Instance;
  selectedTargets: number[];
  core?: Core; // Include the 'core' prop with the optional (?) modifier
}

const BoxMenu = () => {
  //{ url,objs, instance, selectedTargets, core }
  //url={url} objs={objs} instance={instance} selectedTargets={selectedTargets} core={core}
  const core = useAppSelector(state => state.core.coreObject);
  const url = core._url
  const instance = useAppSelector(state => state.core.SelectedInstances)
  const selectedTargets = useAppSelector(state => state.core.selectedTargets)





  const [value, setValue] = React.useState(1);
  const [running, setRunning] = React.useState(false);

  const styles = {
    animation: 'blinking 1s infinite',
    '@keyframes blinking': {
      '0%': { opacity: '0' },
      '25%': { opacity: '0.25' },
      '50%': { opacity: '0.5' },
      '75%': { opacity: '0.75' },
      '100%': { opacity: '1' },
    },
  };
  const [sizes, setSizes] = React.useState([30, 30, 30]);
  const ScriptsRunningColor = () => {
    return running ? 'red' : '#fff'
  }



  function handleResize(gutterIdx: number, allSizes: number[]) {
    //console.log('gutterIdx', gutterIdx);
    //console.log('allSizes in %', allSizes);
    setSizes(allSizes);
  }

  return (
    <div style={{height:"100%"}}>
      <Splitter direction={SplitDirection.Vertical}
        onResizeFinished={handleResize}
        initialSizes={sizes}>
          <LiveView />
          <ObjectView />

        
      </Splitter>
    </div>

  );

}

export default BoxMenu;


{/* <Splitter>
{
    value === 1 && 
    (
      <LiveView />
    )   
  ||
  value === 2 && 
  (
  <Box sx={{ color: 'blue' }}>

    <Box sx={{
      height: '40%',
      width: '100%',
      flexDirection: 'row',
      backgroundColor: '#111',
      padding: '2%',
      display: 'flex',
      flexWrap: 'nowrap'
    }}>
      <Button style={{ width: '50%', borderRadius: '0px', backgroundColor: 'Transparent', color: '#7ff685' }}><FormatListNumberedOutlinedIcon /></Button>
      <Button
        onClick={(e) =>  {e.preventDefault(); setRunning(!running)}}
        style={{
          width: '50%',
          borderRadius: '0px',
          backgroundColor: 'Transparent', 
        
        }}>
        {running ? <StopCircleOutlinedIcon sx={{ ...styles, color:'red' }} /> : <PlayArrowIcon sx={{  color: ScriptsRunningColor }} />}
      </Button>

    </Box>


    <List sx={{ gap: '10px' }} >


      <ListItem sx={{
        ":Hover": { opacity: '0.8' },
        borderRadius: '0px', marginBottom: '1%', backgroundColor: '#222', gap: '1px'
      }}>
        <ListItemIcon >
          <CircleIcon sx={{ fontSize: '10px', color: running ? '#21fd0a' : '#555', width: '10px' }} />
        </ListItemIcon>
        <div style={{ flexDirection: 'column', display: 'flex', }}>
          <ListItemText style={{ color: '#fff' }}>
            <Typography
              style={{
                color: '#fff',
                fontSize: '10px',
              }}>
              SCRIPT 1 - {running? 'RUNNING' : 'STOPPED' }
            </Typography>
          </ListItemText>

        </div>
      </ListItem>

    </List>


  </Box>
  ) ||
  value === 3 && 
  <ObjectView/>

}
    </Splitter> */}