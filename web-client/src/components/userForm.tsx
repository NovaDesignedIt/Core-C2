
import { List, ListItem, Avatar, AlertColor } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppDispatch, useAppSelector } from '../store/store';
import { SetUsers } from '../store/features/CoreSlice';
import { ManageUser, User } from '../api/apiclient';
import React from 'react';
import { DynamicAlert } from './AlertFeedbackComponent';


const usersComponent = () => {

    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.core.Users)
    const core = useAppSelector(state => state.core.coreObject)
    const [alertType, SetAlertType] = React.useState<AlertColor>('success');
    const [message, setmessage] = React.useState('');
    const [open, SetOpen] = React.useState(false);
    const [selectedUser,SetSelectedUser] = React.useState(-1);
  
    function ToggleAlertComponent(type:AlertColor,msg:string,open:boolean){
      SetAlertType(type);
      setmessage(msg)
      SetOpen(open);
    }

    const handleSelectedUser = (index:number) =>{
        SetSelectedUser(index)
    }


    const HandleInsertUsers = async () => {
        if (true) {
            // const l: User = new Listeners(corid, name, ipaddress, '', 0)
            const result = await ManageUser(core._url, core, { username:"dada",password:"nigga"},true);
            if (result !== undefined && result !== 401) {
                const usrs: User[] = result as unknown as User[]
                dispatch(SetUsers({ users: usrs }))
                ToggleAlertComponent('success','Listener Inserted',true);
            }else {
                ToggleAlertComponent('error','session over',true);
            }
            SetSelectedUser(-1)
        }else{
            alert('provide name and ip address')
        }
    }

    const HandleDeleteUsers = async () => {
        if (true) {
            const result = await ManageUser(core._url, core, {},false)
            if (result !== undefined &&  result !== 401) {
                console.log(result.body)
                const usrs: User[] = result as unknown as User[]
                dispatch(SetUsers({ users: usrs }))
                SetSelectedUser(-1)
                ToggleAlertComponent('success','Listener Deleted',true);
            }else {
                ToggleAlertComponent('error','error',true);
            }
        } else {
            alert('Select Listener first')
        }
    }

    function getRandomBlackOrWhiteColor(): string {
        const randomComponent = () => Math.floor(Math.random() * 156) + 100; // Random value between 100 and 255
        const lightColor = `rgb(${randomComponent()}, ${randomComponent()}, ${randomComponent()})`;
        return lightColor;
      }


return (
<>
<h5 style={{ color: "#fff", cursor: "default" }}>Users</h5>
        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex',
          width: "100%",
          height: "35%",
          padding: "5px",
          flexDirection: 'column',
          backgroundColor: "#111",
      

        }}>
          <div style={{ display: 'flex', flexDirection: 'row', cursor: "default", width: "100%" }}>

            <AddIcon
              onClick={() => { HandleInsertUsers() }}
              sx={{
                marginRight: "auto",
                cursor: "pointer",
                "&:hover": {
                  color: "#7ff685"
                }
              }} />

            <RemoveIcon

              onClick={() => { HandleDeleteUsers() }}
              sx={{
                marginLeft: "auto",
                cursor: "pointer",
                "&:hover": {
                  color: "#7ff685"
                }
              }} />
          </div>
            <div style={{
                overflow: "auto",
                height: "100%",
                width: "calc(100% + 17px)", // Adjust the width to hide the scrollbar
                backgroundColor: "transparent",
            }}>
          <List style={{ paddingRight:"15px"}} >
                {
                    (users !== undefined ? users : []).map((i: User, index: number) => (
                        <ListItem
                            onClick={()=>{
                                handleSelectedUser(index)
                            }}
                            sx={{
                                cursor:"pointer",
                                height: "90%",
                                maxHeight:"60px",
                                backgroundColor: selectedUser === index ? "#555" : "#111", "&:hover": { backgroundColor: "#333" },
                                borderRadius: "55px",
                            }}
                        >
                            {/* <div style={{flexDirection:"row",display:"flex",}}> */}
                            <Avatar sx={{ scale: "0.7", backgroundColor: getRandomBlackOrWhiteColor(), color: "#111", cursor: "pointer", fontSize: "15px" }}>
                                { i._username !== undefined ? i._username.substring(0, 2) : ""} 
                            </Avatar>
                            <div style={{ display: 'flex', flexDirection: 'column', borderCollapse: 'collapse' }}>
                                <p style={{ fontSize: '10px', color: '#fff', overflowWrap: 'break-word', margin: '0' }}>{i._username}</p>
                                <p style={{ fontSize: '9px', color: '#fff', overflowWrap: 'break-word', margin: '0' }}>2024/1/30</p>
                            </div>
                            {/* </div> */}
                        </ListItem>
                    ))}


          </List>
          </div>
          <DynamicAlert open={open} msg={message} type={alertType} closeParent={(e) => { SetOpen(false) }} />

        </div>

</>
);

}

export default usersComponent;