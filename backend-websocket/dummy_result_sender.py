import asyncio
import websockets


async def send_request(port):
    async with websockets.connect(f"ws://localhost:{port}") as websocket:
        request = input("Enter your request: ")
        await websocket.send(request)
        response = await websocket.recv()
        print(f"Response from port {port}: {response}")


async def main():
    await asyncio.gather(
        send_request(6666),
        send_request(7777)
    )

if __name__ == "__main__":
    while True:
        try:
            asyncio.run(main())
        except KeyboardInterrupt:
            break
