/******** Components ********/
(() => {
  function Loading() {
    const { state } = React.useContext(Store);
    return (
      <MaterialUI.Backdrop open={state.busy} style={{zIndex:"100"}}>
        <MaterialUI.CircularProgress color="inherit"/>
      </MaterialUI.Backdrop>
    );
  }
  
  function ButtonAppBar() {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <MaterialUI.AppBar position="static">
          <MaterialUI.Toolbar>
            <MaterialUI.IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MaterialUI.Icon className="fa fa-plus-circle">menu</MaterialUI.Icon>
            </MaterialUI.IconButton>
            <MaterialUI.Typography variant="h6" className={classes.title}>
              HAITUSENSE KANBAN
            </MaterialUI.Typography>
            <MaterialLogin/>
          </MaterialUI.Toolbar>
        </MaterialUI.AppBar>
      </div>
    );
  }
  
  function Message () {
    const { state, dispatch } = React.useContext(Store);
    return <h2><font color="#ff0000">{state.err}</font></h2>
  }
  
  function Copyright() {
    return (
      <MaterialUI.Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <MaterialUI.Link color="inherit" href="http://haitusense.com/">
          Haitusense Co,.Ltd.
        </MaterialUI.Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </MaterialUI.Typography>
    );
  }
  
  const Selector =()=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    switch (state.region) {
      case 'search':
        return (<><SearchIssue/></>);
      default:
        return (<><div>404</div></>);
    }
  }
  //<MermaidGraph/>
  //<SearchIssue/>
  
  
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

  window.Loading = Loading;
  window.ButtonAppBar = ButtonAppBar;
  window.Message = Message;
  window.Copyright = Copyright;
  window.Selector = Selector;

})();
