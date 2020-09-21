/******** Actions, ActionCreater ********/

/*
const ActionType2 = {
  RESET : 'RESET',
  ISBUSY : 'ISBUSY',
  ASYNCLOGIN : "ASYNCLOGIN",
  ERR : "ERR",
  NAVIGATE : "NAVIGATE"
}
*/
const Actions = [
  'RESET',
  'ISBUSY',
  "ASYNCLOGIN",
  "LOGOUT",
  "DEFAULT",
  "ASYNCSEARCHISSUE",
  "ERR",
  "NAVIGATE",
]
const ActionType = Actions.reduce((accumulator, currentValue) =>{
  if (currentValue in accumulator) throw new Error('Err : Action Creater');
  return ({...accumulator, [currentValue] : currentValue});
},{});

const api = new GithubAPI();
const owner = 'haitusense';
const repo = 'kanbantest';

/******** Reducers, Store ********/
const getParams = (val, def)=>{
  const dst = ((new URL(document.location)).searchParams).get(val);
  return dst ? dst : def;
};
//if(getParams('token',undefined)!=undefined)
//{
//  api.changeAuth(getParams('token',undefined));
//}

const initialState = {
  region : getParams('region', 'Sign In'),
  busy : false,

  authName : undefined,
  token : undefined,
  err : undefined,

  issuelist: { data : [], count : 0}
}

function createReducer(handlers) {
  return (state, action) => {
    console.log("reducer", action);
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      throw new Error()
      //return state;
    }
  };
}

const reducer = createReducer({
  RESET: () => initialState,
  ISBUSY : (state, action) => ({ ...state, busy : true }),
  ERR : (state, action) => ({ ...state, err : action.value }),
  NAVIGATE : (state, action) => ({ ...state, region : action.value }),
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
    <MaterialAppBar>
      {{
        ["Sign In"] : (<SignIn/>),
        ["State Of Progress"] : (<div>under construction</div>),
        ["View Lot State"] : (<SearchIssue/>),
        ["View Lot Trend"] : (<RenderLineChart/>),
        ["Map"] : (<MermaidChart.Map/>),
        ["Regist a TravelSheet"] : (<RegistIssue/>),
        ["Cam Test"] : (<QRCam/>),
      }}
    </MaterialAppBar>
  </Provider>
);

ReactDOM.render(<App/> , document.getElementById('root'));
