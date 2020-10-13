/******** State ********/
'use strict';

define([],()=>{
  
  let data = undefined;
  try{
    data = JSON.parse(localStorage.getItem('localStorageState'));
  }catch(e){
    console.log(e);
    data = null;
  }

  const initialState = Object.assign({
    loading : [],
    region : 'Home',
    oldRegion : [],
    title : document.title,
    err : { handled: true, type : undefined, message : undefined},
    screen : {width: window.parent.screen.width, height:window.parent.screen.height},
  },
  data
);

  return initialState;
});