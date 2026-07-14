const nodemailer = require("nodemailer");

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                message: "Method Not Allowed"
            })
        };
    }

    try {

        const data = JSON.parse(event.body);

        if (!data.name || !data.email || !data.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Name, Email and Message are required."
                })
            };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        // ==========================
        // Email to FIDAP
        // ==========================

        await transporter.sendMail({

            from: `"FIDAP Solutions Website" <${process.env.GMAIL_USER}>`,

            to: process.env.GMAIL_USER,

            replyTo: data.email,

            subject: `📩 New Contact Form Submission - ${data.name}`,

            html: `

            <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;">

                <table style="max-width:650px;width:100%;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

                    <tr>

                        <td style="background:#0F5FA8;text-align:center;padding:25px;">

                            <img src="https://fidap-solutions.netlify.app/images/logo1.png"
                                 width="220">

                        </td>

                    </tr>

                    <tr>

                        <td style="padding:30px;">

                            <h2 style="color:#0F5FA8;margin-top:0;">
                                New Contact Request
                            </h2>

                            <table style="width:100%;border-collapse:collapse;">

                                <tr>
                                    <td><b>Name</b></td>
                                    <td>${data.name}</td>
                                </tr>

                                <tr>
                                    <td><b>Email</b></td>
                                    <td>${data.email}</td>
                                </tr>

                                <tr>
                                    <td><b>Phone</b></td>
                                    <td>${data.phone || "-"}</td>
                                </tr>

                                <tr>
                                    <td><b>Company</b></td>
                                    <td>${data.company || "-"}</td>
                                </tr>

                            </table>

                            <hr>

                            <h3>Message</h3>

                            <p style="line-height:1.7;">
                                ${data.message}
                            </p>

                        </td>

                    </tr>

                    <tr>

                        <td style="background:#f4f4f4;padding:20px;font-size:13px;color:#666;text-align:center;">

                            FIDAP Solutions<br>

                            AI Recruitment • Staffing • Career Solutions<br><br>

                            📧 info.fidappharma@gmail.com<br>

                            📞 +1 513-858-5046<br>

                            🌐 https://fidap-solutions.netlify.app

                        </td>

                    </tr>

                </table>

            </div>

            `

        });

        // ==========================
        // Auto Reply
        // ==========================

        await transporter.sendMail({

            from: `"FIDAP Solutions" <${process.env.GMAIL_USER}>`,

            to: data.email,

            subject: "Thank you for contacting FIDAP Solutions",

            html: `

            <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;">

                <table style="max-width:650px;width:100%;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

                    <tr>

                        <td style="background:#0F5FA8;text-align:center;padding:25px;">

                            <img src="https://fidap-solutions.netlify.app/images/logo1.png"
                                 width="220">

                        </td>

                    </tr>

                    <tr>

                        <td style="padding:35px;">

                            <h2 style="color:#0F5FA8;">
                                Hi ${data.name},
                            </h2>

                            <p>

                                Thank you for contacting
                                <strong>FIDAP Solutions</strong>.

                            </p>

                            <p>

                                We have successfully received your message.

                            </p>

                            <p>

                                Our recruitment team will review your request
                                and respond within
                                <strong>24 business hours.</strong>

                            </p>

                            <br>

                            <a href="https://fidap-solutions.netlify.app"

                               style="background:#0F5FA8;color:#fff;padding:12px 22px;text-decoration:none;border-radius:5px;display:inline-block;">

                                Visit Our Website

                            </a>

                            <br><br>

                            Regards,<br>

                            <strong>FIDAP Solutions Team</strong>

                        </td>

                    </tr>

                    <tr>

                        <td style="background:#f4f4f4;padding:20px;font-size:13px;color:#666;text-align:center;">

                            AI Recruitment • Staffing • Career Solutions<br><br>

                            📧 info.fidappharma@gmail.com<br>

                            📞 +1 513-858-5046<br>

                            🌐 https://fidap-solutions.netlify.app

                        </td>

                    </tr>

                </table>

            </div>

            `

        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Emails sent successfully."
            })
        };

    } catch (err) {

        console.error("EMAIL ERROR:", err);

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: err.message
            })
        };

    }

};