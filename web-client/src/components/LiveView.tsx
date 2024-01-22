import { Core, Instance, Target } from "../api/apiclient";
import { List,Typography,Box  ,ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { io, Socket } from 'socket.io-client';
import * as React from 'react';
import { useAppSelector } from "../store/store";

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

const LiveView  = () => {
    const [LogEvent, SetLogEvents] = React.useState<LiveViewObject[]>()
    const [stateIndex, setindex] = React.useState<number>(0)
    const [eventFocused, setEventFocused] = React.useState(false);

    const core = useAppSelector(state=> state.core.coreObject);
    const url = core._url
    const instance  = useAppSelector(state=>state.core.SelectedInstances)
    const selectedTargets = useAppSelector(state=>state.core.selectedTargets)
    

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
        <Box sx={{ color: '#fff',height:"100%",overflow: 'auto' }}>
                <Box
        sx={{
          backgroundColor: '#111',
          padding: '2%',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '10px',
          position:'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
                <p >live View</p>
            </Box>
            <List sx={{ gap: '5px', padding: '5px', overflow: 'auto' }}>
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
                                            
                                            <ListItemText sx={{ borderRadius:"3px",backgroundColor: item.status === "200" ? "green" : "#FD4A4D",}} >
                                                <Typography
                                                    style={{
                                                        fontFamily: '"Ubuntu Mono", monospace',
                                                        justifyContent:'center',
                                                        display:"flex",
                                                        color: '#fff',        
                                                        padding:"0px",                               
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


