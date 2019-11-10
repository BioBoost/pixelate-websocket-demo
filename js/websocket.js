let controller = new BleController();
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("start").addEventListener("click", () => {

        const socket = io('http://localhost:3000');

        socket.emit('start', JSON.stringify([
            { controller_id: 'id_pinky', name: 'marki', color: "#FF0000" },
            { controller_id: 'id_hulk', name: 'nico', color: "#00FF00" },
            { controller_id: 'id_mister_blue', name: 'dennis', color: "#0000FF" },
            { controller_id: 'id_god', name: 'ruggy', color: "#FFFFFF" }
        ]));

        controller.connect()
        .then(() => {
            console.log("Connected to BLE controller");
            controller.addEventListener('touch', (event) => {
                switch(event.touchedKey) {
                    case 'R': socket.emit('update', JSON.stringify([ { id: 'id_hulk', actions: ['R'] } ])); break;
                    case 'L': socket.emit('update', JSON.stringify([ { id: 'id_hulk', actions: ['L'] } ])); break;
                    case 'U': socket.emit('update', JSON.stringify([ { id: 'id_hulk', actions: ['U'] } ])); break;
                    case 'D': socket.emit('update', JSON.stringify([ { id: 'id_hulk', actions: ['D'] } ])); break;
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    });
});
