function Temptest() {
    const Server = new WebSocket("ws://192.168.50.164:8080/");
    function gg()
    {
        Server.send(JSON.stringify({elem:"gg"}));
    }
    Server.onmessage = function (event) {
        console.log(event.data);
    };
    return (
        <div>
            <h1>temptest</h1>
            <button onClick={gg}>gg</button>
        </div>
    );
}
export default Temptest;