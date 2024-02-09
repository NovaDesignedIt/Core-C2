import { Button, Popover, Stack, Typography, TextField, ClickAwayListener } from '@mui/material';
import React, { useCallback } from 'react';
import { GiConsoleController } from 'react-icons/gi';
import { Handle, Position, Node } from 'reactflow';
import { RiServerFill } from "react-icons/ri";
import { PiComputerTower } from "react-icons/pi";
import { GrDatabase } from "react-icons/gr";
import { LuBox } from "react-icons/lu";
import { RiComputerLine } from "react-icons/ri";
import { themeTextBlack, getStateLabel, returnStateColor } from '../../Utilities/Utilities'
import RemoveIcon from '@mui/icons-material/Remove';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { GoArrowSwitch } from "react-icons/go";
import { useAppSelector } from '../../store/store';
import { Target } from  '../../api/apiclient';


interface NodeProps {
    data: any, isConnectable: boolean
}


const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {

    const [selected, SetIsSelected] = React.useState(false)

    const targetsObjects: Target[] = useAppSelector(state => state.core.targetObjects);

    const onChange = useCallback((evt: { target: { value: any; }; }) => {
        // console.log(evt.target.value);
    }, []);

    const handleSelectedNode = (id: React.SetStateAction<boolean>) => {
        SetIsSelected(id)
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
                                        onMouseLeave={() => { handleClose() }} style={{ padding: "5px", border: "1px solid #333", height: "250px", width: "250px" }}>



                                        {

                                            data["type"] === 'proxy' &&
                                            <div style={{ display: "flex", flexDirection: "column", margin: "auto", width: "100%",height:"100%", alignItems: "center" ,gap:"5px"}}>
                                                <p style={{ margin: "auto" }}> outbound {data['value']._listener_name}</p>
                                                <p style={{ margin: "auto" }}> outbound: instancesName </p>
                                                <GoArrowSwitch fontSize={"30px"} />
                                                <p style={{ margin: "auto" }}> incomming</p>
                                                    <div style={{ paddingTop:"5px",gap: "3px", display: "flex", flexDirection: "column", height: "100%", width: "100%", alignItems: "center", backgroundColor: "#000", overflow: "scroll", borderRadius: "3px", padding: "3px" }}>


                                                        {  targetsObjects.map((item:any, index) => (
                                                            <div style={{ backgroundColor: "#111", width: "98%",minHeight:"30px", padding: "3px" }}>
                                                                <p> {item._n}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                            </div>
                                        }



                                        {
                                            data["type"] === 'instance' &&
                                            <p>{data['value']._instance_name}</p>
                                        }

                                        {
                                            data["type"] === 'mother' &&
                                            <div
                                                onMouseLeave={() => { handleClose() }}
                                                style={{ flexDirection: "column", display: "flex", padding: "5px", gap: "20px" }}>
                                                <p style={{ fontSize: "10px", color: "#777" }}> {data['value']['core']._core_id} </p>

                                                hosted @ : {data['value']['config']._ip_address}

                                                <Button
                                                    onClick={() => { alert('sleeping all') }}
                                                    sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}> sleep</Button>
                                                <Button
                                                    onClick={() => { alert('purge all') }}
                                                    sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}> purge </Button>

                                            </div>
                                        }

                                        {
                                            data["type"] === 'target' &&
                                            <div onMouseLeave={() => { handleClose() }} style={{ flexDirection: "column", display: "flex", height: "100%" }}>
                                                <h6 style={{ color: "#fff" }} >  target Name : {data['value']._n} </h6>


                                                <div style={{ flexDirection: "row", display: "flex", padding: "5px" }}>
                                                    <p style={{ borderRadius: "5px", color: "#fff", backgroundColor: returnStateColor(data['value']._st), padding: "3px", width: "50%", marginRight: "auto" }} > {getStateLabel(data['value']._st)} </p>
                                                    <BedtimeIcon onClick={() => { alert(`sleeping: ${data['value']._n}`) }}
                                                        sx={{
                                                            marginRight: "auto",
                                                            cursor: "pointer",
                                                            "&:hover": {
                                                                color: "#7ff685"
                                                            }
                                                        }} />
                                                    <RemoveIcon

                                                        onClick={() => { alert(`deleting: ${data['value']._n}`) }}
                                                        sx={{
                                                            marginLeft: "auto",
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
