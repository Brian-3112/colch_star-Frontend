import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import '../../css-general/cssgeneral.css'
import '../../css-general/tailwind.min.css'
import '../../css-general/inicio_style.css'
import '../../css-general/table.min.css'
import styles from '../../pages/proveedores.module.css';



const AgregarProveedor = () => {


    const [proveedor, setProveedor] = useState({
        //estas propiedades vacio y luego setproveedor los llenara a la hora de agregar un proveedor

        nombre: "",
        telefono: "",
        direccion: "",
        identificador: "",
    });

    //metodo para realizar el cambio por medio de setproveedor que lo manda a proveedor
    // uando se llama a esta función, se toma el estado anterior (prev) y se actualiza con un nuevo objeto.
    // [e.target.name] se utiliza como una clave dinámica para actualizar una propiedad del objeto con el nombre que coincide con e.target.name, 
    // que generalmente se refiere al atributo name del elemento del formulario. e.target.value se usa para establecer el nuevo valor de esa propiedad.
    
    const handleChange = (e) => {
        setProveedor(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    //estado para el error que debe mostrar
    const [nombreError, setNombreError] = useState("");

    const handleClick = async e => {

        e.preventDefault()

        //validacion de nombre sea obligatorio
        if (proveedor.nombre.trim() === "") {
            setNombreError("El Nombre es obligatorio");
            return; // No se envía la solicitud si el campo está vacío
        } else {
            setNombreError(""); // Limpiar el mensaje de error si el campo es válido
        }


        try {
            // la ruta por donde voya mandar el objeto que tiene las propiedades es decir proveedor
            await axios.post("http://localhost:3000/api/proveedores", proveedor)

            const modal = document.getElementById("myModal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            location.reload();

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

                            {/* El atributo onSubmit se coloca en un formulario de React para especificar la función que se ejecutará
                     cuando el usuario envíe el formulario */}
                            {/* onSubmit={handleSubmit} */}
                            <form action="" id="formularioAgregarProveedor">

                                <div className="mb-3" name="divIdentificacion">
                                    <label for="identificacionGuardar" className="col-form-label">Identificación:</label>
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
                                    <label for="nombreGuardar" className="col-form-label">Nombre:*</label>
                                    <input type="text"
                                        className="form-control"
                                        name="nombre"
                                        placeholder=". . ." 
                                        onChange={handleChange}

                                    />
                                    <p className="text-red-500">{nombreError}</p>
                                    
                
                                </div>
                                <div className="mb-3" name="divTelefono">
                                    <label for="telefonoGuardar" className="col-form-label">Teléfono:*</label>
                                    <input type="text"
                                        className="form-control"
                                        onChange={handleChange}
                                        name="telefono"
                                        placeholder=". . ."
                                    />
                                </div>
                                <div className="mb-3" name="divDireccion">
                                    <label for="direccionGuardar" className="col-form-label">Dirección:*</label>
                                    <input type="text"
                                        className="form-control"
                                        id="direccionGuardar"
                                        onChange={handleChange}
                                        name="direccion" placeholder=". . ."
                                    />
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
