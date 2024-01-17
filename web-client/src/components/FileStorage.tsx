import { Stack } from '@mui/material';
import { Core, File } from '../api/apiclient';
import React from 'react'
import DirStruct from './DirectoryStructure';
import Files from './Files';
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { useAppSelector } from '../store/store';


const StoreComponent = () => {
    const [file, setFile] = React.useState(new File());
    const [sizes, setSizes] = React.useState([50, 50]);
    const onFileSelected = (file: File) => {
        setFile(file)
    }

    
    const CoreC = useAppSelector(state => state.core.coreObject) 


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
                    <Files  file={file}/>
                </div>

                <div style={{ height: "100%" }}>
                    <DirStruct onFileSelected={onFileSelected} />
                </div>
            </Splitter>
        </Stack>

    );
}
export default StoreComponent;