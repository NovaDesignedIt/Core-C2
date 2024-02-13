import { Alert, AlertColor, Avatar, Button, Checkbox, List, ListItem, ListItemText, Snackbar, Stack, Switch, TextField, ThemeProvider, createTheme, styled } from '@mui/material';
import React, { SetStateAction } from 'react'
import { ClearLogs, Config, CoreC, setconfigurations } from '../api/apiclient';
import InstanceConfiguration from "./InstancesConfiguration";
import ListenerComponent from "./Listeners";
import Users from './userForm'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useAppDispatch, useAppSelector } from '../store/store';
import { DeleteListener, SetListener, addlisteners, BuildStateManagement, SetConfiguration } from '../store/features/CoreSlice';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { DynamicAlert } from './AlertFeedbackComponent';
import { motion } from "framer-motion";

import Radio, { RadioProps } from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const ConfigGeneralComp = () => {

  //dispatcher
  const dispatch: any = useAppDispatch();
  //retrieve the store
  const configurationObject: Config = useAppSelector(state => state.core.configObject)
  const corid = useAppSelector(state => state.core.configObject._core_id)
  const core: CoreC = useAppSelector(state => state.core.coreObject)
  const sessionLength: number = configurationObject._session_len !== undefined ? configurationObject._session_len : 0
  const DaysRetLog: number = configurationObject?._log_ret_days !== undefined ? configurationObject?._log_ret_days : 0
  //populate from store
  const configchkping: boolean = configurationObject?._log_pings === 1 ? true : false
  const configchkhttp: boolean = configurationObject?._use_http === 1 ? true : false
  const configredirectDump: boolean = configurationObject?._redirect_to_dump === 1 ? true : false
  const configCreateonPing: boolean = configurationObject?._create_on_ping === 1 ? true : false
  const configCommands: boolean = configurationObject?._log_commands === 1 ? true : false
  const configLogCreate: boolean = configurationObject?._log_create === 1 ? true : false
  const configLogDelete: boolean = configurationObject?._log_delete === 1 ? true : false
  const configInactivityTimeout: boolean = configurationObject?._inactivitytimeout === 1 ? true : false
  //values
  const [daysretLog, setDaysretLog] = React.useState<number>(DaysRetLog);
  const [sessionlen, setsessionlen] = React.useState<number>(sessionLength);
  const [chckdmp, setChkdmp] = React.useState(configredirectDump);
  const [chkping, setChkping] = React.useState(configCreateonPing);
  const [chkhttp, setChkhttp] = React.useState(configchkhttp);
  const [chkcmd, setChkcmd] = React.useState(configCommands);
  const [chkcreate, setCheckcreate] = React.useState(configLogCreate);
  const [chkdelete, setChkdelete] = React.useState(configLogDelete);
  const [chklp, setChklp] = React.useState(configchkping);
  const [chktimeout, setchktimeout] = React.useState(configInactivityTimeout);
  const [Format,SetFormat] = React.useState('');
  const [alertType, SetAlertType] = React.useState<AlertColor>('success');
  const [message, setmessage] = React.useState('');
  const [open, SetOpen] = React.useState(false);

  function ToggleAlertComponent(type: AlertColor, msg: string, open: boolean) {
    SetAlertType(type);
    setmessage(msg)
    SetOpen(open);
  }

  const HandleClearLogs = async () => {
    const result: number | string | void = await ClearLogs(core._url, core)
    if (result !== 401 && result !== undefined) {
      ToggleAlertComponent('success', `${result} entries deleted`, true);
    } else {
      ToggleAlertComponent('error', 'session over', true);
    }
  }
  const HandleSessionLength = (event: { target: { value: SetStateAction<string>; }; }) => {
    const t: number = parseInt(event.target.value.toString());
    setsessionlen(t);
  }
  const HandleDaysretChanged = (event: { target: { value: SetStateAction<string>; }; }) => {
    const t: number = parseInt(event.target.value.toString());
    setDaysretLog(t);
  }

  const HandleDaysretChanged_KeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Handle Enter key
      event.preventDefault();
    }
  }

  const HandleSaveCore = async () => {

    const settings: any = {
      "_log_ret_days": daysretLog,
      "_session_len": sessionlen,
      "_redirect_to_dump": chckdmp ? 1 : 0,
      "_log_pings": chklp ? 1 : 0,
      "_create_on_ping": chkping ? 1 : 0,
      "_use_http": chkhttp ? 1 : 0,
      "_log_create": chkcreate ? 1 : 0,
      "_log_delete": chkdelete ? 1 : 0,
      "_log_commands": chkcmd ? 1 : 0,
      "_inactivitytimeout": chktimeout ? 1 : 0
    }

    const BpIcon ={
      borderRadius: '50%',
      width: 16,
      height: 16,
      boxShadow:
        theme.palette.mode === 'dark'
          ? '0 0 0 1px rgb(16 22 26 / 40%)'
          : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
      backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
      backgroundImage:
        theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
          : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
      '.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        background:
          theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
      },
    
    };


    const BpCheckedIcon = {
      backgroundColor: '#137cbd',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&::before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: '#106ba3',
      },
    }
    


    const result = await setconfigurations(core._url, core, settings)
    if (result !== undefined) {
      const configInstance = result as unknown as Config
      // Update Config instance with values from settings
      console.log(configInstance)
      Object.keys(settings).forEach((key) => {
        if (configurationObject.hasOwnProperty(key)) {
          configInstance[key] = settings[key];
        } else {
          configInstance[key] = configurationObject[key]
        }
      });
      dispatch(SetConfiguration({ configuration: configInstance }))
      //console.log(configInstance)
      ToggleAlertComponent('success', `configuration saved`, true);
    } else {
      ToggleAlertComponent('error', 'error', true);
    }
  }

  const HandleTimeOut = (event: React.ChangeEvent<HTMLInputElement>) => {
    setchktimeout(event.target.checked)
  }
  const HandlesetChkdmp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChkdmp(event.target.checked)
  }
  const HandlesetChkping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChkping(event.target.checked)
  }
  const HandlessetCheckcreate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckcreate(event.target.checked)
  }

  const HandlesetChkhttp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChkhttp(event.target.checked)
  }
  const HandlesetChkdelete = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChkdelete(event.target.checked)
  }
  const HandlesetChkcmd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChkcmd(event.target.checked)
  }
  const HandlesetChklp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChklp(event.target.checked)
  }
  const themeText = {

    backgroundColor: "#333",
    "&:Hover,focus": {
      backgroundColor: "#555"
    },
    // OUTLINE
    "& .MuiOutlinedInput-root": {
      ":Hover,focus,selected,fieldset, &:not(:focus)": {
        "& > fieldset": { borderColor: "transparent", borderRadius: 0, },

      },
      "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
      borderColor: "transparent", borderRadius: 0,
    },
    "& .root": { color: "#fff" },
    "& .MuiInputLabel-root": { color: '#fff' },
    "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
    input: { color: '#fff' },
    inputProps: {
      style: { fontFamily: 'nunito' },
    },
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
  }

  const SwitchTheme = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#fff',

      '&:hover': {
        backgroundColor: 'transparent'
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#7ff685'
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#999'
    },
  }));


  const theme = createTheme({
    palette: {
      secondary: {
        main: '#fff', // Replace with your desired secondary color
      },
    },
  });


      // Inspired by blueprintjs
