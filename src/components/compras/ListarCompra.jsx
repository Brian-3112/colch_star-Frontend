import '../../css-general/cssgeneral.css';
import '../../css-general/tailwind.min.css';
import '../../css-general/inicio_style.css';
import '../../css-general/table.min.css';
import style from '../../pages/Clientes.module.css';
import Header from '../chared/header/Header';
import Buscador from '../chared/Buscador';
import Paginador from '../chared/Paginador';
import BotonNegro from '../chared/BotonNegro';
import BotonCambioEstado from '../chared/BotonCambioEstado';
import { useEffect, useState } from 'react';
import {
    registrosPorPagina,
    resolucionCards,
} from '../../constantes/constantes';
import useCompras from '../../hooks/useCompras';
import { DetalleCompras } from './DetallesCompras';
import { calcularAnchoDePantalla } from '../../helpers/calcularAnchoDePantalla';
import styles from '../../css-general/CardStyleGenerar.module.css';

import AgregarCompra from '../compras/AgregarCompra';

const ListarCompra = () => {
    const { compras, editarEstado } = useCompras();

    /// Estado de la barra de busqueda y para lastar en la tabla la información
    const [comprasFiltrar, setComprasFiltrar] = useState([]);

    const [detallesCompra, setDetallesCompra] = useState({});

    /// Filtrar los 10 primeras ventas a mostrar en la vista
    useEffect(() => {
        setComprasFiltrar(
            compras.slice(0, registrosPorPagina, registrosPorPagina)
        );
    }, [compras]);

    const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);

    useEffect(() => {
        /// Calcular el ancho de pantalla actual
        calcularAnchoDePantalla(setAnchoPantalla);
    }, []);

    return (
        <>
            <div>
                <div>
                    <Header titulo='Gestión de Compras' />

                    {/* botón agregar */}
                    <div className='container-fluid'>
                        <div className='row'>
                            <div
                                className={`${style.ap} col-md-6 col-ms-6 pb-md-0 pb-4 d-flex justify-content-center align-items-center`}
                            >
                                <AgregarCompra />
                            </div>

                            {/* Boton para Buscar/filtrar */}
                            <div
                                className={`${style.buscador} col-md-6 col-ms-6 pb-md-0 pb-4 d-flex justify-content-center align-items-center`}
                            >
                                {/* Esta función requiere el set de los datos a filtrar, los datos de respaldo, y los campos por los cuales se permite filtrar*/}
                                <Buscador
                                    setDatosFiltrar={setComprasFiltrar}
                                    datos={compras}
                                    camposFiltrar={[
                                        'total_de_compra',
                                        'fecha',
                                        'proveedor',
                                        'prenda',
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    {anchoPantalla >= resolucionCards ? (
                        <div className='tabla'>
                            <table className='table caption-top '>
                                <thead>
                                    <tr>
                                        <th scope='col'>ID</th>
                                        <th scope='col'>Proveedor</th>
                                        <th scope='col'>Total compra</th>
                                        <th scope='col'>Fecha de compra</th>
                                        <th scope='col'>Estado</th>
                                        <th scope='col'>Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comprasFiltrar.map((compra) => (
                                        <tr key={compra.id_compra}>
                                            <td>{compra.id_compra}</td>
                                            <td>
                                                {compra.proveedor
                                                    ? compra.proveedor.nombre
                                                    : 'N/A'}
                                            </td>
                                            <td>{compra.total_de_compra}</td>
                                            <td>{compra.fecha}</td>
                                            <td>
                                                <BotonCambioEstado
                                                    id={compra.id_compra}
                                                    isChecked={compra.estado}
                                                    nombreRegistro={'compra'}
                                                    ruta={`/compras/estado/${compra.id_compra}`}
                                                    editarEstado={editarEstado}
                                                />
                                            </td>
                                            <td>
                                                <BotonNegro
                                                    text='Ver'
                                                    modalToOpen={
                                                        '#modalDetalleCompra'
                                                    }
                                                    onClick={() => {
                                                        setDetallesCompra(
                                                            compra
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={`row pt-4 justify-content-center`}>
                            {comprasFiltrar.map((compra) => (
                                <div
                                    className={`col-md-4 col-sm-6 col-xs-12`}
                                    key={compra.id_compra}
                                >
                                    <div
                                        className={`card mb-4 ${styles.contenedor_card}`}
                                    >
                                        <div className='card-body'>
                                            <p className={styles.text}>
                                                Id:{' '}
                                                <span>{compra.id_compra}</span>
                                            </p>
                                            <p className={styles.text}>
                                                Proveedor:{' '}
                                                <span>
                                                    {compra.proveedor
                                                        ? compra.proveedor
                                                              .nombre
                                                        : 'N/A'}
                                                </span>
                                            </p>
                                            <p className={styles.text}>
                                                Total de Compra:{' '}
                                                <span>
                                                    {compra.total_de_compra}
                                                </span>
                                            </p>
                                            <p className={styles.text}>
                                                Fecha:{' '}
                                                <span>{compra.fecha}</span>
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
                                                                compra.id_compra
                                                            }
                                                            isChecked={
                                                                compra.estado
                                                            }
                                                            nombreRegistro={
                                                                'compra'
                                                            }
                                                            ruta={`/compras/estado/${compra.id_compra}`}
                                                            editarEstado={
                                                                editarEstado
                                                            }
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
                                                        text='Ver'
                                                        modalToOpen='#modalDetalleCompra'
                                                        onClick={() =>
                                                            setDetallesCompra(
                                                                compra
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
                </div>

                <div className='seccion4'>
                    {/* Esta función requiere el set de los datos a filtrar, los datos de respaldo, y los campos por los cuales se permite filtrar*/}
                    <Paginador
                        setDatosFiltrar={setComprasFiltrar}
                        datos={compras}
                    />
                </div>
            </div>
            <DetalleCompras detallesCompras={detallesCompra} />
        </>
    );
};

export default ListarCompra;
