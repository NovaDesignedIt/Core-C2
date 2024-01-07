import { AppBar, styled, Stack, Toolbar, Typography, Alert, Snackbar } from '@mui/material';
import Sidebar from './Sidebar';
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import InstanceContainer from './InstanceContainer';
import Box from '@mui/material/Box';
import MapPanel from './MapPanel';
import react from 'react';
import LoginHome from './LoginHome';
import Store from './Store';
import CustomPanelConfiguration from './CustomPanelConfiguration';
import { Core, Instance } from '../api/apiclient';

      


const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between"
})



const Frame = () => {

  const [selectedContent, setSelectedContent] = react.useState(-1);
  const [core, setSelectedCore] = react.useState<Core>();
  const [Instance, SetInstance] = react.useState<Instance | undefined>();
  const [selectedTargets, setSelectedtarget] = react.useState<number[]>([0,]);
  const [open, setOpen] = react.useState(false);
  const [objs, setObjs] = react.useState<Instance[]>();
  const [sizes, setSizes] = react.useState([15, 85]);
  const [url, setUrl] = react.useState('');


  const handleContentSelection = (index: react.SetStateAction<number>) => {
    // Handle the selected content based on the label
    index = core === undefined && (index === 6 || index === 5) ? -1 : index
    setSelectedContent(index);

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
    // Handle the selected content based ont he label
    console.log(instance);
    setSelectedContent(3);
    setSelectedtarget([]);
    SetInstance(instance);
  };

  const HandleLogin = (CORE: Core, url: string) => {
    if (CORE !== undefined) {
      setUrl(url);
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
          <Stack direction="column" height="90%" width="100%" maxWidth={"100"} overflow="hidden" >
            {selectedContent === -1 && <LoginHome
              onSetCore={HandleLogin}
            />}
            {selectedContent === 2 && <Store
              core={core}
              url={url} />}
            {selectedContent === 3 && 
            <InstanceContainer
              url={url}
              objs={objs}
              instance={Instance}
              handleSelectedTargets={handleSelectedTargets}
              core={core} selectedTargets={selectedTargets} />}
            {selectedContent === 4 && <MapPanel
              core={core} />}
            {selectedContent === 5 && <CustomPanelConfiguration
              core={core} />}
            {selectedContent === 6 && <CustomPanelConfiguration
              core={core} />}
          </Stack>


        </Splitter>
      </Stack>

      <footer style={{ position: "fixed", paddingTop: 0, bottom: 0, width: "100%", minHeight: "10vh", backgroundColor: 'rgb(17,22,19)' }}></footer>
    </Box>
  );
}



export default Frame;








