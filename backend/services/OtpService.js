const supabase = require("../config/supabaseClient");
const sendEmail = require("../services/emailService");
const generateOtp = ()=> {
    return Math.floor(1000 + Math.random() * 9000);
}

const  ExpirationTime = 1000 * 60 * 5; // 5 minutes

const sendOtp  = async (Id)=> {
    const {data: emailData, error: emailError} = await supabase.from('profiles').select('email').eq('id', Id).single();
    if (emailError) {
        return { error: emailError.message };
    }
    console.log(emailData);
    const email = emailData.email;
    const otp = generateOtp();
    // expiration time in yyyy-mm-dd hh:mm:ss format
    const expirationTime = new Date(Date.now() + ExpirationTime).toISOString();
    const {data , error} = await supabase.from('otp').insert([
        {
            userId: Id,
            otp: otp,
            expiration_time: expirationTime
        }
    ]).select('*').single();
    if (error) {
        return { error: error.message };
    }
    sendEmail(email, "OTP for CureIt", `Hello, Your OTP for CureIt is ${otp}. It will expire in 5 minutes.`);
    return {data};
}

module.exports = sendOtp;