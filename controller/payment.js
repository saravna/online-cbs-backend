const checksum_lib = require('../paytm/checksum/checksum')
const stripe = require('stripe')('sk_test_Fs3MSLbruiImIG9Pobr42ZKt00cwSP1E8S')

module.exports.paytmPayment = (req, res) => {
    let params ={}
    params['MID'] = 'YMNFTj96226901061185',
    params['WEBSITE'] = 'WEBSTAGING',
    params['CHANNEL_ID'] = 'WEB',
    params['INDUSTRY_TYPE_ID'] = 'Retail',
    params['CUST_ID'] = '2',
    params['ORDER_ID'] = '1',
    params['TXN_AMOUNT'] = '1',
    params['CALLBACK_URL'] = 'http://localhost:4000/paymentsuccess',
    // params['EMAIL'] = 'ravi.saravana8@gmail.com',
    // params['MOBILE_NO'] = '7845211910'

    checksum_lib.genchecksum(params,'U0ofTbZ9#UrLVh_@',(err, checksum)=> {
        let txn_url = 'https://securegw-stage.paytm.in/order/process';
        let form_fields = '';

        console.log("check", checksum)

        for(x in params){
            form_fields += `<input type='hidden' name='${x}' value='${params[x]}'/>`
        }

        form_fields+=`<input type='hidden' name='CHECKSUMHASH' value='${checksum}'/>`

        var html = `
            <html>
                <body>
                    <center>
                        <h1>Please Hold on.... Donot refresh the page</h1>
                    </center>
                    <form method='post' action='${txn_url}' name="f1">
                        ${form_fields}
                    </form>
                    <script type="text/javascript">
                        document.f1.submit()
                    </script>
                </body>
            </html>
        `
        res.writeHead(200, {'Content-Type' : 'text/html'})
        res.write(html)
        res.end()
        
        // if(!err)
    })
} 

module.exports.paymentSuccess = (req,res) => {
    console.log(req.body)
    res.send(req.body.CHECKSUMHASH)
}

module.exports.stripePayment = (req, res ) => {
    let amount = req.body.price

    stripe.charges.create({
        amount,
        source : req.body.stripeTokenId,
        currency : 'inr',

    })
    .then(resp => {
        console.log(resp)
        res.json(resp)
    })
    .catch(err => console.log(err))
}