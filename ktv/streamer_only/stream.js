const peer = new Peer({
  key: '6e21fb13-42b8-488b-9371-394c3aac5df1',  // App ID（旧SDKのkey）
  debug: 3,
});

document.getElementById('startBtn').onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    document.getElementById('localVideo').srcObject = stream;

    peer.on('open', id => {
      // 部屋名を決めて自分のstreamを配信（簡易p2p）
      const call = peer.call('live-stream', stream);
      alert('配信開始！');
    });
  } catch (e) {
    console.error(e);
    alert('配信に失敗しました');
  }
};
