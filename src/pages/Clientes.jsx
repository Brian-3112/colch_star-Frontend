import { Navigate } from 'react-router-dom';
import ListarCliente from '../components/cliente/ListarCliente';
import useAuth from '../hooks/useAuth';
// import EditarCliente from '../components/cliente/EditarCliente';


const Clientes = () => {
    
    const { auth, loading } = useAuth();
    if (loading == true) return 'Cargando...';


    return auth.usuario.permisos.includes('cliente') ? (
        <div>
            <ListarCliente />
            {/* <EditarCliente/> */}
        </div>
    ) : (
        <Navigate to={'/administracion'} />
    );
};

export default Clientes;
