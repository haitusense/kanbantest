/******** Actions, ActionCreater ********/

const ActionType = {
  RESET : 'RESET',
  ISBUSY : 'ISBUSY',
  ASYNCLOGIN : "ASYNCLOGIN",
  LOGOUT : "LOGOUT",
  DEFAULT : "DEFAULT",
  ERR : "ERR"
}

const api = new GithubAPI();

/******** Reducers, Store ********/

const initialState = {
  authName : undefined,
  owner : 'haitusense',
  repo : 'kanbantest',
  busy : false,
  token : undefined,
  err : undefined
}

function createReducer(handlers) {
  return (state, action) => {
    console.log("reducer", action);
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

const reducer = createReducer({
  RESET: () => initialState,
  ISBUSY : (state, action) => ({ ...state, busy : true }),
  ERR : (state, action) => ({ ...state, err : action.value }),
  ASYNCLOGIN : (state, action) => {
    const nextState = { ...state };
    nextState.authName = action.value;
    nextState.busy = false;
    return nextState;
  },
  LOGOUT : (state, action) => {
    const nextState = { ...state };
    api.changeAuth(undefined);
    nextState.authName = undefined;
    return nextState;
  },
});


async function fetchData(action, dispatch){
  console.log("fetch", action);
  dispatch({ type: ActionType.ISBUSY });
  switch(action.type) {
    case ActionType.ASYNCLOGIN:{
      //await wait(3000);
      try{
        api.changeAuth(action.value);
        let dst = await api.asyncGetRateLimit();
        dispatch({...action, value : dst.login})
      }catch (error) {
        console.log("Request failed:", error);
        console.log(error.message);
        dispatch({ type: ActionType.ERR, value : `${error.status} : token err`});
        dispatch({...action, value : undefined})
      }
      return;
    }
    default:
      throw new Error();
  }
}

const Store = React.createContext();


/******** Components ********/

const useStyles = MaterialUI.makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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

function Loading ({children}) {
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

/******** Provider, Render ********/

const Provider = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <Store.Provider value={{state, dispatch}}>
      {children}
    </Store.Provider>
  );
}

const App = () => (
  <Provider> 
    <Loading  />
    <ButtonAppBar/>
    <Message/>  
    <MermaidGraph/>
    <MermaidChart/>
    <MermaidMap/>

    <Copyright/>
  </Provider>
);
