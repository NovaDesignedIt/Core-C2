import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as React from 'react';
import { Core, Root, File } from '../api/apiclient';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import  { useEffect } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface DirectoryStructureProp {
  core?: Core;
  onFileSelected: (file:File) => void;
  url:string;
}


const DirectoryStructureComponent: React.FC<DirectoryStructureProp> = ({ core,onFileSelected,url }) => {

  const [root, SetRoot] = React.useState(new Root());
  const [selectedFile,setSelectedFile] = React.useState(-1);
  const [promptOpen,setPrompt] = React.useState(false);

  const OnSetFile = (file:File) => {
    onFileSelected(file);
  }

  function makeAjaxRequest() {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    // Configure it: GET-request for the URL /example-api
    xhr.open('GET', `http://${url}/dir`, true);
    // Set up a callback function to handle the response
    xhr.onreadystatechange = function () {
      // Check if the request is complete
      if (xhr.readyState === 4) {
        // Check if the request was successful (status code 200)
        if (xhr.status === 200) {
          // Parse and use the response data
          var responseData = JSON.parse(xhr.responseText);
          //console.log('Response Data:', responseData);

          const roodirectory: Root = new Root(
            responseData['_core_id'],
            responseData['_files'],
            responseData['_filecount']
          )

          SetRoot(roodirectory)

        } else {
          // Handle errors
          console.error('Request failed with status:', xhr.status);
        }
      }
    };
    // Send the request
    xhr.send();
  }

  useEffect(() => {
    // This code will run once when the component mounts
    makeAjaxRequest();
  }, []); // The empty dependency array ensures that this effect runs only once





  return (
    <div style={{height:"100%"}}>
      <div style={{ paddingTop: '2%',paddingLeft: '5%', flexDirection: 'row', justifyContent: 'Left', display: 'flex', backgroundColor: '#202c22' }}>
        <h6 style={{ color: '#fff' }}>Files</h6>
      </div>
     
      <TableContainer component={Paper} sx={{boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', height: "100%", borderRadius: 0, backgroundColor: "#202c22", }} >
                    <Table size="small" sx={{
                        borderStyle:'dotted',
                        borderWidth:'1px',
                        borderColor:'#111',

                        minWidth: 650, backgroundColor: "#202c22",
                        "& .MuiTableCell-root": {
                            color: "#fff",
                        },
                        "& .MuiTableHead-root": {
                            backgroundColor: "#000",
                            ":Hover,focus": {
                                backgroundColor: "#000",
                            },
                        },
                        "& .MuiTableRow-root": {
                            ":Hover,focus": {
                                backgroundColor: "#000",
                            },
                        },
                        "& .MuiTableRow-root.Mui-selected": {
                            backgroundColor: "#4D6A52",
                            opacity: '1'
                        }
                    }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ ':Hover': { backgroundColor: "#000" },cursor:'pointer' }}>
                                <TableCell align="left">File Name</TableCell>
                                <TableCell align="left">Extension</TableCell>
                                <TableCell align="left">size</TableCell>
                        
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 },cursor:'pointer' }}>
                                    <TableCell onClick={() =>  setPrompt(true)} align="left" sx={{width:"1%",backgroundColor:"#000",color:"#fff"}}><AddIcon sx={{":Hover":{ color:"#21fd0a"}}}/></TableCell>
                                    <TableCell onClick={() =>  setPrompt(true)}  align="left" sx={{width:"1%",backgroundColor:"#000",color:"#fff"}}><RemoveIcon sx={{":Hover":{ color:"#21fd0a"}}}/></TableCell>
                                    <TableCell align="left" sx={{width:"10px",backgroundColor:"#000",}}></TableCell>
                                </TableRow>
                        </TableHead>
                        <TableBody>
                        
                            {(root?._files !== undefined ? root?._files : []).map((file:File,index:number) => (

                                <TableRow
                                    key={index}
                                    selected={index === selectedFile}
                                    onClick={() => { setSelectedFile(index); OnSetFile(file); }}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 },cursor:'pointer',width:"100%" }}
                                >
                                    <TableCell align="left" sx={{width:"30px" }}>{file._name}</TableCell>
                                    <TableCell align="left" sx={{width:"10px"}}>.{file._extension}</TableCell>
                                    <TableCell align="left">{file._size}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                </TableContainer>

                <Dialog
        onBackdropClick={() => setPrompt(false)}
        sx={{
          color: "#fff", padding: 0, width: "100%",
          "& .MuiPaper-root": { width: "80%",height:"40%",borderRadius:1 ,bgcolor: "#111613", color: "fff", borderWidth: 1, borderStyle: "solid", borderColor: "#fff" }
        }

        } 
        open={promptOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ color: "#fff", width: "100%", height: "100%", padding: '3%' }} >

          <div style={{ width: '100%', height: '80%', borderStyle: 'dotted', borderColor: '#fff', borderWidth: '2px', padding:"3%",justifyContent:'center',display:'flex',verticalAlign:'center' }}><FileUploadIcon sx={{fontSize:'250px'}}/></div>
          <div style={{width:"100%", flexDirection:'row',display:'flex',justifyContent:'center',padding:"3%"}}>
          <Button
            sx={{ backgroundColor: "#405742", color: "#fff", width: "50%", boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', }}> Upload </Button>
</div>
        </DialogContent>
      </Dialog>


                </div>
  );

}

export default DirectoryStructureComponent;