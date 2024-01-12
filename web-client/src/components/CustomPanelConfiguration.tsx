
import {  Stack} from '@mui/material';
import { Core } from '../api/apiclient';
import React from 'react'
import ConfigurationTabs from './ConfigurationTabs';
import ConfigGeneralComp from './ConfigGeneral';
import InstancesConfiguration from './InstancesConfiguration'


interface ConfigurationProp {
  core?: Core;
};


const ConfigPanel: React.FC<ConfigurationProp> = ({ core }) => {
  const [tabselected, SetTabSelected] = React.useState(0);


const handleSelectTab = (index:React.SetStateAction<number>) => {
  SetTabSelected(index);
}

  return (

              <Stack
                component="form"
                direction="column"
                sx={{
                  width: "100%", height: "100%",
                  backgroundColor: "#111",

                }}
                overflow="scroll"
                autoComplete="off"
          >
            <ConfigurationTabs core={core} onSelectTab={handleSelectTab} />

            {tabselected == 0 &&
              <ConfigGeneralComp core={core} />
            }
              {tabselected == 1 &&
              <InstancesConfiguration core={core} />
            }
          </Stack>
 
    
  
  );
}
export default ConfigPanel;