import React from 'react'
import { Core, Instance, Target } from "../api/apiclient";
import { List, Typography, Box, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useAppSelector } from "../store/store";
import { returnStateColor, themeTextBlack, getStateLabel } from "../Utilities/Utilities";
import RemoveIcon from '@mui/icons-material/Remove';
import BedtimeIcon from '@mui/icons-material/Bedtime';


const ObjectView = () => {

    const core = useAppSelector(state => state.core.coreObject);
    const url = core._url
    const instance = useAppSelector(state => state.core.SelectedInstances)
    const selectedTargets = useAppSelector(state => state.core.selectedTargets)
    const targets = useAppSelector(state => state.core.targetObjects)
    const currentTargs = targets ?? [];
    const [open, setOpen] = React.useState(false);

    return (
        <Box sx={{ color: '#fff', minHeight: "100%", height: "100%" }}>
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
                    }).map((item: Target) =>
                    (

                        <div
                            key={item._id}
                            style={{
                                borderRadius: '4px', marginBottom: '1%', backgroundColor: '#222', gap: '1px', padding: "10px"
                            }}>


                            <div>
                                <div style={{ flexDirection: "column", display: "flex", height: "100%" }}>

                                    <div style={{ gap:"5px",flexDirection: "row", display: "flex" }}>


                                        <p onClick={() => { setOpen(!open) }} style={{ color: "#fff", margin: "0", cursor: "pointer" }} >  {item._n} </p>
                                        {!open && <p style={{ borderRadius: "5px", color: "#fff", backgroundColor: returnStateColor(item._st), padding: "3px", width: "50%", marginRight: "auto" }} > {getStateLabel(item._st)} </p>}
                                    </div>
                                    {open && <>


                                        <div style={{ flexDirection: "row", display: "flex", padding: "5px" }}>
                                            <p style={{ borderRadius: "5px", color: "#fff", backgroundColor: returnStateColor(item._st), padding: "3px", width: "50%", marginRight: "auto" }} > {getStateLabel(item._st)} </p>




                                            <BedtimeIcon onClick={() => { alert(`sleeping: ${item._st}`) }}
                                                sx={{
                                                    marginRight: "auto",
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        color: "#7ff685"
                                                    }
                                                }} />
                                            <RemoveIcon

                                                onClick={() => { alert(`deleting: ${item._n}`) }}
                                                sx={{
                                                    marginRight: "auto",

                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        color: "#7ff685"
                                                    }
                                                }} />

                                        </div>

                                        <TextField
                                            // value={CommandText}
                                            // onChange={HandleCommandChange}
                                            required
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

                                    </>
                                    }
                                </div>


                            </div>


                        </div>


                    ))}

            </div>
        </Box>
    )
}
export default ObjectView;