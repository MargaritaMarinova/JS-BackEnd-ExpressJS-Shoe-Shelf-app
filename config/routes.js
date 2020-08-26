const router = require('../routes');

module.exports = (app) => {

    app.use('/home', router.home);
    app.use('/users',router.users);
    app.use('/offers', router.models);

    app.use('*', (req,res,next)=>{
        //TODO
        next()
    });

    
};