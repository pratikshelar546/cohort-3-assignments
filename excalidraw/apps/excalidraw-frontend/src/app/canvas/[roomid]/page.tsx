import RoomCanvas from "@/components/canvas/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: {
    roomid: string;
  };
}) {
  const roomId = (await params)?.roomid;

  return (
    <>
      <RoomCanvas roomId={roomId} />
    </>
  );
}
