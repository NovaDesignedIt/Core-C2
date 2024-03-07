import { AlertColor, Box, Button, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { Listeners, addlistener, deleteListener } from "../api/apiclient";
import { SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../store/store';
import { SetListener, addlisteners } from "../store/features/CoreSlice";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { DynamicAlert } from "./AlertFeedbackComponent";
const listners = [1, 2, 6, 1, 1, 1, 1, 1, 1, 1]

const ListenersComponent = () => {
    const corid = useAppSelector(state => state.core.configObject._core_id)
    const core = useAppSelector(state => state.core.coreObject)

    const [newlistener, SetNewListener] = useState(false);
    const [name, SetName] = useState('');
    const [ipaddress, SetIpAddress] = useState('');
    const [selectedListener, SetSelectedListener] = useState(-1);
    const listeners = useAppSelector(state => state.core.listenerObjects);
    const dispatch = useAppDispatch();


 

    const [alertType, SetAlertType] = useState<AlertColor>('success');
    const [message, setmessage] = useState('');
    const [open, SetOpen] = useState(false);
  
    function ToggleAlertComponent(type:AlertColor,msg:string,open:boolean){
      SetAlertType(type);
      setmessage(msg)
      SetOpen(open);
    }

  
    
    const HandleSelectedListenerClick = (index: number, id: number) => {
        SetSelectedListener(id)
    }

    const HandleInsertListener = async () => {
        if (name !== '' && ipaddress !== '') {

            const l: Listeners = new Listeners(corid, name, ipaddress, '', 0)

            const result = await addlistener(core._url, core, l);
            if (result !== undefined && result !== 401) {

                const listListeners: Listeners[] = result as unknown as Listeners[]
                dispatch(SetListener({ listenerid: listListeners }))
                SetNewListener(false);
                ToggleAlertComponent('success','Listener Inserted',true);
            }else {
                ToggleAlertComponent('error','session over',true);
            }
            SetSelectedListener(-1)
        }else{
            alert('provide name and ip address')
        }
    }

    const HandleDeleteListener = async () => {
        if (selectedListener !== undefined) {
            const result = await deleteListener(core._url, core, selectedListener)
            if (result !== undefined &&  result.status !== 401) {
                console.log(result.body)
                const listeners: Listeners[] = await result.json() as unknown as Listeners[]
                dispatch(SetListener({ listenerid: listeners }))
                SetSelectedListener(-1)
                if (result.status === 201) {
                    ToggleAlertComponent('warning', 'Active Instance is using this.', true);
                } else {
                    ToggleAlertComponent('success', 'Listener Deleted', true);
                }
            }else {
                ToggleAlertComponent('error','error',true);
            }
        } else {
            alert('Select Listener first')
        }
    }



    const HandleListenerName = (event: { target: { value: SetStateAction<string>; }; }) => {
        SetName(event.target.value);
    }

    const HandleListenerIpAddress = (event: { target: { value: SetStateAction<string>; }; }) => {
        SetIpAddress(event.target.value);
    }


    const themeText = {

        backgroundColor: "#333",
        "&:Hover,focus": {
            backgroundColor: "#555"
        },
        // OUTLINE
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
            style: { fontFamily: 'nunito' },
        },
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
    }



    return (


        <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex',
            width: "100%",
            height: "100%",
            maxHeight: "80%",
            minHeight: "250px",
            gap: "10px",
            padding: "1%",
            flexDirection: 'column',
            backgroundColor: "#111",
        }}>
            <div style={{ flexDirection: "row", display: "flex", marginRight: "auto", height: "10%", gap: "20px", cursor: "pointer" }}>
                <AddIcon
                    onClick={() => { newlistener ? SetNewListener(false) : SetNewListener(true) }}
                    sx={{
                        "&:hover": {
                            color: "#7ff685"
                        }
                    }} />
           
                <RemoveIcon
                
                    onClick={() => { selectedListener !== -1 ? HandleDeleteListener() : alert('no selected Listeners') }}
                    sx={{
                        visibility: listeners.length > 1 ?  "display" :"hidden",
                        "&:hover": {
                            color: "#7ff685"
                        }
                    }} />
            </div>
            <div style={{ padding: "3px", overflow: "hidden", width: "100%", gap: "10px", height: "100%", flexDirection: "column", display: "flex" }}>

                {newlistener &&
                    //newlist
                    <div style={{ padding: "3px", overflow: "hidden", gap: "10px", width: "100%", height: "50%", maxHeight: "50px", minHeight: "50px", flexDirection: "row", display: "flex" }}>
                        <TextField
                            InputLabelProps={{ sx: { color: "#fff" } }}
                            inputProps={{ sx: { color: "#fff" } }}
                            size='small'
                            placeholder={'name'}
                            onChange={(e) => { HandleListenerName(e) }}
                            sx={{ ...themeText, width: "20%", borderRadius: "5px" }} ></TextField>
                        <TextField

                            InputLabelProps={{ sx: { color: "#fff" } }}
                            inputProps={{ sx: { color: "#fff" } }}
                            size='small'
                            placeholder={'ipaddress'}
                            onChange={(e) => { HandleListenerIpAddress(e) }}
                            sx={{ ...themeText, width: "40%", borderRadius: "5px" }} ></TextField>
                        <Button
                            onClick={() => { HandleInsertListener() }}
                            sx={{

                                border: "1px solid #333",
                                color: '#fff',
                                ":hover": {
                                    bgcolor: "#777",
                                }
                            }}
                            style={{ width: '5%', height: '100%', }} >
                            +
                        </Button>
                    </div>

                }
                <div style={{ padding: "1px", overflow: "hidden", gap: "10px", width: "100%", height: "100%", flexDirection: "row", display: "flex" }}>

                    <Box sx={{ padding: '3px', borderRadius: "4px", cursor: "pointer",  backgroundColor: "#000", width: '100%', height: '100%' }} >
                        <List style={{  flexDirection: "column", display: "flex", gap: "10px", overflow:"auto", maxHeight: "100%",height:"100%",backgroundColor:"transparent"}}>
                            {
                                listeners.map((listener: Listeners, index: number) => (
                                    <ListItem
                                        key={index}
                                        onClick={() => { HandleSelectedListenerClick(index, listener._id) }}
                                        sx={{

                                            height: '30px',
                                            borderRadius: '6px',
                                            backgroundColor: '#222',
                                            width: "100%",
                                            ":hover": { opacity: '0.8' },
                                            ":active, :focus": { backgroundColor: '#111' },
                                            border: selectedListener === listener._id ? "1px solid #fff" : ''
                                        }}
                                    >
                                        <ListItemIcon>
                                            <CircleIcon sx={{ fontSize: '10px', color: listener._last_ping === '' ? '#777' : '#21fd0a' }} />
                                        </ListItemIcon>
                                        <ListItemText sx={{ color: '#fff' }}>
                                            <Typography
                                                style={{
                                                    fontFamily: '"Ubuntu Mono", monospace',
                                                    justifyContent: 'center',
                                                    display: "flex",
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    maxWidth: "50px",
                                                    minWidth: "50px"
                                                }}>
                                                {listener._listener_name}
                                            </Typography>
                                        </ListItemText>
                                        <ListItemText >
                                            <Typography
                                                style={{
                                                    fontFamily: '"Ubuntu Mono", monospace',
                                                    justifyContent: 'center',
                                                    display: "flex",
                                                    color: '#fff',
                                                    fontSize: '10px',
                                                    maxWidth: "50px",
                                                    minWidth: "50px"
                                                }}>
                                                {listener._ipaddress}
                                            </Typography>
                                        </ListItemText>
                                        <ListItemText >
                                            <Typography
                                                style={{
                                                    fontFamily: '"Ubuntu Mono", monospace',
                                                    justifyContent: 'center',
                                                    display: "flex",
                                                    color: '#fff',
                                                    fontSize: '10px',
                                                    maxWidth: "50px",
                                                    marginLeft: "auto",
                                                    minWidth: "50px"
                                                }}>
                                                {listener._last_ping}
                                            </Typography>
                                        </ListItemText>
                                    </ListItem>
                                ))
                            }


                        </List>

                    </Box>

                    <DynamicAlert open={open} msg={message} type={alertType} closeParent={(e)=>{SetOpen(false)}}/>


                </div>
            </div>
        </div>


    );
}
export default ListenersComponent;