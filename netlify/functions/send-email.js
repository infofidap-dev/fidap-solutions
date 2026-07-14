const nodemailer = require("nodemailer");

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }

    });

    const mailOptions = {

        from: process.env.GMAIL_USER,

        to: process.env.GMAIL_USER,

        subject: "New Contact Form Submission",

        html: `
            <h2>New Contact Request</h2>

            <p><strong>Name:</strong> ${data.name}</p>

            <p><strong>Email:</strong> ${data.email}</p>

            <p><strong>Phone:</strong> ${data.phone}</p>

            <p><strong>Company:</strong> ${data.company}</p>

            <p><strong>Message:</strong></p>

            <p>${data.message}</p>
        `

    };

    try {

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true
            })
        };

    } catch (err) {

        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };

    }

};