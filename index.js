const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config()
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

async function run() {
  try {
	  // await client.connect();
	  const mySkillsCollections = client.db("Tanvir_Portfolio").collection("skills")
	  const myEducationCollections = client.db("Tanvir_Portfolio").collection("study")
	  const myProjectsCollections = client.db("Tanvir_Portfolio").collection("projects")
	  const myContactCollections = client.db("Tanvir_Portfolio").collection("contact")

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
    <h1 style="
      font-size: 48px;
      font-weight: 700;
      background: linear-gradient(90deg, #f0a, #6e00ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    ">
      Hello! 👋
    </h1>
    
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
		  const result = await mySkillsCollections.find().toArray();
		  res.send(result)
	  })
	  app.get("/education", async (req, res) => {
		  const result = await myEducationCollections.find().toArray();
		  res.send(result);
	  })

	  app.get("/projects", async (req, res) => {
		  const result = await myProjectsCollections.find().toArray();
		  res.send(result);
	  })
	  app.get("/contact", async (req, res) => {
		  const result = await myContactCollections.find().toArray();
		  res.send(result);
	  })
	  
	  

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
