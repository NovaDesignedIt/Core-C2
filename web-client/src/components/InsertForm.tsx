import * as React from 'react';
import { Checkbox, TextField, Typography,List,ListItem,ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Core, Instance, Listeners, Target, insertrecord } from '../api/apiclient';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector,useAppDispatch } from '../store/store';
import { returnStateColor }  from '../Utilities/Utilities'
import { motion } from "framer-motion";

declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}




interface DataGridComponents {

  closePanel: () => void;
}

const insertForm: React.FC<DataGridComponents> = ({ closePanel }) => {

  const targets = useAppSelector(state=>state.core.targetObjects)
  const dispatch = useAppDispatch()

  const [_n, setname] = React.useState('');
  const [_it, setInterval] = React.useState('');
  const [CommandText, SetCommandText] = React.useState('');
  const [targetData, setTargetData] = React.useState<Target[]>();
  const [ofp, setOfp] = React.useState(false);
  const [sleep, setSleep] = React.useState(false);
  const [proxy, setproxy] = React.useState(0);
  const [proxyIndex,setIndex] = React.useState(0); 
  const [proxyName, SetProxyName] = React.useState('');
  const  [targetselected, Settargeselected] = React.useState(-1);

  
  const instance = useAppSelector(state => state.core.SelectedInstances)
  const core = useAppSelector(state => state.core.coreObject)
  const listeners:Listeners[] = useAppSelector(state => state.core.listenerObjects)

  const handleClose = () => {
    closePanel()
  }

  const handletargetSelected = (index: number) => {
    if (targetData !== undefined) {

      setname(targetData[index]._n);
      setInterval(targetData[index]._zzz.toString())
      SetCommandText(targetData[index]._in)
      const prox:Listeners | void = listeners.find(x => x._id.toString() === targetData[index]._ip)
      
      if(targetData[index]._st === 3){
        setOfp(true)     
        setSleep(false)
      }else if(targetData[index]._st === 2){
        setSleep(true)
        setOfp(false)
      }else {
        setOfp(false)
        setSleep(false)
      }

      if (prox !== undefined) {
        const i = listeners.indexOf(prox)
        setIndex(i)
        SetProxyName(prox._listener_name)
      }

    }

    Settargeselected(index);
}

  const HandleOFPChange = () => {
    setOfp(!ofp);
    setSleep(false);
  };
  const HandleSleepCheck = () => {
    if (_it !== undefined && parseInt(_it) > 1) {
      setSleep(!sleep);
      setOfp(false);
    } else {
      alert('set interval > 1');
    }
  };
  const HandleNameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setname(e.target.value)
  }
  const HandleNameItChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInterval(e.target.value)
  }
  const HandleCommandChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    SetCommandText(e.target.value)
  }

  const HandleInsertRecords = async () => {
    if (targetData !== undefined && core !== undefined) {
      targetData.forEach((item: Target, index: number) => {
        insertrecord(core._url, core, item);
      })
     
      setTargetData([])
      closePanel()
    } else {
      alert('you have no targets created.')
    }
  }




  const handleScroll = () => {
    // Calculate the next index based on the current scroll position
    const nextIndex = (proxy + 1) % listeners.length;
    console.log(proxy)
    setproxy(prev => prev + 1)
    SetProxyName(listeners[nextIndex]._listener_name)
    setIndex(nextIndex);
  };

  const HandleRemoveRecord = (targindex: number) => {
    if (targindex !== -1) {
      const arraytarg: Target[] | void = targetData?.filter((item: any, i: number) => i !== targindex);
      if (arraytarg !== undefined) {        
        setTargetData(arraytarg)
      }
    } else {
      alert('select a target first to remove')
    }
  }

  const HandleModifictionChanges =  (targindex: number) =>  {

  const arraytarg:Target[] | void = targetData?.filter((item:any,i:number) => i !== targindex );
  if (arraytarg !== undefined && targindex !== -1 ) {
    const interval: number = _it !== '' ? parseInt(`${_it}`) : 1;
    const targetlisteners = proxyName !== '' ? listeners[proxyIndex]._id : listeners.find(x=> x._id === instance._proxy )?._id 
    setTargetData([...arraytarg,new Target(
      //_ip
      `${targetlisteners}`,
      //_state
      ofp ? 3
        : sleep && interval !== undefined && interval > 1 ? 1
          : -1,
      //_dump
      '.',
      //_in
      ofp ? `${CommandText}`
        : ' ',
      //_out
      '.',
      //_lastping
      '.',
      //_id???
      -1,
      //_instanceID
      instance?._instance_id,
      //_interva;
      interval,
      //_name
      `${_n}`
    )])
    Settargeselected(-1)
  }
}





  const HandleAddRecord = async () => {
    const interval: number = _it !== '' ? parseInt(`${_it}`) : 1;
    const targetlisteners = proxyName !== '' ? listeners[proxyIndex]._id : listeners.find(x=> x._id === instance._proxy )?._id 
    const record: Target = new Target(
      //_ip
      `${targetlisteners}`,
      //_state
      ofp ? 3
        : sleep && interval !== undefined && interval > 1 ? 2
          : -1,
      //_dump
      '.',
      //_in
      ofp ? `${CommandText}`
        : ' ',
      //_out
      '.',
      //_lastping
      '.',
      //_id???
      -1,
      //_instanceID
      instance?._instance_id,
      //_interva;
      interval,
      //_name
      `${_n}`
    )

    if (_n !== '') {
      if (targetData !== undefined && targetData.length > 0) {
        const target = targetData?.find((element:Target) => element._n == _n)
        if (target !== undefined) {
          record._n += targetData.length
        }
      }
      const updatedData = targetData !== undefined ? [...targetData, record] : [record]
      setTargetData(updatedData);
      console.log(record);
    } else {
      alert('you need atleast a name.')
    }
  }

  const themeTextBlack = {
    height: "250px",
    color: "#fff",
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
    }, "&.MuiTextField-root": { width: "100%" },
    "& .root": { color: "#fff" },
    "& .MuiInputLabel-root": { display: 'none' },
    "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
    input: { color: '#fff' },
  }

  const themeText = {

    backgroundColor: "#333",
    "&:Hover,focus": {
      backgroundColor: "#555"
    },
    // OUTLINE
    "& .MuiOutlinedInput-root": {
      ":Hover,focus,selected,fieldset, &:not(:focus)": {
        "& > fieldset": { borderColor: "transparent", borderRadius: 0, },

      },
      "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
      borderColor: "transparent", borderRadius: 0,
    },
    "& .root": { color: "#fff" },
    "& .MuiInputLabel-root": { color: '#fff' },
    "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
    input: { color: '#fff' },
    inputProps: {
      style: { fontFamily: 'nunito' },
    },
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
  }

  

  return (

      <div style={{ gap: '0px', flexDirection: 'column', display: "flex", width: '100%', height: "100%", backgroundColor: "#000", rowGap: "2%" }}>


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
   <div style={{ gap: 'px', flexDirection: 'column', display: "flex", width: '100%', height: "100%", backgroundColor: "#000", rowGap: "2%" }}>



        <div style={{ flexDirection: 'row', display: "flex", height: '15%', minHeight: "50px", width: '100%', backgroundColor: "#000", overflow: 'hidden', padding: '1%' }}>
          <h5 style={{ cursor: "default", color: "#fff", width: "100%" }}>Insert New Records into {instance?._instance_name} </h5>
          <p style={{ cursor: "default", color: "#7ff685", width: "100%", justifyContent: "flex-center", display: 'flex' }}> InstanceID: {instance !== undefined ? instance._instance_id : ''}</p>
          <CloseIcon onClick={() => { handleClose() }} sx={{ cursor: "pointer", color: "#fff" }} />
        </div>


        <div style={{ flexDirection: "row", display: "flex", gap: "10px" }}>


          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex',
            width: "50%",
            padding: "5px",
            flexDirection: 'column',
            backgroundColor: "#111",
            gap:"1px"
          }}>
            <p style={{ verticalAlign: 'start', color: "#fff", width: "400px",margin:"0" }}>Name</p>
            <TextField
              fullWidth={true}
              id="Name filled-required"
              placeholder="Name"
              InputLabelProps={{ sx: { color: "#fff" } }}
              inputProps={{ sx: { color: "#fff" } }}
              label={'name'}
              size='small'
              value={_n}
              onChange={HandleNameChange}
              sx={{ ...themeText, width: "90%", borderRadius: "5px" }} ></TextField>
     
            <p style={{ verticalAlign: 'start', color: "#fff", width: "400px",margin: "0" }}>listener</p>
            <p style={{ verticalAlign: 'start', color: "#fff", width: "400px", fontSize: "11px", opacity: "0.5",margin: "0" }}>scroll to set your listener </p>

            <TextField
              fullWidth={true}
              InputLabelProps={{ sx: { color: "#fff" } }}
              inputProps={{ sx: { color: "#fff" } }}
              size='small'
              onWheel={handleScroll}
              value={proxyName}
              sx={{ ...themeText, width: "50%", borderRadius: "5px" }} ></TextField>



