export const isAdmin = () => {
    const token = localStorage.getItem('jwt');
    
    if(!token){
        return false;
    }
    
    var jwtDecoder = require('jwt-decode');
    const decodedToken = jwtDecoder(token);

    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']==='admin' ? true : false;
}


export const isSuperUser = () => {
    const token = localStorage.getItem('jwt');
    
    if(!token){
        return false;
    }
    
    var jwtDecoder = require('jwt-decode');
    const decodedToken = jwtDecoder(token);

    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']==='superuser' ? true : false;
}

export const isUser = () => {
    const token = localStorage.getItem('jwt');
    
    if(!token){
        return false;
    }

    return  true;
}