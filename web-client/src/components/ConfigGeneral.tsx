import { Alert, Box, Button, Checkbox, FormControlLabel, Stack, Switch, TextField, styled } from '@mui/material';
import React from 'react'
import { Core } from '../api/apiclient';
import ArchiveIcon from '@mui/icons-material/Archive';
import GitHubIcon from '@mui/icons-material/GitHub';

interface ConfigGeneralProp {
    core?: Core
}

const ConfigGeneralComp:React.FC<ConfigGeneralProp> = ({ core }) => {

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
        "&:Hover,focus":{
          backgroundColor:"#555"
        },
        // OUTLINE
        "& .MuiOutlinedInput-root": {
          ":Hover,focus,selected,fieldset, &:not(:focus)":{
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
          style: { fontFamily: 'nunito', },
        },
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
      }
    
      const children = (
        <Box sx={{ display: 'flex', flexDirection: 'row', ml: 3 }}>
          <FormControlLabel
            label="Insert"
            sx={{
              color: "#fff",
              "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
              "& .MuiCheckbox-root": { color: "#fff" }
            }}
            control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
          />

          <FormControlLabel
            label="Update"
            sx={{
              color: "#fff",
              "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
              "& .MuiCheckbox-root": { color: "#fff" }
            }}
            control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
          />
          <FormControlLabel
            label="Delete"
            sx={{
              color: "#fff",
              "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
              "& .MuiCheckbox-root": { color: "#fff" }
            }}
            control={<Checkbox checked={checked[2]} onChange={handleChange3} />}
          />
        </Box>
      );
    
    
    
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
    
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", height: "100%", backgroundColor: "#000" }}>
      
    
        {/* *********************************** Corepanel **************************************** */}

        <Stack spacing={'3%'} sx={{ width: "100%", height: "100%", backgroundColor: "#444", padding: "2%", overflow:'scroll' }}>
        <h6 style={{ color: "#fff" }}> {core?._config?._title} 👤</h6>
          {/* <h6 style={{ color: "#fff" }}> core id: {core?._core_id}</h6> */}
          <TextField
            variant={'outlined'}
            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff", borderColor: "#fff" } }}
            label={'core ID :'}
            value={core?._core_id}
            size='small'
            sx={{ ...themeText}}
          ></TextField>

          <TextField
            variant={'outlined'}
            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff", borderColor: "#fff" } }}
            label={'id'}
            size='small'
            value={core?._config?._id}
            sx={themeText}></TextField>
          <TextField

            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff" } }}
            label={'ip address '}
            size='small'
            value={core?._config?._ip_address}
            sx={themeText}></TextField>
          <TextField

            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff" } }}
            label={'hostname'}
            size='small'
            value={core?._config?._host_name}
            sx={themeText}></TextField>
          <TextField

            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff" } }}
            label={'session length'}
            size='small'
            value={core?._config?._session_len}
            sx={themeText}></TextField>

          <Alert sx={{boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.8)'}}
          severity="info">Set server settings using the utility on the server where your Instance hosted.  <a href='https://github.com/NovaDesignedIt/' target="_blank" rel="noopener noreferrer">get it over at here <GitHubIcon sx={{fontSize:17}} /></a></Alert>
        <h6 style={{ color: "#fff" }}>Listener Configuration 👂</h6>
          <div style={{boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', display: 'flex', flexDirection: 'column', backgroundColor: "#333", padding: '5px' }}>
            <h6 style={{ color: "#fff" }}>Listener</h6>
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
              <FormControlLabel
                label="Create Auto target"
                sx={{
                  color: "#fff",
                  "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
                  "& .MuiCheckbox-root": { color: "#fff" }
                }}
                control={<Checkbox sx={{ "& .MuiCheckbox-root": { color: "#fff" }}} checked={checked[0]} onChange={handleChange2} />}
              />
              <FormControlLabel
                label="Append to Dump"
                sx={{
                  color: "#fff",
                  "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
                  "& .MuiCheckbox-root": { color: "#fff" }
                }}
                control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
              />
              <FormControlLabel
                label="Listen & kill"
                sx={{
                  color: "#fff",
                  "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
                  "& .MuiCheckbox-root": { color: "#fff" }
                }}
                control={<Checkbox checked={checked[2]} onChange={handleChange3} />}
              />
            </Box>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <h6 style={{ color: "#fff" }}>Inactivity Timeout?</h6>
            <SwitchTheme defaultChecked />
          </div>
          <TextField
            fullWidth={true}
            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff" } }}
            label={'session length'}
            size='small'
            value={core?._config?._session_len}
            sx={themeText}></TextField>
      
       </Stack>


      




        {/* ************************************ logs *************************************** */}
        <Stack spacing={'4%'} sx={{ width: "100%", height: "100%", backgroundColor: "#444", padding: "2%", overflow:'scroll' }}>



          <h6 style={{ color: "#fff" }}>log settings 📒</h6>

          <TextField
            fullWidth={true}
            InputLabelProps={{ sx: { color: "#fff" } }}
            inputProps={{ sx: { color: "#fff" } }}
            label={'purge logs after x days.'}
            type={'number'}
            value={100}
            size='small'
            sx={themeText}></TextField>

          <Stack spacing={'3%'} direction={'column'} sx={{ display: 'flex' }}>
            <Stack style={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)',backgroundColor: "#333", padding: '5px', height: "100%" }}>
              <h6 style={{ color: "#fff" }}>Targets</h6>
              <p style={{ color: "#fff",fontSize:12,opacity:0.6 }}>Log inserts, Updates, Deletes, On Targets, Instances and Uesrs</p>
              {children}
              {/* Add the Dump Icon */}

              <Stack spacing={'1%'} direction={'row'} style={{ backgroundColor: "#333", height: "100%", padding: "4px" }}>


                <Box sx={{ borderTopColor: "#fff", borderTopWidth: "1px", borderTopStyle: "solid", width: "10%" }}
                  onClick={() => setDumpmgr(!dumpmgr)} >
                  <ArchiveIcon fontSize='medium' sx={{ color: "#fff" }} />
                </Box>


                {
                  dumpmgr &&

                  <>
                    <Button
                      sx={{
                        bgcolor: '#FF3635',
                        color: '#fff',
                        ":hover": {
                          bgcolor: "#ff7776",
                        }
                      }}
                      style={{ width: '100%', height: '100%', }} >
                      Clear dumps
                    </Button>

                    <Button
                      sx={{
                        bgcolor: '#FFCA09',
                        color: '#fff',
                        ":hover": {
                          bgcolor: "#FFDA51",
                        }
                      }}
                      style={{ width: '100%', height: '100%', }} >
                      Download Dumps
                    </Button>
                  </>

                }
              </Stack>

            </Stack>

            <div style={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', backgroundColor: "#333", padding: '5px' }}>
              <h6 style={{ color: "#fff" }}>Instances</h6>
              {children}
            </div>

            <div style={{boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', backgroundColor: "#333", padding: '5px' }}>
              <h6 style={{ color: "#fff" }}>Users</h6>
              {children}
            </div>

          </Stack>



          <div style={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)',backgroundColor: "#333", padding: '3%' }}>
            <Alert sx={{ paddingBottom: "0%" }} severity="error">Deleting Logs will not delete your dumps or Target info.</Alert>
            <div style={{ padding: "1px",paddingTop:"2%" }}>
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
            onClick={()=>alert('Logs cleared')}
              sx={{
                bgcolor: '#FF3635',
                color: '#fff',
                ":hover": {
                  bgcolor: "#ff7776",
                }
              }}
              style={{ width: '50%', height: '20%', }} >
              Clear Logs
            </Button>
          </div>

        </Stack>


        {/* ****************************** save  ********************************************* */}


   


    </div>
  );

}

export default ConfigGeneralComp;