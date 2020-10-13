/******** Reducers ********/
'use strict';

define(['immer'],({produce})=>{

  const flagUrlTransition = false;

  const reducers = {

    LOADING : (draft, action) => { draft.loading.push(action.value); },
    LOADED : (draft, action) => {
      const found = draft.loading.findIndex(element => element == action.value);
      if(found > -1) draft.loading.splice(found, 1);
    },
    
    NAVIGATE : (draft, action) => {
      if(action.value == 'back'){
        draft.region = draft.oldRegion.pop();
      }else if(action.value == 'home'){
        draft.oldRegion = [];
        draft.region = home;  
      }else{
        draft.oldRegion.push(draft.region);
        draft.region = action.value;  
      }
    },
    
    TITLE : (draft, action) => { draft.title = action.value; },

    SCREEN: (draft, action) => { draft.screen = action.value; },

    ERR : (draft, action) => { draft.err = ({ 
        handled: false, 
        type : 'err', 
        message : action.value 
      });
    },
    WARNING : (draft, action) => { draft.err = { 
        handled: false, 
        type : 'warning', 
        message : action.value 
      }; 
    },
    ERR_HANDLED : (draft, action) => { draft.err = { 
      handled: true, 
    }; 
  },
    RESET : (draft, action) => { draft = initialState; },
    
    //LOADING : (state, action) => produce(state, draft => draft.loading = true)
  };
  

  const createReducer =(handlers)=>{
    return (state, action) => {
      console.log("reducer", action);
      if((action.type == "NAVIGATE")&&flagUrlTransition){
        const dst = produce(state, draft => handlers[action.type](draft, action));
        localStorage.setItem('localStorageState', JSON.stringify(dst))
        window.location.href = `${(new URL(document.location)).pathname}?Page=${dst.region}`;
        return dst;
      }else if (handlers.hasOwnProperty(action.type)) {
        return produce(state, draft => handlers[action.type](draft, action));
      } else {
        throw new Error('Err : createReducer');
      }
    }
  };

  const reducer = createReducer(reducers);
  return reducer;
});