import { Stack } from '@mui/material';
import { Core, File } from '../api/apiclient';
import React from 'react'
import DirStruct from './DirectoryStructure';
import Files from './Files';
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { adjustSizes } from '../Utilities/Utilities';


const StoreComponent = () => {
    const [file, setFile] = React.useState(new File());
    const [sizes, setSizes] = React.useState([50, 50]);

    const onFileSelected = (file: File) => {
        setFile(file)
    }


    function handleResize(gutterIdx: number, allSizes: number[]) {
        const adjustedSizes = adjustSizes(allSizes, 30, 30);
        setSizes(adjustedSizes);
    }

    return (
        <Splitter direction={SplitDirection.Vertical}
            onResizeFinished={handleResize}
            initialSizes={sizes}
        >
            <Stack
                component="form"
                direction="column"
                sx={{
                    width: "100%", height: "100%",
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    backgroundColor: "#111",
                }}
           
                autoComplete="off"
            >

                <Files file={file} />
            </Stack>
            <Stack
                component="form"
                direction="column"
                sx={{
                    width: "100%", height: "100%",
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    backgroundColor: "#111",
                }}
    
                autoComplete="off"
            >
                <DirStruct onFileSelected={onFileSelected} />

            </Stack>
        </Splitter>

    );
}
export default StoreComponent;