import React from 'react'
import { Core, Instance, Target } from "../api/apiclient";
import { List, Typography, Box, ListItem, ListItemIcon, ListItemText, TextField, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useAppSelector } from "../store/store";
import { returnStateColor, themeTextBlack, getStateLabel } from "../Utilities/Utilities";
import RemoveIcon from '@mui/icons-material/Remove';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { IoTrashOutline } from "react-icons/io5";
import {SetCommand } from '../api/apiclient';

const ObjectView = () => {

    const core = useAppSelector(state => state.core.coreObject);
    const url = core._url
    const instance = useAppSelector(state => state.core.SelectedInstances)
    const selectedTargets = useAppSelector(state => state.core.selectedTargets)
    const targets = useAppSelector(state => state.core.targetObjects)
    const currentTargs = targets ?? [];
    const [open, setOpen] = React.useState(false);
    const [SelectedObject, setSelectedObject] = React.useState<number>(-1);
    const [inputValue, setInputValue] = React.useState('');

    const HandleObjectClick = (index: number) => {
        
        setSelectedObject(self => self !== index ?  index : -1 )
    }


    const HandleObjectEnter = (item: any, cmd: string) => {
        const targ = item as Target;
        SetCommand(url, core, instance,
            targ,
            cmd);
        setInputValue('')
        return true
    }

    return (
        <Box sx={{ color: '#fff', minHeight: "100%", height: "100%"  }}>
            <Box
                sx={{
                    backgroundColor: '#111',
                    padding: '2%',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '10px',
                    position: 'sticky',
                    top: 0,
                    height: "25px",
                    zIndex: 1,
                }}
            >
                <p >Object View</p>
            </Box>

            <div style={{ gap: '4px', margin: "auto", overflow: "scroll", flexDirection: "column", display: "flex" }} >
                {

                    targets.filter((item: Target) => {
                        return selectedTargets.includes(item._id);
                    }).map((item: Target, index: number) =>
                    (

                        <Stack
                           
                            key={item._id}
                            sx={{
                                "&:hover":{backgroundColor:"#555"},  borderRadius: '4px', marginBottom: '1%', backgroundColor: '#222', gap: '1px', padding: "10px"
                            }}>


                            <div>
                                <div style={{ flexDirection: "column", display: "flex", height: "100%" }}>

                                    <div
                                     onClick={() => { HandleObjectClick(index) }}
                                    style={{ gap: "5px", flexDirection: "row", display: "flex" }}>


                                        <p  style={{ color: "#fff", margin: "0", cursor: "pointer", width: "100%",fontSize:"11px" }} >  {item._n} </p>
                                        { SelectedObject !== index  && <p style={{ borderRadius: "5px", color: "#fff", fontSize:"11px", backgroundColor: returnStateColor(item._st), padding: "3px", width: "50%", marginRight: "auto" }} > {getStateLabel(item._st)} </p>}
                                    </div>
                                    {SelectedObject === index  && <>


                                        <div style={{ flexDirection: "row", display: "flex", padding: "5px",gap:"10px" }}>
                                            <p style={{ borderRadius: "5px", color: "#fff", backgroundColor: returnStateColor(item._st), width: "50%", margin: "0" }} > {getStateLabel(item._st)} </p>

                                            <BedtimeIcon onClick={() => { alert(`sleeping: ${item._st}`) }}
                                                sx={{
                                                    margin: "auto",
                                                    cursor: "pointer",
                                                    fontSize:"13px",
                                                    "&:hover": {
                                                        color: "#7ff685",

                                                    }
                                                }} />

                                            <IoTrashOutline onClick={() => { alert(`deleting: ${item._n}`) }} style={{
                                                margin: "auto",
                                                cursor: "pointer",
                                                
                                            }} />


                                        </div>

                                        {
                                            //weird behavior.... ._st is supposed to be 0:int not 'Task':string works but why?
                                            item._st.toString() !== "Task" && item._st.toString() !== "dropped" && item._st.toString() !== "Sleep" &&
                                            <TextField
                                                onKeyDown={(e) => { e.key === 'Enter' && typeof e.preventDefault() === "undefined" && HandleObjectEnter(item,inputValue) }}
                                                onChange={(e) => setInputValue(e.target.value)} // Update the input value in state
                                                value={inputValue}
                                                required
                                                maxRows={5}
                                                multiline={true}
                                                size='small'
                                                spellCheck={false}  // Disable spell checking
                                                autoComplete='off'
                                                autoCorrect='off'
                                                autoCapitalize='off'
                                                placeholder="cmd>"
                                                InputLabelProps={{ sx: { color: "#ddd"} }}
                                                inputProps={{ sx: { color: "#ddd", fontFamily: 'Ubuntu Mono, monospace' } }}
                                                sx={{ ...themeTextBlack, maxWidth: "100%", height: "50%", borderRadius: "5px", overflow: "hidden" }}
                                            >
                                            </TextField>
                                        }

                                        {
                                            //weird behavior.... ._st is supposed to be 0:int not 'Task':string works but why?
                                            item._st.toString() === "Task" && item._st.toString() !== "Listen" &&
                                            <TextField
                                                onKeyDown={(e) => { e.key === 'Enter' && typeof e.preventDefault() === "undefined" && HandleObjectEnter(item,inputValue) }}
                                                required
                                                onChange={(e) => setInputValue(e.target.value)} // Update the input value in state
                                                value={inputValue}
                                                maxRows={5}
                                                multiline={true}
                                                size='small'
                                                spellCheck={false}  // Disable spell checking
                                                autoComplete='off'
                                                autoCorrect='off'
                                                autoCapitalize='off'
                                                placeholder="cmd>"
                                                InputLabelProps={{ sx: { color: "#7ff685", fontSize: '5px' } }}
                                                inputProps={{ sx: { color: "#7ff685", fontFamily: 'Ubuntu Mono, monospace' } }}
                                                sx={{ ...themeTextBlack, maxWidth: "100%", height: "50%", borderRadius: "5px", overflow: "hidden" }}
                                            >
                                            </TextField>
                                        }



                                    </>
                                    }
                                </div>


                            </div>


                        </Stack>


                    ))}

            </div>
        </Box>
    )
}
export default ObjectView;