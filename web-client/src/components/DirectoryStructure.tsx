import { Button, Checkbox, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as React from 'react';
import { Core, Root, File, getRootDirectory,deleteFiles,downloadFiles } from '../api/apiclient';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useEffect } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArticleIcon from '@mui/icons-material/Article';
import { ListItem, ListItemText } from '@material-ui/core';
import DownloadIcon from '@mui/icons-material/Download';
import { Download } from '@mui/icons-material';
import { useAppSelector } from '../store/store';
interface DirectoryStructureProp {
  onFileSelected: (file: File) => void;
}


const DirectoryStructureComponent: React.FC<DirectoryStructureProp> = ({  onFileSelected }) => {

  const [file, setFile] = React.useState(null);
  const [root, SetRoot] = React.useState<File[]>();
  const [selectedFile, setSelectedFile] = React.useState(-1);
  const [promptOpen, setPrompt] = React.useState(false);
  const [isDeleting, SetIsDeleting] = React.useState(false);
  const [SelectedFiles, SetSelectedFiles] = React.useState<File[]>([]);

  //console.log(core?._rootdir?._files)

  const CoreC = useAppSelector(state => state.core.coreObject) 
  const config = useAppSelector(state => state.core.configObject) 


  const OnSetFile = (file: File) => {
    onFileSelected(file)
  }

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    

  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://${CoreC._url}/${CoreC?._core_id}/upload`, {
        method: 'POST',
        headers: {
          'authtok': CoreC !== undefined ? CoreC._sessiontoken : "",
        },
        body: formData,
      });

      if (response.ok) {
        console.error('Success uploading file:', response.statusText);
        refreshDirectory()
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error.message);
    }
  };

  async function refreshDirectory() {
    const r: Root = await getRootDirectory(
      CoreC._url,
      CoreC?._core_id !== undefined ? CoreC?._core_id : '',
      CoreC?._sessiontoken !== undefined ? CoreC?._sessiontoken : '',
      config?._title !== undefined ? config?._title : '',
    )
    SetRoot(r._files);
  }

  React.useEffect(() => {
    // This code will run once when the component mounts  
    refreshDirectory()
  }, [SelectedFiles]); // The empty dependency array ensures that this effect runs only once


  const handleCheckboxChange = (event: any, f: File) => {
    SelectedFiles.length === 0
      ? SetSelectedFiles([f])
      : SetSelectedFiles((prevSelectedFiles) => {
        if (event.target.checked) {
          // Add index to the list if checked
          return [...prevSelectedFiles, f];
        } else {
          // Remove index from the list if unchecked
          return prevSelectedFiles.filter((item) => item._name !== f._name);
        }
      });

  };


  async function HandleDelete(files: File[]) {
    if (files.length > 0) {
      const list: string[] = files.map((item: File) => item._name);
      deleteFiles(CoreC._url, list, CoreC);
      const newFileList: File[] = SelectedFiles.filter((item: File) => !list.includes(item._name))
      SetSelectedFiles(newFileList);      


    }
  }

  async function DownloadSelectedFile(files: File[]) {
    
    if (files.length > 0) {
      const list: string[] = files.map((item: File) => item._name);
      const response = await downloadFiles(CoreC._url, list, CoreC);
      const blob = response instanceof Response ? await response.blob() : undefined;
      if (blob !== undefined) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${CoreC?._core_id}_store.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }else{
      alert('u haz No files selected')
    }
  }


  return (
    <div style={{ height: "70%",border:"1px solid #333" ,borderRadius:"5px",overflow:"auto"}}>

      <div style={{ width:"100%", padding:"1%", flexDirection: 'row', justifyContent: 'Left', display: 'flex', backgroundColor: '#111' }}>
        <h3 style={{ color: '#fff' }}>Files</h3>
       
    
          <DownloadIcon  sx={{
            fontSize: '40px',
            marginLeft:"auto",
            cursor:"pointer",
            ":Hover,selected": { color: "#555" },
            color: '#fff',
          }}
          onClick={() => {DownloadSelectedFile(SelectedFiles)}}
          />

      </div>
    
      <TableContainer component={Paper} sx={{ height: "100%", backgroundColor: "#000"}} >
        <Table size="small" sx={{
       
          borderStyle: 'dotted',
          borderWidth: '1px',
          borderColor: '#111',

          minWidth: 650, backgroundColor: "#111",
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
              opacity: "0.9",
            },
         
          },
          "& .MuiTableRow-root.Mui-selected": {
            backgroundColor: "#555",
            opacity: '1'
          }
        }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ ':Hover': { backgroundColor: "#000" }, cursor: 'pointer' }}>
              <TableCell align="left" sx={{ width: "10px" }}></TableCell>
              <TableCell align="left">File Name</TableCell>
              <TableCell align="left">Extension</TableCell>
              <TableCell align="left">size</TableCell>

            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
              <TableCell align="left" sx={{ width: "10px" }}></TableCell>
              <TableCell onClick={() => {setPrompt(true); SetIsDeleting(false);}} align="left" sx={{ width: "1%", backgroundColor: "#000", color: "#fff" }}><AddIcon sx={{ ":Hover": { color: "#21fd0a" } }} /></TableCell>
              <TableCell onClick={() => {setPrompt(true);SetIsDeleting(true);}} align="left" sx={{ width: "1%", backgroundColor: "#000", color: "#fff" }}><RemoveIcon sx={{ ":Hover": { color: "#21fd0a" } }} /></TableCell>
              <TableCell align="left" sx={{ width: "10px", backgroundColor: "#000", }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {(root !== undefined ? root : []).map((f: File, index: number) => (

              <TableRow
                key={index}
                selected={index === selectedFile}
                onClick={() => { setSelectedFile(index); OnSetFile(f); }}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', width: "100%", height:"10px",margin:"0" }}
              >
                <TableCell
                  align="left" sx={{ width: "1%" }}>
                  <FormControlLabel
                    label=""
                    sx={{
                      color: "#fff",
                      "& .MuiCheckbox-root .MuiSvgIcon-root": { color: "#fff" },
                      "& .MuiCheckbox-root": { color: "#fff" },
                      height:"10px"
                    }}
                    control={<Checkbox onChange={(e) => { handleCheckboxChange(e, f) }} />}
                  /></TableCell>
                <TableCell align="left" sx={{ width: "200px",margin:"0",height:"10px", }}>{f._name}</TableCell>
                <TableCell align="left" sx={{ width: "200px",margin:"0",height:"10px" }}>{f._extension}</TableCell>
                <TableCell align="left"  sx={{ width: "250px",margin:"0",height:"10px" }}>{f._size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>

      <Dialog
        onBackdropClick={() => setPrompt(false)}
        sx={{
          color: "#fff", padding: 0, width: "100%",
          "& .MuiPaper-root": { width: "80%", height: "40%", borderRadius: 1, bgcolor: "#111613", color: "fff", borderWidth: 1, borderStyle: "solid", borderColor: "#fff" }
        }}
        open={promptOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        {
          !isDeleting
            ?
            <DialogContent sx={{ color: "#fff", width: "100%", height: "100%", padding: '3%' }} >
              <div style={{ width: '100%', height: '80%', borderStyle: 'dotted', borderColor: '#fff', borderWidth: '2px', padding: "3%", justifyContent: 'center', display: 'flex', verticalAlign: 'center' }}>
                {
                  file === null ? <FileUploadIcon sx={{ fontSize: '250px', color: "#555" }} /> :
                    <FileUploadIcon sx={{ fontSize: '250px', color: "#7ff685" }} />
                }
              </div>
              <div style={{ width: "100%", flexDirection: 'row', display: 'flex', justifyContent: 'center', padding: "3%" }}>

                <input type="file" onChange={handleFileChange}
                  style={{ color: "#fff", width: "50%", }} />
                <Button onClick={async () => { handleUpload(); setPrompt(false); }}
                  sx={{ backgroundColor: "#405742", color: "#fff", width: "50%", boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', }}> Upload </Button>
              </div>
            </DialogContent>
            :
            <DialogContent sx={{ justifyContent:"center", color: "#fff", width: "100%", height: "50%", padding: '5%' }} >
             {
                  SelectedFiles.map((item:File,index:number) => (
                          <ListItemText style={{padding:"1%"}}> - {item._name}</ListItemText>
                  ))


              }

             <Button onClick={async () => {HandleDelete(SelectedFiles); setPrompt(false)  }}
                sx={{ backgroundColor: "#405742", color: "#fff", width: "100%", boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', }}> Confirm Deletion </Button>
             
            </DialogContent>
        }
      </Dialog>


    </div>
  );

}

export default DirectoryStructureComponent;