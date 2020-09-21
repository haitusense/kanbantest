/******** Components ********/

(() => {

  // substitute for import
  const {Typography, TextField, Button, Box} = MaterialUI;

  const SignIn =()=> {
    const { state, dispatch } = React.useContext(Store);
    const classes = useStyles();
    const handleSubmit = React.useCallback((event) =>{
      event.preventDefault();
      fetchData({ 
        type: ActionType.ASYNCLOGIN, 
        value : event.target.token.value
      }, dispatch);
    });
    return (
        <div>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <form noValidate onSubmit={handleSubmit}>
            <Typography variant="caption" ></Typography>
            <TextField variant="outlined" margin="normal" fullWidth
              required disabled
              id="email" name="email" label="Email Address"
              autoComplete="email"
            />
            <TextField variant="outlined" margin="normal" fullWidth
              required disabled
              id="password" name="password" label="Password"
              type="password"
              autoComplete="current-password"
            />
            <Typography variant="caption" ></Typography>
            <TextField variant="outlined" margin="normal" fullWidth
              required
              id="token" name="token" label="Token"
              autoFocus
              type="password"
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" fullWidth
              color="primary"
              className={classes.submit} >
              Sign In
            </Button>
          </form>
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
  

  // substitute for export
  window.SignIn = SignIn;

})();

