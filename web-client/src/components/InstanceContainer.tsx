import Splitter, { SplitDirection } from '@devbookhq/splitter'
import Gridview from './Gridview';
import BoxMenu from './BoxMenu';
import Shell from './Shell';
import React from 'react';
import InsertForm from './InsertForm'
import { Stack } from '@mui/material';
import { Core, Instance } from '../api/apiclient';
import { Visibility } from '@mui/icons-material';


interface InstanceContainerProps {
    url: string;
    objs: any;
    instance?: Instance;
    handleSelectedTargets: (param: number[]) => boolean;
    selectedTargets: any;
    core?: Core; // Include the 'core' prop with the optional (?) modifier
}


const InstanceContainer: React.FC<InstanceContainerProps> = ({ url, objs, instance, handleSelectedTargets, core, selectedTargets }) => {

    const [sizes, setSizes] = React.useState([85, 15]);
    const [sizes2, setSizes2] = React.useState([80, 20]);
    const [action,setSelectedAction] = React.useState(0);

    function handleResize(gutterIdx: number, allSizes: number[]) {
        //console.log('gutterIdx', gutterIdx);
        //console.log('allSizes in %', allSizes);
        setSizes(allSizes);
    }

    function handleResize2(gutterIdx: number, allSizes: number[]) {
        //console.log('gutterIdx', gutterIdx);
        console.log('allSizes in %', allSizes);
        setSizes2(allSizes);
    }


    const GetSelectedAction = (index:number) =>{
        action === index ?  setSelectedAction(0) : setSelectedAction(index);
    }


    return (
        <>
            <div style={{ backgroundColor: "#000", width: "100%", overflow: "hidden", height: "100%", }}>
               
               
                <Splitter direction={SplitDirection.Horizontal}
                    onResizeFinished={handleResize}
                    initialSizes={sizes}>

                    <Splitter direction={SplitDirection.Vertical}
                        onResizeFinished={handleResize2}
                        initialSizes={sizes2}
                        >


                        <Stack
                            component="form"
                            direction="column"
                            sx={{
                                width: "100%", height: "100%",
                                '& .MuiTextField-root': { m: 1 },
                            }}
                            overflow="hidden"
                            autoComplete="off"
                        >

                          
                            <Gridview url={url} core={core} instance={instance} getselectedtargs={handleSelectedTargets} getAction={GetSelectedAction}></Gridview>
                            {action === 1 &&
                                <div style={{ visibility: action === 1 ? 'visible' : 'hidden', height: "50%", width: "100%" }}>
                                    <InsertForm url={url} core={core} instance={instance}></InsertForm>
                                </div>

                            }
                        </Stack>

                        <Stack
                            component="form"
                        direction="column"
                        sx={{
                            width: "100%", height: "100%",
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            backgroundColor: "#000",
                            ":hover": { opacity: "0.9" },
                            ":focus": { backgroundColor: "darkred" },
                            ":selection": { backgroundColor: "#000" },
                            ":active": { backgroundColor: "#000" },
                        }}
                        overflow="scroll"
                        autoComplete="off"
                    >
                        <Shell core={core} instance={instance} url={url} selectedTargets={selectedTargets} />
                    </Stack>
                      
                    </Splitter>


                    <Stack
                            component="form"
                            direction="column"
                            sx={{
                                width: "100%", height: "100%",
                                backgroundColor: "#000",
                            }}
                            overflow="scroll"
                            autoComplete="off"
                        >
                            <BoxMenu url={url} objs={objs} instance={instance} selectedTargets={selectedTargets} core={core} ></BoxMenu>
                        </Stack>

                   

                </Splitter>



            </div>
        </>
    );

}

export default InstanceContainer;

