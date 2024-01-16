
import { Stack, Alert, Snackbar } from '@mui/material';
import Sidebar from './Sidebar';
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import InstanceContainer from './InstanceContainer';
import Box from '@mui/material/Box';
import MapPanel from './MapPanel';
import react from 'react';
import LoginHome from './LoginHome';
import FileStorage from './FileStorage';
import CustomPanelConfiguration from './CustomPanelConfiguration';
import { Config, Core, CoreC, File as Files, Instance } from '../api/apiclient';
import { useAppDispatch } from '../store/store';


import {BuildStateManagement} from  '../store/features/CoreSlice';














const Frame = () => {

  const [selectedContent, setSelectedContent] = react.useState(-1);
  const [core, setSelectedCore] = react.useState<Core>();
  const [Instance, SetInstance] = react.useState<Instance | undefined>();
  const [selectedTargets, setSelectedtarget] = react.useState<number[]>([0,]);
  const [open, setOpen] = react.useState(false);
  const [objs, setObjs] = react.useState<Instance[]>();
  const [sizes, setSizes] = react.useState([15, 85]);

  const dispatch:any = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleContentSelection = async (index: react.SetStateAction<number>) => {
    //is logged in?
    const result = await fetch(`http://${core !== undefined ? core?._url : ''}/ss/${core !== undefined ? core?._core_id : ''}`, {
      method: 'GET',
      headers: {
        'authtok': core !== undefined ?  core?._sessiontoken : ''
      },
    });

     if (result.status === 401) {
        setSelectedCore(undefined)
        setOpen(true);
        setSelectedContent(-1);
     }else {
      index = core === undefined && (index === 6 || index === 5) ? -1 : index
      setSelectedContent(index);
     }    
  };

  const handleSelectedTargets = (selectedtargs: number[]) => {
    setSelectedtarget(selectedtargs);

    // Perform any update logic in the child component
    const objects = core?._instances;
    const filteredObjects = objects ? objects.filter(g => selectedtargs.includes(g._id)) : []
    //const stri = filteredObjects.length > 0 ? JSON.stringify(filteredObjects, null, 2) : ''
    //console.log(filteredObjects.length);
    setObjs(filteredObjects);

    //console.log(filteredObjects);
    //console.log(filteredObjects.length);
    return true;
  }
  const onSelectInstance = (instance: Instance) => {
    setSelectedContent(3);
    setSelectedtarget([]);
    SetInstance(instance);
  };

  const HandleLogin = (CORE: Core) => {
    //This is where the magic happens\
    const co: CoreC = CORE?._core_c ?? new CoreC();
    const con: Config = CORE?._config ?? new Config();
    const ins: Instance[] = CORE?._instances ?? [];
    const fst: Files[] = CORE?._rootdir?._files ?? [];
    if (CORE !== undefined) {
      dispatch(BuildStateManagement({core:co,config:con,instances:ins,fstore:fst}));
      setSelectedCore(CORE);
    }
  };

  function handleResize(gutterIdx: number, allSizes: number[]) {
    console.log('gutterIdx', gutterIdx);
    console.log('allSizes in %', allSizes);
    setSizes(allSizes);
  }

  return (
    <Box flexDirection="column" width="100%" height="100vh" sx={{ sm: "70vh", }}>
      <Stack direction="row" height="100%" padding={0}
        style={{ backgroundColor: "#000",}}>
        <Splitter direction={SplitDirection.Horizontal}
          onResizeFinished={handleResize}
          initialSizes={sizes}>
          <Stack sx={{ height: "100%", bgcolor: "#172219" }} overflow={"hidden"}>
            <Sidebar onSelectInstance={onSelectInstance} onSelectContent={handleContentSelection} core={core} />
          </Stack>
          <Stack direction="column" height="100%" width="100%" maxWidth={"100"} overflow="hidden" >
            {selectedContent === -1 && <LoginHome
              onSetCore={HandleLogin}/>}
            {selectedContent === 2 && <FileStorage
              core={core}
              url={core !== undefined ? core?._url : ''} />}
            {selectedContent === 3 && 
            <InstanceContainer
              url={core !== undefined ? core?._url : ''}
              objs={objs}
              instance={Instance}
              handleSelectedTargets={handleSelectedTargets}
              core={core} selectedTargets={selectedTargets} />}
            {selectedContent === 4 && <MapPanel
              core={core} />}
            {selectedContent === 5 && <CustomPanelConfiguration
              core={core} url={core !== undefined ? core?._url : ''} />}
            {selectedContent === 6 && <CustomPanelConfiguration
              core={core} url={core !== undefined ? core?._url : ''} />}
          </Stack>
        </Splitter>
      </Stack>
      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="error" sx={{ width: '100%' }}>
          Logged Out
        </Alert >
      </Snackbar>
      <footer style={{ position: "fixed", paddingTop: 0, bottom: 0, width: "100%", minHeight: "10vh", backgroundColor: 'rgb(17,22,19)' }}></footer>
    </Box>
  );
}



export default Frame;








