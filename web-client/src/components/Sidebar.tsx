import * as react from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowRight from '@mui/icons-material/ArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Settings from '@mui/icons-material/Settings';
import People from '@mui/icons-material/People';
import Public from '@mui/icons-material/Public';
import StorageIcon from '@mui/icons-material/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import Collapse from '@mui/material/Collapse';
import { GiPlanetCore } from "react-icons/gi";
import { Instance, Core } from '../api/apiclient';
import { FaDatabase } from "react-icons/fa6";
import WebStoriesIcon from '@mui/icons-material/WebStories';
{/*sx={{color:"#21fd0a"}}*/ }
const data = [
  // { icon: <People />, index: 1, text: "User" },
  { icon: <FolderIcon />, index: 2, text: "store" },
  { icon: <StorageIcon />, index: 3, text: "Instances" },
  { icon: <Public />, index: 4, text: "Map" },
];

const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

interface SideBarProps{

  onSelectInstance :(instance:Instance) => void;
  onSelectContent : (index: react.SetStateAction<number>) => void;
  core?:Core;
}

const CustomizedList:React.FC<SideBarProps>  = ({ onSelectInstance = (instance: Instance) => { }, onSelectContent = (index: react.SetStateAction<number>) => { },  core } ) => {
  const [open, setOpen] = react.useState(false);
  const [sublistOpen, setSublistOpen] = react.useState(false);

  const handleSublistToggle = () => {
    setSublistOpen(!sublistOpen);
  };

  const HandleInstanceSelection = (instance:Instance) => {
    onSelectInstance(instance);
  }

  const handleDropDownMenu = () =>{
     core !== undefined ? setOpen(!open) : null;
  }

  const handleItemClick = (index: react.SetStateAction<number>) => {
    onSelectContent(index);
  };

  return (
    <>
      <Box sx={{ display: 'flex',width:"100%" }}>
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiListItemButton: {
                defaultProps: {
                  disableTouchRipple: true,
                },
              },
            },
            palette: {
              mode: 'dark',
              primary: { main: 'rgba(255,255,255,0.8)' },
              background: { paper: 'rgb(17,22,19)' },
            },
          })}
        >
          {/* {👽} */}
          <Paper elevation={0} sx={{ minWidth:"10%", borderRadius: 0,width:"100%" }}>
            <FireNav component="nav" disablePadding sx={{width:"100%"}}>
              <ListItemButton key={1} component="a" href="#customized-list" >
                <ListItemIcon sx={{ fontSize: 15 }}>🛰️</ListItemIcon>

                <ListItemText
                  sx={{ my: 0, color: core === undefined ? "#fff" : "#7ff685" }}
                  primary="CoreC2"
              
                  onClick={() => handleItemClick(-1)}
                  primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: 'medium',
                    letterSpacing: 0,
                    width:"100%"
                  }}
                />
              </ListItemButton>
              <Divider key={999} />
              <ListItem key={2} component="div" disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(6)}
                  sx={{ height: 56 }}>
                  <ListItemIcon>

                       </ListItemIcon>
                  <ListItemText
                    primary="core Overview"
                    secondary={ core === undefined  ? "login to fetch core." : ""}
                    secondaryTypographyProps={{
                      color: 'gray',
                      fontSize:10,
                      fontWeight: 'small',
                      variant: 'body2',
                    }}
                    primaryTypographyProps={{
                      color: 'primary',
                      fontWeight: 'medium',
                      variant: 'body2',
                    }}
                  />
                </ListItemButton>
                <Tooltip title="Project Settings">
                  <IconButton
                    key={3}
                    size="large"
                    onClick={() => handleItemClick(5)}
                    sx={{
                      '& svg': {
                        color: 'rgba(255,255,255,0.8)',
                        transition: '0.2s',
                        transform: 'translateX(0) rotate(0)',
                      },
                      '&:hover, &:focus': {
                        bgcolor: 'unset',
                        '& svg:first-of-type': {
                          transform: 'translateX(-4px) rotate(-20deg)',
                        },
                        '& svg:last-of-type': {
                          right: 0,
                          opacity: 1,
                        },
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        height: '80%',
                        display: 'block',
                        left: 0,
                        width: '1px',
                        bgcolor: 'divider',
                      },
                    }}
                  >
                    <Settings />
                    <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider  key={888} />
              <Box
                key={10}
                sx={{
                  bgcolor: open ? 'rgba(32,44,34)' : null,
                  pb: open ? 2 : 0,

                }}
              >
                <ListItemButton
                  key={4}
                  alignItems="flex-start"
                  onClick={() => handleDropDownMenu()}
                  sx={{
                    px: 3,
                    pt: 2.5,
                    pb: open ? 0 : 2.5,
                    '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                  }}
                >
                  <ListItemText
                    primary="ET-C2"
                    primaryTypographyProps={{
                      fontSize: 15,
                      fontWeight: 'medium',
                      lineHeight: '20px',
                      mb: '2px',
                    }}
                    secondary="login to view your core instance"
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: 12,
                      lineHeight: '16px',
                      color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                    }}
                    sx={{ my: 0 }}
                  />
                  <KeyboardArrowDown
                    sx={{
                      mr: -1,
                      opacity: 0,
                      transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                      transition: '0.2s',
                    }}
                  />
                </ListItemButton>
                {open &&
                  data.map((item) => (
                    <>
                      {
                        item.text === 'Instances' ?
                          (
                            <>
                              <ListItemButton
                                key={item.index}
                                onClick={() => handleSublistToggle()}
                                sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                              >
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                  {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={item.text}
                                  primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                />
                              </ListItemButton>
                              <Collapse in={sublistOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding key={0}>
                                  {/* Add your sublist items here */}
                                  {
                                    open && sublistOpen && core?._instances !== undefined ?
                                      core._instances.map((item_instance: Instance) => (
                                        <ListItemButton
                                          key={item_instance._id}
                                          sx={{ py: 0.5, minHeight: 32, pl: 4, backgroundColor: "#405742", ':hover, :focus': { backgroundColor: "#2f4131" } }}
                                          onClick={() => HandleInstanceSelection(item_instance)}
                                        >
                                          <FaDatabase style={{fontSize:'10px',marginRight:"5px"}} />
                                          {/* Sublist item content */}
                                          <ListItemText
                                            primary={ item_instance["_instance_name"]}
                                            primaryTypographyProps={{ fontSize: 12, fontWeight: 'small' }}
                                          />
                                   
                                        </ListItemButton>
                                      )): <></>
                                  }
                                  {/* Add more sublist items as needed */}
                                </List>
                              </Collapse>
                            </>
                          )
                          : (<ListItemButton
                            key={item.index}
                            onClick={() => handleItemClick(item.index)}
                            sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                          >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.text}
                              primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                            />
                          </ListItemButton>
                          )}
                    </>
                  ))}
              </Box>

            </FireNav>
          </Paper>
        </ThemeProvider>
      </Box>
    </>
  );
}

export default CustomizedList;