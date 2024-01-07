import { Stack } from '@mui/material';
import { Core,File } from '../api/apiclient';
import React from 'react'
import DirStruct from './DirectoryStructure';
import Files from './Files';

interface ConfigurationProp {
    core?: Core;
    url:string;
};

const StoreComponent: React.FC<ConfigurationProp> = ({ core,url }) => {
   
    const [file, setFile] = React.useState(new File());

    const onFileSelected = (file:File) =>{
        setFile(file)
    }

    return (

                <Stack
                    component="form"
                    direction="row"
                    sx={{
                        width: "100%", height: "100vh",
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        backgroundColor: "#000",
                    }}
                    spacing={1}
                    autoComplete="off"
                >
                    <Stack
                        component="form"
                        direction="column"
                        sx={{
                            width: "20%", height: "100%",
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            backgroundColor: "#202c22",
                        }}
                        overflow="scroll"
                        autoComplete="off"
                    >
                        <DirStruct core={core} onFileSelected={onFileSelected} url={url} />
                    </Stack>
                    <Stack
                        component="form"
                        direction="column"
                        sx={{
                            width: "100%", height: "100%",
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            backgroundColor: "#5E8061",
                        }}
                        overflow="scroll"
                        autoComplete="off">
                        <Files core={core} file={file} url={url} />
                    </Stack>
                </Stack>
       
    );
}
export default StoreComponent;