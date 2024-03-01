import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AlertColor, Button, TextField } from '@mui/material';
import { Core, Instance, Target, deleteinstancebyid, getallinstance, insertinstance } from '../api/apiclient';
import { AnyLayer } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../store/store';
import { SetInstance, InsertInstance } from '../store/features/CoreSlice';
import { DynamicAlert } from './AlertFeedbackComponent';

const themeText = {
    backgroundColor: "#333",
    "&:Hover,focus": {
        backgroundColor: "#555"
    },
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
        style: { fontFamily: 'nunito', },
    },
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)',
}

const instanceConfiguration = () => {
    const dispatch: any = useAppDispatch();

    const CoreC = useAppSelector(state => state.core.coreObject)
    const config = useAppSelector(state => state.core.configObject)
    const inst = useAppSelector(state => state.core.instanceObjects)
    const listeners = useAppSelector(state => state.core.listenerObjects)
    const instances = inst ?? []

    const [Instances, setInstances] = React.useState<Instance[]>(instances)
    const [selectedRowId, setSelectedRowId] = React.useState(-1);
    const [insertRow, TogglePanel] = React.useState(false);
    const [InstanceName, SetInstanceName] = React.useState('')

    const [alertType, SetAlertType] = React.useState<AlertColor>('success');
    const [message, setmessage] = React.useState('');
    const [open, SetOpen] = React.useState(false);
    
    const [proxy, setproxy] = React.useState(0);
    const [proxyIndex,setIndex] = React.useState(0); 
    const [proxyName, SetProxyName] = React.useState('');
    const [url, seturl] = React.useState('');






    const handleScroll = () => {
        // Your scroll handling logic here

        // Calculate the next index based on the current scroll position
        const nextIndex = (proxy + 1) % listeners.length;
        console.log(proxy)
        setproxy(prev => prev + 1)
        SetProxyName(listeners[nextIndex]._listener_name)
        setIndex(nextIndex);
    };

    function ToggleAlertComponent(type: AlertColor, msg: string, open: boolean) {
        SetAlertType(type);
        setmessage(msg)
        SetOpen(open);
    }


    const handleInstanceNameChange = (event: any) => {
        SetInstanceName(event.target.value)
        //console.log(InstanceName)
    }

    const handleRowClick = (rowId: number) => {
        setSelectedRowId(rowId);
        //console.log(rowId);
    };

    const HandleDelete = async (rowid: number) => {
        //console.log(rowid)
        if (rowid !== undefined) {
            const instance = Instances.find(i => i._id === rowid)
            if (instance !== undefined && CoreC !== undefined) {
                const response = await deleteinstancebyid(CoreC._url, CoreC, instance)
                const allinstances: Instance[] = response as unknown as Instance[]
                if (allinstances !== undefined) {
                    dispatch(SetInstance({ instance: allinstances }))
                    setInstances(allinstances);
                    ToggleAlertComponent('success', 'Instance Deleted', true);
                } else {
                    ToggleAlertComponent('error', 'session over', true);
                }
            }
        }
    }

    const HandleAdd = async (open: boolean) => {
        if (insertRow) {
           
            const data = new Instance(
                0,
                '',
                InstanceName,
                listeners[proxyIndex]._id,
                url,
                0,
                CoreC?._core_id,
            );
            //console.log(data)
            var t: string = ''
            if (CoreC !== undefined && InstanceName !== '') {
                const response = await insertinstance(CoreC._url, CoreC, data);
                const allinstances: Instance[] = response as unknown as Instance[]
                if (allinstances !== undefined && response !== 401) {
                    dispatch(SetInstance({ instance: allinstances }))
                    setInstances(allinstances);
                    ToggleAlertComponent('success', 'Instance Inserted', true);
                } else {
                    ToggleAlertComponent('error', 'session over', true);
                }
            }
            TogglePanel(false);
            return
        }
        TogglePanel(true);
    }

    return (
    
            <div style={{ width: "100%", height: "100%", minHeight: "250px", backgroundColor: "#000"}}>
                <div onClick={() => { setSelectedRowId(-1) }} style={{ padding: "1%", backgroundColor: "#000", border: "1px #222 solid", borderRadius: "4px" }}>
                    <Button
                        onClick={() => { HandleAdd(true) }}
                        sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}>{insertRow ? "Save" : "Insert"}  </Button>
                    <Button
                        onClick={() => { HandleDelete(selectedRowId) }}
                        sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}> Delete </Button>
                </div>
                <div style={{ border: "1px solid #222", borderRadius: "5px", overflow: "scroll", maxHeight: "100%" }}>


                    <TableContainer component={Paper} sx={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', height: "100%", minHeight: "10px", borderRadius: 0, backgroundColor: "#000" }} >
                        <Table size="small" sx={{

                            borderStyle: 'dotted',
                            borderWidth: '1px',
                            borderColor: '#111',
                            height: "50%",
                            minWidth: 650,
                            backgroundColor: "#222",
                            "& .MuiTableCell-root": {
                                color: "#fff",
                            },
                            "& .MuiTableHead-root": {
                                backgroundColor: "#111",
                                ":Hover,focus": {
                                    backgroundColor: "#333",
                                },
                            },
                            "& .MuiTableRow-root": {
                                ":Hover,focus": {
                                    backgroundColor: "#333",
                                },
                            },
                            "& .MuiTableRow-root.Mui-selected": {
                                backgroundColor: "#444",
                                opacity: '1'
                            }
                        }} aria-label="simple table">
                            <TableHead>
                                <TableRow onClick={() => { setSelectedRowId(-1) }} sx={{ ':Hover': { backgroundColor: "#000" }, cursor: "default" }}>
                                    <TableCell align="left"> id</TableCell>
                                    <TableCell align="left">instance name</TableCell>
                                    <TableCell align="left">instance id</TableCell>
                                    <TableCell align="left">url</TableCell>
                                    <TableCell align="left">proxy</TableCell>
                                </TableRow>
                                {insertRow &&
                                    <TableRow sx={{ ':Hover': { backgroundColor: "#000" }, cursor: "default" }}>
                                        {/* icci */}
                                        <TableCell align="left">

                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                fullWidth={true}
                                                InputLabelProps={{ sx: { color: "#fff" } }}
                                                inputProps={{ sx: { color: "#fff" } }}
                                                size='small'
                                                onChange={(e) => { handleInstanceNameChange(e) }}
                                                value={InstanceName}
                                                sx={{ ...themeText, width: "70%", borderRadius: "5px" }} ></TextField>
                                        </TableCell>
                                        <TableCell align="left">

                                        </TableCell>
                                        <TableCell align="left">
                                        
                                                <TextField
                                                    fullWidth={true}
                                                    InputLabelProps={{ sx: { color: "#fff" } }}
                                                    inputProps={{ sx: { color: "#fff" } }}
                                                    size='small'
                                            
                                                    onChange={(e) => {seturl(e.target.value) }}
                                                    value={url}
                                                    sx={{ ...themeText, width: "100%", borderRadius: "5px" }} ></TextField>
                                       
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                fullWidth={true}
                                                InputLabelProps={{ sx: { color: "#fff" } }}
                                                inputProps={{ sx: { color: "#fff" } }}
                                                size='small'
                                                onWheel={()=> listeners.length > 0 && handleScroll()}                                                
                                                value={proxyName}
                                                sx={{ ...themeText, width: "100%", borderRadius: "5px" }} ></TextField>
                                       
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableHead>
                            <TableBody>
                                {(Instances)?.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        selected={row._id === selectedRowId}
                                        onClick={() => { handleRowClick(row._id); TogglePanel(false) }}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer", border: row._id === selectedRowId ? "2px solid #fff" : undefined }}
                                    >
                                        <TableCell align="left">{row._id}</TableCell>
                                        <TableCell align="left">{row._instance_name}</TableCell>
                                        <TableCell align="left">{row._instance_id}</TableCell>
                                        <TableCell align="left">{row._instance_url}</TableCell>
                                        <TableCell align="left">{listeners.find(x => x._id === row._proxy)?._listener_name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <DynamicAlert open={open} msg={message} type={alertType} closeParent={(e) => { SetOpen(false) }} />
            </div>
           
      
    );
}
export default instanceConfiguration;



