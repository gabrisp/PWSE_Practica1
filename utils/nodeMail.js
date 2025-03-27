require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;


const createTransporter = async () => {
 
    const oauth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.REDIRECT_URI,
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    
    const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
    if (err) {
        console.log(err);
    reject("Failed to create access token.");
    }
        resolve(token);
    });
    });

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    type: "OAuth2",
    user: process.env.EMAIL_FROM,
    accessToken,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
    }
    });
    return transporter;
};

const sendEmail = async (emailOptions) => {
    try {
    let emailTransporter = await createTransporter();
    console.log("emailTransporter");
    await emailTransporter.sendMail(emailOptions);
    console.log("emailOptions");
    } catch (e) {
    console.log(e)
    }
};

module.exports = {  sendEmail };
