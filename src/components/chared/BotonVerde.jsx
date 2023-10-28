import PropTypes from 'prop-types';

const BotonVerde = ({ text, modalToOpen }) => {
    return (
        <button
            type='button'
            className='btn btn-success'
            data-bs-toggle='modal'
            data-bs-target={modalToOpen}
        >
            {text}
        </button>
    );
};

BotonVerde.propTypes = {
    text: PropTypes.string.isRequired,
    modalToOpen: PropTypes.string.isRequired,
};
export default BotonVerde;