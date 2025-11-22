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

            ;

        }



        room.publications.forEach(subscribeAndAttach);

        room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));

    }
