import axios from 'axios'
import { useState } from 'react';
import '../../css-general/cssgeneral.css'
import '../../css-general/tailwind.min.css'
import '../../css-general/inicio_style.css'
import '../../css-general/table.min.css'
import styles from '../../pages/proveedores.module.css';


//COMPONENTE
const AgregarProveedor = () => {


    const [proveedor, setProveedor] = useState({
        //estas propiedades  estan vacias  y luego setproveedor los llenara a la hora de agregar un proveedor
        nombre: "",
        telefono: "",
        direccion: "",
        identificador: "",
    });


    //método para realizar el cambio por medio de setproveedor que lo manda a proveedor
    // usando se llama a esta función, se toma el estado anterior (prev) y se actualiza con un nuevo objeto.
    // [e.target.name] se utiliza  para actualizar una propiedad del objeto con el  atributo name del elemento del formulario.
    //  e.target.value se usa para establecer el nuevo valor de esa propiedad.    
    const handleChange = (e) => {
        setProveedor(prev => ({ ...prev, [e.target.name]: e.target.value }))

    }


    //PARA LAS VALIDACIONES
    //set le pasa el mensaje de validación a Error 
    const [nombreError, setNombreError] = useState("");
    const [telefonoError, setTelefonoError] = useState("");
    const [direccionError, setDireccionError] = useState("");



    const handleClick = async e => {

        e.preventDefault()

        // validación de nombre sea obligatorio
        if (proveedor.nombre.trim() === "") {
            setNombreError("El Nombre es obligatorio");
            return; // No se envía la solicitud si el campo está vacío

        } else {
            setNombreError("");
        }
        // validación de teléfono sea obligatorio   
        if (proveedor.telefono.trim() === "") {
            setTelefonoError("El Teléfono es obligatorio");
            return; // No se envía la solicitud si el campo está vacío
        } else {
            setTelefonoError("")
        }
        // validacion de direccion sea obligatorio
        if (proveedor.direccion.trim() === "") {
            setDireccionError("La Direecion es obligatorio");
            return; // No se envía la solicitud si el campo está vacío
        } else {
            setDireccionError("")// Limpiar el mensaje de error si el campo es válido
        }


        try {
            // la ruta por donde voya mandar el objeto que tiene las propiedades es decir proveedor
            await axios.post("http://localhost:3000/api/proveedores", proveedor)
            //luego de darle guardar se cierre el modal
            const modal = document.getElementById("myModal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        } catch (err) {
            console.log(err)
        }

    }


    return (
        <div>

            {/* modal agregar proveedor */}
            <div className="modal" id="myModal" >
                <div className="modal-dialog modal-dialog-centered ">
                    <div className="modal-content">
                        <div className="agregar agr">
                            <h5 className="modal-title" id="exampleModalLabel">Agregar proveedor</h5>
                            <button type="button" id="xAgregar" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">



                            {/* formulario para agregar proveedor */}
                            <form action="" id="formularioAgregarProveedor">

                                <div className="mb-3" name="divIdentificacion">
                                    <label htmlFor="identificacionGuardar" className="col-form-label">Identificación:</label>
                                    <br />
                                    <div className={styles.identi}>
                                        <select style={{ width: 80, height: 40 }} id="tipoIdentificacion" >
                                            <option value="cedula">CC</option>
                                            <option value="nit">NIT</option>
                                        </select>
                                        <input type="text" className="form-control "
                                            id={styles.identificacionGuardar}
                                            onChange={handleChange}
                                            name="identificador"
                                            placeholder=". . ."
                                        />
                                    </div>
                                </div>

                                <div className="mb-3" name="divNombre">
                                    <label htmlFor="nombreGuardar" className="col-form-label">Nombre:*</label>
                                    <input type="text"
                                        className="form-control"
                                        name="nombre"
                                        placeholder=". . ."
                                        onChange={handleChange}
                                    />
                                    {/* en esta etiqueta va salir el error de validacion  */}
                                    <p className="text-red-500" style={{ fontSize: 14 }}>{nombreError}</p>

                                </div>

                                <div className="mb-3" name="divTelefono">
                                    <label htmlFor="telefonoGuardar" className="col-form-label">Teléfono:*</label>
                                    <input type="text"
                                        className="form-control"
                                        onChange={handleChange}
                                        name="telefono"
                                        placeholder=". . ."
                                    />
                                    {/* en esta etiqueta va salir el error de validacion  */}
                                    <p className="text-red-500" style={{ fontSize: 14 }}>{telefonoError}</p>

                                </div>

                                <div className="mb-3" name="divDireccion">
                                    <label htmlFor="direccionGuardar" className="col-form-label">Dirección:*</label>
                                    <input type="text"
                                        className="form-control"
                                        id="direccionGuardar"
                                        onChange={handleChange}
                                        name="direccion" placeholder=". . ."
                                    />
                                    {/* en esta etiqueta va salir el error de validación  */}
                                    <p className="text-red-500" style={{ fontSize: 14 }}>{direccionError}</p>

                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-c" data-bs-dismiss="modal"
                                        id="guardarCancelado">Cancelar</button>
                                    <input onClick={handleClick} type="submit" className="btn btn-success" value="Guardar" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default AgregarProveedor
