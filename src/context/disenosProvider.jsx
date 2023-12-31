import { createContext, useContext, useEffect, useState } from 'react';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';

// Crear el contexto
const DisenosContext = createContext();

// Proveedor del contexto, que proporciona el estado y las funciones de actualización
export const DisenosProvider = ({ children }) => { 
    const { token, auth } = useAuth();

    const [disenos, setDisenos] = useState([]);
    const [disenosDB, setDisenosDB] = useState([]);


    const [precios, setPrecios] = useState([]);

    const consultarPrecios = async () => {
        const respuesta = await clienteAxios.get('/precio_disenos');
        setPrecios(respuesta.data);
    };
    // console.log(disenosDB)

    const agregarDiseno = (data) => {
        const nuevoDisenos = [...disenos, data];
        console.log(nuevoDisenos);
        setDisenos(nuevoDisenos);
    };

    const eliminarDiseno = (index) => {
        console.log(index)
        const nuevosDisenos = [...disenos];
        nuevosDisenos.splice(index, 1);
        setDisenos(nuevosDisenos);
    };

    /// Query a la api
    const consultarDisenos = async () => {
        // const token = localStorage.getItem('token');
        // if (!token) return;
        const respuesta = await clienteAxios.get('/disenos');
        setDisenosDB(respuesta.data);
    };

    useEffect(() => {
        /// Hacer la petición a la api
        consultarDisenos();
        consultarPrecios();
    }, [auth]);

    const agregarDisenoDB = async (formData, handleClose, reset) => {
        /// Almacenar el diseño en la DB
        try {
            const res = await clienteAxios.post('/disenos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Lanzar alerta del producto agregado
            Swal.fire({
                title: 'Diseño agregado',
                text: res.data.message,
                icon: 'success',
            }).then(() => {
                reset();
                setDisenosDB([...disenosDB, res.data.nuevoDiseno]);
                handleClose();
            });
        } catch (error) {
            console.log(error);
            // Lanzar alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error',
                icon: 'Vuelva a intentarlo',
            }).then(handleClose());
        }
    };

    const editarDisenoDB = async (formData, detalleDiseno, handleClose) => {
        /// editar el diseño
        try {
            const res = await clienteAxios.put(
                `/disenos/${detalleDiseno.id_diseno}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Lanzar alerta del producto agregado
            Swal.fire({
                title: 'Diseño Editado',
                text: res.data.message,
                icon: 'success',
            }).then(() => {
                consultarDisenos()
                handleClose()
            });
        } catch (error) {
            console.log(error);
            // Lanzar alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error',
                icon: 'Vuelva a intentarlo',
            }).then(handleClose());
        }
    };

    const editarEstado = (id) => {
        let disenoEditado = disenosDB.find(
            (diseno) => diseno.id_diseno === id
        );
        disenoEditado.estado = !disenoEditado.estado;

        const clienteActualizado = disenosDB.map((diseno) =>
            diseno.id_diseno == id ? disenoEditado : diseno
        );

        setDisenosDB(clienteActualizado);
    };

     const editarPublicacion = (id) => {
         let disenoEditado = disenosDB.find(
             (diseno) => diseno.id_diseno === id
         );
         disenoEditado.publicado = !disenoEditado.publicado;

         const clienteActualizado = disenosDB.map((diseno) =>
             diseno.id_diseno == id ? disenoEditado : diseno
         );

         setDisenosDB(clienteActualizado);
     };


     const actualizarPrecioDB = async (data,reset,handleClose) => {

        try {
            const res = await clienteAxios.put("/precio_disenos/"+data?.id_precio, {
                precio: data?.precio
            });

            // Lanzar alerta del producto agregado
            Swal.fire({
                title: 'Precio Editado',
                text: res.data.message,
                icon: 'success',
            }).then(() => {
                consultarPrecios();
                reset();
                handleClose();
            });
        } catch (error) {
            console.log(error);
            // Lanzar alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error',
                icon: 'Vuelva a intentarlo',
            }).then( () => {
                reset()
                handleClose()
            });
        }
     };


    // Proporcionar el estado y las funciones de actualización a los componentes hijos
    const contextValue = {
        disenos,
        agregarDiseno,
        disenosDB,
        setDisenosDB,
        agregarDisenoDB,
        editarDisenoDB,
        editarEstado,
        editarPublicacion,
        eliminarDiseno,
        setDisenos,
        precios,
        actualizarPrecioDB,
    };

    return (
        <DisenosContext.Provider value={contextValue}>
            {children}
        </DisenosContext.Provider>
    );
};

// Función personalizada para utilizar el contexto en componentes hijos
export const useDisenosContext = () => {
    return useContext(DisenosContext);
};
