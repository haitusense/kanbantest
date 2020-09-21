(() => {

  const callSignature =(func)=> requirejs(
    ['https://cdn.jsdelivr.net/npm/jsqr@1.3.1/dist/jsQR.min.js']
    , (sig)=>{
      func(sig);
    }
  );


  const QRCam = ()=>{
    const refVideo = React.useRef();
    const refSnap = React.useRef();
    const refResult = React.useRef();
    const width = 320;
    const height = 60;
    React.useEffect(() =>{

      //1.
      let width = refSnap.width;
      let height = refSnap.height;
      
      //2.
      let startScan = (callback)=> {
        const canvasContext = refSnap.getContext("2d");
        // 500ms間隔でスナップショットを取得し、QRコードの読み取りを行う
        let intervalHandler = setInterval(() => {
          canvasContext.drawImage(player, 0, 0, width, height);
          const imageData = canvasContext.getImageData(0, 0, width, height);
          const scanResult = jsQR(imageData.data, imageData.width, imageData.height);
          if (scanResult) {
            clearInterval(intervalHandler);
            if (callback) {
              callback(scanResult);
            }
          }
        }, 500);
      }

      //3.
      let handleSuccess = (stream)=> {
        player.srcObject = stream; // カメラストリームをプレイヤーのデータに設定
        startScan((scanResult) => {
          refResult.innerText = scanResult.data;
        });
      };

      //4.
      navigator.mediaDevices.getUserMedia({
        video: {facingMode: "environment", width: width, height: height}, audio: false
      }).then(handleSuccess)
      .catch(err => {
        console.log(JSON.stringify(err));
      });

    } , [refVideo, refSnap]);
    
    return (
      <div>
        <div id="result" ref={refResult}>null</div>
        <video id="player" ref={refVideo} autoplay></video>
        <canvas id="snapshot" ref={refSnap} width="480" height="640"></canvas>
      </div>
    )
  }

  window.QRCam = QRCam;
})();