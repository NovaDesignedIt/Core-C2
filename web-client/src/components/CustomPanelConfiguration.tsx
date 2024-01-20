
import { Avatar, Button, Stack } from '@mui/material';
import { Core } from '../api/apiclient';
import * as React from 'react';
import ConfigGeneral from './ConfigGeneral';
import InstancesConfiguration from './InstancesConfiguration'

import { AnySourceImpl } from 'mapbox-gl';
import { Typography } from '@material-ui/core';
import { useAppSelector } from '../store/store';



const ConfigPanel = () => {
  const [tabselected, SetTabSelected] = React.useState(0);

  const configurationObject = useAppSelector(state => state.core.configObject)
  const core = useAppSelector(state => state.core.coreObject) 

  

  return (
    <Typography
      component={'span'}
      variant={'body1'}
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
        <div style={{ flexDirection: "row", display: "flex", height: "5%", padding: "4px" }}>
          <div style={{ marginRight: "auto", flexDirection: "row", display: "flex", gap: "10px", cursor: "pointer" }}>
            <Avatar sx={{ backgroundColor: "#7ff685", color: "#111", cursor: "pointer" }}>
              {core?._user !== undefined ? core?._user.substring(0, 2) : ""}
            </Avatar>
            <p style={{ margin: "auto", }}>
              <h6>
                {core?._user}
              </h6>
            </p>
          </div>
          <p style={{ margin: "auto", cursor: "default" }} >
            <h6>name: {configurationObject?._title} </h6>
          </p>
          <p style={{ margin: "auto", cursor: "default" }}>
            <h6> {configurationObject?._host_name} - {configurationObject?._ip_address}</h6>
          </p>
          <p style={{ marginLeft: "auto", cursor: "default" }}>
            <h6> Core-Instance ID: {core?._core_id}</h6>
          </p>
        
        </div>
        <ConfigGeneral />
      </Stack>
    </Typography>


  );
}
export default ConfigPanel;