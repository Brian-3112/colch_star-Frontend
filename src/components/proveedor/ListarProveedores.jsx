// ------------------BRIAN PAREJA HERNANDEZ
//-------------------26 de septiembre 2023
//* Nos permitira Listar un proveedor, traer la informacion de los proveedores de la base de datos y representarla en una tabla 
//* existira una barra buscar que nos permite buscar cualquier informacion mediante un filtro, la busqueda se realiza por cualquier campo

import '../../css-general/cssgeneral.css'
import '../../css-general/tailwind.min.css'
import '../../css-general/inicio_style.css'
import '../../css-general/table.min.css'
import style from '../../pages/proveedores.module.css';
import BotonCambioEstado from '../chared/BotonCambioEstado';
import EditarProveedor from './EditarProveedor';
import Buscador from '../chared/Buscador';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Paginador from '../chared/Paginador'
import BotonNegro from '../chared/BotonNegro';
import Swal from 'sweetalert2';
import Header from '../chared/header/Header'
import { calcularAnchoDePantalla } from "../../helpers/calcularAnchoDePantalla";
import { resolucionCards } from "../../constantes/constantes.js";
import styles from "../../css-general/CardStyleGenerar.module.css";



//componente
const ListarProveedores = () => {

    //estado de la barra buscador
    const [ProveedoresFiltrar, setProveedoresFiltrar] = useState([]);

    // conexión para traer todos los datos de la base de datos, con proveedor es que s eva acer el mapeo en la tabla listar
    const [proveedores, setProveedor] = useState([]);


    // solicitud  a la url
    useEffect(() => {
        axios.get('http://localhost:3000/api/proveedores')
            .then(response => {
                // traeos los datos y se los mnadamos a proveedor, es decir set proveedor actualiza el estado de proveedor
                setProveedor(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la lista de proveedores', error);
            })
    }, []);

    //estado para editar
    const [editarProveedor, setEditarProveedor] = useState("");


    //si al darle click en editar el proveedor etsa inhabilitado no lo va dejar entrar
    const handleEditClick = (proveedor) => {

        if (!proveedor.estado) {
            return Swal.fire(
                'Acción inválida!',
                'Este Proveedor no se puede editar porque está inhabilitado',
                'error'
            );
        }
        setEditarProveedor(proveedor);
    };

    const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);

    useEffect(() => {
        /// Calcular el ancho de pantalla actual
        calcularAnchoDePantalla(setAnchoPantalla);
    }, []);

    return (
        <div>
            <div className='contenedor'>
                {/* titulo */}
                <Header titulo='Gestionar Proveedores' />

                {/* botón agregar */}
                <div className='container-fluid '>
                    <div className='row'>
                        <div
                            className={`${style.ap} col-md-6 col-ms-6 pb-md-0 pb-4 d-flex justify-content-center align-items-center`}
                        >
                            <button
                                type='button'
                                className='btn-a'
                                data-bs-toggle='modal'
                                data-bs-target='#myModal'
                            >
                                Agregar proveedor
                            </button>
                        </div>

                        {/* botón de buscar */}
                        <div
                            className={`${style.buscador} col-md-6 col-ms-8 pb-md-0 pb-4 d-flex justify-content-center align-items-center`}
                        >
                            <Buscador
                                setDatosFiltrar={setProveedoresFiltrar} //se le manda por medio de setProveedoresFiltrar el resultado
                                datos={proveedores} //se le dice que datos son los que se van a filtrar y son por los que trae de la base de datos
                                camposFiltrar={[
                                    'nombre',
                                    'telefono',
                                    'direccion',
                                    'identificador',
                                ]} //se le manda los campos por donde se puede filtrar
                            />
                        </div>
                    </div>
                </div>

                {/* tabla  para listar el proveedor */}
                {anchoPantalla >= resolucionCards ? (
                    <div className='tabla'>
                        <table className='table caption-top '>
                            <thead>
                                <tr>
                                    <th scope='col'>ID</th>
                                    <th scope='col'>Nombre</th>
                                    <th scope='col'>Teléfono</th>
                                    <th scope='col'>Dirección</th>
                                    <th scope='col'>Identificación</th>
                                    <th scope='col'>Inhabilitar</th>
                                    <th scope='col'>Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* // ProveedoresFiltrar hace el mapeo las busqueda de los datos y arroja el resultado  */}
                                {ProveedoresFiltrar.map((proveedor) => (
                                    <tr key={proveedor.id_proveedor}>
                                        <td>{proveedor.id_proveedor}</td>
                                        <td>{proveedor.nombre}</td>
                                        <td>{proveedor.telefono}</td>
                                        <td>{proveedor.direccion}</td>
                                        <td>
                                            {' '}
                                            {proveedor.tipoIdentificacion}{' '}
                                            {proveedor.identificador}
                                        </td>
                                        <td>
                                            {' '}
                                            <BotonCambioEstado
                                                id={proveedor.id_proveedor}
                                                isChecked={proveedor.estado}
                                                nombreRegistro={'proveedor'}
                                                ruta={`/proveedores/estado/${proveedor.id_proveedor}`}
                                            />
                                        </td>
                                        <td>
                                            <BotonNegro
                                                text='Editar'
                                                modalToOpen={
                                                    proveedor.estado
                                                        ? '#modalEditar'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    handleEditClick(proveedor)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={`row pt-4 justify-content-center`}>
                        {ProveedoresFiltrar.map((proveedor) => (
                            <div
                                className={`col-md-4 col-sm-6 col-xs-12`}
                                key={proveedor.id_proveedor}
                            >
                                <div
                                    className={`card mb-4 ${styles.contenedor_card}`}
                                >
                                    <div className='card-body'>
                                        <p className={styles.text}>
                                            Id:{' '}
                                            <span>
                                                {proveedor.id_proveedor}
                                            </span>
                                        </p>
                                        <p className={styles.text}>
                                            Nombre:{' '}
                                            <span>{proveedor.nombre}</span>
                                        </p>
                                        <p className={styles.text}>
                                            Teléfono:{' '}
                                            <span>{proveedor.telefono}</span>
                                        </p>
                                        <p className={styles.text}>
                                            Identificación:{' '}
                                            <span>
                                                {proveedor.tipoIdentificacion}{' '}
                                                {proveedor.identificador}
                                            </span>
                                        </p>

                                        <div className='row pt-3'>
                                            <div className='col justify-content-center align-items-center '>
                                                <div className='text-center'>
                                                    <strong
                                                        className={`${styles.textoEstado}`}
                                                    >
                                                        {' '}
                                                        Estado{' '}
                                                    </strong>
                                                </div>
                                                <div className='text-center'>
                                                    <BotonCambioEstado
                                                        id={
                                                            proveedor.id_proveedor
                                                        }
                                                        isChecked={
                                                            proveedor.estado
                                                        }
                                                        nombreRegistro={
                                                            'proveedor'
                                                        }
                                                        ruta={`/proveedores/estado/${proveedor.id_proveedor}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-footer'>
                                        <div className='row'>
                                            <div
                                                className={`col-6 d-flex justify-content-center align-items-center ${styles.button}`}
                                            >
                                                <BotonNegro
                                                    text='Editar'
                                                    modalToOpen={
                                                        proveedor.estado
                                                            ? '#modalEditar'
                                                            : ''
                                                    }
                                                    onClick={() =>
                                                        handleEditClick(
                                                            proveedor
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* //le mandamos el proveedor a editar la formulario EditarProveedor        */}
                <EditarProveedor editarProveedor={editarProveedor} />
            </div>

            <div className='seccion4'>
                {/* Es)}ta función requiere el set de los datos a filtrar, los datos de respaldo, y los campos por los cuales se permite filtrar*/}
                <Paginador
                    setDatosFiltrar={setProveedoresFiltrar}
                    datos={proveedores}
                />
            </div>
        </div>
    );
}

export default ListarProveedores
