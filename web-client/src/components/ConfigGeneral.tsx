import { Alert, Box, Button, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Snackbar, Stack, Switch, TextField, Typography, styled } from '@mui/material';
import React, { SetStateAction } from 'react'
import { Core, Listeners, addlistener } from '../api/apiclient';
import InstanceConfiguration from "./InstancesConfiguration";
import ListenerComponent from "./Listeners";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addlisteners } from '../store/features/CoreSlice';



const ConfigGeneralComp = () => {

  const dispatch: any = useAppDispatch();

  const configurationObject = useAppSelector(state => state.core.configObject)
  const corid = useAppSelector(state => state.core.configObject._core_id)
  const core = useAppSelector(state => state.core.coreObject)


  const sessionLength: number = configurationObject._session_len !== undefined ? configurationObject._session_len : 0
  const DaysRetLog: number = configurationObject?._log_ret_days !== undefined ? configurationObject?._log_ret_days : 0

 

  const [daysretLog, setDaysretLog] = React.useState<number>(sessionLength);
  const [sessionlen, setsessionlen] = React.useState<number>(DaysRetLog);
  const [message, setmessage] = React.useState('');
  const [chckdmp, setChkdmp] = React.useState(false);
  const [open, SetOpen] = React.useState(false);
  const [chkping, setChkping] = React.useState(false);
  const [chkhttp, setChkhttp] = React.useState(false);
  const [chkcreate, setCheckcreate] = React.useState(false);
  const [chkdelete, setChkdelete] = React.useState(false);
  const [chkcmd, setChkcmd] = React.useState(false);
  const [chklp, setChklp] = React.useState(false);
  const [chktimeout, setchktimeout] = React.useState(false);
  const [newlistener, SetNewListener] = React.useState(false);
  const [name, SetName] = React.useState('');
  const [ipaddress, SetIpAddress] = React.useState('');
  const [selectedListener, SetSelectedListener] = React.useState(-1);

  const HandleClearLogs = () => {
    //alert(corid);
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
const SelectedListener = (id :number) =>{
  SetSelectedListener(id)
}

  const HandleInsertListener = async () => {
    if (name !== '' && ipaddress !== '') {

      const l: Listeners = new Listeners(corid, name, ipaddress, '', 0)

      const result = await addlistener(core._url, core, l);
      if(result === 200){
      dispatch(addlisteners({listener:l}))
      SetNewListener(false);
      }else if(result === 401){
        SetOpen(true);
        setmessage('Logged out')
      }else if(result === 500){
        SetOpen(true);
        setmessage('Error')
      }
    }
  }

  const HandleDeleteListener = async () => {
    if (selectedListener  > 0) {
      alert(selectedListener);
    }else{
      alert('Select Listener first')
    }
  }



  const HandleListenerName = (event: { target: { value: SetStateAction<string>; }; }) => {
    SetName(event.target.value);
  }

  const HandleListenerIpAddress = (event: { target: { value: SetStateAction<string>; }; }) => {
    SetIpAddress(event.target.value);
  }

  const handleClose = () => {
    SetOpen(false)
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
          height: "35%",
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
      <Stack spacing={"2%"} sx={{ flexDirection: "column", width: "70%", height: "100%", padding: "15px", overflow: 'scroll' }}>
        <div style={{ maxHeight: "400px" }} >
          <h5 style={{ color: "#fff", cursor: "default" }}>Instances</h5>
          <InstanceConfiguration />
        </div>
        <Stack direction={'row'} spacing={5} >
          <Stack spacing={3} width={'50%'}>

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
          <Stack spacing={2} width={'100%'}  >
            <h5 style={{ color: "#fff", cursor: "default" }}>Listeners</h5>
            <div style={{
              border: "1px solid #222",
              borderRadius: "4px",
              display: 'flex',
              width: "90%",
              height: "100%",
              maxHeight:"80%",
              gap: "10px",
              padding: "1%",
              flexDirection: 'column',
              backgroundColor: "#111",
            }}>
              <div style={{ flexDirection: "row", display: "flex", marginRight: "auto", height: "10%", gap: "20px", cursor: "pointer" }}>
                <AddIcon
                  onClick={() => { newlistener ? SetNewListener(false) : SetNewListener(true) }}
                  sx={{
                    "&:hover": {
                      color: "#7ff685"
                    }
                  }} />
                <EditNoteIcon sx={{
                  "&:hover": {
                    color: "#7ff685"
                  }
                }} />
                <RemoveIcon 
                onClick= {() => {HandleDeleteListener()}}
                sx={{
                  "&:hover": {
                    color: "#7ff685"
                  }
                }} />
              </div>
              <div style={{ padding: "1px", overflow: "hidden", width: "100%", gap: "10px", height: "100%", flexDirection: "column", display: "flex" }}>

                {newlistener &&
                  //newlist
                  <div style={{ padding: "1px", overflow: "hidden", gap: "10px", width: "100%", height: "50%" ,maxHeight:"40px", flexDirection: "row", display: "flex" }}>
                    <TextField
                      InputLabelProps={{ sx: { color: "#fff" } }}
                      inputProps={{ sx: { color: "#fff" } }}
                      size='small'
                      placeholder={'name'}
                      onChange={(e) => { HandleListenerName(e) }}
                      sx={{ ...themeText, width: "20%", borderRadius: "5px" }} ></TextField>
                    <TextField

                      InputLabelProps={{ sx: { color: "#fff" } }}
                      inputProps={{ sx: { color: "#fff" } }}
                      size='small'
                      placeholder={'ipaddress'}
                      onChange={(e) => { HandleListenerIpAddress(e) }}
                      sx={{ ...themeText, width: "40%", borderRadius: "5px" }} ></TextField>
                    <Button
                      onClick={() => { HandleInsertListener() }}
                      sx={{

                        border: "1px solid #333",
                        color: '#fff',
                        ":hover": {
                          bgcolor: "#777",
                        }
                      }}
                      style={{ width: '5%', height: '100%', }} >
                      +
                    </Button>
                  </div>

                }
                <div style={{ padding: "1px", overflow: "hidden", gap: "10px", width: "100%", height: "100%", flexDirection: "row", display: "flex" }}>

                  <ListenerComponent HandleSelectedInstance={SelectedListener} />
                </div>
              </div>
            </div>
          </Stack>
        </Stack>
      </Stack>
      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert >
      </Snackbar>
    </Stack>
  );

}

export default ConfigGeneralComp;