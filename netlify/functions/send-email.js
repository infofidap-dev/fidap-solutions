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
            <table style="width:600px;font-family:Arial;border-collapse:collapse">
<tr>
<td style="background:#0F5FA8;color:white;padding:20px">
<h2>FIDAP Solutions</h2>
</td>
</tr>

<tr>
<td style="padding:25px">

<h3>New Contact Request</h3>

<hr>

<p><b>Name:</b> ${data.name}</p>

<p><b>Email:</b> ${data.email}</p>

<p><b>Phone:</b> ${data.phone}</p>

<p><b>Company:</b> ${data.company}</p>

<p><b>Message</b></p>

<p>${data.message}</p>

</td>
</tr>

</table>
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

    } 
    await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: data.email,

    subject: "Thank you for contacting FIDAP Solutions",

    html: `
        <h2>Hi ${data.name},</h2>

        <p>Thank you for contacting <b>FIDAP Solutions</b>.</p>

        <p>We have received your request successfully.</p>

        <p>Our recruitment team will get back to you within 24 hours.</p>

        <br>

        <b>FIDAP Solutions</b><br>
        AI Recruitment & Staffing<br>
        📧 info.fidappharma@gmail.com<br>
        📞 +1 513-858-5046
    `
});
    catch (err) {

        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };

    }

};