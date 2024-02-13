
import { List, ListItem, Avatar, AlertColor, TextField, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAppDispatch, useAppSelector } from '../store/store';
import { SetUsers } from '../store/features/CoreSlice';
import { ManageUser, User } from '../api/apiclient';
import React from 'react';
import { DynamicAlert } from './AlertFeedbackComponent';
import { FaRegSquareCaretLeft } from 'react-icons/fa6';
import { ClickAwayListener } from '@material-ui/core';


interface newUser {
    username: string;
    password: string;
    confirm: string;

}

const usersComponent = () => {

    const dispatch = useAppDispatch();
    const users: User[] = useAppSelector(state => state.core.Users)
    const core = useAppSelector(state => state.core.coreObject)
    const [UserList, SetUserList] = React.useState<User[]>(users ?? [])
    const [alertType, SetAlertType] = React.useState<AlertColor>('success');
    const [message, setmessage] = React.useState('');
    const [open, SetOpen] = React.useState(false);
    const [selectedUser, SetSelectedUser] = React.useState<User>();
    const [insertRow, SetInsertRow] = React.useState(false);
    const [NewUser, SetNewUser] = React.useState<newUser>({
        username: "",
        password: "",
        confirm: ""
    });

    const HandleUsernameChange = (event: any) => {
        SetNewUser(prevState => ({
            ...prevState,
            username: event.target.value
        }));
    }
    const HandlePasswordChange = (event: any) => {
        SetNewUser(prevState => ({
            ...prevState,
            password: event.target.value
        }));
    }
    const HandleConfirmChange = (event: any) => {
        SetNewUser(prevState => ({
            ...prevState,
            confirm: event.target.value
        }));
    }

    function ToggleAlertComponent(type: AlertColor, msg: string, open: boolean) {
        SetAlertType(type);
        setmessage(msg)
        SetOpen(open);
    }

    const handleSelectedUser = (user: User) => {
        SetSelectedUser(user)
    }

    const HandleInsertUser = () => {
        if (NewUser.password !== '' && NewUser.username !== '' && NewUser.confirm !== '' && (NewUser.password === NewUser.confirm)) {
            console.log('good to add')
            HandleManageUserOperations(true);
            SetInsertRow(false);
        } else {
            console.log('No Can do ')
        }
    }

    const HandleManageUserOperations = async (operation: boolean) => {
        if (true) {
            const Payload = !operation ? selectedUser !== undefined ? { _hash_id: selectedUser._hash_id } : undefined : NewUser !== undefined ? NewUser : undefined
            if (Payload === undefined) {
                operation ? alert('enter username/password') : alert('you have no user selected');
                return
            }
            console.log(Payload)
            const result: any = await ManageUser(core._url, core, Payload, operation);
            if (result !== undefined) {
                if (typeof result !== 'number' && Array.isArray(result)) {
                    const usrs: User[] = result as unknown as User[]
                    dispatch(SetUsers({ users: usrs }))
                    ToggleAlertComponent('success', 'user Inserted', true);
                    SetUserList(usrs)
                } else if (result === 403) {
                    ToggleAlertComponent('error', 'user already exists', true);
                } else if (result === 401) {
                    ToggleAlertComponent('error', 'session over', true);
                } else {
                    ToggleAlertComponent('error', 'error', true);
                }
                SetSelectedUser(undefined)
            } else {
                alert('provide name and ip address')
            }
        }
    }

    const themeText = {
        backgroundColor: "#333",
        "&:Hover,focus": {
            backgroundColor: "#555"
        },
        "& .MuiOutlinedInput-root": {
            ":Hover,focus,selected,fieldset, &:not(:focus)": {
                "& > fieldset": { borderColor: "transparent", borderRadius: 0, },

            },
            "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
            borderColor: "transparent", borderRadius: 0,
        },
        "& .root": { color: "#fff" },
        "& .MuiInputLabel-root": { color: '#fff' },
        "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
        input: { color: '#fff' },
        inputProps: {
            style: { fontFamily: 'nunito', },
        },
        boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.7)',
    }

    return (


        <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex',
            width: "100%",
            height: "100%",
            padding: "5px",
            flexDirection: 'column',
            backgroundColor: "#111",


        }}>
      
            <div style={{ display: 'flex', flexDirection: 'row', cursor: "default", width: "100%" }}>
                {/* HandleManageUserOperations(true) */}
                <AddIcon
                    onClick={() => { insertRow ? SetInsertRow(false) : SetInsertRow(true) }}
                    sx={{
                        marginRight: "auto",
                        cursor: "pointer",
                        "&:hover": {
                            color: "#7ff685"
                        }
                    }} />
                {UserList.length > 1 &&
                    <RemoveIcon

                        onClick={() => { HandleManageUserOperations(false) }}
                        sx={{
                            marginLeft: "auto",
                            cursor: "pointer",
                            "&:hover": {
                                color: "#7ff685"
                            }
                        }} />
                }                </div>
            <div style={{
                overflow: "auto",
                height: "100%",
                width: "calc(100% + 17px)", // Adjust the width to hide the scrollbar
                backgroundColor: "transparent",
            }}>
                <List style={{ paddingRight: "15px" }} >
                    {
                        insertRow &&
                        <Stack spacing={'10px'} sx={{ flexDirection: "column", width: "100%", padding: "5px" }}>
                            <h5 style={{ color: "#fff", cursor: "default" }}>new user</h5>
                            <TextField
                                fullWidth={true}
                                InputLabelProps={{ sx: { color: "#fff" } }}

                                inputProps={{ sx: { color: "#fff" } }}
                                size='small'
                                placeholder='username'
                                onChange={(e) => { HandleUsernameChange(e) }}
                                sx={{ ...themeText, width: "100%", borderRadius: "5px" }} ></TextField>
                            <TextField
                                fullWidth={true}
                                InputLabelProps={{ sx: { color: "#fff" } }}
                                inputProps={{ sx: { color: "#fff" } }}
                                size='small'
                                placeholder='password'
                                onChange={(e) => { HandlePasswordChange(e) }}
                                type={'password'}
                                sx={{ ...themeText, width: "100%", borderRadius: "5px" }} ></TextField>
                            <TextField
                                fullWidth={true}
                                InputLabelProps={{ sx: { color: "#fff" } }}
                                inputProps={{ sx: { color: "#fff" } }}
                                size='small'
                                placeholder='confirm'
                                onChange={(e) => { HandleConfirmChange(e) }}
                                type={'password'}
                                sx={{ ...themeText, width: "100%", borderRadius: "5px" }} ></TextField>
                            <Button
                                onClick={() => { HandleInsertUser() }}
                                sx={{ backgroundColor: "#000", color: "#fff", height: "100%", }}>{insertRow ? "Save" : "Insert"}  </Button>
                        </Stack>
                    }

                    {
                        UserList.map((i: User, index: number) => (
                            <ListItem
                                onClick={() => {
                                    handleSelectedUser(i)
                                }}
                                sx={{
                                    gap: "5%",
                                    cursor: "pointer",
                                    height: "90%",
                                    maxHeight: "60px",
                                    backgroundColor: i === selectedUser ? "#555" : "#111", "&:hover": { backgroundColor: "#333" },
                                    border: i === selectedUser ? "1px solid #fff": "",
                                    borderRadius: "5px",
                                }}
                            >
                                {/* <div style={{flexDirection:"row",display:"flex",}}> */}
                                <Avatar sx={{ scale: "0.7", backgroundColor: "#AAA", color: "#111", cursor: "pointer", fontSize: "15px" }}>
                                    {i._username !== undefined ? i._username.substring(0, 2) : ""}
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


    );

}

export default usersComponent;