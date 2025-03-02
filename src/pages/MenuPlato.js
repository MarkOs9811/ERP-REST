import { useState } from "react";
import { CategoriaList } from "../components/componentePlatos/CategoriaList";
import { PlatoList } from "../components/componentePlatos/PlatoList";
import { PlatoAdd } from "../components/componentePlatos/PlatoAdd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";

export function MenuPlato(){
    const [search,setSearch] = useState("");
    const [upDateList,setUpDateList] = useState(false);
    const [showModal,setShowModal] = useState(false);
    
    const handleAddPlato = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setUpDateList(prev => !prev);
    }

    return(
        <div className="row g-3">
            <div className="col-md-4">
                <div className="card p-3 shadow-sm">
                    <CategoriaList/>
                </div>
            </div>
            <div className="col-md-8">
                <div className="card shadow-sm">
                    <div className="card-header border-bottom d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Menu</h5>
                            <div className="d-flex align-items-center">
                                <div className="d-flex">
                                    <input type="text" placeholder="Buscar..." className="form-control"  value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                                    <button
                                        className="btn btn-agregar-plato btn-sm rounded-pill p-0  mx-3"
                                      onClick={() => handleAddPlato()}
                                    >
                                        Nuevo Plato <FontAwesomeIcon icon={faPlus} />
                                    </button>    
                                </div>
                            </div>
                    
                    </div>
                    <div className="card-body">
                        <PlatoList  search={search} upDateList={upDateList}/>
                    </div>
                </div>
            </div>

              {/* Modal para agregar PLATOS*/}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                <Modal.Title>Registrar Plato</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {/* Pasa handleCloseModal como prop a UsuarioForm */}
                    <PlatoAdd handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
}   