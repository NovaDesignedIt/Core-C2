
import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Position, useNodesState, useEdgesState, addEdge, Connection, Edge, OnConnect, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './customNodes';
import { Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CoreC, Instance, Listeners, Config, Target, dumpTargets } from '../../api/apiclient';
import { InsertEmoticon } from '@mui/icons-material';
import { Socket, io } from 'socket.io-client';

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

interface coordinates {

  x: number;
  y: number;

}


const nodeTypes: NodeTypes = {

  custom: CustomNode

};

const networkDiagram = () => {

  const componentRef = useRef<HTMLDivElement>(null); // Create a ref for the component
  // console.log(componentRef)


  const [SelectedNode, setSelectedNode] = useState(-1);
  const [targets, setTargets] = useState<Node[]>([]);

  const dispatch: any = useAppDispatch();
  const instances: Instance[] = useAppSelector(state => state.core.instanceObjects);
  const core: CoreC = useAppSelector(state => state.core.coreObject);
  const config: Config = useAppSelector(state => state.core.configObject);
  const listener: Listeners[] = useAppSelector(state => state.core.listenerObjects);
  const targetsObjects: Target[] = useAppSelector(state => state.core.targetObjects);


  let Count: number = 0


  const fullheight: number = window.screen.availHeight / 2

  const mothernode: Node = { id: `${Count}`, type: 'custom', position: { x: 30, y: 300 }, data: { id: '0', value: { core: core, config: config }, type: "mother" } }

  Count = Count + 1

  const proxyNodes: Node[] = listener.map((item: Listeners, index: number) => (
    { id: `${Count + index}`, type: 'custom', position: { x: index % 2 === 0 ?  1000 : 2000 , y: 100 + 300 * index }, data: { id: index, value: item, type: "proxy" } }
  ));



  Count = Count + proxyNodes.length

  function returnpi(i: number, length: number) {
    return (2 * Math.PI * 2 * i) / length;
  }

  function return_coor(centerX: number, centerY: number, radius: number, angle: number) {
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


  const EdgesProxyToinstances = instancenodes.reduce((result: any[], node: Node) => {
    const proxyId = node.data.value._proxy
    const proxy = proxyNodes.find(x => x.data.value._id === proxyId)
    if (proxyId && proxy) {
      result.push({ id: `e${node.id} - ${proxy.id}`, type: "straight", source: node.id, target: proxy.id })
    }
    return result;
  }, []);








  // const TargetNode: Node[] = targets.map((item: Node, index: number) => (
  //   {id: `${ proxyNodes.length + instancenodes.length + index + 1 }`, type: 'custom', position: { x: 100, y: index * 200 }, data: { id: index, value: item, type: "target" }}
  //   ));


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

  const groupedPayload: any[] = alltargets.reduce((groups: any[], item: any) => {
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

    const x = proxyNodes?.find(x => x.data.value._id === instances.find(x => x._instance_id === group.findLast(x => x)._isid)?._proxy)?.position.x;
    const y = proxyNodes?.find(x => x.data.value._id === instances.find(x => x._instance_id === group.findLast(x => x)._isid)?._proxy)?.position.y;

    const xrelative = x !== undefined ? x : 0
    const yrelative = y !== undefined ? y : 0

    const newNodes: Node[] = group.map((targ: any, index: number) => (
      {
        id: `${Count + index}`,
        type: 'custom',
        //position: {x: 500+index *100 , y: index < 5 ? 500-index*100 :  300+-(index % 5)*100 } ,
        position: return_coor(xrelative, yrelative, index % 3 === 0 ? 250 : 350, returnpi( index * 100, alltargets.length)),
        data: { id: Count + index, value: targ, type: 'target' }
      }));

    tempnodes.push(...newNodes)
    Count = Count + newNodes.length

    const EdgesTargetsToProxy: Edge[] = newNodes.reduce((result: any[], node: Node) => {
      const targetproxyid = node.data.value._ip
      const proxy = proxyNodes.find(x => `${x.data.value._id}` === targetproxyid)

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
  const [edges, setEdges] = useState<Edge[]>([...initialEdges,...tempedges]);

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

  const handleKeyDown = (e:any) =>{
    
     if (e.key === 'h' ) {
      alert('help me :)')
    }
  }

  return (
  
    <div 
  
    style={{ width: '100%', height: '90%', padding: "5px", backgroundColor:"#111",flexDirection: "column", display: "flex" }}>
      <Typography
    component={'span'}
    variant={'body1'}
    style={{
      width:"100%",
      fontFamily: '"Ubuntu Mono", monospace',
      justifyContent: 'center',
      display: "flex",
      color: '#555',
      fontSize: '10px',
      margin: "auto"
    }}>
        <div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
          <p style={{margin:"0",color:"#fff"}}>Topology View  </p>
          <p style={{margin:"0",marginLeft:"auto",color:"#fff"}}>tap h for help</p>
  
          <p style={{margin:"0",marginLeft:"auto",color:"#fff"}}>tap h for help</p>
          <p style={{margin:"0",marginLeft:"auto",color:"#fff"}}>Topology View  </p>
        </div>
    
        </Typography>
      <ReactFlow
     
        ref={componentRef}
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
