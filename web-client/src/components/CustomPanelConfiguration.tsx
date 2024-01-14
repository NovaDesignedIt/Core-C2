
import { Avatar, Button, Stack } from '@mui/material';
import { Core } from '../api/apiclient';
import * as React from 'react';
import ConfigGeneralComp from './ConfigGeneral';
import InstancesConfiguration from './InstancesConfiguration'
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { AnySourceImpl } from 'mapbox-gl';
import { Typography } from '@material-ui/core';

interface ConfigurationProp {
  core?: Core;
};

const ConfigPanel: React.FC<ConfigurationProp> = ({ core }) => {
  const [tabselected, SetTabSelected] = React.useState(0);


  const handleSelectTab = (index: React.SetStateAction<number>) => {
    SetTabSelected(index);
  }

  return (
    <Typography
    style={{
      fontFamily: '"Ubuntu Mono", monospace',
      justifyContent: 'center',
      display: "flex",
      color: '#fff',
      fontSize: '15px',
    }}>
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
        <div style={{ flexDirection: "row", display: "flex", height: "5%",padding:"4px" }}>
          <div style={{ marginRight: "auto", flexDirection: "row", display: "flex", gap: "10px",cursor:"pointer" }}>
            <Avatar sx={{ backgroundColor: "#7ff685",color:"#111", cursor: "pointer" }}>
              {core?._user !== undefined ? core?._user.substring(0, 2) : ""}
            </Avatar>
            <p style={{ margin: "auto" ,}}>
              <h6>
                {core?._user}
              </h6>
            </p>
          </div>
          <p style={{ margin: "auto",cursor:"default"  }} >
            <h6>name: {core?._config?._title} </h6>
          </p>
          <p style={{ margin: "auto",cursor:"default"  }}>
            <h6> {core?._config?._host_name} - {core?._config?._ip_address}</h6>
          </p>
          <p style={{ margin: "auto",cursor:"pointer"  }}>
            <h6> Instance ID: {core?._core_id}</h6>
          </p>
          <div style={{ marginLeft: "auto",cursor:"pointer"}}
            onClick={() => { alert('syncing core'); }}
          >
            <p >
              <h6>  save
                <CloudSyncIcon />
              </h6>
            </p>
          </div>
        </div>

      {tabselected == 0 &&
        <ConfigGeneralComp core={core} />
      }
      {tabselected == 1 &&
        <InstancesConfiguration core={core} />
      }
      
    </Stack>
    </Typography>


  );
}
export default ConfigPanel;