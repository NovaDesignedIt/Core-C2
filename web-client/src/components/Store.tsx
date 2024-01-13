import { Stack } from '@mui/material';
import { Core, File } from '../api/apiclient';
import React from 'react'
import DirStruct from './DirectoryStructure';
import Files from './Files';
import Splitter, { SplitDirection } from '@devbookhq/splitter'


interface ConfigurationProp {
    core?: Core;
    url: string;
};

const StoreComponent: React.FC<ConfigurationProp> = ({ core, url }) => {
    const [file, setFile] = React.useState(new File());
    const [sizes, setSizes] = React.useState([50, 50]);
    const onFileSelected = (file: File) => {
        setFile(file)
    }


    function handleResize(gutterIdx: number, allSizes: number[]) {
        //console.log('gutterIdx', gutterIdx);
        //console.log('allSizes in %', allSizes);
        setSizes(allSizes);
    }

    return (

        <Stack
            component="form"
            direction="column"
            sx={{
                width: "100%", height: "100vh",
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                backgroundColor: "#111",
            }}
            spacing={1}
            autoComplete="off"
        >
            <Splitter direction={SplitDirection.Vertical}
                onResizeFinished={handleResize}
                initialSizes={sizes}
            >
                <div style={{ height: "100%" }}>
                    <Files core={core} file={file} url={url} />
                </div>

                <div style={{ height: "100%" }}>
                    <DirStruct core={core} onFileSelected={onFileSelected} url={url} />
                </div>
            </Splitter>
        </Stack>

    );
}
export default StoreComponent;