import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import { Core, Instance } from '../api/apiclient';
import CircleIcon from '@mui/icons-material/Circle';
import { Typography } from '@material-ui/core';

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



function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}


interface InstanceUsersProps {
    core?: Core;

}



const instanceConfiguration: React.FC<InstanceUsersProps> = ({ core }) => {

    const [selectedRowId, setSelectedRowId] = React.useState(0);
    const [PanelOpen, TogglePanel] = React.useState(true);
    const [Exists, setExists] = React.useState(false);

    //Instance Variables
    const [IpValue, SetIpValue] = React.useState('');
    const [HostNameValue, SetHostNameValue] = React.useState('');
    const [NameValue, SetNameValue] = React.useState('');

    function wipevalues(isNew: boolean, targ?: Instance) {
        if (!isNew && targ !== undefined) {
            SetIpValue(targ?._instance_ip)
            SetHostNameValue(targ?._instance_url)
            SetNameValue(targ?._instance_name)
        }
        else {
            SetIpValue('')
            SetHostNameValue('')
            SetNameValue('')
        }

    }

    const HandleHostName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        SetHostNameValue(event.target.value);
    }

    const HandleIpChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        SetIpValue(event.target.value);
    }


    const HandleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        SetNameValue(event.target.value);
    }


    const handleRowClick = (rowId: number) => {
        setSelectedRowId(rowId);
    };

    const HandleEdit = (open: boolean) => {
        if (selectedRowId > 0) {
            TogglePanel(true);
            setExists(true);
            const instance: Instance | undefined = core?._instances?.find((instance) => instance._id === selectedRowId);
            wipevalues(false, instance);
        }

    }

    const HandleAdd = (open: boolean) => {
        TogglePanel(true);
        setExists(false);
        wipevalues(true, undefined);
    }

    const BorderBottomStyle = {

    }

    return (
        <>
            <div style={{ width: "100%", height: "80%", backgroundColor: "#000" }}>
                <Stack spacing={1} flexDirection={'row'} sx={{ flexDirection: "row", justifyContent: "center", display: 'flex', width: "100%", height: '10%', borderBottomWidth: 1, borderBottomColor: '#111', borderBottomStyle: 'solid' }}
                    onClick={() => { setSelectedRowId(0); TogglePanel(false) }} >
                    <div style={{ width: '100%', padding: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <label style={{ color: "#777", marginRight: '20%' }}> Core ID: {core?._core_id} </label>

                        <label style={{ color: "#fff", justifyContent: 'start' }}>
                            <h4>Instances</h4>

                        </label>
                        <label style={{ color: "#fff", marginRight: '5%' }}>&nbsp;&nbsp;-&nbsp;&nbsp;{core?._config?._host_name} </label>
                    </div>
                </Stack>
                <div style={{ width: "100%", height: "10%", padding: "1%", paddingBottom: '1%', backgroundColor: "#000", overflow: 'hidden' }}>

                    <Button
                        onClick={() => HandleAdd(true)}
                        sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}> Insert </Button>
                    <Button
                        onClick={() => { selectedRowId > 0 ? HandleEdit(true) : alert('select an Instance to Edit') }}
                        sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}> Edit </Button>
                    <Button
                        onClick={() => { selectedRowId > 0 ? alert('instance with id ' + selectedRowId + ' was deleted' + ' 😉 *pretend it\'s deleted ok?') : alert('select an Instance to Delete') }}
                        sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}> Delete </Button>
                </div>
                <TableContainer component={Paper} sx={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', height: "100%", borderRadius: 0, backgroundColor: "#000", }} >
                    <Table size="small" sx={{
                        borderStyle: 'dotted',
                        borderWidth: '1px',
                        borderColor: '#111',

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
                            <TableRow sx={{ ':Hover': { backgroundColor: "#000" } }}>
                                <TableCell align="left"> id</TableCell>
                                <TableCell align="left">instance id</TableCell>
                                <TableCell align="left">instance name</TableCell>
                                <TableCell align="left">instance ip</TableCell>
                                <TableCell align="left">instance url</TableCell>
                                <TableCell align="left">Instance count</TableCell>
                                <TableCell align="left">core id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(core?._instances !== undefined ? core._instances : []).map((row) => (

                                <TableRow
                                    key={row._id}
                                    selected={row._id === selectedRowId}
                                    onClick={() => { handleRowClick(row._id); }}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">{row._id}</TableCell>
                                    <TableCell align="left">{row._instance_id}</TableCell>
                                    <TableCell align="left">{row._instance_name}</TableCell>
                                    <TableCell align="left">{row._instance_ip}</TableCell>
                                    <TableCell align="left">{row._instance_url}</TableCell>
                                    <TableCell align="left">{row._Instance_count}</TableCell>
                                    <TableCell align="left">{row._core_id}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div style={{ gap: '10px',display:'flex' , flexDirection: 'row', height: "50%", width: "100%", backgroundColor: "#111", padding: '1%' }}>
                        {
                            PanelOpen &&

                            <Stack spacing={'3%'} sx={{
                                width: "50%", padding: '1%',
                                boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)',
                                borderWidth: 1,
                                borderColor: '#111',
                                borderStyle: 'dotted',
                                backgroundColor: "#222",
                                borderRadius: 1,
                                borderInlineStyle: { opacity: 0.1 }
                            }}>
                                {Exists ?
                                    <label style={{ color: "#fff", marginRight: '25%' }}> Editing Instance : &nbsp;
                                        {
                                            core?._instances?.find((instance) => instance._id === selectedRowId)?._instance_name
                                        }
                                    </label>
                                    :
                                    <label style={{ color: "#fff", marginRight: '25%' }}> Inserting Instance into : {core?._config?._title} </label>}
                                <TextField
                                    fullWidth={true}
                                    onChange={(e) => HandleNameChange(e)}
                                    InputLabelProps={{ sx: { color: "#fff" } }}
                                    inputProps={{ sx: { color: "#fff" } }}
                                    label={'Instance Name'}
                                    value={NameValue}
                                    size='small'
                                    sx={themeText}></TextField>
                                <TextField
                                    fullWidth={true}
                                    onChange={(e) => HandleIpChange(e)}
                                    InputLabelProps={{ sx: { color: "#fff" } }}
                                    inputProps={{ sx: { color: "#fff" } }}
                                    label={'Instance IP'}
                                    value={IpValue}
                                    size='small'
                                    sx={themeText}></TextField>
                                <TextField
                                    fullWidth={true}
                                    onChange={(e) => HandleHostName(e)}
                                    InputLabelProps={{ sx: { color: "#fff" } }}
                                    inputProps={{ sx: { color: "#fff" } }}
                                    label={'Instance HostName'}
                                    value={HostNameValue}
                                    size='small'
                                    sx={themeText}></TextField>
                                <Button
                                    onClick={() => { Exists ? alert('Updated!') : alert('Inserted!') }}
                                    sx={{ backgroundColor: "#405742", color: "#fff", width: "50%", boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', }}>  {Exists ? 'Update' : 'Insert'} </Button>
                            </Stack>

                        }

                        <Stack spacing='10px'  sx={{
                            
                            width: "50%", padding: '1%',
                            height:'100%',
                            boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)',
                            borderWidth: 1,
                            borderColor: '#111',
                            borderStyle: 'dotted',
                            backgroundColor: "#222",
                            borderRadius: 1,
                            borderInlineStyle: { opacity: 0.1 }
                        }}>
                        
                            <label style={{ color: "#fff", marginRight: '25%' }}> Listeners </label>
                            <Box sx={{ padding: '2%', borderRadius: 1, boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', backgroundColor: "#000", width: '100%', height: '100%' }} >
                                <List sx={{gap:'10px'}}>
                                     {/*                  
                                    // .MAP THIS SHIEEE
                                    */}
                                    <ListItem sx={{  
                                        ":Hover":{opacity:'0.8'},
                                        height:'30px',marginBottom:'1%',borderRadius: '6px', backgroundColor: '#222' }}>
                                       <ListItemIcon>
                                       <CircleIcon sx={{ fontSize:'10px',color:'#21fd0a'}}/>
                                        </ListItemIcon>
                                        <ListItemText sx={{ color: '#fff' }}>
                                        <Typography
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '10px'
                                                }}
                                            >
                                            LISTENER-01
                                            </Typography>

                                        </ListItemText>
                                        <ListItemText >
                                            <Typography
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '10px'
                                                }}
                                            >
                                                online : 2023/12/27 16:20:11
                                            </Typography>
                                        </ListItemText>
                                    </ListItem>


                                    <ListItem sx={{
                                        ":Hover": { opacity: '0.8' },
                                        height: '30px', borderRadius: '6px', backgroundColor: '#222'
                                    }}>
                                        <ListItemIcon>
                                            <CircleIcon sx={{ fontSize: '10px', color: '#21fd0a' }} />
                                        </ListItemIcon>
                                        <ListItemText sx={{ color: '#fff' }}>
                                        <Typography
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '10px'
                                                }}
                                            >
                                            LISTENER-02
                                            </Typography>

                                        </ListItemText>
                                        <ListItemText >
                                            <Typography
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '10px'
                                                }}
                                            >
                                                online : 2023/12/27 16:20:11
                                            </Typography>
                                        </ListItemText>
                                    </ListItem>





                                </List>

                            </Box>

                        </Stack>
                    </div>
                </TableContainer>
            </div>
            <div
                onClick={() => { setSelectedRowId(0); TogglePanel(false) }}
                style={{ height: "10%", width: "100%", backgroundColor: "#000" }}>
                {/* <h1>more shit </h1> */}
            </div>
        </>
    );
}
export default instanceConfiguration;