import { createContext, useEffect, useState } from 'react';
import ordenAxios from '../config/axios';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import axios from 'axios';
import clienteAxios from '../config/axios';

const ordenesContext = createContext();

const OrdenesProvider = ({ children }) => {
    const { config, auth } = useAuth();

    const [detallesOrden, setDetallesOrden] = useState([]);

    const [totalCompra, setTotalCompra] = useState(0);

    /// Calcular el total de la compra
    useEffect(() => {
        setTotalCompra(
            detallesOrden.reduce(
                (total, producto) =>
                    total + producto.cantidad * producto.precio,
                0
            )
        );
    }, [detallesOrden]);

    // primer state
    const [ordenes, setOrdenes] = useState([]);

    // función para obtener los clientes solo cuando se carge el componente

    const consultarOrdenes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const { data } = await ordenAxios.get('/ordenes', config);

            setOrdenes(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        consultarOrdenes();
    }, [auth]);

    const agregarOrden = async (data, reset, handleClose) => {
        const { fecha_entrega, fk_cliente, estado_de_orden } = data;

        try {
            const newOrden = await ordenAxios.post(
                '/ordenes',
                {
                    total_de_compra: totalCompra,
                    fecha_entrega: fecha_entrega,
                    fk_cliente: fk_cliente,
                    detallesOrdenes: detallesOrden,
                    estado_de_orden: estado_de_orden || 'Creada',
                },
                config
            );

            Swal.fire({
                title: 'Compra Agregada',
                text: newOrden.data.message,
                icon: 'success',
            }).then(() => {
                consultarOrdenes();
                handleClose(reset);
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error. Vuelva a intentarlo.',
                icon: 'error',
            });
        }
    };

    const cambiarEstadoDeOrden = (estado, id) => {
        Swal.fire({
            title: `¿Deseas cambiar el estado de la venta a ${estado}?`,
            // text: "Este ",
            icon: 'question',
            iconColor: '#fa0000',
            showCancelButton: true,
            confirmButtonColor: '#3E5743',
            cancelButtonColor: '#252432',
            confirmButtonText: `Si, Cámbialo`,
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //  Realiza la petición PATCH
                    const response = await clienteAxios.patch(
                        `/ordenes/estado/${id}`,
                        { estado: estado },
                        config
                    );

                    if (response.status === 200) {
                        Swal.fire('Cambio de estado exitoso');
                    } else {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al cambiar el estado',
                            'error'
                        );
                    }
                } catch (error) {
                    console.error('Error al realizar la petición:', error);
                    Swal.fire(
                        'Error',
                        'Hubo un problema al cambiar el estado',
                        'error'
                    );
                }
            }

            consultarOrdenes();
        });
    };

    //* Funcionalidad para cerra el modal de agregar
    const [show, setShow] = useState(false);

    const handleClose = (reset) => {
        
        setShow(false);
        
        if(!reset) return;
        setDetallesOrden([]);
        reset();
    };
    const handleShow = () => setShow(true);


    //* Funcionalidad para cerra el modal de detalles
    const [showDetalles, setShowDetalles] = useState(false);

    const handleCloseDetalles = () => {
        setShowDetalles(false);
    };

    const handleShowDetalles = () => setShowDetalles(true);

    return (
        <ordenesContext.Provider
            value={{
                ordenes,
                agregarOrden,
                setDetallesOrden,
                detallesOrden,
                cambiarEstadoDeOrden,
                handleShowDetalles,
                handleCloseDetalles,
                showDetalles, 
                handleClose,
                handleShow
                
            }}
        >
            {children}
        </ordenesContext.Provider>
    );
};

export { OrdenesProvider };
export default ordenesContext;