import React, { useEffect, useState, Component, ErrorInfo, PureComponent, Children } from 'react';
import { DataGrid, GridCellParams, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Switch from '@mui/material/Switch';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import { Alert, AlertColor, Box, Checkbox, DialogContentText, Modal, Snackbar, Stack, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InsertForm from './InsertForm'
import EditNoteIcon from '@mui/icons-material/EditNote';
import ClearIcon from '@mui/icons-material/Clear';
import UpdateForm from './UpdateForm';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Core, deleterecordbyid, Instance, getallrecords, CoreC, Config, ExportDumpToFile } from '../api/apiclient';
import { Typography } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../store/store';
import { BuildStateManagement, SetInstanceTargets, SetSelectedTargets } from '../store/features/CoreSlice';
import { Socket, io } from 'socket.io-client';
import { DynamicAlert } from './AlertFeedbackComponent';
import { getStateLabel } from '../Utilities/Utilities';





const columns = [
  { field: '_id', headerName: 'ID', width: 70 },
  {
    field: '_st', headerName: 'State', width: 130,
  },
  { field: '_isid', headerName: 'Instance ID', width: 120, },
  { field: '_zzz', headerName: 'Interval', width: 180, },
  { field: '_n', headerName: 'Name', width: 180, },
  { field: '_dmp', headerName: 'dump', width: 180, },
  { field: '_in', headerName: 'in', width: 120, },
  { field: '_out', headerName: 'Results', width: 200, },
  { field: '_lp', headerName: 'Last Ping', width: 200, },
  { field: '_ip', headerName: 'proxy', width: 180, },
];


interface gridViewProp {
  GetAction: (index: number) => void;
}

const MuiDataGrid: React.FC<gridViewProp> = ({ GetAction }) => {
  const dispatch: any = useAppDispatch();

  // url={core !== undefined ? core?._url : ''}
  // objs={objs}
  // instance={Instance}
  // handleSelectedTargets={handleSelectedTargets}
  // core={core} selectedTargets={selectedTargets}
  const config = useAppSelector(state => state.core.configObject);
  const core = useAppSelector(state => state.core.coreObject);
  const Targets = useAppSelector(state => state.core.targetObjects);
  const SelectedTargets = useAppSelector(state => state.core.selectedTargets);
  const SelectedContent = useAppSelector(state => state.core.SelectedContent);
  const proxies = useAppSelector(state=> state.core.listenerObjects);
  const SelectedInstance = useAppSelector(state => state.core.SelectedInstances);




  const [promptopen, setPrompt] = React.useState(false);
  const [rows, setRows] = useState<any>([]);
  const [open2, setOpen2] = useState(false);
  const [open, setOpen] = useState(false);
  const [Refresh, setRefresh] = useState(true);
  const [showDmpColumn, setShowDmpColumn] = useState(false);
  const [crud, setCrud] = useState(0);
  const [rowSelected, setSelectedRows] = useState<number[]>();
  const [filteredCols, SetFilteredColumns] = useState<any>([{}]);
  const [on,setOn] = useState(true);
  const [formData, setFormData] = useState({
    _ip: '',
    _st: '',
    _dmp: '',
    _in: '',
    _out: '',
    _lp: '',
    _id: '',
    _isid: '',
    _zzz: '',
    _n: ''
  });
  //alert
  const [alertType, SetAlertType] = React.useState<AlertColor>('success');
  const [message, setmessage] = React.useState('');
  const [openAlert, SetOpenAlert] = React.useState(false);

  function ToggleAlertComponent(type: AlertColor, msg: string, open: boolean) {
    SetAlertType(type);
    setmessage(msg)
    SetOpenAlert(open);
  }

  const handleSelectedAction = (index: number) => {
    GetAction(index)
  }

  //deleterecordbyid
  const handleDeleteAll = async () => {
    //   alert(selectedTargets)
    setPrompt(false);
    var t = rowSelected;
    setOpen(true)
    var ol = rowSelected !== undefined ? rowSelected : [].toString().split(',').map((id: string) => id.trim())
    if (rowSelected !== undefined) {
      await deleterecordbyid(core._url, rowSelected, core);
    }
    setSelectedRows([]);
    dispatch(SetSelectedTargets({ target_ids: [] }))
  };

  const SwitchTheme = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#fff',
      '&:hover': {
        backgroundColor: '#fff'
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#7ff685'
    },
  }));


  const handleExportDump = async () => {
    const result  = await  ExportDumpToFile(core._url, SelectedInstance, core);
    if ( result === 200){
      ToggleAlertComponent('success', `Exported Check your store`, true);
    }else{
      ToggleAlertComponent('error', `Error while exporting Dump`, true);
    }
  }
  //console.log(instance['_targets']);
  const buttonstyle = {
    backgroundColor: "Transparent",
    color: "#fff",
    borderColor: "Transparent",
    display: 'flex',
    alignItems: 'center', // Center content vertically
    justifyContent: 'center', // Center content horizontally

  }


  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ width: "100%", wordWrap: "nowrap" }}>

        <button style={buttonstyle} onClick={(e) => {
   e.preventDefault();
          handleSelectedAction(1);

        }}>
          <span style={{ marginRight: '5px' }}>
            <AddIcon fontSize='small' />
          </span>
          ADD
        </button>

        <button style={buttonstyle} onClick={(e) => {
          e.preventDefault();
          setPrompt(true);

        }}>
          <span style={{ marginRight: '5px' }}>
            <RemoveIcon fontSize='small' /> {/* Add the AddIcon */}
          </span>
          DELETE
        </button>

        <button style={buttonstyle} onClick={(e) => {
          e.preventDefault();
          handleExportDump();
        }}>
          <span style={{ marginRight: '5px' }}>
            <ArchiveIcon fontSize='small' /> {/* Add the Dump Icon */}
          </span>
          DUMP
        </button>




        <GridToolbarColumnsButton  />

        <GridToolbarFilterButton />

        <GridToolbarDensitySelector
        
        />
        <GridToolbarExport
        
        />



        <button  style={buttonstyle} onClick={(e) => {
         
          alert('demo only')
        }}>
          <span style={{ marginRight: '5px' }}>
            <SatelliteAltIcon style={{ fontSize: "15px" }} />
          </span>
          DOWNLOAD AGENT
        </button>


        <button style={buttonstyle} onClick={(e) => {
   
          setOn(!on)
        }}>
          <span style={{ marginRight: '5px' }}>

          </span>
          {on ? "REFRESH ON" : "REFRESH OFF"}
        </button>


      </GridToolbarContainer>
    );
  }


  const setData = (data: any) => {
    const filteredRows = data 
    //console.log(instance?._instance_id);
    const filteredColumns = showDmpColumn
      ? columns
      : columns.filter((column) =>
        column.field !== '_dmp'
        && column.field !== '_out'
        && column.field !== '_in'
        && column.field !== '_isid'
      );
    SetFilteredColumns(filteredColumns)
   //console.log(filteredRows,'************************')

    if (Array.isArray(filteredRows)) {
      const result = filteredRows.map((item: any) => {
        // Your map logic hereRefresh
        var statusText = getStateLabel(item._st);

        item._proxy = 
        item._zzz += ' seconds'
        item._st = statusText;
        return item;
      });
      const rowsWithIds: any[] = result.map((row: any, index: number) => ({ ...row, id: index + 1 }));

      setRows(rowsWithIds)
    }

  }



  const fetchData = async (inst: Instance) => {
    try {
      let isMounted = true;
      if (isMounted) {
        const data = await getallrecords(core._url, inst, core)
        if (data === '401' || typeof data === "string") {
          setOpen2(true);
          return;
        }
      } else {
        // Handle the case when data is a string
        console.error("Data is a string. Unable to use map.");
        // Additional error handling or return from the function as needed
      }


    } catch (error) {

      setRows([]);
      console.error('Error fetching data:', error);

    }
  };

  useEffect(() => {
    const socks: Socket = io(`http://${core._url}`);
    if (socks !== undefined) {
      socks.on(
        'rtgrid/' + SelectedInstance._instance_id,
        (data: any) => {
          const payload =  data !== undefined ? data : [{}].filter((row: any) => row._isid === SelectedInstance._instance_id ? SelectedInstance?._instance_id : new Instance()._instance_id);
          setData(payload);
          console.log(payload)
          dispatch(SetInstanceTargets({targets:payload}))
        });
    }
    setInterval(() => {
      on ? socks.emit('rtgrid', { "isid": `${SelectedInstance._instance_id}` }) : undefined;
    }, 500);
     return () => { socks.disconnect(); socks.close()};
  }, [SelectedInstance,on]);


  //console.log(rowsWithIds);
  const selectedRows = (r: string) => {
    //parse string.
    const indexArray = r.toString().split(',').map(Number);
    // Step 2: Iterate through the array and get corresponding _id values
    const selectedIds: number[] = indexArray.map(index => rows[`${index - 1}`]?._id);
    setSelectedRows(selectedIds);
    dispatch(SetSelectedTargets({ target_ids: selectedIds }))
    
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };



  return (
    <Box style={{ height: "100%" }} sx={{
      height: "100%",
      width: '100%',
      '& .super-app-theme--header': {
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      backgroundColor: '#000000',

    }}
    >

      <DataGrid onMenuClose={() => { setRefresh(true) }} rows={rows} columns={filteredCols} rowHeight={30} columnHeaderHeight={30} checkboxSelection
        
        style={{ borderRadius: 0, overflow: "hidden" }}
        onRowSelectionModelChange={(details) => { selectedRows(details.toString()) }}
        slots={{
          toolbar: CustomToolbar,
        }}
        sx={{

          boxShadow: 0,
          color: 'rgb(255,255,255)',
          backgroundColor: '#080808',
      
          '&. MuiTablePagination-root': {
            color: 'white',
            backgroundColor: 'white'
          },
          '& .MuiDataGrid-overlay': {
            backgroundColor: '#000'
          },
          borderColor: 'transparent',
          '& .MuiDataGrid-toolbarContainer': {
            '& .MuiButtonBase-root': {
              color: '#ffffff',
              typography: { color: '#ffffff' }
            },
            backgroundColor: '#222', // Set the background color for the toolbar container
            padding: 0,
            typography: {
              color: '#ffffff',

            }

          },
  
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#333',
            outline:"none"
          },
          '& .MuiDataGrid-columnHeader': { color: '#ffffff', backgroundColor: '#333' },
          
          '& .MuiDataGrid-check:checked': { color: '#21fd0a', backgroundColor: '#00000' },
          
          '& .MuiDataGrid-row:focus,checked': { color: '#777'},
          
          '& .MuiDataGrid-cell:hover,focus': { color: '#ffffff', outline:"none",transparent:"none"}, //limegreen
          
          '& .MuiDataGrid-cell':{border:"1px dotted #111",outline:"none"},
          '& .MuiDataGrid-cell:focus':{border:"1px dotted #111",outline:"none"},
          '& .MuiDataGrid-row:hover': { backgroundColor: '#222' }, 
          '& .Mui-row-selected:selected': {
            color: '#00000',
            border:"none",
            backgroundColor: '#ffffff',
            '&:hover': {
              backgroundColor: '#fffff'
            }
          },


          '& .MuiTablePagination-root': {
            color: '#ffffff'
          },

          '& .MuiDataGrid-selectedRowCount': {
            // Add styles for the selected row count text
            // Example: color, font-size, etc.
            color: '#ffffff'
          },
          '& .Mui-hover': {
            color: '#ffffff', // Set the color when checkboxes are checked
            // Add other styles as needed
            backgroundColor:"#000"
          },

          '&. MuiPopper-root': {
            background: '#ffffff !important;'
          },


          '& .MuiSvgIcon-root': {
            color: '#7ff685', // Set the color for the SVG icon inside the checkbox
          },

          // '& .Mui-selected': {
          //   color: '#7ff685' // Set the color when checkboxes are checked
          //   // Add other styles as needed
          // },

          '& .Mui-checked': {
            color: '#7ff685', // Set the color when checkboxes are checked
            // Add other styles as needed
            borderColor: '#ffffff',
            AccentColor: '#ffffff'

          },



          '& .MuiDataGrid-cellCheckbox': {
            "&:hover": {
              color: '#fffff',
              backgroundColor: '#fffff',
              '&:hover': {
                backgroundColor: '#fffff'
              }
            }
          }
        }

        } />

      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: '100%' }}>
          targets Deleted Successful
        </Alert >
      </Snackbar>

      <Snackbar open={open2} autoHideDuration={2500} onClose={handleClose2}>
        <Alert onClose={handleClose2} variant="filled" severity="error" sx={{ width: '100%' }}>
          Logged Out
        </Alert >
      </Snackbar>

      <Dialog
        onBackdropClick={() => setPrompt(false)}

        sx={{
          color: "#fff", padding: 0, width: "100%", height: "100%",
          "& .MuiPaper-root": { bgcolor: "#111613", color: "fff", borderWidth: 1, borderStyle: "solid", borderColor: "#fff" }
        }
        } open={promptopen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ color: "#fff", padding: 0 }} >
          <Stack direction="column" style={{ width: "400px", padding: 30 }}>
            <h6>
              Deleting {rowSelected !== undefined ? rowSelected.length : 0} target handlers?
            </h6>
            <Stack direction="row" spacing={10} style={{ width: "100%", padding: 0 }}>
              <Button sx={{ backgroundColor: "Transparent", color: "#fff", width: "100%", ":hover": { backgroundColor: "red" } }} onClick={() => { handleDeleteAll() }}>Delete</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      <DynamicAlert open={openAlert} msg={message} type={alertType} closeParent={(e) => { SetOpenAlert(false) }} />
    </Box>
  );
};

export default MuiDataGrid;
{ "Deleting {rowSelected.findLastIndex ? rowSelected.length : 0}  target handlers?" }


function clsx(arg0: string, arg1: { negative: boolean; positive: boolean; }) {
  throw new Error('Function not implemented.');
}

