
import { Alert, Button, Snackbar, TextField, Typography } from '@mui/material';
import { SetStateAction, useState } from 'react';
import { Core, Config, Instance, Root, getRootDirectory, User, CreateCore } from '../api/apiclient';
import CloseIcon from '@mui/icons-material/Close';


export default function LoginHome({ onSetCore = (core: Core, url: string) => { } }) {
    const [password, setPassword] = useState('user');
    const [username, setUsername] = useState('super');
    const [address, setAddress] = useState('192.168.2.196:8000');
    const [color, setColor] = useState('#ffffff');
    const [explode, setExplode] = useState(false);
    const [open, setOpen] = useState(false);
    const [IsCreating, SetIsCreating] = useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const TryLogin = () => {

        const HandleCore = async (corev: any) => {
            const sessiontok: string = corev["_sessiontoken"].toString();
            const corid: string = corev["_core_id"].toString();
            const configuration: Config = corev["_config"];
            const instances: Instance[] = corev["_instances"];
            const title = configuration._title !== undefined ? configuration._title : '_'
            const directoryStructure: Root = await getRootDirectory(address, corid, sessiontok, title);
            console.log("thisis it", directoryStructure)
            const users: User[] = corev["_users"];
            const rdir = directoryStructure !== undefined ? directoryStructure : new Root()
            const current_user = users.find(i => i._username === username);
            const user: string = current_user !== undefined ? current_user._username : "";
            const c = new Core(sessiontok, corid, configuration, instances, rdir, users, user);
            onSetCore(c, address);
        };

        const url = `http://${address}/auth`;
        const payload = { 'value': username + '&' + password }
        // Make the POST request
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type if sending JSON data
                // Add any additional headers as needed
            },
            body: JSON.stringify(payload), // Convert the data to JSON format
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                // Handle the data from the response
                if (data !== 500) {
                    HandleCore(data)
                    handleClick()
                } else {
                    0
                    console.error('invalid login:');
                    console.log('valid?')
                    setColor('#FF5F5F')
                }
            })
            .catch(error => {
                // Handle errors during the fetch
                console.error('Error during POST request:', error);
                setColor('#FF5F5F')
            });
    }
    async function HandleCreateCore() {
        await CreateCore("192.168.2.196:8000", JSON.stringify({ "these": "nuts" }));
        SetIsCreating(false)
    }

    const handleuser = (event: { target: { value: SetStateAction<string>; }; }) => {
        setUsername(event.target.value)
    }

    const handlepwd = (event: { target: { value: SetStateAction<string>; }; }) => {
        setPassword(event.target.value)
    }


    const handlehostname = (event: { target: { value: SetStateAction<string>; }; }) => {
        setAddress(event.target.value)
    }

    const login = () => {
        username !== '' && password !== '' ? TryLogin() : alert(':(')
    }

    const handleEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            login()
        }
    };

    const themebutton = {
        bgcolor: '#00BF3F',
        color: '#fff',
        ":hover": {
            bgcolor: "#00F24F",
        }
    }
    //declare the const and add the material UI style
    const themeText = {

        backgroundColor: "#333",
        "&:Hover,focus": {
            backgroundColor: "#555"
        },
        // OUTLINE
        "& .MuiOutlinedInput-root": {
            ":Hover,focus,selected,fieldset, &:not(:focus)": {
                "& > fieldset": { borderColor: "transparent", borderRadius: 0, },
            },
            "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
            borderColor: "transparent", borderRadius: 0,
        },
        "& .root": { color: "#fff" },
        "& .MuiInputLabel-root": { display: 'none' },
        "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
        input: { color: '#fff' },
        inputProps: {
            style: { fontFamily: 'nunito', },
        },
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
    }
    return (
        <>
            <div style={{
                height: "100vh",
                width: "100%",
                backgroundColor: "#2f4131",
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'

            }}>

                <div id='Login-panel'
                    style={{
                        borderRadius: "2px",
                        backgroundColor: '#628565',
                        height: '40%',
                        width: '40%',
                        borderColor: color,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        minHeight: !IsCreating ? "350px" : "550px" ,
                        boxShadow: '0px 5px 9px rgba(0, 0, 0, 0.7)'
                    }}>

                    <div style={{
                        gap: '5px',
                        padding: 0,
                        minHeight: "40%",
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        color: 'white',
                        width: "90%"
                    }}>
                        {!IsCreating ?
                            <>
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        color: "#fff",
                                        fontSize: 25,
                                        fontWeight: 'medium',
                                        letterSpacing: 0,
                                        width: "100%"
                                    }}
                                >Login to Core
                                </Typography>
                                <div style={{ marginBottom: 10, width: "80%" }}>
                                    <TextField
                                        required
                                        id="hostname filled-required"
                                        placeholder="hostname"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>


                                </div>

                                <div style={{ marginBottom: 10, width: "80%" }}>

                                    <TextField
                                        required
                                        className='usercls'
                                        id="username filled-required"
                                        placeholder="username"
                                        fullWidth={true}
                                        onChange={handleuser}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>

                                </div>
                                <div style={{ marginBottom: 10, width: "80%" }}>

                                    <TextField
                                        required
                                        type='password'
                                        placeholder="password"
                                        className='pwdcls'
                                        fullWidth={true}
                                        onChange={handlepwd}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#111" } }}
                                        size='small'
                                        sx={themeText}></TextField>


                                </div>
                            </>
                            :



                            <>
                                <div style={{ marginBottom: 10, width: "80%", flexDirection: "row", display: "flex" }}>
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                            color: "#fff",
                                            fontSize: 25,
                                            fontWeight: 'medium',
                                            letterSpacing: 0,
                                            width: "100%"
                                        }}
                                    >Creating Core
                                    </Typography>
                                    <CloseIcon sx={{ marginTop: "5px", cursor: "pointer" }} onClick={() => { SetIsCreating(false) }} />
                                </div>

                                <div style={{ marginBottom: 10, width: "80%" }}>
                                    <TextField
                                        required
                                        id="title filled-required"
                                        placeholder="title"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>


                                </div>

                                <div style={{ marginBottom: 10, width: "80%" }}>
                                    <TextField
                                        required
                                        id="hostname filled-required"
                                        placeholder="hostname"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>


                                </div>

                                <div style={{ marginBottom: 10, width: "80%",flexDirection:"row",display:"flex",gap:"3%"}}>
                                    <TextField
                                        required
                                        id="address filled-required"
                                        placeholder="Ip address"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>

                                         <TextField
                                        required
                                        id="port filled-required"
                                        placeholder="port"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>
                                </div>



                                <div style={{ marginBottom: 10, width: "80%" }}>
                                    <TextField
                                        required
                                        id="username filled-required"
                                        placeholder="username"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>
                                </div>

                                <div style={{ marginBottom: 10, width: "80%" }}>
                                    <TextField
                                        required
                                        id="password filled-required"
                                        placeholder="password"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>


                                </div>

                                <div style={{ marginBottom: 10, width: "80%" }}>
                                    <TextField
                                        required
                                        id="confirm password filled-required"
                                        placeholder=" confirm password"
                                        fullWidth={true}
                                        onChange={handlehostname}
                                        InputLabelProps={{ sx: { color: "#777" } }}
                                        inputProps={{ sx: { color: "#fff" } }}
                                        size='small'
                                        sx={themeText}></TextField>


                                </div>


                            </>



                        }
                        <div style={{ marginBottom: 10, width: "80%" }}>
                            {!IsCreating &&
                                <Button
                                    onClick={login}
                                    sx={themebutton}
                                    style={{
                                        width: '100%', marginBottom: 10,
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
                                    }} >
                                    login
                                </Button>
                            }
                            <Button
                                variant="outlined"
                                disableRipple disableFocusRipple
                                onClick={() => { IsCreating && HandleCreateCore() || SetIsCreating(true) }}
                                sx={{
                                    width: "100%", border: "1px solid transparent", color: "#fff",
                                    "&:hover,focus": { border: "1px solid transparent", color: "#00BF3F", backgroundColor: "transparent" }
                                }}
                            >
                                Create Core
                            </Button>

                        </div>
                        <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
                            <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: '100%' }}>
                                Logged In 👍
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </>
    );
}
