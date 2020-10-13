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

  const MaterialAppBar =({regions, title, children})=> {
    const { state, dispatch } = React.useContext(Store);
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const toggleDrawer = (anchor, str) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setOpen(str);
    };
    return (
      <div>
        <TitleBar title={title} onClick={handleDrawerOpen} />
        <MaterialDrawer
          regions={regions}
          onClick={toggleDrawer(null, false)} 
          onKeyDown={toggleDrawer(null, false)}           
          open={open} />
        {children}
      </div>
    );
  }

  const TitleBar =({title, onClick})=> {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start"
            onClick={onClick} 
            color="inherit" aria-label="open drawer">
            <Icon className="fa fa-plus-circle">menu</Icon>
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
    );
  }

  const MaterialDrawer =({onClick, onKeyDown, open, regions})=> {
    const { state, dispatch } = React.useContext(Store);
    const navi = React.useCallback((e) => dispatch({ type: ActionType.NAVIGATE, value : e.target.textContent}), [dispatch]);
    return (
      <Drawer anchor="left" role="presentation" open={open}      
        onClick={onClick} onKeyDown={onKeyDown}>
        <ListItem ><b>menu</b></ListItem>
        <Divider />
        <List>
          {Object.keys(regions).map((text, index) => (
            <ListItem button key={text} onClick={navi}>
              <ListItemText primary={text}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }

  return MaterialAppBar;
});