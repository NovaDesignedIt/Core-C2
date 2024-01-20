import { Alert, AlertColor, Button, Checkbox, Snackbar, Stack, Switch, TextField, styled } from '@mui/material';
import React, { SetStateAction } from 'react'
import { ClearLogs, CoreC, setconfigurations } from '../api/apiclient';
import InstanceConfiguration from "./InstancesConfiguration";
import ListenerComponent from "./Listeners";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useAppDispatch, useAppSelector } from '../store/store';
import { DeleteListener, SetListener, addlisteners, BuildStateManagement } from '../store/features/CoreSlice';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import {  DynamicAlert } from './AlertFeedbackComponent';

const ConfigGeneralComp = () => {

  const dispatch: any = useAppDispatch();

  const configurationObject = useAppSelector(state => state.core.configObject)
  const corid = useAppSelector(state => state.core.configObject._core_id)
  const core: CoreC = useAppSelector(state => state.core.coreObject)
  const sessionLength: number = configurationObject._session_len !== undefined ? configurationObject._session_len : 0
  const DaysRetLog: number = configurationObject?._log_ret_days !== undefined ? configurationObject?._log_ret_days : 0

  const configchkdump: boolean = configurationObject?._redirect_to_dump !== 1 ? true : false

  const configchkping: boolean = configurationObject?._log_pings !== 1 ? true : false
  const configchkhttp: boolean = configurationObject?._use_http !== 1 ? true : false
  const asdas: boolean = configurationObject?._redirect_to_dump !== 1 ? true : false
  const confidgchkdump: boolean = configurationObject?._redirect_to_dump !== 1 ? true : false
  const confiasdasdgchkdump: boolean = configurationObject?._redirect_to_dump !== 1 ? true : false
  const condfigchkdump: boolean = configurationObject?._redirect_to_dump !== 1 ? true : false
  const configchakdump: boolean = configurationObject?._redirect_to_dump !== 1 ? true : false




  const [daysretLog, setDaysretLog] = React.useState<number>(sessionLength);
  const [sessionlen, setsessionlen] = React.useState<number>(DaysRetLog);
  const [chckdmp, setChkdmp] = React.useState(false);
  const [chkping, setChkping] = React.useState(false);
  const [chkhttp, setChkhttp] = React.useState(false);
  const [chkcreate, setCheckcreate] = React.useState(false);
  const [chkdelete, setChkdelete] = React.useState(false);
  const [chkcmd, setChkcmd] = React.useState(false);
  const [chklp, setChklp] = React.useState(false);
  const [chktimeout, setchktimeout] = React.useState(false);


  

  const [alertType, SetAlertType] = React.useState<AlertColor>('success');
  const [message, setmessage] = React.useState('');
  const [open, SetOpen] = React.useState(false);

  function ToggleAlertComponent(type:AlertColor,msg:string,open:boolean){
    SetAlertType(type);
    setmessage(msg)
    SetOpen(open);
  }

  



  
 const HandleClearLogs = async () => {
    const result : number | string | void  = await ClearLogs(core._url, core)
    if (result !== 401 && result !== undefined) {
      ToggleAlertComponent('success',`${result} entries deleted`,true);
    }else{
      ToggleAlertComponent('error','session over',true);
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
      "_redirect_to_dump": chckdmp,
      "_log_pings ": chkping,
      "_use_http ": chkhttp,
      "_log_create ": chkcreate,
      "_log_delete ": chkdelete,
      "_log_commands ": chkcmd,
      "_inactivitytimeout ": chktimeout
    }
    await setconfigurations(core._url, core, settings)
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

  return (

    <Stack sx={{ borderStyle: 'none', padding: "1px", display: 'flex', backgroundColor: "#000", flexDirection: 'row', width: "100%", height: "100%", overflow: "scroll" }}>
      <Stack spacing={'15px'} sx={{ width: "30%", height: "100%", padding: "10px", overflow: 'scroll' }}  >
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

        <div>
          <h5 style={{ cursor: "default" }}>Targets</h5>
          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex-end',
            width: "100%",
            height: "87%",
            paddingLeft: "10px",
            paddingRight: "10px",
            flexDirection: 'column',
            backgroundColor: "#111",

          }}>
            <p style={{ opacity: "0.5" }}> Log target Creations,Deletion,commands or last known ping </p>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              create
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={chkcreate} onChange={(e) => { HandlessetCheckcreate(e) }} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              delete
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={chkdelete} onChange={(e) => { HandlesetChkdelete(e) }} />
            </div>

            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              Commands
              <Checkbox sx={{
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
          height: "60%",
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
            <p style={{ color: "#fff" }}>
              files: 3 files
            </p>
            <p style={{ color: "#fff" }}>
              total space: 250mb
            </p>
            <p style={{ color: "#fff" }}>
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
      <Stack spacing={"2%"} sx={{ flexDirection: "column", width: "100%", height: "100%", padding: "10px", overflow: 'scroll' }}>
        <div style={{ maxHeight: "400px" }} >
          <h5 style={{ color: "#fff", cursor: "default" }}>Instances</h5>
          <InstanceConfiguration />
        </div>
        <Stack direction={'row'} spacing={5} >
          <Stack spacing={3} width={'100%'}>

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
          <Stack spacing={2} width={'100%'} height={'100%'}  >
            <h5 style={{ color: "#fff", cursor: "default" }}>Listeners</h5>
            <ListenerComponent />

          </Stack>

        </Stack>


        <Stack sx={{
          height: "100%",
          width: "100%",
          minHeight: "100px",
          "&:hover": {
            color: "#7ff685"
          }
        }}>
          <Button
            onClick={() => { HandleSaveCore() }}
            sx={{
              marginTop: "auto",
              marginLeft: "auto",
              height: "100px",
              maxHeight: "100px",
              minHeight: "60px",
              maxWidth: "250px",
              border: "1px solid #7ff685",
              color: '#fff',
              bgcolor: "#000",
              ":hover": {
                color: '#7ff685'
              }
            }}
            style={{ width: '100%', height: '15%', }}>
            save
            <CloudSyncIcon />
          </Button>
        </Stack>
      </Stack>

      <div style={{ marginLeft: "auto", cursor: "default", width: "20%",padding: "10px" }}>
      <h5 style={{ color: "#fff", cursor: "default" }}>Users</h5>
        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex-end',
          width: "100%",
          height: "35%",
          padding: "10px",
          flexDirection: 'column',
          backgroundColor: "#111",

        }}>



        </div>


      </div>

      <DynamicAlert open={open} msg={message} type={alertType} closeParent={(e)=>{SetOpen(false)}}/>

    </Stack>
  );

}

export default ConfigGeneralComp;