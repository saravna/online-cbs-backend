var model = require('../models')
var {Op} = require('sequelize')

module.exports.allProducts = (req, res) => {
    model.products.findAll({
        attributes : ['id','name','price','image']
    })
    .then(products => {
        res.json(products)
    })
}

module.exports.allProductsWithQuantity = (req, res) => {
    model.products.findAll({
        attributes : ['id','name'],
        include : [{
            model : model.menu,
            attributes : ['quantity'],
            where : {
                quantity : {
                    [Op.gt] : 0
                }
            }
        }]
    })
    .then(products => {
        res.json(products)
        // console.log(products)
    })
}

module.exports.addProduct = (req, res) => {
    model.products.create({
        name : req.body.name,
        price : req.body.price,
        image : req.body.image
    })
    .then(product => product.createMenu({
        quantity : 0
    }))
    .then(data => res.json(data))
}

module.exports.deleteProduct = (req, res) => {
    model.products.destroy({
        where : {
            id : req.body.id
        }
    })
    .then(removedProduct => {
        console.log(removedProduct)
        model.menu.destroy({
            where : {
                productId : req.body.id
            }
        })
        .then(response => res.json(response))
    })

}