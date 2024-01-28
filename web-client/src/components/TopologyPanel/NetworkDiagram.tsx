
import React, { useCallback, useState } from 'react';
import ReactFlow, { Position, useNodesState, useEdgesState, addEdge, Connection, Edge, OnConnect, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges,Node} from 'reactflow';
import 'reactflow/dist/style.css';
import ColorChooserNode from './customNodes';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};
const nodeStyle = {
  background:"#222",
  borderRadius:"15px",
  border:"none",
  fontSize:"10px",
  color:"#fff",
  height:"30px"
  
}

const initialNodes:Node[] = [
 { id: '1',sourcePosition:Position.Right,targetPosition:Position.Right,position:{ x: 0, y: 105 }, data: { label: '1' }, style:nodeStyle,  },


 { id: '2',targetPosition:Position.Left, sourcePosition:Position.Left,  position: { x: 300, y: 5 }, data: { label: '2' }, style:nodeStyle },
 { id: '3',targetPosition:Position.Left, sourcePosition:Position.Left, position: { x: 300, y: 55 }, data: { label: '3' }, style:nodeStyle },
 { id: '4',targetPosition:Position.Left, sourcePosition:Position.Left, position: { x: 300, y: 105 }, data: { label: '4' }, style:nodeStyle },
 { id: '5',targetPosition:Position.Left, sourcePosition:Position.Left, position: { x: 300, y: 155 }, data: { label: '5' }, style:nodeStyle },
 { id: '6',targetPosition:Position.Left, sourcePosition:Position.Left, position: { x: 300, y: 205 }, data: { label: '6' }, style:nodeStyle },
 { id: '7',targetPosition:Position.Left, sourcePosition:Position.Left, position: { x: 300, y: 255 }, data: { label: '7' }, style:nodeStyle },


];
const initialEdges: Edge[]  = [
        { id: 'e1-2', source: '1', target: '2'},
        { id: 'e1-2', source: '1', target: '3' },
        { id: 'e1-2', source: '1', target: '4'},
        { id: 'e1-2', source: '1', target: '5'},
        { id: 'e1-2', source: '1', target: '6'},
        { id: 'e1-2', source: '1', target: '7'},];

const networkDiagram = () =>  {




  const [selectedNode,SetSelectedNodes] = useState(-1);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
 
  const onNodesChange: OnNodesChange = useCallback(
    (changes:any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
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
    <div style={{ width: '100%', height: '100%'}}>
      
      <ReactFlow
      
        onNodeClick={(e)=>{console.log(e.currentTarget.getAttribute('data-id'));}}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}

        onConnect={onConnect}
      />

    </div>
  );
}

export default networkDiagram;