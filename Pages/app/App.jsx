/******** Actions, ActionCreater ********/

const ActionType = {
  RESET : 'RESET',
  ISBUSY : 'ISBUSY',
  ASYNCLOGIN : "ASYNCLOGIN",
  LOGOUT : "LOGOUT",
  DEFAULT : "DEFAULT",
  ASYNCSEARCHISSUE : "ASYNCSEARCHISSUE",
  ERR : "ERR"
}

const api = new GithubAPI();
const owner = 'haitusense';
const repo = 'kanbantest';

/******** Reducers, Store ********/

const initialState = {
  authName : undefined,
  busy : false,
  token : undefined,
  err : undefined,
  region : 'search',

  issuelist: { data : [], count : 0}
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
  ASYNCSEARCHISSUE : (state, action) => {
    const nextState = { ...state };
    nextState.issuelist = action.value;
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
    case ActionType.ASYNCSEARCHISSUE:{
      try{
        let dst = await api.asyncGetIssuesFromTitle(owner, repo, action.value, 10);
        console.log(dst);
        dispatch({...action, value : dst})
      }catch (error) {
        console.log("Request failed:", error);
        console.log(error.message);
        dispatch({ type: ActionType.ERR, value : `${error.status} : token err`});
        dispatch({...action, value : initialState.issuelist})
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
    <Selector/>
    <Copyright/>
  </Provider>
);
