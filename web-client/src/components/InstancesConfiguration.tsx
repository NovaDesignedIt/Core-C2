import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { Core, Instance } from '../api/apiclient';


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
            <div style={{ width: "100%", height: "35%", backgroundColor: "#000" }}>
                <div style={{ width: "100%",minHeight:"40px", height: "10px", padding: "1%", paddingBottom: '1%', backgroundColor: "#000", overflow: 'hidden' }}>

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
                <TableContainer component={Paper} sx={{ boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', height: "100%",minHeight:"10px", borderRadius: 0, backgroundColor: "#000", }} >
                    <Table size="small" sx={{
                        borderStyle: 'dotted',
                        borderWidth: '1px',
                        borderColor: '#111',
                        height:"50%",
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
                            <TableRow sx={{ ':Hover': { backgroundColor: "#000" },cursor:"default" }}>
                                <TableCell align="left"> id</TableCell>
                                <TableCell align="left">instance name</TableCell>
                                <TableCell align="left">instance id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(core?._instances !== undefined ? core._instances : []).map((row) => (
                                <TableRow
                                    key={row._id}
                                    selected={row._id === selectedRowId}
                                    onClick={() => { handleRowClick(row._id); }}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 },cursor:"pointer" }}
                                >
                                    <TableCell align="left">{row._id}</TableCell>
                                    <TableCell align="left">{row._instance_name}</TableCell>
                                    <TableCell align="left">{row._instance_id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
export default instanceConfiguration;



    