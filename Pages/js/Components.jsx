/******** Components ********/

function Message () {
  const { state, dispatch } = React.useContext(Store);
  return <h2><font color="#ff0000">{state.err}</font></h2>
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
        <b>Signed in as  {state.authName} </b>
        <MaterialUI.Button color="inherit" onClick={logout}>Logout</MaterialUI.Button>
      </>
    )
  }
}
