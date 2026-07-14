const nodemailer = require("nodemailer");

// Escape HTML to prevent injection
function escapeHtml(text = "") {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                success: false,
                message: "Method Not Allowed"
            })
        };
    }

    try {

        const data = JSON.parse(event.body);

        // Validation
        if (
            !data.name ||
            !data.email ||
            !data.message
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Name, Email and Message are required."
                })
            };
        }

        // Clean Data
        const name = escapeHtml(data.name.trim());
        const email = escapeHtml(data.email.trim());
        const phone = escapeHtml(data.phone || "-");
        const company = escapeHtml(data.company || "-");
        const message = escapeHtml(data.message).replace(/\n/g, "<br>");

        const submittedDate = new Date().toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "medium"
        });

        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }

        });

        // ====================================================
        // ADMIN EMAIL
        // ====================================================

        await transporter.sendMail({

            from: `"FIDAP Solutions Website" <${process.env.GMAIL_USER}>`,

            to: process.env.GMAIL_USER,

            replyTo: email,

            subject: `📩 New Lead | ${name}`,

            text: `
New Contact Request

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}

Message:
${data.message}
`,

            html: `

<div style="background:#eef3f9;padding:35px;font-family:Arial,sans-serif;">

<table width="650" align="center" cellpadding="0" cellspacing="0"
style="background:#fff;border-radius:12px;overflow:hidden;
box-shadow:0 5px 20px rgba(0,0,0,.08);">

<tr>

<td style="background:#0F5FA8;padding:30px;text-align:center;">

<img
src="https://fidap-solutions.netlify.app/images/logo1.png"
width="230"
alt="FIDAP Solutions">

</td>

</tr>

<tr>

<td style="padding:35px;">

<h2 style="margin-top:0;color:#0F5FA8;">
New Contact Request
</h2>

<table width="100%" cellpadding="10"
style="border-collapse:collapse;">

<tr style="border-bottom:1px solid #eee;">
<td width="140"><b>Name</b></td>
<td>${name}</td>
</tr>

<tr style="border-bottom:1px solid #eee;">
<td><b>Email</b></td>
<td>
<a href="mailto:${email}">
${email}
</a>
</td>
</tr>

<tr style="border-bottom:1px solid #eee;">
<td><b>Phone</b></td>
<td>
<a href="tel:${phone}">
${phone}
</a>
</td>
</tr>

<tr style="border-bottom:1px solid #eee;">
<td><b>Company</b></td>
<td>${company}</td>
</tr>

<tr style="border-bottom:1px solid #eee;">
<td><b>Date</b></td>
<td>${submittedDate}</td>
</tr>

</table>

<h3 style="margin-top:35px;color:#0F5FA8;">
Message
</h3>

<div
style="
background:#f8f9fb;
padding:18px;
border-left:4px solid #0F5FA8;
line-height:1.8;
border-radius:6px;
">
${message}
</div>

</td>

</tr>

<tr>

<td
style="
background:#f5f5f5;
padding:20px;
font-size:13px;
text-align:center;
color:#666;
">

<b>FIDAP Solutions</b><br>

AI Recruitment • Staffing • Career Solutions

<br><br>

📧
<a href="mailto:info.fidappharma@gmail.com">
info.fidappharma@gmail.com
</a>

<br>

📞
<a href="tel:+15138585046">
+1 513-858-5046
</a>

<br>

🌐
<a href="https://fidap-solutions.netlify.app">
fidap-solutions.netlify.app
</a>

</td>

</tr>

</table>

</div>

`

        });

        // ====================================================
        // CUSTOMER EMAIL
        // ====================================================

        await transporter.sendMail({

            from: `"FIDAP Solutions" <${process.env.GMAIL_USER}>`,

            to: email,

            subject: "Thank you for contacting FIDAP Solutions",

            text: `
Hi ${name},

Thank you for contacting FIDAP Solutions.

We have successfully received your message.

Our recruitment team will review your request and contact you within 24 business hours.

Website:
https://fidap-solutions.netlify.app

Regards,
FIDAP Solutions
`,

            html: `

<div style="background:#eef3f9;padding:35px;font-family:Arial,sans-serif;">

<table width="650" align="center" cellpadding="0" cellspacing="0"
style="background:#fff;border-radius:12px;overflow:hidden;
box-shadow:0 5px 20px rgba(0,0,0,.08);">

<tr>

<td style="background:#0F5FA8;padding:30px;text-align:center;">

<img
src="https://fidap-solutions.netlify.app/images/logo1.png"
width="230"
alt="FIDAP">

</td>

</tr>

<tr>

<td style="padding:40px;">

<h2 style="color:#0F5FA8;margin-top:0;">

Hi ${name},

</h2>

<p style="font-size:16px;line-height:1.8;">

Thank you for contacting
<strong>FIDAP Solutions.</strong>

</p>

<p style="line-height:1.8;">

We have successfully received your request.

</p>

<p style="line-height:1.8;">

Our recruitment team will carefully review your enquiry and respond within
<strong>24 business hours.</strong>

</p>

<p style="line-height:1.8;">

If your enquiry is urgent, feel free to contact us directly.

</p>

<div style="margin:35px 0;">

<a
href="https://fidap-solutions.netlify.app"
style="
background:#0F5FA8;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
">

Visit Our Website

</a>

</div>

<p>

Kind Regards,

<br><br>

<strong>FIDAP Solutions Team</strong>

</p>

</td>

</tr>

<tr>

<td
style="
background:#f5f5f5;
padding:20px;
font-size:13px;
text-align:center;
color:#666;
">

<b>FIDAP Solutions</b>

<br>

AI Recruitment • Staffing • Career Solutions

<br><br>

📧
<a href="mailto:info.fidappharma@gmail.com">
info.fidappharma@gmail.com
</a>

<br>

📞
<a href="tel:+15138585046">
+1 513-858-5046
</a>

<br>

🌐
<a href="https://fidap-solutions.netlify.app">
fidap-solutions.netlify.app
</a>

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