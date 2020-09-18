/******** Components ********/

(() => {

  // substitute for import
  const Typography = MaterialUI.Typography;
  const TextField = MaterialUI.TextField;
  const Button = MaterialUI.Button;

  //https://github.com/szimek/signature_pad
  const Signature = ()=>{
    const myRef = React.useRef();
    const myRef2 = React.useRef();
    React.useEffect(() =>{
      let signaturePad = new SignaturePad(myRef.current,
        {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          penColor: 'rgb(0, 0, 0)',
          onEnd : ()=>{
            //this.onchange(this.signaturePad.toDataURL("image/svg+xml"))
            myRef2.current.src = signaturePad.toDataURL("image/svg+xml");
          }
        });
    } , [myRef]);
    return (
      <div>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <canvas ref={myRef} style={{border:"1px dotted",borderBottom:"1px solid"}}/>
        <img ref={myRef2} alt="no signature" style={{borderBottom:"1px solid black"}}/>
        </div>
    )
  }



  // substitute for export
  window.Signature = Signature;

})();

