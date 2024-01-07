import { Core, Instance, Target } from "../api/apiclient";
import { List,Typography,Box  ,ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

interface ObjectViewProps {
    core?:Core;
    instance?:Instance;
    SelectedTargets: number[];
}

const ObjectView:React.FC<ObjectViewProps> = ({core,instance,SelectedTargets}) => {


    return (
      <Box sx={{ color: '#fff' }}> 
      <Box sx={{
       width: '100%',
       flexDirection: 'row',
       backgroundColor: '#111',
       padding: '2%',
       JustifyContent:"center",
       display: 'flex',
       flexWrap: 'nowrap',
       fontSize:"10px"
     }}>
       <p >Object View</p> 
     </Box>
  
      <List sx={{ gap: '10px' }} >
                {
                    
                    (instance !== undefined ? instance._targets : []).map((item: any) =>
                    (
                        <>
                        { SelectedTargets.includes(item._id) ? (
                            <ListItem 
                            key={item._id}
                            sx={{
                                ":Hover": { opacity: '0.8' },
                                borderRadius: '4px', marginBottom: '1%', backgroundColor: '#222', gap: '1px'
                            }}>
                                <ListItemIcon >
                                    <CircleIcon sx={{ fontSize: '10px', color:     
                                                      item._st === -1 ? "#999" :
                                                      item._st === 0 ? "Tasking" :
                                                      item._st === 1 ? "yellow" :
                                                      item._st === 2 ? "dead" :
                                                      item._st === 3 ? '#21fd0a' : 
                                                      item._st === 4 ? "Scripting" :
                                                      "Unknowned"
                                   , width: '10px' }} />
                                </ListItemIcon>
                                <div style={{ flexDirection: 'column', display: 'flex', }}>
                                    <ListItemText style={{ color: '#fff' }}>
                                        <Typography
                                            style={{
                                                color: '#fff',
                                                fontSize: '9px',
                                            }}>
                                            {item._n}
                                        </Typography>
                                    </ListItemText>
                                    <div style={{ gap: '10px', flexDirection: 'row', display: 'flex', }}>
                                        <ListItemText style={{ color: '#fff' }}>
                                            <Typography
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '10px',

                                                }}
                                            >
                                                    {
                                                      item._st === -1 ? "await" :
                                                      item._st === 0 ? "Tasking" :
                                                      item._st === 1 ? "sleep" :
                                                      item._st === 2 ? "dead" :
                                                      item._st === 3 ? "Listen" : 
                                                      item._st === 4 ? "Scripting" :
                                                      "Unknowned"
                                                    }
                         
                                                </Typography>
                                            </ListItemText>
                                            <ListItemText >
                                                <Typography
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '8px'
                                                }}
                                            >
                                                 {item._lp}
                                            </Typography>
                                        </ListItemText>
                                    </div>
                                </div>
                            </ListItem>
                        ) : (<></>)}
                    </>
                    ))}







      </List>
      </Box>
    )
  }
 export default ObjectView;