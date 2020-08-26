const User = require('../users/User');
const {validationResult} = require('express-validator');
const Model = require('./Model');

module.exports = {
    get: {
        createOffer(req, res) {
            const isLoggedIn = (req.user !== undefined);
            res.render('offers/create-offer.hbs', {
                isLoggedIn,
                email: req.user ? req.user.email : ''
            });
        },

        editOffer(req, res) {
            const { offerId } = req.params;
            const userId = req.user._id;
            Model
                .findById(offerId).lean().then((offer) => {
                    const isLoggedIn = (req.user !== undefined);
                    res.render("offers/edit-offer.hbs", {
                        isLoggedIn,
                        email: req.user ? req.user.email : null,
                        offer,
                        offerId
                    });
                })

        },

        detailsOffer(req, res) {
            const {offerId} = req.params;
            Model
            .findById(offerId)
            .populate('buyers')
            .lean()
            .then((offer) => {
                const hbsOptions = Object.keys(offer).reduce((acc, curr) => {
                    acc[curr] = offer[curr];
                    return acc;
                }, {})
                const isLoggedIn = (req.user !== undefined);
                const currentUser = JSON.stringify(req.user._id)
                const hasAlreadyBought = JSON.stringify(offer.buyers).includes(currentUser);
                res.render('offers/details-offer', {
                    ...hbsOptions,
                    isLoggedIn,
                    hasAlreadyBought,
                    email: req.user ? req.user.email : '',
                    isTheCreator: JSON.stringify(req.user._id) === JSON.stringify(offer.creator)
                });
            })
        },
        
        buyOffer(req, res) {
            const {offerId} = req.params;
            const {_id} = req.user;
            console.log(offerId)
            
            Promise.all([
            Model.updateOne({_id: offerId}, {$push: {buyers: _id}}),
            User.updateOne({_id}, {$push: {offersBought: offerId}})
        ]).then (([updatedModel, updatedUser])=>{
            res.redirect(`/offers/details-offer/${offerId}`)
        }).catch((err)=> {
            console.log(err.message)
        })
    },

        deleteOffer(req, res) {
            const {offerId} = req.params;
            const userId = req.user._id

            Promise.all([
            Model.deleteOne({_id: offerId}, {$pull: {buyers: userId}}),
            User.updateOne({_id: userId}, {$pull: {offersBought: offerId}})
        ]).then(([updatedModel, updatedUser])=>{
            res.redirect('/home/')
        })
        }
    },
    post: {
        createOffer(req, res){
            const {title, description, imageUrl, price, brand, isPublic: isChecked} = req.body;
            const isPublic = isChecked === 'on' ? true : false;
            const createdAt = (new Date() + "").slice(0, 24);
            const creator = req.user._id
            Model.create({title, description, imageUrl, price, brand, isPublic, createdAt, creator})
            .then(createdOffer => {
                console.log(createdOffer)
                
                res.status(201).redirect('/home/')
            })
        },
        editOffer(req, res) {
            const {offerId} = req.params;
            const { title, description, imageUrl, price, brand, isPublic: public } = req.body;        // isPublic: "on" || undefined
            isPublic = !!public;
            Model.findByIdAndUpdate({ _id: offerId }, {
                "title": title,
                "description": description,
                "imageUrl": imageUrl,
                "price": price,
                "brand": brand,
                "isPublic": isPublic
            }).then((err, updated) => {
                if (err) console.log("Update error:    ", err)
                const isLoggedIn = (req.user !== undefined);
                res.redirect(`/offers/details-offer/${offerId}`)
                
            
            })
        }

        
    }
}