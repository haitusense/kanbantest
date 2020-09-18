/******** Components ********/

const useStyles = MaterialUI.makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    //marginLeft: drawerWidth,
    //[theme.breakpoints.up('sm')]: {
    //  width: `calc(100% - ${drawerWidth}px)`,
    //},
  },
  toolbar2: theme.mixins.toolbar,
  toolbar: {
    marginTop : 80,
  },
  textField: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
    '& input' : {
      color: 'LightGrey',
    },
    '& label' : {
      foregroundColor : 'whitesmoke', 
      color: 'LightGrey',
      '&.Mui-focused': { color: 'whitesmoke' }
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { 
        //foregroundColor : 'whitesmoke', 
        borderColor: 'LightGrey', 
        //backgroundColor: 'SteelBlue', 
      },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': {
        borderColor: 'whitesmoke',
      },

    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
}));

(() => {

  // substitute for import
  //const CssBaseline = MaterialUI.CssBaseline;

  const Backdrop = MaterialUI.Backdrop;
  const CircularProgress = MaterialUI.CircularProgress;

  const AppBar = MaterialUI.AppBar;
  const Toolbar = MaterialUI.Toolbar;
  const Typography = MaterialUI.Typography;
  const Drawer = MaterialUI.Drawer;
  const IconButton = MaterialUI.IconButton;
  const Divider = MaterialUI.Divider;
  const List = MaterialUI.List;
  const ListItem  = MaterialUI.ListItem ;
  const ListItemText = MaterialUI.ListItemText;
  const TextField = MaterialUI.TextField;
  const Button = MaterialUI.Button;
  const Link = MaterialUI.Link;

  const Icon = MaterialUI.Icon;
  const Box = MaterialUI.Box;
  const Container = MaterialUI.Container;
  // AppBar

  const Loading =()=>{
    const { state } = React.useContext(Store);
    return (
      <Backdrop open={state.busy} style={{zIndex:"100"}}>
        <CircularProgress color="inherit"/>
      </Backdrop>
    );
  }

  const MaterialLogin =()=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const myRef =  React.useRef(null);
    const asynclogin = React.useCallback(() =>{
      fetchData({ 
        type: ActionType.ASYNCLOGIN, 
        value : myRef.current.value
      }, dispatch);
    }); 
    const logout = React.useCallback((e) => dispatch({ type: ActionType.LOGOUT}), [dispatch]);
    if(state.authName == undefined)
    {
      return (
        <>
          <TextField 
            id="password" inputRef={myRef}
            className={classes.textField} variant="outlined" size="small"
            type="password"
            label="token" 
            autoComplete="current-password"
            />
          <Button color="inherit" onClick={asynclogin}>Login</Button>
        </>
      )
    }else{
      return (
        <>
          <p>Signed in as <b>{state.authName}</b></p>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </>
      )
    }
  }
  
  const Message =()=> {
    const { state, dispatch } = React.useContext(Store);
    return <h2><font color="#ff0000">{state.err}</font></h2>
  }

  const Copyright =()=> {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="http://haitusense.com/">
          Haitusense Co,.Ltd.
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const Selector =({children})=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    return (
      <Container component="main" maxWidth="xs">
      <Box mt={12}>
      </Box>
      <div>
        <Message/>
          {
            Object.keys(children).indexOf(state.region) !== -1
            ? (<>{children[state.region]}</>)
            : (<div>404</div>)
          }
      </div>      
      <Box mt={8}>
        <Copyright />
      </Box>
      </Container>
    );
    //className={classes.toolbar}
  }


  const MaterialAppBar =({children})=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const navi = React.useCallback((e) => dispatch({ type: ActionType.NAVIGATE, value : e.target.textContent}), [dispatch]);
    const toggleDrawer = (anchor, str) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setOpen(str);
    };
    return (
      <div className={classes.root}>
        <Loading/>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton}
              onClick={handleDrawerOpen} 
              color="inherit" aria-label="open drawer">
              <Icon className="fa fa-plus-circle">menu</Icon>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Haitusense KANBAN
            </Typography>
            <MaterialLogin/>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" role="presentation" open={open}      
          onClick={toggleDrawer(null, false)}
          onKeyDown={toggleDrawer(null, false)}>
          <ListItem ><b>menu</b></ListItem>
          <Divider />
          <List>
            {Object.keys(children).map((text, index) => (
              <ListItem button key={text} onClick={navi}>
                <ListItemText primary={text}/>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Selector>{children}</Selector>
      </div>
    );
  }

  // substitute for export
  window.MaterialAppBar = MaterialAppBar;

})();

