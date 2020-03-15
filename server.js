//Imports
var express = require('express')
var app = express()
var multer= require('multer')
var path=require('path')
var cors = require('cors')
var bodyParser = require('body-parser')

//Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.get('/', (req, res) => {
    res.json("Hit")
})

//User
var userController = require('./controller/user')
app.post('/signup', userController.signup)
app.post('/signin', userController.signin)
app.get('/resetpassword/:mail', userController.resetPassword)
app.post('/updatepassword', userController.updatePassword)
app.post('/fetchusersdata', userController.fetchUsersData)
app.get('/handleblock/:id', userController.handleBlock)
//Token Verify
app.post('/verifytoken', userController.verifyToken)


//Product
var productController = require('./controller/product')
app.post('/addproduct', productController.addProduct)
app.get('/allproducts', productController.allProducts)
app.delete('/deleteproduct',productController.deleteProduct)
app.get('/allproductswithquantity', productController.allProductsWithQuantity)

//Menu
var menuController = require('./controller/menu')
app.put('/updatequantity', menuController.updateProductQuantity)
app.get('/getmenu', menuController.getMenu)

//orders
var orderController = require('./controller/order')
app.post('/addorder', orderController.addOrder)
app.get('/getpendingorders', orderController.getAllOrders)
app.post('/resolveorder',orderController.resolveOrder)
app.get('/ordersbyuser/:token',orderController.getOrdersByUser)
app.post('/report', orderController.report)

//payment
var paymentController = require('./controller/payment')
app.get('/payment', paymentController.paytmPayment)
app.post('/paymentsuccess',paymentController.paymentSuccess)
app.post('/stripe', paymentController.stripePayment)

//Image
app.use(express.static('public'))
var storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
        cb(null , `IMAGE-${Date.now()}${path.extname(file.originalname)}`);
    }
}
);

var upload = multer({ storage } );


app.post('/profile', upload.single('profile'), (req, res) => {
    try {
        console.log("file",req.file)
        res.send(req.file);
    }catch(err) {
        res.send(400);
    }
});

app.listen(4000, (err) => console.log("--->   App up and running on port 4000   <---"))