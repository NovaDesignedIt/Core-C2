import { Alert, Box, Button, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Switch, TextField, Typography, styled } from '@mui/material';
import React from 'react'
import { Core } from '../api/apiclient';
import InstanceContainer from "./InstancesConfiguration";
import ListenerComponent from "./Listeners";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditNoteIcon from '@mui/icons-material/EditNote';
interface ConfigGeneralProp {
  core?: Core
}

const ConfigGeneralComp: React.FC<ConfigGeneralProp> = ({ core }) => {

  const [checked, setChecked] = React.useState([true, false]);
  const [dumpmgr, setDumpmgr] = React.useState(false);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

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
        backgroundColor: '#fff'
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#fff'
    },
  }));

  return (

    <Stack sx={{ borderStyle: 'none', padding: "1px", display: 'flex', backgroundColor: "#000", flexDirection: 'row', width: "100%", height: "100%" ,overflow:"scroll" }}>
      <Stack spacing={'1%'}  sx={{ width: "30%", height: "100%", padding: "10px", overflow: 'scroll' }}  >
        <h5 style={{ color: "#fff",cursor:"default" }}>Listener Configuration</h5>
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
            }} checked={checked[0]} onChange={handleChange1} />
          </div>
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            create on ping
            <Checkbox sx={{
              color: "#fff",
              '&.Mui-checked': {
                color: '#fff',
              }
            }} checked={checked[1]} onChange={handleChange2} />
          </div>
          <div style={{ display: "flex", justifyContent: 'space-between' }}>
            use http
            <Checkbox sx={{
              color: "#fff",
              '&.Mui-checked': {
                color: '#fff',
              }
            }} checked={checked[3]} onChange={handleChange3} />
          </div>
        </div>
     
        <div>
          <h5 style={{cursor:"default"}}>Targets</h5>
          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex-end',
            width: "100%",
            height:"87%",
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
              }} checked={checked[0]} onChange={handleChange1} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              delete
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={checked[1]} onChange={handleChange2} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              Create
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={checked[3]} onChange={handleChange3} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              Commands
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={checked[3]} onChange={handleChange3} />
            </div>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              last ping
              <Checkbox sx={{
                color: "#fff",
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} checked={checked[3]} onChange={handleChange3} />
            </div>
          </div>
        </div>

        <h5 style={{ color: "#fff",cursor:"default" }}>Clear data</h5>
        {/* CLEARING LOGS */}
        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex-end',
          width: "100%",
          height: "40%",
          padding: "8px",  

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
              label={'days to retain logs '}
              size='small'
              value={core?._config?._session_len}
              sx={{ ...themeText, width: "40%", borderRadius: "5px" }} ></TextField>

          <div style={{padding:"10px"}} >
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
            onClick={() => alert('Logs cleared')}
            sx={{
              border:"1px solid #FF3635",
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
      <Stack sx={{ flexDirection: "column", width: "70%", height: "100%", padding: "20px", overflow: 'scroll' }}>
        <h5 style={{ color: "#fff",cursor:"default" }}>Instances</h5>
        <InstanceContainer core={core} />
        <Stack direction={'row'} spacing={5} >
          <Stack spacing={3} width={'100%'}>
           
          <h5 style={{ color: "#fff",cursor:"default" }}>Session</h5>

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
              <h6 style={{ color: "#fff",cursor:"default" }}>Inactivity Timeout?</h6>
              <SwitchTheme defaultChecked />
            </div>
            <p style={{ opacity: "0.5" }}>
           set Session length in minutes
          </p>
            <TextField
              fullWidth={true}
              InputLabelProps={{ sx: { color: "#fff" } }}
              inputProps={{ sx: { color: "#fff" } }}
              label={'session length'}
              size='small'
              value={core?._config?._session_len}
              sx={{ ...themeText, width: "100%", borderRadius: "5px" }} ></TextField>
         
         
            </div>
          </Stack>
          <Stack spacing={2} width={'100%'}  >
          <h5 style={{ color: "#fff",cursor:"default"}}>Listeners</h5>
            <div style={{
              border: "1px solid #222",
              borderRadius: "4px",
              display: 'flex',
              width: "100%",
              height:"50%",
              gap:"10px",
              padding: "1%",
              flexDirection: 'column',
              backgroundColor: "#111",
            }}>
              <div style={{ flexDirection: "row", display: "flex", marginRight: "auto", gap: "20px", cursor: "pointer" }}>
                <AddIcon />
                <EditNoteIcon />
                <RemoveIcon />
              </div>
              <div style={{padding:"1px" ,overflow:"hidden"}}>
              <ListenerComponent />
              </div>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

}

export default ConfigGeneralComp;