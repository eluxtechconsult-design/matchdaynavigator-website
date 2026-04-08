import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.post("/contact", async (req, res) => {
  const { Name, Email, Organisation, Message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.your-email-provider.com",
    port: 587,
    secure: false,
    auth: {
      user: "admin@matchdaynavigator.com",
      pass: "EMAIL_PASSWORD"
    }
  });

  await transporter.sendMail({
    from: "MatchDay Navigator <admin@matchdaynavigator.com>",
    to: "admin@matchdaynavigator.com",
    subject: "New City / Partner Inquiry",
    text: `
Name: ${Name}
Email: ${Email}
Organisation: ${Organisation}

Message:
${Message}
    `
  });

  res.redirect("/thank-you.html");
});

app.listen(3000, () => {
  console.log("Contact form handler running");
});