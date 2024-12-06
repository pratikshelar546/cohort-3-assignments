import "./index.css";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const wsRef = useRef();
  const roomRef = useRef<string>();
  const messageRef = useRef<string>();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const joinRoom = () => {
    wsRef.current.onopen = () => {
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            room: roomRef.current.value,
          },
        })
      );
    };
  };

  return (
    <>
      {!showChat ? (
        <div className="h-screen w-full bg-black flex justify-center items-center gap-4">
          <input
            type="text"
            placeholder="enter server name"
            className="p-4 bg-white rounded-lg text-black"
            ref={roomRef}
          />
          <button
            className="bg-green-500 px-6 py-4 rounded-xl"
            onClick={joinRoom}
          >
            Join Server
          </button>
        </div>
      ) : (
        <div className="h-screen bg-black flex w-full flex-col justify-between">
          <h1 className="text-white text-3xl font-semibold text-center p-4">
            You have successfully joined {roomRef.current?.value} server
          </h1>
          <div className="flex flex-col justify-between w-full text-white">
            <div className="flex flex-col gap-2">
              {messages.map((msg) => (
                <h1 className="text-black bg-gray-500 p-4 m-3">{msg}</h1>
              ))}
            </div>
            <div className="flex justify-between w-full p-3 bottom-6 relative">
              <input
                type="text"
                className="p-4 bg-white w-[80%] outline-none rounded-xl border-none text-black"
                placeholder="Write message here"
                ref={messageRef}
              />
              <button
                className="w-[18%] bg-white text-black font-bold text-2xl rounded-xl"
                onClick={() => {
                  const message = messageRef.current?.value;
                  wsRef.current?.send(
                    JSON.stringify({
                      type: "chat",
                      payload: {
                        message: message,
                      },
                    })
                  );
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
