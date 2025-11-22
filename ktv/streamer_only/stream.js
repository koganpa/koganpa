const { SkyWayContext, SkyWayRoom, SkyWayStreamFactory, SkyWayAuthToken, uuidV4, nowInSec } = skyway_room;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjRmM2FhZi1kYzMyLTQxNGMtODI4MS04YWE2OTUyYjRhMGYiLCJpYXQiOjE3NjM4MjY3MTEsImV4cCI6MTc2MzkxMzExMSwic2NvcGUiOnsiYXBwIjp7ImlkIjoiN2IyNjk1ZmUtZTA4Ny00NWIxLTk4YjctYjQwMjBiYWVjYTMxIiwiYWN0aW9ucyI6WyJyZWFkIl0sImNoYW5uZWxzIjpbeyJpZCI6IioiLCJuYW1lIjoiKiIsImFjdGlvbnMiOlsid3JpdGUiXSwibWVtYmVycyI6W3siaWQiOiIqIiwibmFtZSI6IioiLCJhY3Rpb25zIjpbIndyaXRlIl0sInB1YmxpY2F0aW9uIjp7ImFjdGlvbnMiOlsid3JpdGUiXX0sInN1YnNjcmlwdGlvbiI6eyJhY3Rpb25zIjpbIndyaXRlIl19fV0sInNmdUJvdHMiOlt7ImFjdGlvbnMiOlsid3JpdGUiXSwiZm9yd2FyZGluZ3MiOlt7ImFjdGlvbnMiOlsid3JpdGUiXX1dfV19XSwidHVybiI6dHJ1ZX19fQ.0BPFAg7c8tlImq7ugAoeBxIFL28yjvdPvLQ-C_aeDhE"

const token = new SkyWayAuthToken({
  jti: uuidV4(),
  iat: nowInSec(),
  exp: nowInSec() + 60 * 60 * 24,
  scope: {
    app: {
      id: '7b2695fe-e087-45b1-98b7-b4020baeca31',
      turn: true,
      actions: ['read'],
      channels: [
        {
          id: '*',
          name: '*',
          actions: ['write'],
          members: [
            {
              id: '*',
              name: '*',
              actions: ['write'],
              publication: {
                actions: ['write'],
              },
              subscription: {
                actions: ['write'],
              },
            },
          ],
          sfuBots: [
            {
              actions: ['write'],
              forwardings: [
                {
                  actions: ['write'],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}).encode('SecretKEY');

console.log(token);

const init = async () => {
    const roomIdInput = document.getElementById('room-id');
    const userIdDisplay = document.getElementById('user-id');

    document.getElementById("stream").onclick = async () => {
        if (roomIdInput.value === '') {
            alert('ルームIDを入力してください');
            return;
        }

        const context = await SkyWayContext.Create(token);
    }
}
