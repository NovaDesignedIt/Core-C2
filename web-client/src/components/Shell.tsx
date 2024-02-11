import * as React from 'react';
import Box from '@mui/joy/Box';
import Textarea from '@mui/joy/Textarea';
import { AccordionGroupTypeMap } from '@mui/joy';
import TerminalIcon from '@mui/icons-material/Terminal';
import { List, ListItemText, Typography } from '@material-ui/core';
import { TextField } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { 
  fetchOut,
  Core, 
  Instance, 
  Target, 
  deleterecordbyid,
  insertrecord,
  getrecordsbyfield,
  getrecordbyid,
  getallrecords,
  updatesinglerecordbyid,
  updatemanyrecordsbyfield,
  SetCommand }
from '../api/apiclient';
import { useAppSelector } from '../store/store';



export const help = () => {
 return (`
Exposed Objects:
  url:string
  selectedTargets:number[]
  instance:Instance
  core:Core

Commands:
  Command(command:string)
  CommandById(command:string, id:number)
  

TypeScript Api - Client Functions:
  async function insertrecord(url:string,core:Core,data:Target): Promise<string> 
  async function getrecordsbyfield(url:string,core:Core,field:string,value:string): Promise<string> 
  async function getrecordbyid(url:string,core:Core,record_id:string): Promise<string> 
  async function getallrecords(url:string,instance?:Instance,core?:Core): Promise<Target[] | string> 
  export async function deleterecordbyid(url:string,record_id:string,core?:Core,): Promise<string> {
  async function updatesinglerecordbyid(url:string,core:Core,record_id:string,field:string,value:string): Promise<string> 
  async function updatemanyrecordsbyfield(url:string,core:Core,record_id:string,field:string,value:string): Promise<string> `);
};


function executeJS(str: string) {
  try {
    // Use the Function constructor to create a function from the provided string
    const dynamicFunction = new Function(str);
    // Execute the dynamically created function and capture the result
    const result = dynamicFunction();
    // Return the result
    return result;
  } catch (error) {
    console.error("Error executing JavaScript:", error);
    return null;
  }
}


interface commands {
  input:string;
  output:string;
}

async function Evaluate(inputValue:string){
  try {
    const result = await eval(`${inputValue}`);
    return result; // This will log the result of getallrecords
  } catch (error) {
    return error
  }
}

