const peer = new Peer({
  key: '6e21fb13-42b8-488b-9371-394c3aac5df1',
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
