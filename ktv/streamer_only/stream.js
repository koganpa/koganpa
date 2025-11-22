// グローバル変数skyway_roomから必要なオブジェクトを取得
const { SkyWayContext, SkyWayStreamFactory, SkyWayRoom } = window.skyway_room;

// 自分のSkyWayアプリIDを入れてね（最新の公式ダッシュボードから取得）
const SKYWAY_APP_ID = "6e21fb13-42b8-488b-9371-394c3aac5df1";

document.getElementById("startBtn").onclick = async () => {
  try {
    // カメラ映像を取得
    const stream = await SkyWayStreamFactory.createCameraVideoStream();
    const videoElem = document.getElementById("localVideo");
    videoElem.srcObject = stream.mediaStream;

    // SkyWayに接続（App IDだけでOKな簡易認証）
    const context = await SkyWayContext.Create(SKYWAY_APP_ID);

    // 部屋作成 or 参加（p2p型）
    const room = await SkyWayRoom.FindOrCreate(context, {
      name: "live-stream",
      type: "p2p",
    });

    const me = await room.join();

    // 映像を公開（配信開始）
    await me.publish(stream);

    alert("配信を開始したよ！");
  } catch (err) {
    console.error("配信失敗エラー:", err);
    alert("配信に失敗しました。コンソールを確認してね。");
  }
};
