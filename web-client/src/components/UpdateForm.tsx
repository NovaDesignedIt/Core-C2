import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { createTheme } from '@mui/material/styles';
import { Select, ThemeProvider, selectClasses } from '@mui/joy';
import { ListItem } from '@mui/material';

declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}


export default function UpdateForm(){
    const themebutton = {
        bgcolor: '#00BF3F',
        color: '#fff',
        psadding: 1,
        width: '100%',
        ":hover": {
          bgcolor: "#00F24F",
        }
      }
    
    
      const theme = createTheme({
        palette: {
          primary: {
            main: '#fff',
          },
        },
      });

return ( <> 
    <Stack
    component="form"
    direction="row"
    width={'100%'}

    padding={0}
    borderRadius={0}
    autoComplete="off">
      
      <Stack
        component="form"
        direction="column"
        width={'100%'}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
          backgroundColor: "#628565"
        }}
        padding={1}
        borderRadius={0}
        autoComplete="off"
      >
        <div >
          <label style={{ padding: 10, color: "#fff" }}>Update target listener</label>
        </div>
        <Stack
          component="form"
          direction="row"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '100%' },
          }}
          paddingLeft={0}
          borderRadius={2}
          autoComplete="off"
        >

          <TextField
            placeholder='name'
            required
            id="name filled-required"
            label="name"
            defaultValue=""
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiFormLabel-root": { color: "#fff" },
              "& .root": { color: "#fff" },
              "& .MuiInputLabel": { color: "#fff" },
              "& .MuiInputLabel-root": { ":Hover": { color: 'white' }, ":focused": { color: 'white' }, color: 'white' },
              "& .MuiInput-root": { ":focused": { color: 'white' }, ":Hover": { color: 'white' }, borderBottomColor: 'white' },
              input: { color: 'white' },
              inputProps: {
                style: { fontFamily: 'nunito', color: 'white' },
              },
              width: "100%", backgroundColor: "#405742", accentColor: "#fff"
            }
            }
          />

          <TextField
            placeholder='Interval'
            required
            id="Interval filled-required"
            label="Interval"
            defaultValue=""
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiFormLabel-root": { color: "#fff" },
              "& .root": { color: "#fff" },
              "& .MuiInputLabel": { color: "#fff" },
              "& .MuiInputLabel-root": { ":Hover": { color: 'white' }, ":focused": { color: 'white' }, color: 'white' },
              "& .MuiInput-root": { ":focused": { color: 'white' }, ":Hover": { color: 'white' }, borderBottomColor: 'white' },
              input: { color: 'white' },
              inputProps: {
                style: { fontFamily: 'nunito', color: 'white' },
              },
              width: "100%", backgroundColor: "#405742", accentColor: "#fff"
            }
            }
          />

<TextField
            placeholder='Interval'
            required
            id="Interval filled-required"
            label="Interval"
            defaultValue=""
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiFormLabel-root": { color: "#fff" },
              "& .root": { color: "#fff" },
              "& .MuiInputLabel": { color: "#fff" },
              "& .MuiInputLabel-root": { ":Hover": { color: 'white' }, ":focused": { color: 'white' }, color: 'white' },
              "& .MuiInput-root": { ":focused": { color: 'white' }, ":Hover": { color: 'white' }, borderBottomColor: 'white' },
              input: { color: 'white' },
              inputProps: {
                style: { fontFamily: 'nunito', color: 'white' },
              },
              width: "100%", backgroundColor: "#405742", accentColor: "#fff"
            }
            }
          />

<TextField
            placeholder='Interval'
            required
            id="Interval filled-required"
            label="Interval"
            defaultValue=""
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiFormLabel-root": { color: "#fff" },
              "& .root": { color: "#fff" },
              "& .MuiInputLabel": { color: "#fff" },
              "& .MuiInputLabel-root": { ":Hover": { color: 'white' }, ":focused": { color: 'white' }, color: 'white' },
              "& .MuiInput-root": { ":focused": { color: 'white' }, ":Hover": { color: 'white' }, borderBottomColor: 'white' },
              input: { color: 'white' },
              inputProps: {
                style: { fontFamily: 'nunito', color: 'white' },
              },
              width: "100%", backgroundColor: "#405742", accentColor: "#fff"
            }
            }
          />

<TextField
            placeholder='Interval'
            required
            id="Interval filled-required"
            label="Interval"
            defaultValue=""
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiFormLabel-root": { color: "#fff" },
              "& .root": { color: "#fff" },
              "& .MuiInputLabel": { color: "#fff" },
              "& .MuiInputLabel-root": { ":Hover": { color: 'white' }, ":focused": { color: 'white' }, color: 'white' },
              "& .MuiInput-root": { ":focused": { color: 'white' }, ":Hover": { color: 'white' }, borderBottomColor: 'white' },
              input: { color: 'white' },
              inputProps: {
                style: { fontFamily: 'nunito', color: 'white' },
              },
              width: "100%", backgroundColor: "#405742", accentColor: "#fff"
            }
            }
          />
        </Stack>
        <Stack direction="row" spacing={3} style={{ padding: 10, width: '100%' }}>
          <Button 
          sx={themebutton} 
          style={{ width: '100%' }} >
           Update
          </Button>
          <Button 
          color="warning"
          variant="contained"
          style={{ width: '50%' }} >
            Build Payload
          </Button>
        </Stack>

      </Stack>
            </Stack>
    </>);

}