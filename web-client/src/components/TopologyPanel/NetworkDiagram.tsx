
import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Position, useNodesState, useEdgesState, addEdge, Connection, Edge, OnConnect, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './customNodes';
import { Button, Typography, ButtonGroup, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, Divider, Stack, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CoreC, Instance, Listeners, Config, Target, dumpTargets } from '../../api/apiclient';
import { generateRandomNumber, getStateLabel, returnStateColor } from '../../Utilities/Utilities'
import { InsertEmoticon } from '@mui/icons-material';
import { Socket, io } from 'socket.io-client';
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { randomInt } from 'crypto';
const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};
const nodeStyle = {

  border: "none",
  fontSize: "10px",
  color: "#fff",
  height: "30px",
  width: "30px"

}

const labelStyle = {

  margin: "auto",
  color: "#fff",
  cursor: "pointer",


}

interface coordinates {

  x: number;
  y: number;

}

const threadTypes: string[] = ["curve", "straight", "step"];


const nodeTypes: NodeTypes = {

  custom: CustomNode

};

const networkDiagram = () => {

  const componentRef = useRef<HTMLDivElement>(null); // Create a ref for the component
  // console.log(componentRef)


  const [SelectedNode, setSelectedNode] = useState(-1);
  const [targets, setTargets] = useState<Node[]>([]);
  const [SettingsEdit, setSettingsEdit] = useState(false);

  const dispatch: any = useAppDispatch();
  const instances: Instance[] = useAppSelector(state => state.core.instanceObjects);
  const core: CoreC = useAppSelector(state => state.core.coreObject);
  const config: Config = useAppSelector(state => state.core.configObject);
  const listener: Listeners[] = useAppSelector(state => state.core.listenerObjects);
  const targetsObjects: Target[] = useAppSelector(state => state.core.targetObjects);


  const HandleSettingsEditting = (e: any) => {

    setSettingsEdit(!SettingsEdit)


  }

  let Count: number = 0


  const fullheight: number = window.screen.availHeight / 2

  const mothernode: Node = { id: `${Count}`, type: 'custom', position: { x: 30, y: 300 }, data: { id: '0', value: { core: core, config: config }, type: "mother" } }

  Count = Count + 1

  const proxyNodes: Node[] = listener.map((item: Listeners, index: number) => (
    { id: `${Count + index}`, type: 'custom', position: { x: index % 2 === 0 ? 500 : 1000, y: 100 + 300 * index }, data: { id: index, value: item, type: "proxy" } }
  ));



  Count = Count + proxyNodes.length

  function returnpi(i: number, length: number) {
    return (2 * Math.PI * 2 * i) / length;
  }

  function return_coor(centerX: number, centerY: number, radius: number, angle: number, index: number) {
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y }
  }


  const instancenodes: Node[] = instances.map((item: Instance, index: number) => (
    { id: `${Count + index}`, type: 'custom', position: { x: 200, y: 200 + index * 200 }, data: { id: index, value: item, type: "instance" } }

  ));


  Count = Count + instancenodes.length




  const EgdesInstancesToMotherShip: Edge[] = instancenodes.map((item: Node, index: number) => (
    { id: `e0-${item.id}`, type: "straight", source: '0', target: item.id }
  ));


  const EdgesProxyToinstances = (instancenodes !== undefined ? instancenodes : []).reduce((result: any[], node: Node) => {
    const proxyId = node.data.value._proxy
    const proxy = proxyNodes.find(x => x.data.value._id === proxyId)
    if (proxyId && proxy) {
      result.push({ id: `e${node.id} - ${proxy.id}`, type: "straight", source: node.id, target: proxy.id })
    }
    return result;
  }, []);



  const handleSelectedNode = (e: any) => {
    const id = e.currentTarget.getAttribute('data-id')
    if (id !== undefined) {
      //console.log(id)
      setSelectedNode(parseInt(id));
    }
  }


  const initialEdges: Edge[] = [
    ...EgdesInstancesToMotherShip,
    ...EdgesProxyToinstances,


  ];
  const initialNodes: Node[] = [
    mothernode,

  ];




  const alltargets: any = targetsObjects;

  const groupedPayload: any[] = (alltargets !== undefined ? alltargets : []).reduce((groups: any[], item: any) => {
    const isid = item._isid;
    if (!groups[isid]) {
      groups[isid] = [];
    }
    groups[isid].push(item);
    return groups;
  }, {});


  const tempnodes: Node[] = []
  const tempedges: Edge[] = []

  Object.values(groupedPayload).forEach((group: any[], i: number) => {

    const x = proxyNodes?.find(x => x.data.value._id === instances.find(x => x._instance_id === group.find(x => x)._isid)?._proxy)?.position.x;
    const y = proxyNodes?.find(x => x.data.value._id === instances.find(x => x._instance_id === group.find(x => x)._isid)?._proxy)?.position.y;

    const xrelative = x !== undefined ? x : 0
    const yrelative = y !== undefined ? y : 0

    const newNodes: Node[] = group.map((targ: any, index: number) => (
      {
        id: `${Count + index}`,
        type: 'custom',
        //position: {x: 500+index *100 , y: index < 5 ? 500-index*100 :  300+-(index % 5)*100 } ,
        position: return_coor(
          xrelative,
          yrelative,
          100 + generateRandomNumber(),
          returnpi(index, alltargets.length),
          index),
        data: { id: Count + index, value: targ, type: 'target' }
      }));

    //* index % 4 === 0 ? 1: -1  generateRandomNumber() * 100 ,

    tempnodes.push(...newNodes)
    Count = Count + newNodes.length

    const EdgesTargetsToProxy: Edge[] = (newNodes !== undefined ? newNodes : []).reduce((result: any[], node: Node) => {
      const targetproxyid = node.data.value._ip
      const proxy: any = proxyNodes.find(x => `${x.data.value._id}` === targetproxyid)

      //console.log(proxyNodes,targetproxyid)
      if (proxy && targetproxyid) {
        result.push({ id: `e${proxy.id} - ${node.id}`, type: "straight", source: proxy.id, target: node.id })
      }
      return result;
    }, []);
    tempedges.push(...EdgesTargetsToProxy)
  });

  //console.log(targets)
  const allnodes: Node[] = [...initialNodes, ...proxyNodes, ...instancenodes, ...tempnodes]

  const [nodes, setNodes] = useState<Node[]>(allnodes);
  const [edges, setEdges] = useState<Edge[]>([...initialEdges, ...tempedges]);

  const [edgeTypes, setEdgesTypes] = useState('straight')
  //(changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
  const onNodesChange: OnNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes, setSelectedNode],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const handleKeyDown = (e: any) => {

    if (e.key === 'h') {
      alert('help me :)')
    }
  }

  const [selectedObjects, SetSelectedObjects] = React.useState<number[]>([]);
  const [selectedListeners, SetSelectedListeners] = React.useState<number>(-1);

  const handleItemClick = (id: number) => {
    SetSelectedObjects(self => self.includes(id) ? self.filter(x => x !== id) : [...self, id])

  }

  const HandleListenerClick = (id: number) => {
    SetSelectedListeners(id)

  }


  const getNextThreadType = (currentType: string): string => {
    const currentIndex = threadTypes.indexOf(currentType);
    const nextIndex = (currentIndex + 1) % threadTypes.length;
    return threadTypes[nextIndex];
  };

  const HandleSetConfig = (type: string) => {
    const new_edges: Edge[] = edges.map((item: Edge, index: number) => {
      item.type = type
      return item;
    });
    setEdges(new_edges);
  };





  return (

    <div

      style={{ backgroundColor: "#000", width: '100%', height: '90%', padding: "5px", flexDirection: "column", display: "flex", gap: "10px" }}>
      <Typography
        component={'span'}
        variant={'body1'}
        style={{
          width: "100%",
          fontFamily: '"Ubuntu Mono", monospace',
          justifyContent: 'center',
          display: "flex",
          color: '#555',
          fontSize: '10px',
          margin: "auto"
        }}>

        <div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
          <h6 style={labelStyle}>Topology View </h6>
          <h6 style={labelStyle}>core ID: {core._core_id}</h6>
          <h6 style={labelStyle}>instance count: {instances.length}</h6>
          <h6 style={labelStyle}>proxy/listener count: {listener.length}</h6>
          <h6 style={labelStyle}>target count: {targetsObjects.length}</h6>
          <h6 style={{ ...labelStyle, color: SettingsEdit ? "#7ff685" : "#fff" }}
            onClick={(e) => HandleSettingsEditting(e)}>Settings</h6>
        </div>

      </Typography>

      {
         SettingsEdit &&
       // true &&

        <div style={{
          border: "1px solid #333",
          borderRadius: "4px",
          display: 'flex-end',
          width: "100%",
          height: "35%",
          padding: "10px",
          gap: "10px",
          flexDirection: 'column',
          backgroundColor: "#111",

        }}>
          <div style={{ flexDirection: "row", display: "flex", borderRadius: "10px", width: "100%", height: "100%", gap: "10px", backgroundColor: "transparent" }}>
              <div style={{ flexDirection: "row", display: "flex", borderRadius: "10px", width: "100%", height: "50%", gap: "10px", backgroundColor: "transparent", margin: "0" }}>
                <div style={{ width: "30%", height: "100%" }}>
                  <p style={{ margin: "0", color: "#999", fontSize: "12px" }}>Edge Connections:</p>
                  <FormControl sx={{ height: "100%" }}>

                    <RadioGroup
                      onChange={(e) => { HandleSetConfig(e.target.value) }}
                      defaultValue="female"
                      aria-labelledby="demo-customized-radios"
                      name="customized-radios"
                    >
                      <FormControlLabel value="straight" control={<Radio sx={{

                        fontFamily: '"Ubuntu Mono", monospace',
                        color: "#fff",
                        '&.Mui-checked': {
                          color: "#fff",
                        }
                      }} />} label="straight" />
                      <FormControlLabel value="step" control={<Radio sx={{
                        color: "#fff",
                        '&.Mui-checked': {
                          color: "#fff",
                        },
                      }} />} label="step" />
                      <FormControlLabel value="curl" control={<Radio sx={{
                        color: "#fff",
                        '&.Mui-checked': {
                          color: "#fff",
                        },
                      }} />} label="curl" />

                    </RadioGroup>
                  </FormControl>

                </div>
                <div style={{ width: "30%", height: "100%" }}>
                  <p style={{ margin: "0", color: "#999", fontSize: "12px" }}>Display Format (disabled)</p>

                  <FormControl sx={{ height: "50%" }}>

                    <RadioGroup
                      row={true}
                      onChange={(e) => { }}
                      defaultValue="female"
                      aria-labelledby="demo-customized-radios"
                      name="customized-radios"
                    >
                      <FormControlLabel value="Explosion" control={<Radio checked={true} sx={{
                        fontFamily: '"Ubuntu Mono", monospace',
                        color: "#fff",
                        '&.Mui-checked': {
                          color: "#fff",
                        }
                      }} />} label="Explosion" />
                      <FormControlLabel value="Pyramid" control={<Radio checked={false} sx={{
                        color: "#fff",
                        '&.Mui-checked': {
                          color: "#fff",
                        },
                      }} />} label="Pyramid" />
                      <FormControlLabel value="row" control={<Radio checked={false} sx={{
                        color: "#fff",
                        '&.Mui-checked': {
                          color: "#fff",
                        },
                      }} />} label="row" />

                    </RadioGroup>
                  </FormControl>






                </div>
                <div style={{ width: "30%", height: "100%" }}>
                  <p style={{ margin: "0", color: "#999", fontSize: "12px" }}>Display Nodes: (disabled)</p>


                  <div style={{ display: "flex", width: "100%", justifyContent: 'space-between', margin: "0" }}>
                    <p style={{ margin: "0" }}>Home server</p>
                    <Checkbox checked={true} sx={{
                      color: "#fff",
                      '&.Mui-checked': {
                        color: '#555',
                      }
                    }} />
                  </div>
                  <div style={{ width: "100%", display: "flex", justifyContent: 'space-between', margin: "0" }}>
                    <p style={{ margin: "0" }}> Instances</p>
                    <Checkbox checked={true} sx={{
                      color: "#fff",
                      '&.Mui-checked': {
                        color: '#555',
                      }
                    }} />
                  </div>
                  <div style={{ display: "flex", width: "100%", justifyContent: 'space-between', margin: "0" }}>
                    <p style={{ margin: "0" }}> Proxy</p>
                    <Checkbox checked={true} sx={{
                      color: "#fff",
                      '&.Mui-checked': {
                        color: '#555',
                      }
                    }} />
                  </div>
                  <div style={{ display: "flex", width: "100%", justifyContent: 'space-between', margin: "0" }}>
                    <p style={{ margin: "0" }}> Target</p>
                    <Checkbox checked={true} sx={{
                      color: "#fff",
                      '&.Mui-checked': {
                        color: '#555',
                      }
                    }} />
                  </div>




                </div>
              </div>
            <Divider orientation='vertical' variant="fullWidth" sx={{ backgroundColor: "#fff", height: "100%" }} flexItem />
            <div style={{ flexDirection: "column", display: "flex", width: "100%", padding: "5px" }}>
              <div style={{ flexDirection: "row", display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
                <div style={{ flexDirection: "column", display: "flex", overflow: "hidden", borderRadius: "4px", width: "50%", border: "1px solid #333" }}>


                  <div style={{ borderRadius: "0px", backgroundColor: "#000", flexDirection: "row", display: "flex", height: "10%", width: "100%" }}>
                    <Button disableTouchRipple disableRipple disableFocusRipple style={{ width: "100%", height: "100%", color: "#fff" }}> Targets </Button>
                    <Button disableTouchRipple disableRipple disableFocusRipple style={{ width: "100%", height: "100%", color: "#fff" }}> Filter</Button>
                  </div>

                  <div style={{ paddingTop: "10px", gap: "3px", display: "flex", flexDirection: "column", height: "100%", width: "100%", alignItems: "center", backgroundColor: "#000", overflow: "auto", borderRadius: "4px", padding: "5px" }}>

                    {targetsObjects.map((item: Target, index) => (
                      <Stack

                        onClick={() => { handleItemClick(item._id) }}
                        sx={{
                          border: selectedObjects.includes(item._id) ? "1px solid white" : "1px solid #333",
                          backgroundColor: selectedObjects.includes(item._id) ? "#555" : "#111",

                          ":Hover":
                            { backgroundColor: "#555", border: "1px solid white" },
                          cursor: "pointer",
                          width: "98%",
                          minHeight: "30px",
                          padding: "3px",
                          borderRadius: "5px",
                          flexDirection: 'row',
                          display: "flex"

                        }}

                      >
                        <p style={{ width: "25%", fontSize: "10px", color: "#999" }}> name:</p>
                        <p style={{ width: "100%" }}> {item._n}</p>

                        <Chip label={getStateLabel(item._st)[0]} sx={{ borderRadius: "15px", color: "#fff", backgroundColor: returnStateColor(item._st), width: "15%", padding: "5px", height: "100%" }} />

                      </Stack>
                    ))}

                  </div>


                </div>

                <div style={{ width: "50%", height: "100%", padding: "1%", gap: "5px", flexDirection: "column", display: "flex" }}>
                  <div style={{ flexDirection: "row", display: "flex" }}>
                    <p style={{ width: "50%", fontSize: "10px", color: "#999", margin: "auto" }}> targets Selected:</p>
                    <p style={{ width: "60%", margin: "auto" }}> {selectedObjects.length}</p>
                  </div>

                  <div style={{ flexDirection: "row", display: "flex", height: "100%", width: "100%", overflow: "auto" }}>
                    <div style={{ flexDirection: "column", display: "flex", height: "100%", width: "60%", gap: "5%", padding: "5px" }}>
                      <Button disableFocusRipple disableTouchRipple disableRipple
                        onClick={() => { SetSelectedObjects([]) }}
                        sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#222", border: "1px solid #555", height: "10%", width: "100%", color: "#fff", fontSize: "10px" }}>clear </Button>

                      <Button disableFocusRipple disableTouchRipple disableRipple
                        sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#222", border: "1px solid #555", height: "10%", width: "100%", color: "#fff", fontSize: "10px" }}>repoint</Button>

                      <Button disableFocusRipple disableTouchRipple disableRipple
                        sx={{ ":hover": { backgroundColor: "#333" }, backgroundColor: "#222", border: "1px solid #555", height: "10%", width: "100%", color: "#fff", fontSize: "10px" }}>migrate</Button>
                    </div>

                    <div style={{ border: "1px solid #333", borderRadius: "5px", gap: "5px", flexDirection: "column", display: "flex", height: "100%", width: "100%", backgroundColor: "#000", padding: "5px", overflow: "auto" }}>
                      {listener.map((item: Listeners, index: number) => (
                        <Stack
                          onClick={() => { HandleListenerClick(item._id) }}
                          sx={{
                            border: selectedListeners === item._id ? "1px solid white" : "1px solid #333",
                            backgroundColor: selectedListeners === item._id ? "#555" : "#111",
                            ":Hover":
                              { backgroundColor: "#555", border: "1px solid white" },
                            cursor: "pointer",
                            width: "98%",
                            minHeight: "30px",
                            maxHeight: "50px",
                            padding: "3px",
                            borderRadius: "5px",
                            flexDirection: 'column',
                            display: "flex"
                          }}

                        >
                          <div style={{ flexDirection: "row", justifyContent: "space-between", display: "flex", overflow: "hidden", width: "100%" }}>
                            <p style={{ width: "30%", fontSize: "10px", color: "#999", margin: "0" }}> name:</p>
                            <p style={{ width: "70%", fontSize: "12px", margin: "0", textOverflow: "ellipsis" }}> {item._listener_name}</p>
                          </div>

                          <div style={{ flexDirection: "row", display: "flex" }}>
                            <p style={{ width: "20%", fontSize: "10px", color: "#999", margin: "0" }}>  ip:</p>
                            <p style={{ width: "80%", fontSize: "12px", margin: "0", textOverflow: "ellipsis" }}> {item._ipaddress}</p>
                          </div>

                        </Stack>
                      ))}
                    </div>
                  </div>


                </div>

              </div>



            </div>

            <Divider orientation='vertical' variant="fullWidth" sx={{ backgroundColor: "#fff", height: "100%" }} flexItem />

            <div style={{ width: "100%", }}>
              <div style={{ backgroundColor: "#000", width: "100%", height: "100%", borderRadius: "5px", border: "1px solid #333" }}></div>
            </div>
          </div>
        </div>
      }

      {/* topology */}
      <ReactFlow
        nodesFocusable={true}
        ref={componentRef}
        style={{ zIndex: "0", backgroundColor: "#111" }}
        onNodeClick={(e) => { handleSelectedNode(e) }}
        onNodeMouseEnter={(e) => { }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
       zoomOnDoubleClick={false}
      >
        
   </ReactFlow>
  


    </div>

  );
}
export default networkDiagram;