<p style={{ verticalAlign: 'start', color: "#fff", width: "400px",margin:"0" }}>interval / sleep</p>
            <p style={{ verticalAlign: 'start', color: "#fff", width: "100%", fontSize: "11px", opacity: "0.5",margin:"0" }}>if you set the sleep flag on set this interval in seconds {"("+"1 by default"+")"}</p>
            <div style={{ display: "flex",margin:"0" }}>
              <p style={{ color: "#fff", width: "10%",paddingTop:"10px",margin:"0" }}>Sleep</p>
              <Checkbox checked={sleep} onChange={() => { HandleSleepCheck() }} sx={{ "& .MuiSvgIcon-root": { color: "#7ff685" } }} />
            </div>
            <TextField
              fullWidth={true}
              type='number'
              id="interval filled-required"
              placeholder="interval"
              InputLabelProps={{ sx: { color: "#fff" } }}
              inputProps={{ sx: { color: "#fff" } }}
              label={'interval'}
              size='small'
              value={_it}
              onChange={HandleNameItChange}
              sx={{ ...themeText, width: "50%", borderRadius: "5px" }} ></TextField>
            
            <h6 style={{ verticalAlign: 'start', color: "#fff", margin:"0"  }}>process</h6>
           
           <hr style={{width:"80%",margin:"5px"}}/>

           <div style={{ display: "flex",margin:"0"  }}>
              <p style={{ verticalAlign: 'center', color: "#fff", width: "40%", height: '100%',margin:"0" }}>spawn process <strong>O</strong>n <strong>F</strong>irst <strong>P</strong>ing </p>
              <Checkbox checked={ofp} onChange={() => { HandleOFPChange() }} sx={{ "& .MuiSvgIcon-root": { color: "#7ff685" } }} />
          </div>

