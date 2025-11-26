// live.js

const {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  uuidV4,
  SfuClient,
} = skyway_sfu_client;

// ★君のSkyWay AppID/Secret入れてね！
const APP_ID = "6e21fb13-42b8-488b-9371-394c3aac5df1";
const SECRET = "yoiM6kXWFO6YaxUnSwOY2IHayCScAhRguhEWKLcROzg=";

// トークン生成
async function createToken() {
  return new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60,
    scope: {
      appId: APP_ID,
      sfu: {
        rooms: ["*"],
        actions: ["join", "subscribe"]
      }
    },
  }).encode(SECRET);
}

document.getElementById("startLive").onclick = async () => {
  const token = await createToken();
  const context = await SkyWayContext.Create(token);
  const sfu = await SfuClient.Create(context);

  // “live”部屋に join
  const me = await sfu.join({ name: "live" });

  // ★ ここがポイント：最新の配信を自動検知！
  const publications = me.room.publications;

  if (publications.length === 0) {
    alert("まだ配信が始まってないよ！");
    return;
  }

  // 映像の publication を自動で選ぶ
  const videoPub = publications.find(p => p.contentType === "video");

  if (!videoPub) {
    alert("映像の配信が見つからないよ！");
    return;
  }

  // subscribe!
  const { stream } = await me.subscribe(videoPub.id);

  // 映像を画面に出す
  stream.attach(document.getElementById("remote"));
};
