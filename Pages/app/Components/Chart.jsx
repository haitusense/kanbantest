(() => {

  mermaid.initialize({
    startOnLoad:false,
    securityLevel: 'loose',
    theme: 'forest',
    flowchart:{
      useMaxWidth:false,
      htmlLabels:true
    }
  });
  //window.mermaid.init(undefined, document.querySelectorAll('.language-mermaid'));
    
  
  
  const AsciiMap =(src)=> `
  ..${src[0]}${src[1]}..
  .${src[2]}${src[3]}${src[4]}${src[5]}.
  ..${src[6]}${src[7]}..
  `;
  
  const AsciiGantt =(src)=> `
  gantt
    title Progress Diagram
    dateFormat  YYYY-MM-DD
    section Lot-1
      Process-1 : crit, a1, 2014-01-01, 60d
      Process-2 :       a2, after a1  , 20d
    section Lot-2
      Process-1 :       b1, 2014-03-01, 60d
      Process-2 :       b2, after b1, 20d
  `;


/******** Components ********/

// idが被ると表示しないので、回避する必要ある

const ProcessGraph =(props)=>{
  const ref =  React.useRef(null);
  const ProcessType = {
    A : 'Planed',
    B : 'Process-1',
    C : "Process-2",
    D : "Done",
  };
  const AsciiGraph =(src)=> {
    const pKey = Object.keys(ProcessType).filter((key) => ProcessType[key] === src);
    const color = (pKey.length == 1 ? `style ${pKey[0]} fill:#f9f` : "");
    return `
      graph LR
        A(${ProcessType.A}) --> B
        B[${ProcessType.B}] --> C
        C[${ProcessType.C}] --> D[${ProcessType.D}]
        ${color}
    `;
  }
  React.useEffect(() => {
    ref.current.innerHTML = "";
    mermaid.mermaidAPI.render('mermaidGraph_id', AsciiGraph(props.value), (svg,bindEvents)=>{
      ref.current.innerHTML = svg;
      bindEvents();
    });
  }, [props.value]); //第二引数が変化したとき再動作
  return <div ref={ref}/>
}

function Chart () {
  const { state } = React.useContext(Store);
  const ref =  React.useRef(null);
  const p = state.authName == undefined ? "Planed" : "Process-1";
  React.useEffect(() => {
    ref.current.innerHTML = "";
    mermaid.mermaidAPI.render('mermaid_id2', AsciiGraph(p), (svg,bindEvents)=>{
      ref.current.innerHTML = svg;
      bindEvents();
    });
  }, [state.authName]); //第二引数が変化したとき再動作
  return <div ref={ref}/>
}

function Gantt () {
  const { state } = React.useContext(Store);
  const ref =  React.useRef(null);
  const p = state.authName == undefined ? "Planed" : "Process-1";
  React.useEffect(() => {
    ref.current.innerHTML = "";
    mermaid.mermaidAPI.render('mermaidGantt_id', AsciiGantt(p), (svg,bindEvents)=>{
      ref.current.innerHTML = svg;
      bindEvents();
    });
  }, [state.authName]); //第二引数が変化したとき再動作
  return <div ref={ref}/>
}

function Map () {
  const { state } = React.useContext(Store);
  const map = [0,1,1,2,3,4,5,6,7,1,2];
  return <pre>{AsciiMap(map)}</pre>
}

  window.MermaidChart = {
    ProcessGraph,
    Chart,
    Gantt,
    Map
  }

})();