{
        ofp &&
          <TextField
            value={CommandText}
            onChange={HandleCommandChange}
            required
            
            maxRows={5}
            multiline={true}
            size='small'
            spellCheck={false}  // Disable spell checking
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            placeholder="cmd>"
            InputLabelProps={{ sx: { color: "#7ff685", fontSize: '5px' } }}
            inputProps={{ sx: { color: "#ddd", fontFamily: 'Ubuntu Mono, monospace' } }}
            sx={{...themeTextBlack,maxWidth:"98%",borderRadius:"5px"}}
          >
          </TextField>
}
          
          </div>

          <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex',
          height: "300px",
          width: "50%",
          paddingLeft: "1%",
          flexDirection: 'column',
          backgroundColor: "#111",
          padding:'5px'
        }}>
          <h5 style={{ color: "#fff", width: "100%", cursor: "default",margin: "0"}}>Insert target</h5>
            <div style={{     display: 'flex',
            width: "10%",
            padding: "10px",
            flexDirection: 'row',
            gap: "5px",}}>

            
            

                <Button
                  onClick={HandleAddRecord}
                  style={{ backgroundColor: "#333", color: "#7ff685", width: "100%" }}>+</Button>

                <Button
                  onClick={()=>HandleRemoveRecord(targetselected)}
                  style={{ backgroundColor: "#333", color: "#7ff685", width: "100%" }}>-</Button>

          </div>

            <List sx={{ overflow:"auto",border:"1px solid #333",borderRadius:"5px",backgroundColor: "#000",minHeight:"50%",width: "100%", flexDirection: 'column', display: "flex",padding:"5px",gap:"5px"}}>
            
              {(targetData !== undefined ? targetData : []).map((item: Target, index: number) => (

<motion.div
className="box"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.15 }}
>
                <ListItem  onClick={()=>handletargetSelected(index)} sx={{ ":hover": { opacity: "0.6" }, cursor: "pointer", borderRadius: "5px", width: "100%", minHeight: "35px", backgroundColor: targetselected !== index ? "#111" :  "#333",border : targetselected !== index ? "1px solid #333": "1px solid #fff" , flexDirection: 'row', display: "flex", gap: "3px", overflow: "hidden" }}>
                  <div style ={{flexDirection: 'row', display: "flex",gap:"10px",width:"100%"}}>
                  <p style={{ color: "#fff", width: "100%", fontSize: "15px",margin:"0" }}>
                    Target:{index}
                  </p>
                 
                  <p style={{ color: "#fff", width: "100%", fontSize: "15px",margin:"0" }}>
                   name:{item._n}
                  </p>
                  <p style={{ color: "#fff", width: "100%", fontSize: "15px",margin:"0" }}>
                   listener:{listeners.find(x => x._id.toString() === item._ip)?._listener_name}
                  </p>
           
                  <p style={{ padding:"5px",color: "#fff",backgroundColor:returnStateColor(item._st), width: "50%", fontSize: "8px", borderRadius:"6px",margin:"0" }}>
                      {
                        item._st === 0 &&
                        "Task" ||
                        item._st === 1 &&
                        "Sleep" ||
                        item._st === 2 &&
                        "dropped" ||
                        item._st === 3 &&
                        "Listen" ||
                        "awaiting"
                      }
                  </p>
                  </div>
                </ListItem>
          </motion.div>
              ))}
            </List>
            <p style={{ color: "#fff", width: "100%", cursor: "default",  margin: "0"}}> Count:{targetData !== undefined ? targetData.length : 0}</p>
         <div style={{flexDirection:"row",display:"flex",gap:"50%"}}>
            <Button
            onClick={()=>HandleModifictionChanges(targetselected)}
            style={{   backgroundColor: "transparent",border:"1px solid #7ff685",  color: "#7ff685", width: "100%", height: "100%" }}> Save 
          </Button>

        <Button
            onClick={HandleInsertRecords}
            style={{ marginLeft: "auto",  backgroundColor: "transparent",border:"1px solid #7ff685",  color: "#7ff685", width: "100%", height: "100%" }}> Insert 
        </Button>
        </div>
        </div>

       

        </div>

 
          <div style ={{flexDirection: 'row', display: "flex"}}>


          </div>

        </div>

        </Typography>

      </div>
    
  );

}

export default insertForm;

