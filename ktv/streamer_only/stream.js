import {
  SkyWayAuthToken,
  nowInSec,
  uuidV4,
  SkyWayContext,
  SkyWayStreamFactory,
  SkyWayRoom
} from "https://cdn.jsdelivr.net/npm/@skyway-sdk/room/dist/skyway_room-latest.mjs";

const APP_ID = "6e21fb13-42b8-488b-9371-394c3aac5df1";
const SECRET = "yoiM6kXWFO6YaxUnSwOY2IHayCScAhRguhEWKLcROzg=";

function createToken() {
  return new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 3600,
    scope: {
      appId: APP_ID,
      sfu: {
        rooms: ["*"],
        actions: ["publish", "subscribe", "join"]
      }
    }
  }).encode(SECRET);
}

document.getElementById("startBtn").onclick = async () => {
  try {
    const token = createToken();
    const context = await SkyWayContext.Create(token);
    const stream = await SkyWayStreamFactory.createCameraVideoStream();
    document.getElementById("localVideo").srcObject = stream.mediaStream;

    const room = await SkyWayRoom.FindOrCreate(context, {
      name: "live-stream",
      type: "p2p"
    });

    const me = await room.join();
    await me.publish(stream);

    alert("配信開始！");
  } catch (error) {
    console.error("配信失敗:", error);
    alert("配信失敗！コンソールを見て！");
  }
};
