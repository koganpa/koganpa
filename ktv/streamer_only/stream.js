const peer = new Peer({
  key: 'd940e091-a4fa-4946-baa0-3bf8ffa296bd',
  debug: 3,
});

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

