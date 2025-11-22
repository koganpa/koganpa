const { SkyWayContext, SkyWayStreamFactory, SkyWayRoom } = window.skyway_room;
const SKYWAY_APP_ID = "6e21fb13-42b8-488b-9371-394c3aac5df1";

document.getElementById("startBtn").onclick = async () => {
  try {
    const stream = await SkyWayStreamFactory.createCameraVideoStream();
    document.getElementById("localVideo").srcObject = stream.mediaStream;

    const context = await SkyWayContext.Create(SKYWAY_APP_ID);
    const room = await SkyWayRoom.FindOrCreate(context, {
      name: "live-stream",
      type: "p2p",
    });

    const me = await room.join();
    await me.publish(stream);

    alert("配信を開始したよ！");
  } catch (err) {
    console.error("配信失敗エラー:", err);
    alert("配信に失敗しました。コンソールを確認してね。");
  }
};
