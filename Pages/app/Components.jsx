/******** Components ********/
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

  const Link = MaterialUI.Link;

  // AppBar

  const Loading =()=>{
    const { state } = React.useContext(Store);
    return (
      <Backdrop open={state.busy} style={{zIndex:"100"}}>
        <CircularProgress color="inherit"/>
      </Backdrop>
    );
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
    if(Object.keys(children).indexOf(state.region) !== -1)
    {
      return (<>{children[state.region]}</>);
    }else{
      return (<><div>404</div></>);
    }
  }

  const MaterialAppBar =({children})=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const navi = React.useCallback((e) => dispatch({ type: ActionType.NAVIGATE, value : e.target.textContent}), [dispatch]);
    return (
      <div className={classes.root}>
        <Loading/>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton}
              onClick={handleDrawerOpen} 
              color="inherit" aria-label="open drawer">
              <MaterialUI.Icon className="fa fa-plus-circle">menu</MaterialUI.Icon>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Haitusense KANBAN
            </Typography>
            <MaterialLogin/>
          </Toolbar>
        </AppBar>
        <Drawer variant="persistent" anchor="left" open={open} >
          <div>
            <IconButton onClick={handleDrawerClose}>close</IconButton>
          </div>
          <Divider />
          <List>
          {Object.keys(children).map((text, index) => (
            <ListItem button key={text} onClick={navi}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        </Drawer>
        <div className={classes.toolbar}>
          <Message/>
          <Selector>
            {children}
          </Selector>
          <Copyright/>
        </div>
      </div>
    );
  }


  
  
  const OldLogin =()=> {
    const { state, dispatch } = React.useContext(Store);
    const myRef =  React.useRef(null);
    const asynclogin = React.useCallback(() =>{
      fetchData({ 
        type: ActionType.ASYNCLOGIN, 
        value : myRef.current.value
      }, dispatch)
    }); 
    const logout = React.useCallback((e) => dispatch({ type: ActionType.LOGOUT}), [dispatch]);
    
    if(state.authName == undefined)
    {
      return (
        <div>
          <b> Token：</b>
          <input id="password" type="password" ref={myRef}/> 
          <button onClick={asynclogin}>Login</button>
        </div>
      )
    }else{
      return (
        <div>
          {String(state.busy)}
          <b> {state.authName} </b>
          <button onClick={logout}>Logout</button>
        </div>
      )
    }
  }
  
  //Login
  
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
          <MaterialUI.TextField 
            id="password" inputRef={myRef}
            className={classes.textField} variant="outlined" size="small"
            type="password"
            label="token" 
            autoComplete="current-password"
            />
          <MaterialUI.Button color="inherit" onClick={asynclogin}>Login</MaterialUI.Button>
        </>
      )
    }else{
      return (
        <>
          <p>Signed in as <b>{state.authName}</b></p>
          <MaterialUI.Button color="inherit" onClick={logout}>Logout</MaterialUI.Button>
        </>
      )
    }
  }
  
  //Search Issue
  
  const SearchIssue =()=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const myRef =  React.useRef();
    const asynclogin = React.useCallback(() =>{
      fetchData({ 
        type: ActionType.ASYNCSEARCHISSUE, 
        value : myRef.current.value
      }, dispatch);
    });
    return (
        <>
          <div>
            <MaterialUI.TextField 
              id="searchissue" inputRef={myRef}
              variant="outlined" size="small"
              label="Lot No." 
              />
          </div>
          <div>
            <MaterialUI.Button color="inherit" onClick={asynclogin}>Search</MaterialUI.Button>
          </div>
          <ViewIssue/>
        </>
      );
  }

  const ViewIssue =()=> {
    const classes = useStyles();
    const defaultVal = "-1";
    const { state, dispatch } = React.useContext(Store);
    const [selectVal, setSelectVal] = React.useState(defaultVal);
    const asyncview = React.useCallback((e) =>{
      setSelectVal(e.target.value);
    });
    const result = (list)=> list.data.map(n => (
      <MaterialUI.FormControlLabel control={<MaterialUI.Radio/>} key={`lost_${n.number}`} value={String(n.number)} label={`${n.number} : ${n.title}`} /> 
    ));
    return (
      <>
      <MaterialUI.FormControl component="fieldset">
        <MaterialUI.FormLabel component="legend">Result</MaterialUI.FormLabel>
        <MaterialUI.RadioGroup aria-label="gender" name="gender1" defaultValue={defaultVal} onChange={asyncview}>
        <MaterialUI.FormControlLabel control={<MaterialUI.Radio/>} value={defaultVal} label={"null"} />
          {result(state.issuelist)}
        </MaterialUI.RadioGroup>
      </MaterialUI.FormControl> 
      <ViewIssue2>{selectVal}</ViewIssue2>
      </>
    );
  }

  const ViewIssue2 =({children})=> {
    const [val, setVal] = React.useState({});
    React.useEffect(() => { 
      try{
        api.asyncGetIssueFromNum(owner, repo, Number(children)).then(issue=>{
          setVal(issue);
        });
      }catch{

      }
    }, [children]);
    return (
      <div>
        id : {children} kanban : {val.kanban}
        <MermaidChart.ProcessGraph value={val.kanban} />
        <div>
          title : {val.title}<br/>
          url : {val.html_url}<br/>
          body : <pre>{val.body}</pre>
        </div>
      </div> 
    );
  }

  // substitute for export
  window.MaterialAppBar = MaterialAppBar;
  window.SearchIssue = SearchIssue;

})();
