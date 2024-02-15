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
        <div style={{height:"100%", padding:"1%",flexDirection:"row",display:"flex",gap:"1%"}}>
               <DirStruct onFileSelected={onFileSelected} />
            <Files file={file} />
         
        </div>      
    );
}
export default StoreComponent;