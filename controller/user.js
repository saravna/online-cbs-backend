var jwt = require('../jwt/jwt')
var model = require('../models')
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')
var Sequelize = require('sequelize')

module.exports.signin = (req, res) => {
    model.user.findAll({
        attributes : ['id','mail', 'password','blocked'],
        where : {mail : req.body.mail}
    })
    .then(users => {
        console.log(users)
        if(users && users[0].dataValues){
            bcrypt.compare(req.body.password,users[0].dataValues.password,(err,result)=> {
                console.log(err, result)
                if(!err){
                    if(result){
                        if(!users[0].dataValues.blocked) {
                            jwt.generateToken({id:users[0].dataValues.id,mail : req.body.mail})
                            .then(token => res.json({authToken : token}))   
                        } else {
                            res.json({error : "You have been blocked"})
                        }
                    } else {
                        res.json({error : "Username or Password is invalid"})
                    }
                } else {
                    res.json({error : err})
                }
            })
        } else {
            res.json({error : "Username or Password is invalid"})
        }
    })
    .catch(err => res.json({error:"Error finding user"}))
}

module.exports.fetchUsersData = (req, res) => {
    console.log(req.body)
    jwt.verifyToken(req.body.token)
    .then(data => {
        // if(!data.error){
            model.user.findAll({
                attributes : ['id','mail','blocked'],
                where : {
                    role : 'USER'
                },
                order : [['mail','ASC']]
            })
            .then(data => res.json(data.map(d => d.dataValues)))
        // }
    })
}

module.exports.signup = (req, res) => {
    console.log(req.body)
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            model.user.create({
                mail : req.body.mail,
                password : hash,
                role : req.body.role,
                blocked : req.body.blocked,
                mobile : req.body.mobile
            })
            .then(user => {
                if(user.dataValues){
                    jwt.generateToken({id:user.dataValues.id,mail : req.body.mail})
                    .then(token => res.json({authToken : token}))
                }
            })
            .catch(err => res.json({error:err}))
        });
    });
}

module.exports.handleBlock = (req, res) => {
    const id = parseInt(req.params.id)
    model.user.update(
        {   blocked : Sequelize.literal('NOT blocked')  },
        {   where : {id}    }
    )
    .then(data => res.json("success"))
}

module.exports.updatePassword = (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            console.log(hash)
            model.user.update(
                {password : hash},
                {where : { id : req.body.id }
            })
            .then(user => {
                if(user[0]==1)
                    res.json("success")
                else 
                    res.json({error : "Failed"})
            })
            .catch(err => res.json({error:err}))
        });
    });
}

module.exports.verifyToken = (req, res) => {
    jwt.verifyToken(req.body.token)
    .then(data => res.json(data))
}

module.exports.resetPassword = (req, res) => {
    // console.log(req)
    model.user.findOne({
        attributes : ['id','mail'],
        where : {
            mail : req.params.mail
        }
    })
    .then(user => {
        if(user === null){

        } else {
            jwt.generateToken(user.dataValues)
            .then(token => {
                mail(token,user.dataValues.mail)
                .then(res.json('success'))
                .catch(err => console.log(err))
            })
        }
    })
} 

const mail = async (token, mail) => {
    // let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "saravanakumar.ravichandran@codingmart.com",
          pass: "codingmart"
        }
      });

      var url = process.env.NODE_ENV==="development"?"http://localhost:3000/":"cashlesscanteen.gq/"

      let mailOptions = {
        from: "Saravana Kumar",
        to: mail,
        // cc: <cc mail add>,
        subject: "Password Recovery", 
        // text: token, 
        html: `<p><a href="${url}recoverpassword/?a=${token}">Click Here</a> to change password</p>`, 
        // attachments: [
        //   {
        //     path: <path>
        //   }
        // ]
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: " + info.response);
        return info.response
      });
      return
}