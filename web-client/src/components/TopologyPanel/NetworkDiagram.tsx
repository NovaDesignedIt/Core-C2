
import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Position, useNodesState, useEdgesState, addEdge, Connection, Edge, OnConnect, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import  CustomNode from './customNodes';
import { Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CoreC, Instance, Listeners, Config, Target,dumpTargets} from '../../api/apiclient';
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

x:number;
y:number;

}


const nodeTypes:NodeTypes = { 

  custom : CustomNode

 };

const networkDiagram = () => {

  const componentRef = useRef<HTMLDivElement>(null); // Create a ref for the component
  console.log(componentRef)


  const [SelectedNode, setSelectedNode] = useState(-1);
  const [targets, setTargets] = useState<Node[]>([]);

  const dispatch:any = useAppDispatch();
  const instances:Instance[] = useAppSelector(state => state.core.instanceObjects);
  const core:CoreC = useAppSelector(state => state.core.coreObject);
  const config:Config = useAppSelector(state => state.core.configObject);
  const listener:Listeners[] = useAppSelector(state => state.core.listenerObjects);
  
  let Count:number  = 0


  const fullheight:number = window.screen.availHeight / 2
  
  const mothernode:Node  = { id: `${Count}`, type: 'custom', position: { x: 30, y: 300 }, data: { id: '0',  value:{core :core, config:config}, type: "mother" } }
  
  Count = Count + 1

  const proxyNodes: Node[] = listener.map((item: Listeners, index: number) => (
     { id: `${Count+index}`, type: 'custom', position: { x:1000 , y: 100 +700 * index }, data: { id: index, value: item, type: "proxy" }}
  ));



  Count = Count + proxyNodes.length

  function returnpi (i:number,length:number){
    return (2 * Math.PI * 2*i) / length;
  }
  
  function return_coor(centerX: number, centerY: number, radius: number, angle: number) {
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y }
  }


  const instancenodes: Node[] = instances.map((item: Instance, index: number) => (
  {id: `${Count + index }`, type: 'custom', position: { x: 200, y: 200 + index * 100 }, data: { id: index, value: item, type: "instance" }}
  
  ));

 
  Count = Count + instancenodes.length
  



  const EgdesInstancesToMotherShip: Edge[] = instancenodes.map((item:Node, index: number) => (
          { id: `e0-${item.id}`, type: "straight", source: '0', target: item.id }
  ));


  const EdgesProxyToinstances = instancenodes.reduce((result:any[],node: Node) => {
    const proxyId = node.data.value._proxy
    const proxy = proxyNodes.find(x => x.data.value._id === proxyId)
    if (proxyId && proxy ){
      result.push({ id: `e${node.id} - ${proxy.id}`, type:"straight", source: node.id, target: proxy.id })
    }
  return result;
  },[]);


 

 



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

  //console.log(targets)
  const  allnodes:Node[] = [...initialNodes, ...proxyNodes, ...instancenodes]

  const [nodes, setNodes] = useState<Node[]>(allnodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);


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





  const fetchData = async () => {
    try {
      const payload = await dumpTargets(core._url, core); // Call dumpTargets function with core._url and core
      //console.log('Payload:', payload);
      

      const groupedPayload: any[] = payload.reduce((groups:any[], item:any) => {
        const isid = item._isid;
        if (!groups[isid]) {
          groups[isid] = [];
        }
        groups[isid].push(item);
        return groups;
      }, {});

      

      Object.values(groupedPayload).forEach((group: any[], i: number) => {
      
      console.log(group.length)
  
        const newNodes: Node[] = group.map((targ: any, index: number) => (
          {
            id: `${Count + index}`,
            type: 'custom',
            //position: {x: 500+index *100 , y: index < 5 ? 500-index*100 :  300+-(index % 5)*100 } ,
            position: return_coor(proxyNodes[i].position.x, proxyNodes[i].position.y, 250, returnpi(index , payload.length)),
            data: { id: index * i, value: targ, type: 'target' }
          }));
  
        setNodes(current => [...current,...newNodes])
        //plotcircle(index,payload.length,{x:300,y:300})
       
        Count =  Count + newNodes.length

      const EdgesTargetsToProxy:Edge[] = newNodes.reduce((result:any[], node: Node) => {
        const targetproxyid = node.data.value._ip
        const proxy = proxyNodes.find(x => `${x.data.value._id}` === targetproxyid)

        //console.log(proxyNodes,targetproxyid)
        if (proxy && targetproxyid ){
          result.push({ id: `e${proxy.id} - ${node.id}`, type:"straight", source: proxy.id, target: node.id })
        }
        

      return result;
      },[]);

      setEdges(self => [...self,...EdgesTargetsToProxy])
    
    
    });
      

    } catch (error) {
      console.error('Error fetching targets:', error);
    }
  };








    // Call fetchData when the component mounts
    React.useEffect(() => {
      fetchData();

      if (componentRef.current) {
        const height = componentRef.current.clientHeight;
        console.log('Component height:', height);
      }

    }, []); // Empty dependency array ensures this effect runs only once
  

  // const payload = dumpTargets(core._url,core);
  // console.log(  payload)
  // // const t:Node[] = payload.map((item: any, index: number) => (
  // //   { id: `${proxyNodes.length + instancenodes.length + index + 1}`, type: 'custom', position: { x: 200, y: index * 200 }, data: { id: index, value: item, type: "target" } }
  // // ));
  // // setNodes(self => [...self,...t])
  

  


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