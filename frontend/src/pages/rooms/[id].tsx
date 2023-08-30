import { useRouter } from "next/router";
import useSocket from "../../hooks/Socket";

interface IRoom {}

const Room = ({ roomData }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const { socket } = useSocket();

  return <div>{id}</div>;
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  const roomData = await fetch("http://localhost:4000/" + id);
  const json = roomData.json();
  return {
    props: {
      ...json,
    },
  };
}

export default Room;
