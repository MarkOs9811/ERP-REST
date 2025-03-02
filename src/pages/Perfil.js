import { useParams } from "react-router-dom";

export default function Perfil() 
{
    const {nombre} = useParams();
     return(
        <div>
            <h1>
                Mi perfil, {nombre}
            </h1>
        </div>
     );
}