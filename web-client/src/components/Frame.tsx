
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
import { LogMetrics,GetMetrics,Config, Core, CoreC, File as Files, Instance, Listeners, User, dumpTargets } from '../api/apiclient';
import { useAppDispatch,useAppSelector } from '../store/store';
import { adjustSizes } from '../Utilities/Utilities'
import { FaGithub } from "react-icons/fa";
import {BuildStateManagement,SetInstanceTargets,SetLogMet} from  '../store/features/CoreSlice';
import  NetworkDiagram from './TopologyPanel/NetworkDiagram'













const Frame = () => {

  const [selectedContent, setSelectedContent] = react.useState(-1);
  const [core, setSelectedCore] = react.useState<Core>();
  const [selectedTargets, setSelectedtarget] = react.useState<number[]>([0,]);
  const [open, setOpen] = react.useState(false);
  const [sizes, setSizes] = react.useState([15, 85]);

  const dispatch:any = useAppDispatch();



  const inst = useAppSelector(state => state.core.instanceObjects)
  const content = useAppSelector(state => state.core.SelectedContent)


  const handleClose = () => {
    setOpen(false);
  };

  // const handleContentSelection = async (index: react.SetStateAction<number>) => {
  //   //is logged in?
  //   const result = await fetch(`http://${core !== undefined ? core?._url : ''}/ss/${core !== undefined ? core?._core_id : ''}`, {
  //     method: 'GET',
  //     headers: {
  //       'authtok': core !== undefined ?  core?._sessiontoken : ''
  //     },
  //   });

  //    if (result.status === 401) {
  //       setSelectedCore(undefined)
  //       setOpen(true);
  //       setSelectedContent(-1);
  //    }else {
  //     index = core === undefined && (index === 6 || index === 5) ? -1 : index
  //     setSelectedContent(index);
  //    }    
  // };



  const HandleLogin = async (CORE: Core) => {
    //This is where the magic happens\
    const co: CoreC = CORE?._core_c ?? new CoreC();
    const con: Config = CORE?._config ?? new Config();
    const ins: Instance[] = CORE?._instances ?? [];
    const fst: Files[] = CORE?._rootdir?._files ?? [];
    const listener: Listeners[] = CORE?._listeners ?? [];
    const usrs: User[] = CORE?._users ?? [];
    const metrics:LogMetrics = await GetMetrics(co._url,co)

    if (CORE !== undefined) {
      //const payload = await dumpTargets(co?._url, co); // Call dumpTargets function with core._url and core
      console.log(metrics)
      dispatch(SetLogMet({logmet:metrics}))
      dispatch(BuildStateManagement({core:co,config:con,instances:ins,fstore:fst,listeners:listener,users:usrs}));
      const payload = await dumpTargets(CORE._url, CORE); // Call dumpTargets function with core._url and core
      dispatch(SetInstanceTargets({targets :payload}))
      setSelectedCore(CORE);
    }
  };

  function handleResize(gutterIdx: number, allSizes: number[]) {
    // console.log('gutterIdx', gutterIdx);
    // console.log('allSizes in %', allSizes);
    const sizxs =  adjustSizes(allSizes,1,80)
    setSizes(sizxs);
  }

 


  return (
    <Box flexDirection="column" width="100%" height="100vh" sx={{ sm: "70vh", }}>
      <Stack direction="row" height="100%" padding={0}
        style={{ backgroundColor: "#000",}}>
        <Splitter direction={SplitDirection.Horizontal}
          onResizeFinished={handleResize}
          initialSizes={sizes}>
          <Stack sx={{ height: "100%", bgcolor: "#010101" }} overflow={"hidden"}>
            <Sidebar/>
          </Stack>
          <Stack direction="column" height="100%" width="100%" maxWidth={"100"} overflow="hidden" >
            {content === -1 && <LoginHome onSetCore={HandleLogin}/>}
            {content === 2 && <FileStorage />}
            {content === 3 && <InstanceContainer/>}
            {content === 4 && <MapPanel/>}
            {content === 5 && <CustomPanelConfiguration />}
            {content === 7 && <NetworkDiagram />}
          </Stack>
        </Splitter>
      </Stack>
      <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="error" sx={{ width: '100%' }}>
          Logged Out
        </Alert >
      </Snackbar>
      <footer style={{ position: "fixed", paddingTop: 0, bottom: 0, width: "100%", minHeight: "6vh", backgroundColor: '#040404' }}>
        <div style={{ gap:"5px",padding:"10px",justifyContent:"center", width: "100%", height: "100%",display:"flex",flexDirection:"row" }}>
          <FaGithub style={{cursor:"pointer" }}/>
          <a style={{color:"#fff"}} target='_blank' href='https://github.com/NovaDesignedIt/Core-C2'>github.com/NovaDesignedIt/CoreC2</a>
        </div>
      </footer>
    </Box>
  );
}



export default Frame;








