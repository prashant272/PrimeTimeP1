import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.BREVO_SMTP_HOST,
//   port: process.env.BREVO_SMTP_PORT,
//   secure: false, // TLS
//   auth: {
//     user: process.env.BREVO_SMTP_USER, // apikey
//     pass: process.env.BREVO_SMTP_PASS, // xsmtpsib-...
//   },
// });

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: process.env.BREVO_SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER || "apikey",
        pass: process.env.BREVO_SMTP_PASS,
    },
});

// SMTP check
transporter.verify((err, success) => {
    if (err) {
        console.error("❌ Brevo SMTP Error:", err);
    } else {
        console.log("✅ Brevo SMTP Connected Successfully");
    }
});

/**
 * Send OTP email
 */
export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Global Healthcare Awards" <${process.env.BREVO_FROM_EMAIL}>`,
        to: email,
        subject: "Verify Your Email - Global Healthcare Awards",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d4af37; border-radius: 10px;">
        <h2 style="color: #d4af37; text-align: center;">Welcome to Global Healthcare Awards</h2>
        <p>Dear User,</p>
        <p>Please use the following OTP to verify your email. This OTP is valid for 10 minutes.</p>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; color: #333; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>If you did not request this, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; text-align: center;">© Global Healthcare Awards 2026</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending OTP:", error);
        throw new Error("Failed to send OTP email");
    }
};

/**
 * Send Nomination Success Email
 */
export const sendNominationSuccessEmail = async (email, nomineeName) => {
    const mailOptions = {
        from: `"Global Healthcare Awards" <${process.env.BREVO_FROM_EMAIL}>`,
        to: email,
        subject: "Nomination Received - Global Healthcare Awards 2026",
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #d4af37; border-radius: 15px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px;">Submission Successful!</h1>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${nomineeName}</strong>,</p>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Your nomination has been successfully received. Our team will connect with you after reviewing the profile.
        </p>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #fffdf2; border-radius: 10px; border-left: 4px solid #d4af37;">
            <h3 style="color: #d4af37; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Any Queries? Feel free to contact us</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                        <span style="font-weight: bold; color: #333;">General Queries:</span><br>
                        <a href="tel:+919810882769" style="color: #d4af37; text-decoration: none; font-size: 16px;">📞 +91 9810 88 2769</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                        <span style="font-weight: bold; color: #333;">Nominations:</span><br>
                        <a href="tel:+919971002984" style="color: #d4af37; text-decoration: none; font-size: 16px;">📞 +91 9971 00 2984</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <span style="font-weight: bold; color: #333;">Sponsorship:</span><br>
                        <a href="tel:+919810910686" style="color: #d4af37; text-decoration: none; font-size: 16px;">📞 +91 9810 91 0686</a>
                    </td>
                </tr>
            </table>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #888; text-align: center; margin-bottom: 0;">
            Sent by <strong>Global Healthcare Awards & Summit 2026</strong><br>
            Organised by Prime Time Research Media Pvt. Ltd.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Nomination success email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending nomination email:", error);
    }
};

/**
 * Send Password Reset OTP Email
 */
export const sendPasswordResetEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Global Healthcare Awards" <${process.env.BREVO_FROM_EMAIL}>`,
        to: email,
        subject: "Password Reset Code - Global Healthcare Awards",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d4af37; border-radius: 10px;">
        <h2 style="color: #d4af37; text-align: center;">Account Recovery</h2>
        <p>Dear User,</p>
        <p>You have requested to reset your password. Use the following OTP to proceed. This OTP is valid for 10 minutes.</p>
        <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; color: #333; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        <hr>
        <p style="font-size: 12px; text-align: center;">© Global Healthcare Awards 2026</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset OTP sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
