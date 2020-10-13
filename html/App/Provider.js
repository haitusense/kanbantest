/******** Provider ********/
'use strict';

define(
  [
    'react', 
    'jsx!App/initialState',
    'jsx!App/reducer',
    'jsx!App/store',
  ],
  (
    React,
    initialState,
    reducer,
    Store,
  )=>{

  const Provider = ({children, eventTarget}) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    React.useEffect(() => {
      console.log('Provider mounting...');
      Object.keys(eventTarget).map(key => {
        eventTarget[key](dispatch);
      });
      return () => console.log('Provider unmounting...');
    }, []);
    return <Store.Provider value={{state, dispatch}}>{children}</Store.Provider>;
  }

  return Provider;
});