const { SkyWayContext, SkyWayStreamFactory, SkyWayRoom } = window.skyway_room;

const APP_ID = "7b2695fe-e087-45b1-98b7-b4020baeca31";  // 公式ガイドで取得した APP ID をここに

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").onclick = async () => {
    try {
      const media = await SkyWayStreamFactory.createCameraVideoStream();
      document.getElementById("localVideo").srcObject = media.mediaStream;

      const context = await SkyWayContext.Create(APP_ID);

      const room = await SkyWayRoom.FindOrCreate(context, {
        name: "live-stream",
        type: "p2p",
      });

      const me = await room.join();

      await me.publish(media);

      alert("配信を開始しました！");
    } catch (err) {
      console.error("配信失敗エラー:", err);
      alert("配信に失敗しました。コンソールを見てください。");
    }
  };
});
