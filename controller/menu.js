var model = require('../models')

module.exports.updateProductQuantity = (req, res) => {
    const { newQuantity } = req.body
    // console.log(newQuantity)
    newQuantity.map((productData) => {
        model.menu.update(
            { quantity : productData.quantity },
            { where : { productId : productData.productId }}
        )
        .then((menu) => console.log(menu))
        .catch(err => console.log("error",err))
    })
    res.json("Success")
}

module.exports.getMenu = (req, res) => {
    model.products.findAll({
        attributes : ['id','name','price','image'],
        include : [{
            model : model.menu,
            attributes : ['quantity']
        }]
    })
    .then(data => res.json(data))
}