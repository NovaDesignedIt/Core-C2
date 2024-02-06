import Splitter, { SplitDirection } from '@devbookhq/splitter'
import Gridview from './Gridview';
import BoxMenu from './BoxMenu';
import Shell from './Shell';
import React from 'react';
import InsertForm from './InsertForm'
import { Box, Modal, Stack, fabClasses } from '@mui/material';
import { Core, Instance } from '../api/apiclient';
import { Visibility } from '@mui/icons-material';
import { useAppSelector } from '../store/store';
import { adjustSizes } from '../Utilities/Utilities';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };




//{ url, objs, instance, handleSelectedTargets, core, selectedTargets }

const InstanceContainer = () => {

    const [sizes, setSizes] = React.useState([85, 15]);
    const [sizes2, setSizes2] = React.useState([80, 20]);
    const [action,setSelectedAction] = React.useState(0);

  

    function handleResize(gutterIdx: number, allSizes: number[]) {
        //console.log('gutterIdx', gutterIdx);
        //console.log('allSizes in %', allSizes);
        const adjustedSizes = adjustSizes(allSizes, 70, 3);
        setSizes(adjustedSizes);
    }

    function handleResize2(gutterIdx: number, allSizes: number[]) {
        //console.log('gutterIdx', gutterIdx);
        console.log('allSizes in %', allSizes);
        const adjustedSizes = adjustSizes(allSizes, 30, 15);
        setSizes2(adjustedSizes);
    }



    const GetSelectedAction = (index:number) =>{
        action === index ?  setSelectedAction(0) : setSelectedAction(index);
    }

    const CloseInsertPanel = () =>  {
        setSelectedAction(0);
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

                          
                            {action !== 1 &&
                             <Gridview GetAction={GetSelectedAction}></Gridview>
                            }

                            {action === 1 &&
                                <InsertForm closePanel={CloseInsertPanel}></InsertForm>
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
                        <Shell />
                    </Stack>
                      
                    </Splitter>


                    <Stack
                            component="form"
                            direction="column"
                            sx={{
                                width: "100%", height: "100vh",
                                backgroundColor: "#000",
                            }}
                            overflow="scroll"
                            autoComplete="off"
                        >
                            <BoxMenu  ></BoxMenu>
                        </Stack>

                   

                </Splitter>



            </div>
        </>
    );

}

export default InstanceContainer;

