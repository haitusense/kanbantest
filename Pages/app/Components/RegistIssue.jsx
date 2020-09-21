/******** Components ********/

(() => {

  // substitute for import
  const {Typography, Box, Button,TextField} = MaterialUI;

  const callSignature =(func)=> requirejs(
    ['https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js']
    , (sig)=>{
      func(sig);
    }
  );
  const callYaml = ()=>{
    return new Promise((resolve, reject) => {
      requirejs(
        ['https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.14.0/js-yaml.js']
        , (yaml)=>{
          resolve(yaml);
        }
      );
    });
  };

  //自動採番
  const getNo =()=>{
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth()+1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    const dst = "test-" + y + m + d;
    return dst;
  }

  const RegistIssue =()=> {
    const createField=(id, name, label)=>{
      return <TextField variant="outlined" margin="normal" fullWidth id={id} key={"tf"+id} 
        label={label} name={name} />
    }
    const handleSubmit = React.useCallback((event) =>{
      const target = event.target;
      (async ()=>{
        const _yaml = await callYaml();

        const obj = {
          title : target.lotno.value,
          body : `
          ${target.comment.value}
          \`\`\`
          ${_yaml.safeDump({
            B : target.B.value,
            C : target.C.value,
          })}
          \`\`\`
          `
        }
        console.log(obj);
        api.asyncRegistIssue(owner, repo, obj);
      })();
      event.preventDefault();
    });
    React.useEffect(() => { 

    }, []);
    return (
        <div>
          <Typography component="h1" variant="h5">Issue a TravelSheet</Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField variant="outlined" margin="normal" fullWidth id="lotno" label="LotNo" name="lotno"
              defaultValue={getNo()}/>
            {[
              {id:"comment", label:"Comment", name:"comment"},
              {id:"B", label:"B", name:"B"},
              {id:"C", label:"C", name:"C"}
            ].map(n => createField(n.id,n.name,n.label))}
            <Button type="submit" fullWidth variant="contained" color="primary">
              Regist
            </Button>
          </form>
        </div>
    );
  }
    

  //https://github.com/szimek/signature_pad
  const Signature = ()=>{
    const myRef = React.useRef();
    const myRef2 = React.useRef();
    const width = 320;
    const height = 60;
    React.useEffect(() =>{
      callSignature((SignaturePad)=>{
        let signaturePad = new SignaturePad(myRef.current,
          {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)',
            onEnd : ()=>{
              myRef2.current.src = signaturePad.toDataURL("image/svg+xml");
            }
          });  
      });
    } , [myRef]);
    return (
      <div>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Typography component="div">
            <Box fontWeight="fontWeightLight" m={1}>Signature</Box>
          </Typography>
          <canvas width={width} height={height} ref={myRef} style={{border:"1px dotted",borderBottom:"1px solid"}}/>
          <Typography component="div">
            <Box fontWeight="fontWeightLight" m={1} fontSize={8}>Preview</Box>
          </Typography>
          <img ref={myRef2} width={width/4} height={height/4} alt="no signature" style={{borderBottom:"1px solid black"}}/>
      </div>
    )
  }

  // substitute for export
  window.RegistIssue = RegistIssue;

})();

