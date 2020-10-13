'use strict';

define(['react', 'jsx!App/actions', 'App/store', 'material-ui'],  
(
  React,
  ActionType,
  Store,
  {
    Backdrop, CircularProgress, Typography, Link, Snackbar, Button
  }
)=>{

  const Selector =({children})=> {
    const { state, dispatch } = React.useContext(Store);
    return (
      <React.Fragment>{
        Object.keys(children).indexOf(state.region) !== -1
        ? (<React.Fragment>{children[state.region]}</React.Fragment>)
        : (<div>null</div>)
      }</React.Fragment>
    );
  }

  const lazy =(path)=> {  
    const Dst =()=>{
      const { state, dispatch } = React.useContext(Store);
      const [isTransition, setTransition] = React.useState(false);
      React.useEffect(() =>{
        console.log(path)
        dispatch({ type: ActionType.LOADING, value: path});
        requirejs([path], (obj)=>{ 
          setTransition(true); 
          dispatch({ type: ActionType.LOADED, value: path});
        });
      }, []);
      if (isTransition) {
        let Dependency = require(path);
        return <Dependency/>;
      }else{
        return <div>Loading...</div>;
      }
    }
    return <Dst/>;
  }

  const Loading =({children})=>{
    const { state } = React.useContext(Store);
    return(
      <React.Fragment>
        <Backdrop open={state.loading.length > 0} style={{zIndex:"100"}}>
          <CircularProgress color="inherit"/>
        </Backdrop>
      </React.Fragment>
    );
  }
  
  const Copyright =({name,href})=> {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href={href}>
          {name}
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const ErrSnackbar =({name,href})=> {
    //const [open, setOpen] = React.useState(false);
    const { state, dispatch } = React.useContext(Store);
    const handleClose = React.useCallback((e) => {
      dispatch({type: ActionType.ERR_HANDLED});
    }, [dispatch]);
    const handleClose2 = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }  
      //setOpen(false);
      dispatch({type: ActionType.ERR_HANDLED})
    };  
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={!(state.err.handled)}
        message={state.err.message}
        autoHideDuration={6000}
        onClose={handleClose}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              CLOSE
            </Button>
          </React.Fragment>
        }
      />
    );
  }

  return {Selector, lazy, Copyright, Loading, ErrSnackbar};
});