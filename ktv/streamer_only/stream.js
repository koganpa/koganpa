const peer = new Peer({
  key: 'a43fe550-05fc-4ad6-a371-89b2e2125e38',
  debug: 3,
});

console.log("SKYWAY_APP_ID:", SKYWAY_APP_ID);

document.getElementById('startBtn').onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('localVideo').srcObject = stream;

    peer.on('open', id => {
      peer.call('live-stream', stream);
      alert('配信開始！');
    });
  } catch (e) {
    console.error(e);
    alert('配信に失敗しました');
  }
};


