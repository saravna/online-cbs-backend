var model = require('../models')
var jwt = require('../jwt/jwt')
var sequelize = require('sequelize')
var {Op} = sequelize

module.exports.addOrder = (req, res) => {
    var otp = Math.floor(1000 + Math.random() * 9000)
    jwt.verifyToken(req.body.token)
    .then(data => {
        if(data.data.id){
            console.log(req.body)
            model.order.create({
                userId : data.data.id,
                status : req.body.status,
                otp,
                billAmount : req.body.billAmount,
                paymentId : req.body.paymentId,
                recieptUrl : req.body.recieptUrl 
            })
            .then(order => {
                console.log(req.body.orderItems)
                return req.body.orderItems.map(item => {
                    model.orderItems.create({
                        orderId : order.dataValues.id,
                        productId : item.productId,
                        quantity : item.quantity,
                    })
                    .then(item => {
                        return model.menu.findAll({
                            attributes : ['id','quantity'],
                            where : {productId : item.dataValues.productId}
                        })
                        .then(menu => {
                            return model.menu.update(
                                {quantity : menu[0].dataValues.quantity - item.dataValues.quantity},
                                {where : {id : menu[0].dataValues.id}}
                            )
                        })
                    })

                })
            })
            .then(data => res.json("success"))
            .catch(err => res.json(err))
        } else {
            res.json(data.err)
        }
    })
}

module.exports.getAllOrders = (req, res) => {
    model.order.findAll({
        where : {status : 'PENDING'},
        include : [{
            model : model.orderItems,
            include : [model.products]
        }]
    })
    .then(orders => res.json(orders))
}

module.exports.resolveOrder = (req, res) => {
    jwt.verifyToken(req.body.token)
    .then(data => {
        if(data.data.id){
            model.order.update(
                {status : 'DELIVERED'},
                {where : {id:req.body.orderId}}
            )
            .then(order => res.json(order))
        }
    })
}

module.exports.getOrdersByUser = (req, res) => {
    console.log(req.params)
    jwt.verifyToken(req.params.token)
    .then(data => {
        console.log("Hit")
        if(data.data.id) {
            model.order.findAll({
                where : {
                    userId : data.data.id,
                },
                include : [
                    {
                        model : model.orderItems,
                        include : [model.products]
                    }
                ]
            })
            .then(orders => res.json(orders))
        }
    })
}

module.exports.report = (req, res) => {
    model.orderItems.findAll({
        attributes : ['productId',[sequelize.fn('sum', sequelize.col('quantity')),'totalQuantity']],
        group :['orderItems.productId'],
        where : {
            [Op.and] : [
                {
                    createdAt : {
                        [Op.gte] : req.body.start    
                    }
                },
                {
                    createdAt : {
                        [Op.lte] : req.body.end    
                    }
                }   
            ]
        }
    })
    .then(async data => {
        var result = await appendProducts(data)
        res.json(result)
    })
}

const appendProducts =async  (data) => {
    for(var i=0;i<data.length ; i++){
        await model.products.findOne({
            attributes : ['name', 'price', 'image'],
            where : {
                id : data[i].dataValues.productId
            }
        })
        .then(result => {
            return data[i].dataValues.product = result.dataValues
        })
    }
    return data
}