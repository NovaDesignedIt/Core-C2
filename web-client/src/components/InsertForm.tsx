import * as React from 'react';
import { Checkbox, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Core, Instance, Listeners, Target, insertrecord } from '../api/apiclient';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector,useAppDispatch } from '../store/store';

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


  const instance = useAppSelector(state => state.core.SelectedInstances)
  const core = useAppSelector(state => state.core.coreObject)
  const listeners:Listeners[] = useAppSelector(state => state.core.listenerObjects)

  const handleClose = () => {
    closePanel()
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

  const HandleAddRecord = async () => {
    const interval: number = _it !== '' ? parseInt(`${_it}`) : 1;
    
    const targetlisteners = listeners.find(x=> x._id === instance._proxy )?._ipaddress
    const record: Target = new Target(
      //_ip
      targetlisteners,
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
        const target = targetData?.findLast((element) => element._n == _n)
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
      <div style={{ gap: '0px', flexDirection: 'column', display: "flex", width: '100%', height: "100%", backgroundColor: "#000", rowGap: "2%" }}>




        <div style={{ flexDirection: 'row', display: "flex", height: '15%', minHeight: "50px", width: '100%', backgroundColor: "#000", overflow: 'hidden', padding: '1%' }}>
          <h5 style={{ cursor: "default", color: "#fff", width: "100%" }}>Insert New Records into {instance?._instance_name} </h5>
          <p style={{ cursor: "default", color: "#7ff685", width: "100%", justifyContent: "flex-center", display: 'flex' }}> InstanceID: {instance !== undefined ? instance._instance_id : ''}</p>
          <CloseIcon onClick={() => { handleClose() }} sx={{ cursor: "pointer", color: "#fff" }} />
        </div>


        <div style={{ flexDirection: "row", display: "flex", gap: "1%" }}>


          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex',
            width: "50%",
            padding: "10px",
            flexDirection: 'column',
            backgroundColor: "#111",
          }}>
            <p style={{ verticalAlign: 'start', color: "#fff", width: "400px", height: '50%' }}>Name</p>
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
            <p style={{ verticalAlign: 'start', color: "#fff", width: "400px", height: '50%' }}>interval / sleep</p>
            <p style={{ verticalAlign: 'start', color: "#fff", width: "400px", height: '50%', fontSize: "11px", opacity: "0.5" }}>if you set the sleep flag on set this interval in seconds</p>
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
              sx={{ ...themeText, width: "40%", borderRadius: "5px" }} ></TextField>
          </div>

          <div style={{
            border: "1px solid #222",
            borderRadius: "4px",
            display: 'flex',
            width: "50%",
            height:"50%",
            padding: "10px",
            flexDirection: 'column',
            backgroundColor: "#111",
            cursor: "default"
          }}>
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              <p style={{ verticalAlign: 'center', color: "#fff", width: "400px", height: '100%' }}>Sleep</p>
              <Checkbox checked={sleep} onChange={() => { HandleSleepCheck() }} sx={{ "& .MuiSvgIcon-root": { color: "#7ff685" } }} />
            </div>


            <div style={{ display: "flex", justifyContent: 'space-between' }}>
              <p style={{ verticalAlign: 'center', color: "#fff", width: "400px", height: '100%' }}>spawn process <strong>O</strong>n <strong>F</strong>irst <strong>P</strong>ing </p>
              <Checkbox checked={ofp} onChange={() => { HandleOFPChange() }} sx={{ "& .MuiSvgIcon-root": { color: "#7ff685" } }} />
            </div>
          </div>

        </div>
        <p style={{ verticalAlign: 'start', color: "#fff", width: "400px" }}>process</p>
        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex',
          height: "300px",
          width: "100%",
          paddingRight: "1%",
          flexDirection: 'column',
          backgroundColor: "#111",
        }}>
          
          <TextField
            value={CommandText}
            onChange={HandleCommandChange}
            required
            fullWidth={true}
            maxRows={5}
            multiline={true}
            size='small'
            spellCheck={false}  // Disable spell checking
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            placeholder="cmd>"
            InputLabelProps={{ sx: { color: "#7ff685", fontSize: '5px' } }}
            inputProps={{ sx: { color: "#7ff685", fontFamily: 'Ubuntu Mono, monospace' } }}
            sx={themeTextBlack}
          >
          </TextField>

        </div>


        <div style={{
          border: "1px solid #222",
          borderRadius: "4px",
          display: 'flex',
          width: "100%",
          padding: "10px",
          flexDirection: 'row',
          gap: "10px",
          backgroundColor: "#111",
        }}>
          <Button
            onClick={HandleAddRecord}
            style={{ backgroundColor: "#333", color: "#7ff685", width: "5%", height: "80%" }}> + </Button>

          <p style={{ color: "#fff", width: "10%", cursor: "default" }}> Count {targetData !== undefined ? targetData.length : 0}</p>

          <Button
            onClick={HandleInsertRecords}
            style={{ marginLeft: "auto",  backgroundColor: "transparent",border:"1px solid #7ff685",  color: "#7ff685", width: "20%", height: "80%" }}> Insert
          </Button>


        </div>





      </div>
    </Typography>
  );

}

export default insertForm;

