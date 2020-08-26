const Model = require('../model/Model');

module.exports = {
    get: {
        home(req, res) {
            const isLoggedIn = req.user !== undefined;

           
           const criteria = isLoggedIn ? {buyers: '-1'} : {buyers: '-1'}



            Model.find({isPublic : true})
            .sort(criteria)
            .lean()
            .then((c) => {
                

                const offers = c.reduce((acc, curr)=> {
                    acc.push({...curr, isLoggedIn})
                    return acc;
                }, []);

                res.render('home/home.hbs', {
                    isLoggedIn,
                    email: req.user ? req.user.email : '',
                    isNotLoggedIn: !isLoggedIn,
                    offers
                });

            })
            
        }
    }
};