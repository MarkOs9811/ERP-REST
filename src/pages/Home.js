export function Home(){
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        <div className="card  p-3 border-0 shadow-sm">
            <h2 className="titulo-card-especial">Hola {user.empleado.persona.nombre}</h2>
            <small>En este sistema puedes gestioanr tu empresa.</small>
        </div>
    );
}