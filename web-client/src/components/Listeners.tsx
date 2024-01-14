import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

const listners = [1,2,6,1,1,1,1,1,1,1] 

export default function ListenersComponent() {

    return (
     
        <Box sx={{ padding: '1%',borderRadius: 1, cursor:"pointer",boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)', backgroundColor: "#000", width: '100%', height: '100%' }} >
            <List style={{padding:"10px",flexDirection:"column",display:"flex",gap:"10px",overflow:"scroll",maxHeight:"100%"}}>      
                {
                listners.map((index:number) => (
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
                                <Typography
                                    style={{
                                        fontFamily: '"Ubuntu Mono", monospace',
                                        justifyContent: 'center',
                                        display: "flex",
                                        color: '#fff',
                                        fontSize: '14px',
                                    }}>
                                    LISTENER-1
                                </Typography>
                            </Typography>

                        </ListItemText>
                        <ListItemText >
                            <Typography
                                style={{
                                    color: '#fff',
                                    fontSize: '10px'
                                }}
                            >
                                <Typography
                                    style={{
                                        fontFamily: '"Ubuntu Mono", monospace',
                                        justifyContent: 'center',
                                        display: "flex",
                                        color: '#fff',
                                        fontSize: '10px',
                                    }}>
                                    online : 2023/12/27 16:20:11
                                </Typography>
                            </Typography>
                        </ListItemText>






                    </ListItem>
                ))
                }

   
            </List>

        </Box>
 
    );
}