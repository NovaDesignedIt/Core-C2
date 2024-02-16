import * as React from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Core, File, Root, CoreObjects } from '../api/apiclient';
import { useAppSelector } from '../store/store';


export interface FileViewerProp {
  file?: File
}
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.svg', '.ico'];


const themeTextBlack = {
  height: "100%",
  color: "#fff",
  overflow: 'auto',
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




const Files: React.FC<FileViewerProp> = ({  file }) => {
  const [selectFile, SetSelectedFile] = React.useState('');
  const [fileContent, setFileContent] = React.useState('');
  const [ImageUrl, setImageURL] = React.useState('');


  const CoreC = useAppSelector(state => state.core.coreObject) 




  const fetchFileContent = async () => {
    try {
      if (file?._extension !== undefined && !imageExtensions.includes(file._extension)) {
        const response = await fetch(`http://${CoreC._url}/upl/${CoreC?._core_id}_files/${file !== undefined ? file._name : ''}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authtok': CoreC?._sessiontoken !== undefined ? CoreC?._sessiontoken : '',
      }});
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        setFileContent(content);
      }else{  
              /*
              python back-end-point 
              @app.route('/<_core_id>/upl/ph/<filename>')
              def get_image(filename):      
                  Utility.Log.insert_log("",
                  ..... */
            await fetch(`http://${CoreC._url}/${CoreC?._core_id}/upl/ph/${file !== undefined ? file._name : ''}`,{
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'authtok': CoreC?._sessiontoken !== undefined ? CoreC?._sessiontoken : '',
            }}).then(response => setImageURL(response.url) )
            .catch(error => console.error('Error fetching image URL:', error));
      }
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  React.useEffect(() => {
    
    fetchFileContent()

    
  }, [file,fileContent,fetchFileContent,setFileContent]);


  return (
    <Stack sx={{ height: "90%", width: "100%", maxWidth:"70%", backgroundColor: "#000", border:"1px solid #333",borderRadius:"5px" }}>
      <Stack
        sx={{ padding: '1%', flexDirection: 'row', minHeight: "60px",maxHeight: "60px", height: "100%", width: "100%", boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.8)', backgroundColor: "#111" }}>
        <label style={{ fontSize: 20, color: "#fff" }}>{file !== undefined ? file?._name : ''}</label>
      </Stack>

      <Stack
        sx={{ display: "flex", flexDirection: "row",justifyContent:"center", height: "100%", width: "100%",  overflow: "auto" }}>

        {
        imageExtensions.includes(file?._extension !== undefined ? file?._extension : '') ?
          <img src={ImageUrl} />
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
            inputProps={{ sx: { color: "#DDD", fontFamily: 'Ubuntu Mono, monospace' } }}
            sx={{...themeTextBlack}}
          >
          </TextField>
        }
      </Stack>
    </Stack>

  );
}

export default Files