const Shell = ()  => {
  const [inputValue, setInputValue] = React.useState<string | any[] | React.ReactElement>();
  const [val, setVal] = React.useState('');
  const textareaRef = React.useRef(null);
  const [commands, setCommands] = React.useState<commands[]>([{input:'',output:''}]);
  const [CmdIndex, setIndex] = React.useState(0);
  
  // core={core} instance={instance} url={url} selectedTargets={selectedTargets}

  const core = useAppSelector(state => state.core.coreObject);
  const instance = useAppSelector(state => state.core.SelectedInstances);
  const selectedTargets = useAppSelector(state => state.core.selectedTargets);
  const AllTargets:Target[] = useAppSelector(state => state.core.targetObjects);
  const url = core._url  
  




  const Command = async (arg: string) => {
    selectedTargets.forEach((id: number, index: number) => {
      const target: Target = (AllTargets.find(t => t._id === id)) ?? new Target();      
      SetCommand(url, core, instance, target, arg);
    });
  }

  const CommandById = async (arg: string, id: number) => {
    if (core !== undefined && instance !== undefined) {
      const target: Target = (AllTargets.find(t => t._id === id)) ?? new Target();
      SetCommand(url, core, instance, target, arg);
    }
  }


  const addCommand = (newCommand: commands) => {
    setCommands(prevCommands => [...prevCommands, newCommand]);
  };

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    setVal(inputValue);
    //setInputValue(inputValue);
  };


  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (val === 'clear' || val === 'cls') {
        setInputValue("");
        setVal('');
      } else {
        try {
          const result = Evaluate(val);
          const output: string | any[] | undefined | any = await result
          const out = typeof output === 'string' ? output.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '')
          : JSON.stringify(output, null, 2);
          addCommand({input:val, output:out });
          //out);
          setInputValue(out);
          setVal('');

        } catch (error) {
          setInputValue(`${error}`);
          setVal('');
        }
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
    e.preventDefault(); // Prevent the default behavior (e.g., moving the cursor in a text input)
    // alert('up');
    const id = CmdIndex < commands.length ? CmdIndex : 0    
    const t:commands = commands[id]; 
    setVal(t.input);
    setInputValue(t.output);
    setIndex(id+1);
  }
  }
  


  React.useEffect(() => {
   
    //Expose the function to the global scope
    //setSocket(io(`http://192.168.2.196:8000/`));
 
    //Connect to the server with the specified query parameters
        const socks: Socket = io(`http://${url}`);   
    
    if (socks !== undefined) {
      socks.on(
          instance._instance_id,
        (data: string) => {
          console.log(data)
          const recv = data !== undefined ? data.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '')  : 'undefined'
          //const outtext = inputValue !== undefined ? inputValue :'' 
          setInputValue((outtext) => `${outtext !== undefined ? outtext : ''} ${'\n'} ${recv}`);
          // Update your React component state or perform any other action
        });
    }
  
    

    (window as any).getallrecords = getallrecords;
    (window as any).core = core;
    (window as any).instance = instance;
    (window as any).url = url;
    (window as any).deleterecordbyid = deleterecordbyid;
    (window as any).insertrecord = insertrecord;
    (window as any).getrecordsbyfield = getrecordsbyfield;
    (window as any).getrecordbyid = getrecordbyid;
    (window as any).getallrecords = getallrecords;
    (window as any).updatesinglerecordbyid = updatesinglerecordbyid;
    (window as any).updatemanyrecordsbyfield = updatemanyrecordsbyfield;
    (window as any).selectedTargets = selectedTargets;
    (window as any).Command = Command;
    (window as any).CommandById = CommandById;
    // Set scrollTop to the maximum value to ensure the scrollbar is at the bottom
    if (textareaRef.current) {
      //textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }

    //console.log(`${instance?._instance_id} **************************************`)
  
    return () => {
     
      socks?.disconnect();
  
      // Remove properties from the window object when the component is unmounted
      delete (window as any).getallrecords;
      delete (window as any).core;
      delete (window as any).instance;
      delete (window as any).url;
      delete (window as any).deleterecordbyid;
      delete (window as any).insertrecord;
      delete (window as any).getrecordsbyfield;
      delete (window as any).getrecordbyid;
      delete (window as any).getallrecords;
      delete (window as any).updatesinglerecordbyid;
      delete (window as any).updatemanyrecordsbyfield;
      delete (window as any).selectedTargets;
      delete (window as any).Command;
      delete (window as any).CommandById;
    };
    
  }, [
      inputValue,
      setInputValue,
      getallrecords,
      core,
      instance,
      url,
      Command,
      CommandById,
      deleterecordbyid,
      insertrecord,
      getrecordsbyfield,
      getrecordbyid,
      updatesinglerecordbyid,
      updatemanyrecordsbyfield]);

 
  const themeText = {
    height: "15px",
    
    backgroundColor: "#000",
    "&:Hover,focus": {
      backgroundColor: "#000"
    },
    // OUTLINE
    "& .MuiOutlinedInput-root": {
      ":Hover,focus,selected,fieldset, &:not(:focus)": {
        "& > fieldset": { borderColor: "transparent", borderRadius: 0, },
      },
      "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
      borderColor: "transparent", borderRadius: 0,
    }, "&.MuiTextField-root": { width: "100%", padding: '0%' },
    "& .root": { color: "#fff" },
    "& .MuiInputLabel-root": { display: 'none' },
    "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
    input: {    fontFamily: '"Ubuntu Mono", monospace',color: '#fff', fontSize: '12px', padding: '0px', marginLeft: '-5px' },
    inputProps: {
      style: {    fontFamily: '"Ubuntu Mono", monospace', },
    },
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
  }

  return (
    <div style={{ flexDirection: 'column', display: 'flex', backgroundColor: '#070907', height: "100%", width: "100%", padding: '0%' }}>
      <div style={{ backgroundColor: '#070907', height: "20px", width: "100%", padding: '0%', position: 'sticky' }}>
        <TerminalIcon fontSize='small' htmlColor='#7ff685' />
      </div>
      <Box sx={{ padding:"10px",backgroundColor: '#000', height: '100%', width: '100%', overflow: "scroll"}}>
        <TextField
          value={val}
          placeholder="$_"
          fullWidth={true}
          onChange={(e)=> {handleChange(e)}}
          onKeyDown={(e) => {handleKeyDown(e)}}
          spellCheck={false}  // Disable spell checking
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          autoFocus={true}
          sx={{...themeText,padding:"10px"}}>
        </TextField>
        <List style={{ width: "100%", padding: "0%" }}>
          <ListItemText style={{ flexWrap: 'wrap', margin: '6px' }}>
            <Typography style={{   
                   fontFamily: '"Ubuntu Mono", monospace',whiteSpace: 'pre',
                overflowWrap: 'break-word', fontSize: '12px', color: '#fff', flexWrap: 'wrap',  backgroundColor: inputValue !== 'Disabled the Shell :(' ? '#000' : "red" }}>
              {inputValue}
            </Typography>
          </ListItemText>
        </List>
      </Box>
    </div>
  );
}

export default Shell;