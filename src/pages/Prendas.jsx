import AgregarPrendas from "../components/prendas/AgregarPrendas"
import { Navigate } from 'react-router-dom';

import {ListarPrendas} from "../components/prendas/ListarPrendas"
import useAuth from "../hooks/useAuth";



const Prendas =()=>{

    const { auth, loading } = useAuth();
    if (loading === true) return 'Cargando...';
    
    return auth.usuario.permisos.includes('producto') ? (
            <ListarPrendas />
    ) : (
        <Navigate to={'/administracion'} />
    );
}

export default Prendas
