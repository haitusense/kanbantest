'use strict';

define(
  [
    'react', 
    'react-dom',
    'jsx!App/Provider',
    'jsx!App/Components/AppBar',
    'jsx!App/Components/Common',
    'material-ui',
  ],
  (
    React,
    ReactDOM, 
    Provider,
    AppBar,
    { Selector, lazy, Copyright, Loading, ErrSnackbar },
    { Box, CssBaseline },
  )=>{

  /* Regions */
  const regionManeger = {
    Home : lazy('jsx!App/Components/Home'),
    Default : (<div>under construction</div>),
  };

  /* EventListener */
  const eventTarget = {
    screenChanged : (dispatch)=> window.addEventListener("orientationchange", ()=>{
      setTimeout(()=>{
        const width = window.parent.screen.width
        const height = window.parent.screen.height
        dispatch({ type: ActionType.SCREEN, value:{width:width,height:height}});
      }, 100);
    }),
  }
  
  const App = () => (
    <Provider eventTarget={eventTarget}>
      <AppBar title="Test" regions={regionManeger}>
        <Loading/>
        <ErrSnackbar/>
        <Box mt={10} width="auto" minHeight={480}>
          <Selector>{regionManeger}</Selector>
        </Box>
        <Box mt={3}>
          <Copyright name={globalVariables.organization} href={globalVariables.href}/>
        </Box>
      </AppBar>
    </Provider>
  );

  ReactDOM.render(<App />, document.getElementById('root'));
});
