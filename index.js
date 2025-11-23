const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  try {
    // await client.connect();
    const mySkillsCollections = client
      .db("Tanvir_Portfolio")
      .collection("skills");
    const myEducationCollections = client
      .db("Tanvir_Portfolio")
      .collection("study");
    const myProjectsCollections = client
      .db("Tanvir_Portfolio")
      .collection("projects");
    const myContactCollections = client
      .db("Tanvir_Portfolio")
      .collection("contact");

    app.get("/", async (req, res) => {
      res.send(`
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    text-align: center; 
	padding: 0;
	margin: 0; 
    background: linear-gradient(135deg, #1a0033, #140021);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 20px;
  ">
    <div style="display: flex; align-items: center; gap: 10px;">
  <h1 style="
    font-size: 48px;
    font-weight: 700;
    background: linear-gradient(90deg, #f0a, #6e00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  ">
    Hello!
  </h1>
  <span style="font-size: 48px;">👋</span>
</div>

    
    <h2 style="
      font-size: 32px;
      font-weight: 600;
      background: linear-gradient(90deg, #ff79c6, #8be9fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
    ">
      I am Tanvir Hasan
    </h2>
    
    <p style="
      font-size: 18px; 
      max-width: 600px; 
      line-height: 1.6; 
      margin-bottom: 30px;
      color: #ccc;
    ">
      I am a passionate Web Developer specializing in React.js, Next.js, Node.js, and modern full-stack MERN applications.
      I build fast, scalable, and high-performance web solutions with clean and maintainable code.
    </p>
    
    <div style="
      width: 200px; 
      height: 200px; 
      border-radius: 50%; 
      overflow: hidden; 
      border: 4px solid #ff79c6; 
      box-shadow: 0 0 20px rgba(255,121,198,0.5);
      transition: transform 0.3s, box-shadow 0.3s;
    " 
      onmouseover="this.style.transform='scale(1.1) rotate(5deg)'; this.style.boxShadow='0 0 30px rgba(255,121,198,0.8)';" 
      onmouseout="this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 0 20px rgba(255,121,198,0.5)';"
    >
      <img 
        src="https://i.ibb.co.com/5hftcXWM/Tanvir.jpg" 
        alt="Tanvir Hasan" 
        style="width:100%; height:100%; object-fit: cover;"
      />
    </div>
  </div>
`);
    });

    app.get("/skills", async (req, res) => {
      const result = await mySkillsCollections.find({}).toArray();

      const order = [
        "Frontend Development",
        "Backend Development",
        "Database",
        "Tools & Technology",
      ];

      const sorted = result.sort(
        (a, b) => order.indexOf(a.category) - order.indexOf(b.category)
      );

      res.send(sorted);
    });

    app.get("/education", async (req, res) => {
      const result = await myEducationCollections.find().toArray();
      res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const result = await myProjectsCollections.find().toArray();

      const order = ["TechOrbit", "Recipe Hut", "Volunify"];

      const sorted = result.sort(
        (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
      );

      res.send(sorted);
    });
    app.get("/contact", async (req, res) => {
      const result = await myContactCollections.find().toArray();
      res.send(result);
    });

    // send-email API
    app.post("/send-email", async (req, res) => {
      const { name, phone, email, subject, message } = req.body;
      try {
        // console.log("📩 Incoming Email Request:", req.body);

        const mailOptions = {
          from: `"Portfolio Message" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: subject,
          html: `
  <div style="background:#f4f4f7; padding:20px; font-family:Arial, sans-serif;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:white;
      padding:25px;
      border-radius:10px;
      box-shadow:0 4px 12px rgba(0,0,0,0.1);
    ">
      
      <h2 style="color:#6a1b9a; text-align:center; margin-bottom:20px;">
        📩 New Message From Your Portfolio
      </h2>

      <p style="font-size:15px; color:#333;">
        You have received a new message from your portfolio contact form.
      </p>

      <div style="margin-top:20px;">
        <p style="margin:8px 0; font-size:14px;">
          <strong style="color:#6a1b9a;">Name:</strong> ${name}
        </p>
        <p style="margin:8px 0; font-size:14px;">
          <strong style="color:#6a1b9a;">Email:</strong> ${email}
        </p>
        <p style="margin:8px 0; font-size:14px;">
          <strong style="color:#6a1b9a;">Phone:</strong> ${
            phone || "Not provided"
          }
        </p>
        <p style="margin:8px 0; font-size:14px;">
          <strong style="color:#6a1b9a;">Subject:</strong> ${subject}
        </p>
      </div>

      <div style="
        margin-top:20px;
        padding:15px;
        background:#f9e7ff;
        border-left:4px solid #9c27b0;
        border-radius:6px;
      ">
        <p style="margin:0; white-space:pre-line; font-size:14px; color:#444;">
          ${message}
        </p>
      </div>

      <p style="font-size:13px; color:#888; margin-top:25px; text-align:center;">
        — Portfolio Mail System • ${new Date().toLocaleDateString()} —
      </p>
    </div>
  </div>
`,
        };

        const result = await transporter.sendMail(mailOptions);
        // console.log("📬 Email sent:", result);

        await transporter.sendMail({
          from: `"Tanvir Hasan Portfolio" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "📬 We Received Your Message!",
          html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4f8; padding: 30px; border-radius: 15px; max-width: 600px; margin: auto; border: 2px solid #6a1b9a;">
    
    <div style="text-align: center; margin-bottom: 25px;">
      <h1 style="color: #6a1b9a; font-size: 28px; margin-bottom: 5px;">Hello, ${name}! 👋</h1>
      <p style="color: #333; font-size: 16px; margin-top: 0;">
        We’ve received your message and I’ll get back to you within 24 hours. ⏳
      </p>
      <p style="color: #555; font-size: 14px; margin-top: 5px;">
        Kindly stay tuned and keep an eye on your inbox. Your patience is appreciated! 🌟
      </p>
    </div>

    <div style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.15);">
      <h2 style="color: #6a1b9a; font-size: 20px; margin-bottom: 12px;">What’s Next? 🔜</h2>
      <p style="color: #555; line-height: 1.7;">
        I’ll review your message carefully and reply as soon as possible. Meanwhile, feel free to explore my portfolio, projects, and social profiles. Inspiration and collaboration can strike anytime! 🚀
      </p>
      <p style="color: #555; line-height: 1.7; margin-top: 12px;">
        Thank you for reaching out and trusting me with your message. Let’s create something amazing together! ✨
      </p>
    </div>

    <div style="margin-top: 25px; text-align: center;">
      <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
        Connect with me on social platforms while you wait:
      </p>
      <div style="margin-top: 5px;">
        <a href="https://github.com/tanvir-hasan-code" style="text-decoration:none; margin:0 5px; color:#fff; background:#333; padding:8px 15px; border-radius:5px;">GitHub</a>
        <a href="https://www.linkedin.com/in/tanvir-hasan01/" style="text-decoration:none; margin:0 5px; color:#fff; background:#0077b5; padding:8px 15px; border-radius:5px;">LinkedIn</a>
        <a href="https://www.facebook.com/tanvir0Xv/" style="text-decoration:none; margin:0 5px; color:#fff; background:#4267B2; padding:8px 15px; border-radius:5px;">Facebook</a>
      </div>
      <p style="margin-top: 15px; font-size: 14px; color: #555;">Or Call me directly:</p>
      <a href="tel:+8801796255213" style="display:inline-block; margin-top:5px; background:#6a1b9a; color:#fff; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">Call +8801796255213</a>
    </div>

    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you once again for contacting me! Stay inspired and keep shining! ✨</p>
      <p>— Tanvir Hasan</p>
    </div>

  </div>
`,
        });

        res.send({ success: true, message: "Email sent successfully!" });
      } catch (error) {
        // console.error("❌ Email Send Error:", error);
        res.status(500).send({
          error: true,
          message: "Email sending failed",
          details: error.message,
        });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