const HandleExportButton = () =>{
  //hit here to download.
  alert(`http://${core._url}/${corid}/cex/${Format}`);
}
    

  return (

    <Stack sx={{ borderStyle: 'none', padding: "1px", display: 'flex', backgroundColor: "#000", flexDirection: 'row', width: "100%", height: "100%", overflow: "scroll" }}>


      <Stack padding={2} spacing={'5px'} sx={{ flexDirection: "column", width: "20%", height: "100%", overflow: 'scroll' }}  >
        <h5 style={{ color: "#fff", cursor: "default" }}>Listener Configuration</h5>







        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex-end',
          width: "100%",
          padding: "10px",
          flexDirection: 'column',
          backgroundColor: "#111",
        }}>
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            send to dump
            <Checkbox sx={{
              color: "#fff",
              '&.Mui-checked': {
                color: '#fff',
              }
            }} checked={chckdmp} onChange={(e) => { HandlesetChkdmp(e) }} />
          </div>
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            create on ping
            <Checkbox sx={{
              color: "#fff",
              '&.Mui-checked': {
                color: '#fff',
              }
            }} checked={chkping} onChange={(e) => { HandlesetChkping(e) }} />
          </div>
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            use http
            <Checkbox sx={{
              color: "#fff",
              '&.Mui-checked': {
                color: '#fff',
              }
            }} checked={chkhttp} onChange={(e) => { HandlesetChkhttp(e) }} />
          </div>
        </div>




        <h5 style={{ cursor: "default" }}>Targets</h5>








        <div>

          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex-end',
            width: "100%",
            height: "100%",
            paddingLeft: "10px",
            paddingRight: "10px",
            flexDirection: 'column',
            backgroundColor: "#111",

          }}>
            <p style={{ opacity: "0.5", margin: "0" }}> Log target Creations,Deletion,commands or last known ping </p>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              create
              <Checkbox sx={{
                margin: "0",
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={chkcreate} onChange={(e) => { HandlessetCheckcreate(e) }} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              delete
              <Checkbox sx={{
                margin: "0",
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={chkdelete} onChange={(e) => { HandlesetChkdelete(e) }} />
            </div>

            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              Commands
              <Checkbox sx={{
                margin: "0",
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={chkcmd} onChange={(e) => { HandlesetChkcmd(e) }} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              last ping
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={chklp} onChange={(e) => { HandlesetChklp(e) }} />
            </div>
          </div>
        </div>




        <h5 style={{ color: "#fff", cursor: "default" }}>Clear data</h5>







        {/* CLEARING LOGS */}
        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex-end',
          width: "100%",
          height: "100%",
          padding: "10px",
          flexDirection: 'column',
          backgroundColor: "#111",

        }}>
          <p style={{ opacity: "0.5" }}>
            Deleting Logs will not delete your dumps or Target info.
          </p>
          <TextField
            fullWidth={true}
            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff" } }}
            label={'days'}
            size='small'
            type={'number'}
            value={daysretLog}
            onKeyDown={(e: any) => { HandleDaysretChanged_KeyDown(e) }}
            onChange={(e) => { HandleDaysretChanged(e) }}
            sx={{ ...themeText, width: "40%", borderRadius: "5px" }} ></TextField>

          <div style={{ padding: "10px" }} >
            <p style={{ color: "#fff", margin: "0" }}>
              files: 3 files
            </p>
            <p style={{ color: "#fff", margin: "0" }}>
              total space: 250mb
            </p>
            <p style={{ color: "#fff", margin: "0" }}>
              Log records: 22453 rows
            </p>
          </div>
          <Button
            onClick={() => { HandleClearLogs() }}
            sx={{

              border: "1px solid #FF3635",
              color: '#fff',
              ":hover": {
                bgcolor: "#ff7776",
              }
            }}
            style={{ width: '100%', height: '15%', }} >
            Clear Logs
          </Button>

        </div>





      </Stack>



      <Stack padding={2} spacing={"5px"} sx={{ flexDirection: "column", width: "60%", height: "100%", overflow: 'scroll' }}>

        <h5 style={{ color: "#fff", cursor: "default" }}>Instances</h5>








        <div style={{ maxHeight: "400px" }} >

          <InstanceConfiguration />

        </div>






        <Stack direction={'row'} spacing={3} >


          <Stack spacing={1} width={'100%'} height={'100%'}>
            <h5 style={{ color: "#fff", cursor: "default" }}>Session</h5>
            <div style={{
              border: "1px solid #222",
              borderRadius: "4px",
              display: 'flex-end',
              width: "100%",

              padding: "15px",
              flexDirection: 'column',
              backgroundColor: "#111",
            }}>
              <p style={{ opacity: "0.5" }}>
                Stay logged in?
              </p>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: "20px" }}>
                <h6 style={{ color: "#fff", cursor: "default" }}>Inactivity Timeout?</h6>
                <SwitchTheme defaultChecked checked={chktimeout} onChange={(e) => { HandleTimeOut(e) }} />
              </div>
              <p style={{ opacity: "0.5" }}>
                set Session length
              </p>
              <TextField
                fullWidth={true}
                type={'number'}
                InputLabelProps={{ sx: { color: "#fff" } }}
                inputProps={{ sx: { color: "#fff" } }}
                label={'minutes'}
                size='small'
                value={sessionlen}
                onChange={(e) => { HandleSessionLength(e) }}
                sx={{ ...themeText, width: "40%", borderRadius: "5px" }} ></TextField>
            </div>

          </Stack>

          <Stack spacing={1} width={'100%'} height={'100%'}  >

            <h5 style={{ color: "#fff", cursor: "default" }}>Listeners</h5>








            <ListenerComponent />

          </Stack>
        </Stack>

      </Stack>


      <Stack padding={2} spacing={"10px"} sx={{ flexDirection: "column", width: "20%", height: "100%", overflow: 'scroll' }}>

        <div style={{
          flexDirection: "column",
          display: "flex",
          marginLeft: "auto",
          cursor: "default",
          width: "100%",
          height: "50%",
          overflow: "hidden"
        }}>







          <h5 style={{ color: "#fff", cursor: "default" }}>Users</h5>
          <Users></Users>
        </div>



        <div style={{
          flexDirection: "column",
          display: "flex",
          marginLeft: "auto",
          cursor: "default",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          margin:"auto"
        }}>



          <h5 style={{ color: "#fff", cursor: "default" }}>Save - Export</h5>
          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex-end',
            width: "100%",
            height: "100%",
            padding: "10px",
            flexDirection: 'column',
            backgroundColor: "#111",
            margin: "auto"

          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              <p style={{ opacity: "0.5", margin: 0 }}>
                Export Core as:
              </p>

              <p style={{ opacity: "0.5", margin: 0 }}> Json, XML, yaml, 
              </p>
              {/* Pkl soon...?*/}






{/* here */}


              <FormControl>

                <RadioGroup
                  onChange={(e)=>{SetFormat(e.currentTarget.value)}}
                  defaultValue="female"
                  aria-labelledby="demo-customized-radios"
                  name="customized-radios"
                >
                  <FormControlLabel value="json" control={<Radio sx={{
                    color: "#fff",
                    '&.Mui-checked': {
                      color: "#fff",
                    },
                  }} />} label="json" />
                  <FormControlLabel value="xml" control={<Radio sx={{
                    color: "#fff",
                    '&.Mui-checked': {
                      color: "#fff",
                    },
                  }} />} label="xml" />
                  <FormControlLabel value="yaml" control={<Radio sx={{
                    color: "#fff",
                    '&.Mui-checked': {
                      color: "#fff",
                    },
                  }} />} label="yaml" />

                </RadioGroup>
              </FormControl>









              <Button
                onClick={HandleExportButton}
                sx={{

                  maxHeight: "50px",
                  minHeight: "50px",
                  maxWidth: "250px",
                  minWidth: "200px",
                  border: "1px solid #fff",
                  color: '#fff',
                  backgroundColor: "#111",
                  ":hover": {
                    backgroundColor: '#333'
                  }
                }}
              >
                Export
              </Button>

              <p style={{ opacity: "0.5", margin: 0 }}>
                Push all settings and changes
              </p>
              <Button
                onClick={() => { HandleSaveCore() }}
                sx={{

                  maxHeight: "50px",
                  minHeight: "50px",
                  maxWidth: "250px",
                  minWidth: "200px",
                  border: "1px solid #7ff685",
                  color: '#fff',
                  backgroundColor: "#111",
                  ":hover": {
                    backgroundColor: '#32f13b'
                  }
                }}
              >
                save
                <CloudSyncIcon />


              </Button>

            </div>




          </div>
        </div>

      </Stack>

      <DynamicAlert open={open} msg={message} type={alertType} closeParent={(e) => { SetOpen(false) }} />
    </Stack>
  );

}

export default ConfigGeneralComp;