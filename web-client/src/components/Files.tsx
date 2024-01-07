import * as React from 'react';
import { Button, Stack } from '@mui/material';
import {Core,File,Root,CoreObjects} from '../api/apiclient';
import DownloadIcon from '@mui/icons-material/Download';

export interface FileViewerProp {
  core?:Core
  file?:File
  url:string
}


const Files:React.FC<FileViewerProp> = ( {core,file,url} ) => {
  return (
    
    <Stack sx={{ height: "100%", width: "100%" }}>
      <Stack
        sx={{padding: "1%" ,flexDirection:'row', overflow: 'hidden', height: "10%", width: "100%", boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.8)',backgroundColor: "#202c22" }}>
        <Stack
          sx={{ overflow: 'hidden', height: "100%", width: "100%", backgroundColor: "#202c22"  }}>
          <label style={{ fontSize: 18, color: "#fff" }}>fileName:  {file !== undefined ? file?._name + '.' + file?._extension : ''}</label>
          <label style={{ fontSize: 10, color: "#fff" }}>Extension: {file !== undefined ? '.' + file?._extension : ''}</label>
          <label style={{ fontSize: 15, color: "#fff" }}>Full Path: {file !== undefined ? file?._path : ''}</label>
        </Stack>
        
        <Button 
        onClick={()=> alert('downloading')}
        sx={{
          ":Hover,selected":{backgroundColor:"Transparent"},
          height: '100%',
        }}>
          <DownloadIcon sx={{
            fontSize: '50px',
            color: '#fff'
          }}
          />
        </Button>
      </Stack>
    
    <Stack 
    sx={{height:"90%" ,width:"100%"}}>

    </Stack>
  </Stack>

  );
  }

  export default Files