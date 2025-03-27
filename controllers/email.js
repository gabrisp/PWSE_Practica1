const { sendEmail } = require('../utils/nodeMail')
const { handleHttpError } = require('../utils/handleHttpError')


const send = async (req, res) => {
    try {
    const info= {
        from: process.env.EMAIL_FROM,
        to: "gabrielsanchezpalma73@gmail.com",
        subject: "Verification Code",
        text: "El codigo de verificacion es: 123456"
    }
    console.log(info);
    const data = await sendEmail(info);
    console.log("data",data);
    res.send(data);
    } catch (err) {
    //console.log(err)
    handleHttpError(res, 'ERROR_SEND_EMAIL')
    }
}

module.exports = { send }