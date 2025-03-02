import { TrailSignOutline } from "react-ionicons";

export function AlmacenTransferenias(){
    return(
        <div className="m-auto">
            <button className="btn btn-primary p-3 mx-2">
                <TrailSignOutline color={'auto'}/>
                <span className="ms-2">Transferencias de Area a Areas</span>
            </button>
            <button className="btn btn-success p-3">
            <TrailSignOutline color={'auto'}/>
                <span className="ms-2">Transferencias de Almacen a Area</span>
            </button>
        </div>
    );
}