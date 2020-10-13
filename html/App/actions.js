/******** Actions, ActionCreater ********/
'use strict';

define(['immer'],({produce})=>{

  const Actions = [
    'LOADING',
    'LOADED',

    'NAVIGATE',

    'TITLE',
    'SCREEN',

    'ERR',
    'WARNING',
    'ERR_HANDLED',

    'RESET',
  ];
  
  const createAction =(src)=> src.reduce((accumulator, currentValue) =>{
    if (currentValue in accumulator) throw new Error('Err : createAction');
    return produce(accumulator, draft => { draft[currentValue] = currentValue; });
  },{});

  const ActionType = createAction(Actions);
  return ActionType;
});