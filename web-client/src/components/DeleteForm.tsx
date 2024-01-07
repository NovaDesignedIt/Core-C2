import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { createTheme } from '@mui/material/styles';
import { Select, ThemeProvider, selectClasses } from '@mui/joy';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, Snackbar } from '@mui/material';

declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

export default function DeleteForm({ selectedTargets, core, instance }) {
  const [SessionKeyText, setSessionKeyText] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [promptopen,setPrompt] = React.useState(false);
  const handleSubmit = async (id:string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/t/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Record with ID ${id} deleted successfully`);
     //   setOpen(true)
      } else {
        console.error(`Failed to delete record with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error during API call for ID ${id}:`, error);
    }
  };

const handleClose =  async  () => {
  setOpen(false);
}

  const handleDeleteAll = async () => {
//   alert(selectedTargets)

    setPrompt(false);
    var t = selectedTargets;
    setOpen(true)
    var ol = selectedTargets.toString().split(',').map((id: string) => id.trim())
    for (const id of ol) {
      await handleSubmit(id);
    }
  };


  const themebutton = {
    bgcolor: '#FF4533',
    color: '#fff',
    psadding: 1,
    width: '100%',
    ":hover": {
      bgcolor: "#FF968C",
    }
  }
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Optionally, you can show a message or perform other actions
  };

  const HandleChange = (event: any) => {
    setSessionKeyText(event.target.value)
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
    },
  });
  return (
    <>

      <Stack
        component="form"
        direction="column"
        width={'35%'}
        sx={{
          minWidth: '50%',
          minHeight: '50%',
          '& .MuiTextField-root': { m: 1, width: '100%' },
          backgroundColor: "#628565"
        }}
        padding={1}
        borderRadius={0}
        autoComplete="off"
      >
        <Stack direction="column" sx={{}}>
          {/* <label style={{ padding: 10, color: "#fff" }}>confirm using your session code</label>
          <label style={{ paddingLeft: "5%", paddingBottom: "1%", color: "#fff" }}>{core["_sessiontoken"]}</label> */}
        </Stack>
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
            placeholder='confirmation code'
            required
            value={SessionKeyText}
            onChange={HandleChange}
            onPaste={handlePaste}
            id="code filled-required"
            label="confirmation code"
            defaultValue=""
            variant="filled"
                size="small"
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
            onClick={() => setPrompt(true)}
            sx={themebutton}
            style={{ width: '100%' }} >
            Delete
          </Button>
        </Stack>
        <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
          <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: '100%' }}>
            Delete Successful
          </Alert>
        </Snackbar>
      </Stack>
 


    </>
  );
}
