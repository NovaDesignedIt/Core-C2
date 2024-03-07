import { Button, Popover, Stack, Typography, TextField, ClickAwayListener } from '@mui/material';
import React, { useCallback } from 'react';
import { GiConsoleController } from 'react-icons/gi';
import { Handle, Position, Node } from 'reactflow';
import { RiServerFill } from "react-icons/ri";
import { PiComputerTower } from "react-icons/pi";
import { GrDatabase } from "react-icons/gr";
import { LuBox } from "react-icons/lu";
import { RiComputerLine } from "react-icons/ri";
import { themeTextBlack, getStateLabel, returnStateColor,themeText } from '../../Utilities/Utilities'
import RemoveIcon from '@mui/icons-material/Remove';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { GoArrowSwitch } from "react-icons/go";
import { useAppSelector } from '../../store/store';
import { Target } from '../../api/apiclient';
import { Directions } from '@mui/icons-material';
import { IoTrashOutline } from "react-icons/io5";
import { SetCommand } from '../../api/apiclient';
import Shell from '../Shell';
import LabelWithValue from '../../CustomUIComponents/LabelWValue';

interface NodeProps {
    data: any, isConnectable: boolean
}


const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {

    const [selected, SetIsSelected] = React.useState(false)
    const [Command, SetCommandText] = React.useState('');
    const targetsObjects: Target[] = useAppSelector(state => state.core.targetObjects);

    const onChange = useCallback((evt: { target: { value: any; }; }) => {
        // console.log(evt.target.value);
    }, []);

    const handleSelectedNode = (id: React.SetStateAction<boolean>) => {
        SetIsSelected(id)
    }

    const handleCommandChange = (cmd: string) => {
        SetCommandText(cmd);

    }

    const HandleObjectEnter = (item: Target, cmd: string) => {
        const targ = item as Target;
        // SetCommand(url, core, item,
        //     targ,
        //     cmd);
        alert('disabled from topology view')
        SetCommandText('')
        return true
    }
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        SetIsSelected(false)
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    return (
        <div
        >
            <Typography
                component={'span'}
                variant={'body1'}
                style={{
                    fontFamily: '"Ubuntu Mono", monospace',
                    justifyContent: 'center',
                    display: "flex",
                    color: '#fff',

                    fontSize: '15px',
                }}>


                {data['type'] === 'mother' &&

                    <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
                }

                {
                    data['type'] === 'proxy' &&

                    <>
                        <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
                        <Handle
                            type="target"
                            position={Position.Left}
                            isConnectable={isConnectable}
                        />
                    </>
                }

                {
                    data['type'] === 'instance' &&

                    <>
                        <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
                        <Handle
                            type="target"
                            position={Position.Left}
                            isConnectable={isConnectable}
                        />
                    </>
                }


                {
                    data['type'] === 'target' &&
                    <Handle
                        type="target"
                        position={Position.Left}
                        isConnectable={isConnectable}
                    />
                }

                <div

                    onDoubleClick={(e) => { handleSelectedNode(true); handleClick(e); }}
                    onMouseLeave={(e) => { handleSelectedNode(false); }}
                    style={{
                        height: "100%",
                        width: "100%",
                        border: "1px solid transparent",
                        borderRadius: "5px",
                        background: selected ? "#111" : '#111',
                        backgroundColor: "transparent"

                    }}>
                    <ClickAwayListener onClickAway={handleClose}>

                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}

                        >



                            <Stack sx={{ background: "#222" }}
                            >
                                <Typography
                                    component={'span'}
                                    variant={'body1'}
                                    style={{
                                        fontFamily: '"Ubuntu Mono", monospace',
                                        justifyContent: 'center',
                                        display: "flex",
                                        color: '#fff',
                                        fontSize: '15px',
                                        margin: "auto"
                                    }}>

                                    <div
                                        onMouseLeave={() => { handleClose() }} style={{ padding: "5px", border: "1px solid #333",  }}>



                                        {

                                            data["type"] === 'proxy' &&
                                            <div style={{ display: "flex", flexDirection: "column", margin: "auto", width: "100%", height: "300px", alignItems: "center", gap: "5px" }}>
                                                <p style={{ margin: "auto", cursor: "pointer" }}> outbound {data['value']._listener_name}</p>
                                                <p style={{ margin: "auto", cursor: "pointer" }}> outbound: instancesName </p>
                                                <GoArrowSwitch fontSize={"30px"} />
                                                <p style={{ margin: "auto" }}> incomming</p>
                                                <div style={{  border:"1px solid #333",gap: "3px", display: "flex", flexDirection: "column", height: "100%", width: "100%", alignItems: "center", backgroundColor: "#000", overflow: "auto", borderRadius: "3px", padding: "3px" }}>


                                                    { Array.isArray(targetsObjects) && targetsObjects.filter(x => x._ip.toString() === data["value"]._id.toString()).map((item: any, index:number) => (
                                                        <Stack

                                                            onClick={() => alert()}
                                                            sx={{
                                                                ":Hover":
                                                                    { backgroundColor: "#555", border: "1px solid white" },
                                                                border: "1px solid #333",
                                                                cursor: "pointer",
                                                                backgroundColor: "#111",
                                                                width: "100%",
                                                                minHeight: "30px",
                                                                padding: "3px",
                                                                borderRadius: "5px",
                                                                flexDirection: 'row',
                                                                display: "flex"
                                                            }}

                                                        >
                                                            <p style={{ width: "100%" }}> {item._n}</p>
                                                            <p style={{ borderRadius: "5px", color: "#fff", backgroundColor: returnStateColor(item._st), width: "50%", padding: "3px", height: "100%", margin: "auto", marginLeft: "auto" }} > {getStateLabel(item._st)} </p>

                                                        </Stack>
                                                    ))}
                                                </div>
                                            </div>
                                        }



                                        {
                                            data["type"] === 'instance' &&
                                            <div onMouseLeave={() => { handleClose() }} style={{ flexDirection: "column", display: "flex", height: "100%" }}>
                                                <LabelWithValue label="instance id:" value={data['value']._instance_id} fontSize="15px" />

                                                <div
                                                    onMouseLeave={() => { handleClose() }}
                                                    style={{ flexDirection: "column", display: "flex", padding: "1px", gap: "5px", width: "100%", height: "100%" }}>
                                                    <LabelWithValue label="name:" value={data['value']._instance_name} fontSize="15px" />
                                                    <LabelWithValue label="hosted:" value={data['value']._instance_url} fontSize="15px" />

                                                    <div style={{ flexDirection: "row", display: "flex" }}>
                                                            <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>sleep</Button>
                                                            <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>interval</Button>
                                                            <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>repoint</Button>
                                                            <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>migrate</Button>
                                                            <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>Drop</Button>
                                                            <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>script</Button>
                                                        </div>
                                                    <p style={{ margin: "0", cursor: "pointer",color:"#555"}}>  </p>
                                                    <TextField
                                                        required

                                                        id="portcc filled-required"
                                                        placeholder="Sleep"
                                                        fullWidth={true}

                                                        InputLabelProps={{ sx: { color: "#777" } }}
                                                        inputProps={{ sx: { color: "#fff" } }}
                                                        size='small'
                                                        sx={{
                                                            ...themeText,
                                                            border: "1px solid #111",
                                                            input: {
                                                                //color: titlecc === '' ? 'pink' : '#fff',
                                                                color: '#fff',
                                                            }
                                                        }}></TextField>
                                                         <Button disableFocusRipple disableTouchRipple disableRipple
                                                                sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "5px", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>Drop file</Button>

                                                </div>
                                            </div>
                                        }

                                        {
                                            data["type"] === 'mother' &&
                                            <div
                                                onMouseLeave={() => { handleClose() }}
                                                style={{ flexDirection: "column", display: "flex", padding: "1px", gap: "5px", width: "300px", height: "300px" }}>
                                                <p style={{ fontSize: "10px", color: "#999", margin: "0" }}> {data['value']['core']._core_id} </p>
                                                <LabelWithValue label="hosted:" value={data['value']['config']._ip_address} fontSize="15px" />

                                                <div style={{ flexDirection: "row", display: "flex" }}>
                                                    <Button disableFocusRipple disableTouchRipple disableRipple
                                                        sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>sleep</Button>

                                                    <Button disableFocusRipple disableTouchRipple disableRipple
                                                        sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>interval</Button>

                                                    <Button disableFocusRipple disableTouchRipple disableRipple
                                                        sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#444", borderRadius: "0", border: "1px solid #555", height: "100%", width: "100%", color: "#fff", fontSize: "10px" }}>Drop</Button>
                                                 
                                                </div>
                                                <p style={{ fontSize: "10px", color: "#999", margin: "0" }}>for example: core, help() </p>
                                                <div style={{ height: "100%", overflow:"auto" }}>
                                                    <Shell />
                                                </div>
                                            </div>
                                        }

                                        {
                                            data["type"] === 'target' &&
                                            <div onMouseLeave={() => { handleClose() }} style={{ flexDirection: "column", display: "flex", height: "100%" ,minWidth:"200px",width:"100%"}}>

                                                <LabelWithValue label="name:" value={data['value']._n} fontSize="15px" />

                                                <div style={{ flexDirection: "row", display: "flex", padding: "5px" }}>
                                                    <p style={{ borderRadius: "5px", color: "#fff", backgroundColor: returnStateColor(data['value']._st), padding: "3px", width: "50%", marginRight: "0" }} > {getStateLabel(data['value']._st)} </p>
                                                    {(data['value']._st.toString() !== "2" && data['value']._st.toString() !== "1") &&
                                                        <BedtimeIcon onClick={() => { alert(`sleeping: ${data['value']._n}`) }}
                                                            sx={{
                                                                width: "40px",
                                                                marginLeft: "auto",
                                                                margin: "0",
                                                                cursor: "pointer",
                                                                "&:hover": {
                                                                    color: "#7ff685"
                                                                },
                                                                fontSize: 17,
                                                            }} />
                                                    }

                                                    <IoTrashOutline style={{
                                                        cursor: "pointer",
                                                        margin: "0", width: "20px"
                                                    }} />


                                                </div>
                                                {data['value']._st.toString() === "1" &&
                                                    <p style={{ opacity: "0.5", margin: "0" }}>
                                                        Will Execute on wake.
                                                    </p>
                                                }


                                                {data['value']._st.toString() !== "2" &&
                                                    <TextField
                                                        // value={CommandText}
                                                        onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() === undefined && HandleObjectEnter(data['value'], Command) }}
                                                        onChange={(e) => { handleCommandChange(e.target.value) }}
                                                        value={Command}
                                                        required
                                                        maxRows={5}
                                                        multiline={true}
                                                        size='small'
                                                        spellCheck={false}  // Disable spell checking
                                                        autoComplete='off'
                                                        autoCorrect='off'
                                                        autoCapitalize='off'
                                                        placeholder="cmd>"
                                                        InputLabelProps={{ sx: { color: "#ddd", fontSize: '5px' } }}
                                                        inputProps={{ sx: { color: "#ddd", fontFamily: 'Ubuntu Mono, monospace' } }}
                                                        sx={{ ...themeTextBlack, maxWidth: "100%", height: "50%", borderRadius: "5px", overflow: "hidden" }}
                                                    >
                                                    </TextField>

                                                }

                                            </div>
                                        }
                                    </div>
                                </Typography>





                            </Stack>

                        </Popover>
                    </ClickAwayListener>

                    {data["type"] === 'proxy' && <RiServerFill fontSize={45} style={{ color: "#fff", margin: "0" }} />}
                    {data["type"] === 'target' && <RiComputerLine fontSize={45} style={{ color: returnStateColor(data['value']._st), backgroundColor: "transparent", margin: "0" }} />}
                    {data["type"] === 'mother' && <GrDatabase fontSize={45} style={{ color: selected ? "#DDD" : "#999", margin: "0" }} />}
                    {data["type"] === 'instance' && <LuBox fontSize={45} style={{ color: selected ? "#DDD" : "#999", margin: "0" }} />}

                    <div>
                        {data["type"] === 'instance' &&
                            <p style={{ color: "#fff", fontSize: "8px", backgroundColor: "#111" }}>  {data['value']._instance_name}</p>
                        }

                        {data["type"] === 'mother' &&
                            <p style={{ color: "#fff", fontSize: "8px", backgroundColor: "#111" }}>  {data['value']['config']._host_name}</p>
                        }

                        {data["type"] === 'target' &&
                            <p style={{ color: "#fff", fontSize: "8px", backgroundColor: "#111" }}>  {data['value']._n}</p>
                        }

                        {data["type"] === 'proxy' &&
                            <p style={{ color: "#fff", fontSize: "8px", backgroundColor: "#111" }}>  {data['value']._listener_name}</p>
                        }
                    </div>
                </div>


                {/* 7ff685 */}
            </Typography>
        </div>
    );
}

export default CustomNode;
