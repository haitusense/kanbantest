/******** Components ********/

(() => {

  // substitute for import
  const {
    Backdrop, CircularProgress, 
    AppBar, Toolbar, Typography, Drawer, IconButton,
    Divider, List, ListItem, ListItemText,
    Link
  } = MaterialUI;

  //Search Issue
  
  const SearchIssue =()=> {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const myRef =  React.useRef();
    const asynclogin = React.useCallback(() =>{
      fetchData({ 
        type: ActionType.ASYNCSEARCHISSUE, 
        value : myRef.current.value
      }, dispatch);
    });
    return (
        <>
          <div>
            <MaterialUI.TextField 
              id="searchissue" inputRef={myRef}
              variant="outlined" size="small"
              label="Lot No." 
              />
          </div>
          <div>
            <MaterialUI.Button color="inherit" onClick={asynclogin}>Search</MaterialUI.Button>
          </div>
          <ViewIssue/>
        </>
      );
  }

  const ViewIssue =()=> {
    const classes = useStyles();
    const defaultVal = "-1";
    const { state, dispatch } = React.useContext(Store);
    const [selectVal, setSelectVal] = React.useState(defaultVal);
    const asyncview = React.useCallback((e) =>{
      setSelectVal(e.target.value);
    });
    const result = (list)=> list.data.map(n => (
      <MaterialUI.FormControlLabel control={<MaterialUI.Radio/>} key={`lost_${n.number}`} value={String(n.number)} label={`${n.number} : ${n.title}`} /> 
    ));
    return (
      <>
      <MaterialUI.FormControl component="fieldset">
        <MaterialUI.FormLabel component="legend">Result</MaterialUI.FormLabel>
        <MaterialUI.RadioGroup aria-label="gender" name="gender1" defaultValue={defaultVal} onChange={asyncview}>
        <MaterialUI.FormControlLabel control={<MaterialUI.Radio/>} value={defaultVal} label={"null"} />
          {result(state.issuelist)}
        </MaterialUI.RadioGroup>
      </MaterialUI.FormControl> 
      <ViewIssue2>{selectVal}</ViewIssue2>
      </>
    );
  }

  const ViewIssue2 =({children})=> {
    const [val, setVal] = React.useState({});
    React.useEffect(() => { 
      try{
        api.asyncGetIssueFromNum(owner, repo, Number(children)).then(issue=>{
          setVal(issue);
        });
      }catch{

      }
    }, [children]);
    return (
      <div>
        id : {children} kanban : {val.kanban}
        <MermaidChart.ProcessGraph value={val.kanban} />
        <div>
          title : {val.title}<br/>
          url : {val.html_url}<br/>
          body : <pre>{val.body}</pre>
        </div>
      </div> 
    );
  }

  // substitute for export
  window.SearchIssue = SearchIssue;

})();

