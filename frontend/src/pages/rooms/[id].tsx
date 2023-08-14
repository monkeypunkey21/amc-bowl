import { useRouter } from "next/router"
import useSocket from '../../hooks/Socket'

const Room = () =>
{
    const router = useRouter();
    const {id} = router.query;
    const {socket} = useSocket();
    
    return (
        <div>
            {id}
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;

    return {
        props: {

        }
    }
}
export default Room