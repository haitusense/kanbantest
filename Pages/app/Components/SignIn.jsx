/******** Components ********/

(() => {

  // substitute for import
  const Typography = MaterialUI.Typography;
  const TextField = MaterialUI.TextField;
  const Button = MaterialUI.Button;



  const SignIn =()=> {
    const classes = useStyles();
    return (
        <div>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
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

