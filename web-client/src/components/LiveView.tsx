import { Core, Instance, Target } from "../api/apiclient";
import { List,Typography,Box  ,ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { io, Socket } from 'socket.io-client';
import * as React from 'react';

interface LiveViewProps {
    url:string
    core?:Core;
    instance?:Instance;
    SelectedTargets: number[];
}

interface LiveViewObject {
    isid: string;
    status: string;
    time: string;
    msg: string;
  }
  


let isColorToggle = false;

const generateRandomColor = () => {
  const color = isColorToggle ? "#666" : "#888";
  isColorToggle = !isColorToggle; // Toggle the value for the next call
  return color;
};

const LiveView: React.FC<LiveViewProps> = ({ url, core, instance, SelectedTargets }) => {
    const [LogEvent, SetLogEvents] = React.useState<LiveViewObject[]>()
    const [stateIndex, setindex] = React.useState<number>(0)
    const [eventFocused, setEventFocused] = React.useState(false);

    React.useEffect(() => {
        const socks: Socket = io(`http://${url}/`);
        if (socks !== undefined) {
            if (!eventFocused) {
                socks.on(
                    typeof instance?._instance_id === 'string'
                        ? 's/' + instance?._instance_id : '',
                    (data: string) => {
                        const recv = data !== undefined ? data : 'undefined'
                        //const outtext = inputValue !== undefined ? inputValue :'' 
                        const logobj = JSON.parse(data);
                        if (LogEvent !== undefined) {
                            if (LogEvent.length > 30) {
                                LogEvent.pop();
                            }
                            setindex(stateIndex + 1)
                            SetLogEvents([logobj, ...LogEvent]);
                        } else {
                            SetLogEvents([logobj]);
                        }
                        // Update your React component state or perform any other action
                    });
            }
        }


        return () => {

            socks?.disconnect();
        }

    }, [LogEvent, SetLogEvents,eventFocused]);


    return (
        <Box sx={{ color: '#fff',height:"80%" }}>
            <Box sx={{
                width: '100%',
                flexDirection: 'row',
                backgroundColor: '#111',
                padding: '2%',
                JustifyContent: "center",
                display: 'flex',
                flexWrap: 'nowrap',
         
                fontSize: "10px"
            }}>
                <p >live View</p>
            </Box>

            <List sx={{ gap: '5px',padding:"5px" }} >
                {

                    (LogEvent !== undefined ? LogEvent.reverse() : []).map((item: LiveViewObject, index: number) =>
                    (
                        (
                            <ListItem
                                onClick={()=>{setEventFocused(!eventFocused)}}
                                key={index}
                                sx={{
                                    ":Hover": { opacity: '0.8' },cursor:'pointer',
                                    borderRadius: '4px',marginBottom:'2px',height:"10%",maxHeight:"10%",  backgroundColor: '#222', gap: '1px',justifyContent:"Left"
                                }}>
                                <div style={{  flexDirection: 'column', display: 'flex',width:"100%",alignContent:'center' }}>
                                    <div style={{ flexDirection: 'column', display: 'flex',width:"100%", alignContent:'center' }}>
                                        <div style={{ flexDirection: 'row', display: 'flex',width:"100%" ,gap: '6px' }}>
                                            
                                            <ListItemText >
                                                <Typography
                                                    style={{
                                                        fontFamily: '"Ubuntu Mono", monospace',
                                                        justifyContent:'center',
                                                        backgroundColor: item.status === "200" ? "green" : "#FD4A4D",
                                                        color: '#fff',
                                                        width:"30%",
                                                        padding:'3%',
                                                        borderRadius:"5px",
                                                        fontSize: '10px',
                                                    }}>
                                                    {item.status}
                                                </Typography>
                                            </ListItemText>

                                            <ListItemText style={{ color: '#fff' }}>
                                                <Typography
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '7px',
                                                        marginLeft:'40%',
                                                    }}>
                                                    {item.isid}
                                                </Typography>
                                            </ListItemText>
                                        </div>

                                    <ListItemText style={{ color: '#fff',justifyContent:'center',width:'100%' }}>
                                        <Typography
                                            style={{
                                                fontFamily: '"Ubuntu Mono", monospace',
                                                color: '#fff',
                                                fontSize: '10px',
                                            }}>
                                            {item.msg}
                                        </Typography>
                                    </ListItemText>

                                    </div>
                                <div style={{ flexDirection: 'row', display: 'flex' }}>
                             
                                    <ListItemText style={{ color: '#fff' }}>
                                        <Typography
                                            style={{
                                                fontFamily: '"Ubuntu Mono", monospace',
                                                color: '#fff',
                                                fontSize: '10px',
                                            }}>
                                            {item.time}
                                        </Typography>
                                    </ListItemText>
                                  
                                </div>
                                </div>
                            </ListItem>

                        )
                    ))}
            </List>
        </Box>
    )
}
export default LiveView;



 //Conditional Rendering 


//  { SelectedTargets.includes(item._id) ? 
                        
//     (
//         <ListItem 
//         key={item._id}
//         sx={{
//             ":Hover": { opacity: '0.8' },
//             borderRadius: '4px', marginBottom: '1%', backgroundColor: '#222', gap: '1px'
//         }}>
//             <ListItemIcon >
//                 <CircleIcon sx={{ fontSize: '10px', color:     
//                                   item._st === -1 ? "#999" :
//                                   item._st === 0 ? "Tasking" :
//                                   item._st === 1 ? "yellow" :
//                                   item._st === 2 ? "dead" :
//                                   item._st === 3 ? '#21fd0a' : 
//                                   item._st === 4 ? "Scripting" :
//                                   "Unknowned"
//                , width: '10px' }} />
//             </ListItemIcon>
//             <div style={{ flexDirection: 'column', display: 'flex', }}>
//                 <ListItemText style={{ color: '#fff' }}>
//                     <Typography
//                         style={{
//                             color: '#fff',
//                             fontSize: '9px',
//                         }}>
//                         {item._n}
//                     </Typography>
//                 </ListItemText>
//             </div>
//         </ListItem>
//     ) 
    
//     : (<></>)}