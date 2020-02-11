var jwt = require('jsonwebtoken')

exports.generateToken = async (payload) => {
    var authToken
    // console.log(payload)
    await jwt.sign(payload,'secret...shhh',{expiresIn : '1h'},(err, token) => {
        // console.log(err,token)
        if(!err){
            authToken = token
        }
        return
    })
    return authToken;
}

exports.name =()=> {
    return "hello"
}

exports.verifyToken = async(token) => {
    var result
    await jwt.verify(token, 'secret...shhh',(err, data) => {
        console.log(data)
        if(!err)
            result =  {data : data}
        else 
            result = {error : err}
    })
    return result
}