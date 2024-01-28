import { Button, Popover, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { GiConsoleController } from 'react-icons/gi';
import { Handle, Position, Node } from 'reactflow';
import { RiServerFill } from "react-icons/ri";
import { PiComputerTower } from "react-icons/pi";
import { GrDatabase } from "react-icons/gr";
interface NodeProps {
    data: any, isConnectable: boolean
}

const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {

    const [selected, SetIsSelected] = React.useState(false)

    const onChange = useCallback((evt: { target: { value: any; }; }) => {
        console.log(evt.target.value);
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
                

                 {   data['type'] === 'mother' &&
                    
                    
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
                     data['type'] === 'target' && 
                        <Handle
                            type="target"
                            position={Position.Left}
                            isConnectable={isConnectable}
                        />
                }  
             
                <div
                    onClick={handleClick}
                    onMouseEnter={(e) => { handleSelectedNode(true) }}
                    onMouseLeave={() => { handleSelectedNode(false) }}
                    style={{
                        height: "50px",
                        width: "50px",
                        border: "1px solid transparent",
                        borderRadius: "5px",
                        background: selected ? "#111" : '#111',

                    }}>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        hideBackdrop={false}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >

                        <Stack sx={{ background: "#222" }}
                            onMouseLeave={() => { handleClose() }}>
                                <div style={{ padding:"10px",border: "1px dotted #444",height:"250px",width:"250px"}}>
                                <p style={{ color: "#fff", fontSize: "12px" }}>  Type: {data['type']} name :{data['id']}</p>
                            </div>
                        </Stack>
                     
                        </Popover>
                    {data["type"] === 'proxy' && <RiServerFill fontSize={45} style={{ color: "#fff" }} />}
                    {data["type"] === 'target' && <PiComputerTower fontSize={45} style={{ color: selected ? "#DDD" : "#999" }} />}
                    {data["type"] === 'mother' && <GrDatabase fontSize={45} style={{ color: selected ? "#DDD" : "#999" }} />}
                    <div>
                        <p style={{ color: "#fff", fontSize: "12px",backgroundColor:"#111" }}>target:192.168.2.196</p>
                        <p style={{ color: "#fff", fontSize: "8px",backgroundColor:"#111"}}>last ping:10s</p>
                    </div>
                </div>
                {/* 7ff685 */}
            </Typography>
        </div>
    );
}

export default CustomNode;
