let remote_audio = false;
let remote_video = false;

const remoteArea = document.getElementById('remote-area');


    const roomIdInput = document.getElementById('room-id');

    document.getElementById("watch").onclick = async () => {
        if (roomIdInput.value === "") {
            alert('ルームIDを入力してください');
            return;
        }

        const context = await SkyWayContext.Create(token);

        const room = await SkyWayRoom.FindOrCreate(context, {
            type: "sfu",
            name: roomIdInput.value,
        });
        const me = await room.join();


        const subscribeAndAttach = async (publication) => {
    if (publication.publisher.id === me.id) return;
    const { stream } = await me.subscribe(publication.id);

    let newMedia;
    switch (stream.track.kind) {
        case 'video':
            if (remote_video) {
                const oldMedia = document.getElementById('remote-video');
                oldMedia.parentNode.removeChild(oldMedia);
            }
            newMedia = document.createElement('video');
            newMedia.id = "remote-video";
            newMedia.playsInline = true;
            newMedia.autoplay = true;
            newMedia.controls = true;
            remote_video = true;
            break;
        case 'audio':
            if (remote_audio) {
                const oldMedia = document.getElementById('remote-audio');
                oldMedia.parentNode.removeChild(oldMedia);
            }
            newMedia = document.createElement('audio');
            newMedia.id = "remote-audio";
            newMedia.controls = true;
            newMedia.autoplay = true;
            remote_audio = true;
            break;
        default:
            return;
    }
    stream.attach(newMedia);
    remoteArea.appendChild(newMedia);
}




        room.publications.forEach(subscribeAndAttach);

        room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));

    }
