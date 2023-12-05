import { useForm } from 'react-hook-form';
import HeaderModals from '../chared/HeaderModals';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AlertaError from '../chared/AlertaError';
import GuardarModal from '../chared/GuardarModal';
import { useDisenosContext } from '../../context/disenosProvider';
import style from '../../pages/Productos.module.css'
import BotonNegro from '../chared/BotonNegro';
import logo from '../../imgNavbar/cruz.png'
import { Modal } from 'react-bootstrap';
import useProducto from '../../hooks/useProducto';


//Componente
const EditarDisenoModal = ({ showw, handleClosex, handleClosee, editarProducto }) => {

    const {editarDisenosProducto} = useProducto()
    const {
        register, //registra o identifica cada elemento o cada input
        handleSubmit, //para manejar el envió del formulario
        formState: { errors },
        reset
    } = useForm();

    // console.log(editarProducto)

    //trae alguna funciones de disenos provider
    const { agregarDiseno, eliminarDiseno, setDisenos } = useDisenosContext();

    //muestra los disenos existentes
    // console.log(disenosDB)

    // muestra los disenos seleccionados en el agregar
    // console.log(disenos)

    


    const eliminarDiseno01 = (index) => {
        // Crea una copia del array original
        const nuevosDisenos = [...selectedDisenoNombre];

        // Elimina el elemento en el índice especificado
        nuevosDisenos.splice(index, 1);
        // Actualiza el estado con la nueva array sin el elemento eliminado
        setSelectedDisenoNombre(nuevosDisenos);

        editarDisenosProducto();
        
        eliminarDiseno(index)
    };


    const [selectedDisenoNombre, setSelectedDisenoNombre] = useState([]);

    const agregarNuevoDiseno = (data) => {
        
        // console.log(data);
        agregarDiseno(data);

        console.log(selectedDisenoNombre);
        const nuevoDiseno = detalle_diseno.find(
            (diseno) => diseno.id_diseno == data.id_diseno
        );

        setSelectedDisenoNombre([...selectedDisenoNombre, nuevoDiseno]);

    };



    //estado pa los diseños
    const [detalle_diseno, setDetalle_diseno] = useState([]);
    //  console.log( detalle_diseno)

    useEffect(() => {
        // Realizar una solicitud para obtener la lista de roles desde el servidor
        axios.get('http://localhost:3000/api/disenos').then((response) => {
            setDetalle_diseno(response.data); // Almacenar la lista de roles en el estado
        });
    }, []);


    const [Precio, setPrecio] = useState([]);
    // traemos la informacion de las prendas y las guardamos en setPrendas y eso las manda a PrendAS
    useEffect(() => {
        // Realizar una solicitud para obtener la lista de roles desde el servidor
        axios
            .get('http://localhost:3000/api/precio_disenos')
            .then((response) => {
                setPrecio(response.data); // Almacenar la lista de roles en el estado
            });
    }, []);


    return (
        <Modal
            show={showw}
            onHide={() => {
                reset();
                handleClosee();
            }}
            className="modal d-flex align-items-center justify-content-center "

            id='myModalDiseno'
        >
            <div className='modal-content'>
                {/* Cabecero del modal */}
                <HeaderModals title='Diseno y  Tamaño' handleClose={() => {
                    reset();
                    handleClosex();
                    //al darle lcick al salir manda estos datos vacios
                    setSelectedDisenoNombre([])
                    setDisenos([])
                }} />

                <div className='modal-body'>
                    <form
                        action=''
                        id='formularioModificar'
                        onSubmit={handleSubmit(agregarNuevoDiseno)}
                    >
                        <div className="row ">
                            <div className="col-md-6">



                                <label htmlFor='rol' className='col-form-label'>
                                    Diseños:
                                </label>
                                <select
                                    className='form-control' // Allow multiple selections
                                    {...register('id_diseno', {
                                        required: {
                                            value: true,
                                            message:
                                                'Debe seleccionar al menos un diseño',
                                        },
                                    })}

                                >
                                    <option value='' disabled>
                                        Seleccionar diseño
                                    </option>
                                    {detalle_diseno
                                        .filter((diseno) => diseno.estado)
                                        .map((diseno) => (
                                            <option
                                                key={diseno.id_diseno}
                                                value={diseno.id_diseno}
                                            >
                                                {diseno.nombre}
                                            </option>
                                        ))}
                                </select>

                                {errors.diseno && (
                                    <AlertaError
                                        message={errors.diseno.message}
                                    />
                                )}


                                <label htmlFor='rol' className='col-form-label'>
                                    Tamaño:
                                </label>
                                <select
                                    className='form-control' // Allow multiple selections
                                    {...register('id_precio_diseno', {
                                        required: {
                                            value: true,
                                            message:
                                                'Debe seleccionar al menos un tamaño',
                                        },
                                    })}
                                >
                                    <option value='' disabled>
                                        Seleccionar tamaño
                                    </option>
                                    {Precio.map((precio) => (
                                        <option
                                            key={precio.id_precio_diseno}
                                            value={precio.id_precio_diseno}
                                        >
                                            {precio.tamano}
                                        </option>
                                    ))}
                                </select>

                                {errors.diseno && (
                                    <AlertaError
                                        message={errors.diseno.message}
                                    />
                                )}

                            </div>
                            <div className='col-md-6'>
                                <p className={style.diseñosModalTitle}>
                                    Diseños seleccionados:
                                </p>

                                {selectedDisenoNombre.map(
                                    (diseno, index) => (
                                        <div key={index} className={style.disenocontainer}>
                                            <p>
                                                <span className={style.disenonombre}>- {diseno.nombre}</span>
                                                <span onClick={() => eliminarDiseno01(index)}>
                                                    <img src={logo} alt="" className={style.logoimg} />
                                                </span>

                                            </p>
                                        </div>
                                    )
                                )}
                                {editarProducto.disenos && editarProducto.disenos.map((diseno, index) => (
                                    <div key={index} className={style.disenocontainer}>
                                        <p>
                                            <span className={style.disenonombre}>- {diseno.nombre}</span>
                                            <span onClick={() => eliminarDiseno01(index)}>
                                                <img src={logo} alt="" className={style.logoimg} />
                                            </span>
                                        </p>
                                    </div>
                                ))}


                            </div>

                        </div>
                        <br />



                        <div className='modal-footer'>
                            {/* Botón para cancelar*/}

                            <BotonNegro text={'Regresar'}
                                modalClouse={"modal"}
                                onClick={handleClosee} />

                            {/* Botón para guardar*/}
                            <GuardarModal />
                        </div>


                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditarDisenoModal;
