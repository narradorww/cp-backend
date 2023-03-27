const authenticatedMiddleware = (req, res, next) => {
    if (req.user) {
      console.log('Usuário autenticado');
    } else {
      console.log('Usuário não autenticado');
    }
    next();
  };
  
    export default authenticatedMiddleware;  
  

