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


interface LogProp {
    id:string;
    instanceid:string;
    Action:string;
    logtime:string;
    status:string;
}
let isColorToggle = false;

const generateRandomColor = () => {
  const color = isColorToggle ? "#666" : "#888";
  isColorToggle = !isColorToggle; // Toggle the value for the next call
  return color;
};

const LiveView:React.FC<LiveViewProps> = ({url,core,instance,SelectedTargets}) => {
    const [LogEvent,SetLogEvents] = React.useState<LogProp[] | any[]>()
    const [stateIndex,setindex] = React.useState<number>(0)


    React.useEffect(()=>{
        const socks:Socket = io(`http://${url}/`);
        if (socks !== undefined) {
          socks.on(
            typeof instance?._instance_id === 'string'
              ? 's/'+instance?._instance_id : '',
            (data: string) => {
              console.log(data)
              const recv = data !== undefined ? data  : 'undefined'
              //const outtext = inputValue !== undefined ? inputValue :'' 
                if (LogEvent !== undefined) {
                    if(LogEvent.length > 30){
                        LogEvent.pop();
                    }
                    setindex(stateIndex+1)
                    SetLogEvents([recv,... LogEvent]);
                }else{
                    SetLogEvents([recv]);
                }
                // Update your React component state or perform any other action
            });
        }


        return () => {
     
            socks?.disconnect();
        }

    },[LogEvent,SetLogEvents] );


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

                    (LogEvent !== undefined ? LogEvent.reverse() : []).map((item: any, index: number) =>
                    (
                        (
                            <ListItem
                                key={item._id}
                                sx={{
                                    ":Hover": { opacity: '0.8' },
                                    borderRadius: '4px',marginBottom:'2px',  backgroundColor: '#222', gap: '1px',justifyContent:"center"
                                }}>
                                <div style={{ flexDirection: 'column', display: 'flex', }}>
                                    <ListItemText style={{ color: '#fff' }}>
                                        <Typography
                                            style={{
                                                color: '#fff',
                                                fontSize: '10px',
                                            }}>
                                            {item}
                                        </Typography>
                                    </ListItemText>
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