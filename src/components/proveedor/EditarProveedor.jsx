import React from 'react'
import '../../css-general/cssgeneral.css'
import '../../css-general/tailwind.min.css'
import '../../css-general/inicio_style.css'
import '../../css-general/table.min.css'
import styles from '../../pages/proveedores.module.css';

const EditarProveedor = () => {



    return (
        <div>

            {/* modal de editar proveedor */}
            <div class="modal" id="modalEditar">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="editar edi">
                            <h5 class="modal-title">Editar datos del proveedor</h5>
                            <button type="button" id="xEditar" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {/* formulario para editar los datos de la tabla proveedor */}
                            <form action="" id="formularioEditarProveedor">

                                <div class="mb-3" name="divIdentificacion">
                                    <label for="identificacionEditar" class="col-form-label">Identificacion:</label>
                                    <br />
                                    <div className={styles.identi}>
                                        <select style={{ width: 80, height: 40 }} id="tipoIdentificacion" >
                                            <option value="cedula">CC</option>
                                            <option value="nit">NIT</option>
                                        </select>
                                        <input type="text" class="form-control" id={styles.identificacionEditar} name="identificacionEditar"
                                            placeholder="Ingresar su identificacion"
                                        />
                                    </div>
                                </div>
                                <div class="mb-3" name="divNombre">
                                    <label for="nombreEditar" class="col-form-label">Nombre:</label>
                                    <input type="text" class="form-control" id="nombreEditar" name="nombreEditar"
                                        placeholder="Ingresar nombre"
                                    />
                                </div>
                                <div class="mb-3" name="divTelefono">
                                    <label for="telefonoEditar" class="col-form-label">Teléfono:</label>
                                    <input type="text" class="form-control" id="telefonoEditar" name="telefonoEditar"
                                        placeholder="Ingresar teléfono"
                                    />
                                </div>
                                <div class="mb-3" name="divDireccion">
                                    <label for="direccionEditar" class="col-form-label">Dirección:</label>
                                    <input type="text" class="form-control" id="direccionEditar" name="direccionEditar"
                                        placeholder="Ingresar dirección"
                                    />
                                </div>

                                <div class="modal-footer">
                                    <button type="button" id="editarCancelado" class="btn-c"
                                        data-bs-dismiss="modal">Cancelar</button>
                                    <input type="submit" id="GuardarEditarProveedor" class="btn btn-success" value="Guardar" />
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditarProveedor
