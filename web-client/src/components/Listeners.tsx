import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { useAppSelector } from "../store/store";
import { Listeners } from "../api/apiclient";
import { useState } from "react";

const listners = [1,2,6,1,1,1,1,1,1,1] 

interface ListenerProp {
    HandleSelectedInstance:(id:number)=>void;
}

const ListenersComponent:React.FC<ListenerProp> = ({HandleSelectedInstance}) => {

    const listeners = useAppSelector(state => state.core.listenerObjects);
    const [selected,setSelected] = useState(0)

    const HandleSelectedListener = (index:number,id:number)=>{
        setSelected(index)
        HandleSelectedInstance(id)
    }

    return (
     
        <Box sx={{ padding: '1%',borderRadius: 1, cursor:"pointer",boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', backgroundColor: "#000", width: '100%', height: '100%' }} >
            <List style={{padding:"10px",flexDirection:"column",display:"flex",gap:"10px",overflow:"scroll",maxHeight:"100%"}}>      
                {
                 listeners.map((lis:Listeners,index:number) => (
                    <ListItem 
                    key={index}
                    onClick={()=>{HandleSelectedListener(index,lis._id)}}
                    sx={{
                        
                        height: '30px',
                        borderRadius: '6px',
                        backgroundColor: '#222',
                        width:"100%",
                        ":hover": { opacity: '0.8' },
                        ":active, :focus": { backgroundColor: '#111' },
                        border: selected === index ? "1px solid #fff": ''
                    }}
                >
                        <ListItemIcon>
                            <CircleIcon sx={{ fontSize: '10px', color: lis._last_ping === '' ? '#777' : '#21fd0a' }} />
                        </ListItemIcon>
                        <ListItemText sx={{ color: '#fff' }}>
                                <Typography
                                    style={{
                                        fontFamily: '"Ubuntu Mono", monospace',
                                        justifyContent: 'center',
                                        display: "flex",
                                        color: '#fff',
                                        fontSize: '14px',
                                        maxWidth:"50px",
                                        minWidth:"50px"
                                    }}>
                                    {lis._listener_name}
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
                                        maxWidth:"50px",
                                        minWidth:"50px"
                                    }}>
                                      {lis._ipaddress}
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
                                        maxWidth:"50px",
                                        marginLeft:"auto",
                                        minWidth:"50px"
                                    }}>
                                     {lis._last_ping}
                                </Typography>
                        </ListItemText>
                    </ListItem>
                ))
                }

   
            </List>

        </Box>
 
    );
}
export default ListenersComponent;