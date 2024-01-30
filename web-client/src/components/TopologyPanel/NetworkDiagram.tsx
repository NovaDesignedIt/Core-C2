
import React, { useCallback, useState } from 'react';
import ReactFlow, { Position, useNodesState, useEdgesState, addEdge, Connection, Edge, OnConnect, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import  CustomNode from './customNodes';
import { Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CoreC, Instance, Listeners } from '../../api/apiclient';

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




const nodeTypes:NodeTypes = { 

  custom : CustomNode

 };

const networkDiagram = () => {

  const [SelectedNode, setSelectedNode] = useState(-1);

  const dispatch:any = useAppDispatch();

  const instances:Instance[] = useAppSelector(state => state.core.instanceObjects);
  const core:CoreC = useAppSelector(state => state.core.coreObject);
  const listener:Listeners[] = useAppSelector(state => state.core.listenerObjects);
  const [ids,incrementId] = useState(0);

  const mothernode:Node  = { id: '0', type: 'custom', position: { x: 30, y: window.screen.availHeight / 4 }, data: { id: '0',  value:core, type: 'mother' } }

  const proxyNodes: Node[] = listener.map((item: Listeners, index: number) => (
     { id: `${index+1}`, type: 'custom', position: { x: 300 * index /2 , y: 200 }, data: { id: index, value: item, type: "proxy" }}
  ));

  const instancenodes: Node[] = instances.map((item: Instance, index: number) => (
  {id: `${ proxyNodes.length + index + 1 }`, type: 'custom', position: { x: 300 * index / 2, y: 200 }, data: { id: index, value: item, type: "instance" }}
  ));

  const EgdesInstancesToMotherShip: Edge[] = instancenodes.map((item:Node, index: number) => (
          { id: `e0-${item.id}`, type: "step", source: '0', target: item.id }
  ));



  const initialNodes: Node[] = [
    mothernode,
    { id: '17', type: 'custom', position: { x: 700, y: 5 }, data: { id: '2', type: 'target' } },
    { id: '18', type: 'custom', position: { x: 500, y: 55 }, data: { id: '3', type: 'target' } },
    { id: '19', type: 'custom', position: { x: 700, y: 105 }, data: { id: '4', type: 'target' } },
    { id: '20', type: 'custom', position: { x: 500, y: 155 }, data: { id: '5', type: 'target' } },
    { id: '21', type: 'custom', position: { x: 700, y: 205 }, data: { id: '6', type: 'target' } },
    { id: '22', type: 'custom', position: { x: 500, y: 255 }, data: { id: '7', type: 'target' } }

  ];

  const  allnodes:Node[] = [...initialNodes, ...proxyNodes, ...instancenodes]

console.log(allnodes)

  const initialEdges: Edge[] = [
    ...EgdesInstancesToMotherShip
    // { id: 'e0-1', type:"step", source: '0', target: '1' },
    // { id: 'e1-2', type:"straight", source: '1', target: '2' },
    // { id: 'e1-3', type:"straight", source: '1', target: '3' },
    // { id: 'e1-4', type:"straight", source: '1', target: '4' },
    // { id: 'e1-5', type:"straight", source: '1', target: '5' },
    // { id: 'e1-6', type:"straight", source: '1', target: '6' },
    // { id: 'e1-7', type:"straight", source: '1', target: '7' },
  ];

  const [nodes, setNodes] = useState<Node[]>(allnodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const handleSelectedNode = (e: any) => {
    const id = e.currentTarget.getAttribute('data-id')
    if (id !== undefined) {
      //console.log(id)
      setSelectedNode(parseInt(id));
    }
  }


  const onNodesChange: OnNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes,setSelectedNode],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '80%', padding: "20px", gap: "20px", flexDirection: "column", display: "flex" }}>
      <div style={{ gap: "20px", display: "flex" }}>
      <Typography
                component={'span'}
                variant={'body1'}
                style={{
                    fontFamily: '"Ubuntu Mono", monospace',
                    justifyContent: 'center',
                    display: "flex",
                    color: '#fff',
                    fontSize: '15px',
                    margin:"auto"
                }}> 
                <h5>Topology View</h5>
                </Typography>
                
        {/* <Button sx={{ color: "#fff", border: "1px solid #fff", width: "50%" }}>test</Button>
        <Button sx={{ color: "#fff", border: "1px solid #fff" }}>test</Button> */}
      </div>
      <ReactFlow
        style={{ border: "1px solid #333", borderRadius: "4px", backgroundColor: "#111" }}
        
        onNodeClick={(e) => { handleSelectedNode(e) }}
        onNodeMouseEnter={(e) => { }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />

    </div>
  );
}
export default networkDiagram;