import PropTypes from 'prop-types';
import usePrendas from '../../hooks/usePrendas';
import useProducto from '../../hooks/useProducto';

//TODO: modalToCancel sera eliminado

const CancelarModal = ({
    modalToCancel,
    reset,
    name = 'Cancelar',
    handleClose,
    DisenoNombre, 
    ColorsNombre
}) => {

    const {setSelectColorsNombre}= usePrendas()
    const {setSelectedDisenoNombre} = useProducto()

    //función que cuando le de click en cancelar se refresque la pagina y se restablezca la informacion que estaba en el formulario
    const onClick = () => {
        if (reset) reset();
        handleClose();
        
        // si es existe algo en setSelectDiseno resetea el set
        if (DisenoNombre) {


            // Llama a setSelectedDisenoNombre con los parámetros adecuados
            setSelectedDisenoNombre([]);
        }


        if(ColorsNombre){
            setSelectColorsNombre([])
        }


    };

    return (
        <button
            type='button'
            className='btn btn-danger'
            id={modalToCancel}
            data-bs-dismiss='modal'
            style={{
                backgroundColor: '#252432',
                borderColor: '#252432', // Utiliza borderColor en lugar de border
            }}
            onClick={onClick}
        >
            {name}
        </button>
    );
};

CancelarModal.propTypes = {
    modalToCancel: PropTypes.string,
    name: PropTypes.string,
    reset: PropTypes.func,
    handleClose : PropTypes.func
};

export default CancelarModal;
