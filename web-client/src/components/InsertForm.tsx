import * as React from 'react';
import { Checkbox, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Core, Instance, Target,insertrecord } from '../api/apiclient';


declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}




interface DataGridComponents {
  url: string;
  core?: Core; // Include the 'core' prop with the optional (?) modifier
  instance?: Instance;
}

const insertForm: React.FC<DataGridComponents> = ({ url, core, instance }) => {
  const [_n, setname] = React.useState('');
  const [_it, setInterval] = React.useState('');
  const [CommandText,SetCommandText ] = React.useState('');
  const [targetData, setTargetData] = React.useState<Target[]>();
  const [ofp, setOfp] = React.useState(false);
  const [sleep, setSleep] = React.useState(false);

  const HandleOFPChange = () => {
    setOfp(!ofp);
    setSleep(false);
  };
  const HandleSleepCheck = () => {
    setSleep(!sleep);
    setOfp(false);
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
    if (targetData !== undefined && core !== undefined){
      targetData.forEach((item:Target,index:number)=>{
        insertrecord(url,core,item);
      })
      setTargetData([])
    }else{
      alert('you have no targets created.')
    }
  }

  const HandleAddRecord = async () => {
    const interval: number = _it !== '' ? parseInt(`${_it}`) : 1;
    const record:Target = new Target(
        instance?._instance_ip,
        ofp ? 3 : sleep ? 2 : -1,
        '.',
        `${CommandText}`,
        '.',
        '.',
        -1, 
        instance?._instance_id,
        interval,
        `${_n}`
    )

    if (_n !== '') {
      if (targetData !== undefined && targetData.length > 0) {
        const target = targetData?.findLast((element)=> element._n == _n)
        if (target !== undefined) {
         record._n += targetData.length
        }
      }
      const updatedData = targetData !== undefined ? [...targetData, record] : [record]
      setTargetData(updatedData);
      console.log( record._n );
    } else {
      alert('you need atleast a name.')
    }
  }



  const themeTextBlack = {
    height: "100%",
    color: "#fff",
    overflow: 'scroll',
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
    input: { color: '#fff' },
  }

  const themeText = {
    width: "100%",

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
    "& .MuiInputLabel-root": { display: 'none' },
    "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
    input: { color: '#fff', overflowWrap: 'break-word' },

    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.7)'
  }
  return (

    
      <div style={{ gap:'0px',flexDirection: 'column', display: "flex", width: '100%', backgroundColor: "#111", paddingLeft: '1%' }}>

      <div style={{ flexDirection: 'row', display: "flex", height: '15%', width: '100%', backgroundColor: "#111", overflow: 'hidden', padding: '1%' }}>
          <h5 style={{ color: "#fff", width: "100%" }}>Insert New Records into {instance?._instance_name} </h5>
          <p style={{ color: "#7ff685", width: "100%", justifyContent:"flex-end",display:'flex' }}> Instance ID: {instance !== undefined ? instance._instance_id : ''}</p>

        </div>

        <div style={{ flexDirection: 'row', display: "flex", width: '70%', backgroundColor: "#111" }}>
          
        <TextField
            required
            value={_n}
            onChange={HandleNameChange}
            id="Name filled-required"
            placeholder="Name"
            fullWidth={true}
            InputLabelProps={{ sx: { color: "#777" } }}
            inputProps={{ sx: { color: "#fff" } }}
            size='small'
            sx={themeText}></TextField>
         
          <TextField
            required
            value={_it}
            onChange={HandleNameItChange}
            type='number'
            id="Interval filled-required"
            placeholder="ping/second"
            InputLabelProps={{ sx: { color: "#777" } }}
            size='small'
            sx={themeText}></TextField>    
        
        <div style={{ flexDirection: 'row', display: "flex", height: '100%%', width: '50%', backgroundColor: "#111", overflow: 'hidden', paddingLeft: '1%' }}>
          <p style={{ verticalAlign:'center',color: "#fff", width: "20%",  height:'100%',padding:'4%' }}>Sleep</p>
          <div style={{ paddingLeft: "10%" }}>
            <Checkbox checked={sleep} onChange={()=> {HandleSleepCheck()}} sx={{ "& .MuiSvgIcon-root": { color: "#7ff685" } }} /></div>
        </div>
        </div>


        <div style={{ flexDirection: 'row', display: "flex", height: '20%', width: '100%', backgroundColor: "#111", overflow: 'hidden', paddingLeft: '1%' }}>
          <p style={{ color: "#fff", width: "20%" }}>spawn process <strong>O</strong>n <strong>F</strong>irst <strong>P</strong>ing</p>
          <div style={{ paddingLeft: "3%" }}>
            <Checkbox checked={ofp} onChange={() => {HandleOFPChange()}} sx={{ "& .MuiSvgIcon-root": { color: "#7ff685" } }} /></div>
        </div>


      
        <div style={{ flexDirection: 'row', display: "flex", height: '30%', width: '100%', backgroundColor: "#111", overflow: 'hidden', }}>
          
          <TextField
            value={CommandText}
            onChange={HandleCommandChange}
            required
            fullWidth={true}
            maxRows={3}
            multiline={true}
            size='small'
            spellCheck={false}  // Disable spell checking
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            placeholder="cmd>"
            InputLabelProps={{ sx: { color: "#7ff685", fontSize: '5px', height: '100%' } }}
            inputProps={{ sx: { color: "#7ff685", fontFamily: 'Ubuntu Mono, monospace' } }}
            sx={themeTextBlack}
          >
          </TextField>
        </div>



      <div style={{ flexDirection: 'row', display: "flex", width: '100%', backgroundColor: "#111", gap: "50%", padding: "1%" }}>
        <div style={{ flexDirection: 'row', display: "flex", width: '100%', backgroundColor: "#111", gap: "3%", }}>
          <Button
            onClick={HandleAddRecord}
            style={{ backgroundColor: "#333", color: "#7ff685", width: "5%", height: "80%" }}> + </Button>
          <p style={{ color: "#fff", width: "10%" }}>👾 : {targetData !== undefined ? targetData.length : 0}</p>
        </div>
        <Button
          onClick={HandleInsertRecords}
          style={{ backgroundColor: "#7ff685", color: "#000", width: "20%", height: "80%" }}> Insert </Button>
      </div>



    </div>

  );
}

export default insertForm;

