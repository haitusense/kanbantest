 const asyncOctokit = async () =>{ 
   let hoge = await import('https://cdn.skypack.dev/@octokit/rest');
   return new hoge.Octokit();
 }
  
 const asyncGraphql = async () =>{
   let dst = await import('https://cdn.skypack.dev/@octokit/graphql');
   return dst;
 }
  
const globalVariables = {
  organization : 'haitusense Co.,Ltd.',
  href : 'https://github.com/haitusense'
};

const regionPaths = {
  Home : 'jsx!App/Components/Home',
};

(async()=>{
  window.babelConfig = {};
  if(babelflag){
    requirejs.config({
      paths: {
        'jsx': 'App/Logic/react-require.min',
        'babel': 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min',
        'react': 'https://unpkg.com/react@16/umd/react.development',
        'react-dom': 'https://unpkg.com/react-dom@16/umd/react-dom.development',
        'material-ui': 'https://unpkg.com/@material-ui/core@latest/umd/material-ui.production.min',
        'immer': 'https://unpkg.com/immer@6.0.3/dist/immer.umd.production.min',
      },
    });
  }else{
    requirejs.config({
      paths: {
        'jsx': 'App/Logic/react-require.min',
        'babel': 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min',
        'react': 'https://unpkg.com/react@16/umd/react.production.min',
        'react-dom': 'https://unpkg.com/react-dom@16/umd/react-dom.production.min',
        'material-ui': 'https://unpkg.com/@material-ui/core@latest/umd/material-ui.production.min',
        'immer': 'https://unpkg.com/immer@6.0.3/dist/immer.umd.production.min',
      },
    });     
  }
  require(['jsx!App/App']);
})();
