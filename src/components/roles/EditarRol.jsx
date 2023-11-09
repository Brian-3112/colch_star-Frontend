// ------------------HERLYN NORBEY DAVID POSO
//-------------------10 de octubre 2023
//Nos permitira editar un rol, se podra editar el rol mediante un formulario con sus respectivas validaciones donde se ingresaran los datos a editar
//de este rol y luego se mostrara en la tabla listar roles los cambios realizados
import "../../css-general/cssgeneral.css";
import "../../css-general/tailwind.min.css";
import "../../css-general/inicio_style.css";
import "../../css-general/table.min.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CancelarModal from "../chared/CancelarModal";
import GuardarModal from "../chared/GuardarModal";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import AlertaError from "../chared/AlertaError";
import { validarEspaciosVacios } from "../../Validations/validations";

//Componente
function EditarRol({ editarRol }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // a la hora del editar el rol del administrador no va aparecer el rol
  const [permisos, setPermisos] = useState([]);
  const [errorPermisos, setErrorPermisos] = useState(null);
  const esRolAdministrador = editarRol && editarRol.nombre === "Administrador";
  const tituloPermisos = esRolAdministrador
    ? "Editar rol Administrador"
    : "Editar permisos del rol";

    // Cuando editarRol cambia, actualiza los valores del formulario
  useEffect(() => {
    if (editarRol) {
      setValue("nombre", editarRol.nombre);
      setPermisos(editarRol.permisos);
    }
  }, [editarRol]);

  const handlePermisoChange = (permiso, isChecked) => {
    if (isChecked) {
      setPermisos([...permisos, permiso]);
    } else {
      setPermisos(permisos.filter((p) => p !== permiso));
    }
  };

    /// Función para guardar el cliente en la DB
  const onSubmit = (data) => {
    const { nombre } = data;

    if (permisos.length === 0 && !esRolAdministrador) {
      setErrorPermisos("Debes seleccionar al menos un permiso");
      return;
    } else {
      setErrorPermisos(null);
    }

        // Ruta
    if (editarRol && editarRol.id_rol) {
      axios
        .patch(`http://localhost:3000/api/rol/${editarRol.id_rol}`, {
          nombre: nombre.trim(),
          permisos: permisos,
        })
        .then((response) => {
          console.log("Rol actualizado:", response.data);
          Swal.fire({
            title: "Rol actualizado",
            text: response.data.message,
            icon: "success",
          }).then(() => {
            location.reload();
          });
        })
        .catch((error) => {
          console.error("Error al actualizar el rol", error);

          if (error.response && error.response.status === 400) {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Ya existe este Rol",
              icon: "error",
            });
          }
        });
    } else {
      console.error("No se pudo obtener el ID del rol");
    }
  };

  return (
    <div>
          {/* modal de editar roles */}
      <div className="modal" id="modalEditar">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="editar edi">
              <h5 className="modal-title">{tituloPermisos}</h5>
              <button
                type="button"
                id="xEditar"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                className="row g-3 needs-validation"
                action=""
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mb-3" name="divNombre">
                  <label htmlFor="nombreEditar" className="col-form-label">
                    Nombre del rol:
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder=""
                    //register es una funcion, nos devuelve propiedades, para asigar esas propiedades al input  se pone . . .
                     //  identificador Es una cadena que se utiliza como identificador o nombre del campo de entrada del formulario.
                    {...register("nombre", {
                      required: { // Es una propiedad que indica que el campo es obligatorio. 
                        value: true, // indica que el campo debe tener un valor (no puede estar vacío) para pasar la validación.
                        message: "El nombre es obligatorio", // es un mensaje que se mostrará si la validación falla.
                      },
                      validate: (value) => {
                        return validarEspaciosVacios(value);
                      },
                      pattern: {
                        value: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/,
                        message:
                          "El nombre no puede contener números ni caracteres especiales",
                      },
                    })}
                  />
                  {errors.nombre && (
                    <AlertaError message={errors.nombre.message} />
                  )}
                </div>
                <div className="container">
                  {!esRolAdministrador && (
                    <div>
                      {/* selecciona los permisos que va editar */}
                      <label htmlFor="">Seleccionar permisos: *</label>
                      {errorPermisos && <AlertaError message={errorPermisos} />}
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditar"
                          id="usuarioEditar"
                          checked={permisos.includes("usuario")}
                          onChange={(e) =>
                            handlePermisoChange("usuario", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="usuarioEditar"
                        >
                          Usuario
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditarDos"
                          id="rolEditar"
                          checked={permisos.includes("rol")}
                          onChange={(e) =>
                            handlePermisoChange("rol", e.target.checked)
                          }
                        />
                        <label className="form-check-label" htmlFor="rolEditar">
                          Rol
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditarTres"
                          id="proveedorEditar"
                          checked={permisos.includes("proveedor")}
                          onChange={(e) =>
                            handlePermisoChange("proveedor", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="proveedorEditar"
                        >
                          Proveedor
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditarCuatro"
                          id="productoEditar"
                          checked={permisos.includes("producto")}
                          onChange={(e) =>
                            handlePermisoChange("producto", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="productoEditar"
                        >
                          Producto
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditarCinco"
                          id="clienteEditar"
                          checked={permisos.includes("cliente")}
                          onChange={(e) =>
                            handlePermisoChange("cliente", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="clienteEditar"
                        >
                          Cliente
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditarSeis"
                          id="compraEditar"
                          checked={permisos.includes("compra")}
                          onChange={(e) =>
                            handlePermisoChange("compra", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="compraEditar"
                        >
                          Compra
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          name="seleccionEditarSiete"
                          id="ordenEditar"
                          checked={permisos.includes("orden")}
                          onChange={(e) =>
                            handlePermisoChange("orden", e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ordenEditar"
                        >
                          Orden
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <CancelarModal />
                  <GuardarModal />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditarRol;