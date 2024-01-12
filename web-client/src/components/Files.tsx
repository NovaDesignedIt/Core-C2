import * as React from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Core, File, Root, CoreObjects } from '../api/apiclient';


export interface FileViewerProp {
  core?: Core
  file?: File
  url: string
}
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.svg', '.ico'];


const themeTextBlack = {
  height: "100%",
  color: "#fff",
  overflow: 'scroll',
  backgroundColor: "#000",
  "&:Hover,focus": {
    backgroundColor: "#000"
  },
  // OUTLINE
  "& .MuiOutlinedInput-root": {
    ":Hover,focus,selected,fieldset, &:not(:focus)": {
      "& > fieldset": { borderColor: "transparent", borderRadius: 0, },
    },
    "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
    borderColor: "transparent", borderRadius: 0,
  }, "&.MuiTextField-root": { width: "100%" },
  "& .root": { color: "#fff" },
  "& .MuiInputLabel-root": { display: 'none' },
  "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
  input: { color: '#fff' },
}




const Files: React.FC<FileViewerProp> = ({ core, file, url }) => {
  const [selectFile, SetSelectedFile] = React.useState('');
  const [fileContent, setFileContent] = React.useState('');

  const fetchFileContent = async () => {
    try {
      if (file?._extension !== undefined && !imageExtensions.includes(file._extension)) {
        const response = await fetch(`http://${url}/upl/${core?._core_id}_files/${file !== undefined ? file._name : ''}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authtok': core?._sessiontoken !== undefined ? core?._sessiontoken : '',
      }});

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }

        const content = await response.text();
        console.log(content);
        setFileContent(content);
      }
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  React.useEffect(() => {
    
    fetchFileContent()

    
  }, [file,fileContent,fetchFileContent,setFileContent]);


  return (
    <Stack sx={{ height: "100%", width: "100%", backgroundColor: "#000" }}>
      <Stack
        sx={{ padding: '1%', flexDirection: 'row', minWidth: "100%",minHeight: "60px",maxHeight: "60px", height: "15%", width: "100%", boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.8)', backgroundColor: "#202c22" }}>
        <label style={{ fontSize: 20, color: "#fff" }}>{file !== undefined ? file?._name : ''}</label>
      </Stack>

      <Stack
        sx={{ display: "flex", flexDirection: "row", height: "100%", width: "100%", justifyContent: "center", overflow: "scroll" }}>

        {
        imageExtensions.includes(file?._extension !== undefined ? file?._extension : '') ?
          <img src={`http://${url}/upl/${core?._core_id}_files/${file !== undefined ? file._name : ''}`} />
          :
          <TextField
            value={
              fileContent
            }
            required
            fullWidth={true}
            maxRows={20}
            multiline={true}
            size='small'

            spellCheck={false}  // Disable spell checking
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            placeholder=""
            InputLabelProps={{ sx: { color: "#7ff685", fontSize: '5px', height: '100%' } }}
            inputProps={{ sx: { color: "#7ff685", fontFamily: 'Ubuntu Mono, monospace' } }}
            sx={themeTextBlack}
          >
          </TextField>
        }
      </Stack>
    </Stack>

  );
}

export default Files