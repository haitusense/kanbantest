'use strict';

define(['react', 'jsx!App/actions', 'App/store', 'material-ui'],  
(
  React,
  ActionType,
  Store,
  { 
    AppBar, Toolbar, Typography, Drawer, IconButton,
    Divider, List, ListItem, ListItemText,
    Icon, Box, Container}
)=>{

  const Home =()=> {
    const { state, dispatch } = React.useContext(Store);
    return (
      <div>
        <div>{`Width : ${state.screen.width}`}</div>
        <div>{`Height : ${state.screen.height}`}</div>
      </div>
    );
  }

  return Home;
});