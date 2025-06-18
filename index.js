import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import 'dotenv/config'; 
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

var edit= false;

const db = new pg.Client({
    user:  process.env.PG_USER,
    host:  process.env.PG_HOST,
    database:  process.env.PG_DATABASE,
    password:  process.env.PG_PASSWORD,
    port :  process.env.PG_PORT,
});

db.connect() .then(() => console.log("Connected to PostgreSQL")).catch((err) => console.error("Connection error", err.stack));
let books =[];



async function checkBooks(){
  try{   
    const result = await db.query("select * from book order by date_read asc, rating desc");
    books = result.rows;
  }catch(err){
    console.log("Error in executing the checkBooks query",err.stack);
  }
}
await checkBooks();


app.get("/",(req,res)=>{
    // console.log(books);
    res.render("index.ejs",{books});
});

app.get("/edit/:id" ,(req,res)=>{
    const id =parseInt(req.params.id);
    const book = books.find(b=> b.id === id);
    edit = true;
    res.render("new.ejs",{wasedit : edit , book : book});
});

app.post("/update/:id", async (req,res)=>{
    const id = parseInt(req.params.id);
    const title = req.body.title;
    const rating =req.body.rating;
    const review = req.body.content;
    let d =new Date();
    const date = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
    // console.log(date);
    try{
        const result = await db.query("update book set name= $1 , rating =$2 , content = $3 ,date_read = $4 where id =$5",[title,rating,review,date,id]);
        await checkBooks();
        edit=false;
        res.redirect("/");
    }catch(err){
        console.log("Error updating the data query",err.stack);
        res.status(500).send("database error in updating the data");
    }
    
});

app.get("/new",(req,res)=>{
    edit = false;
    res.render("new.ejs",{wasedit : edit});
});
app.post("/create", async (req, res) => {
  let title = req.body.title;
  const rating = req.body.rating;
  const review = req.body.content;
  let author = "";
  let isbn = "";

  const d = new Date();
  const date = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
//   console.log(date);

  try {
    const result = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(title)}`);
    const obj = result.data;

    if (obj.docs && obj.docs.length > 0) {
      author = obj.docs[0].author_name?.join(", ") || author;
      title = obj.docs[0].title;
      isbn = obj.docs[0].cover_i;
      console.log(author,title,isbn);
    } else {
      console.warn("No results from Open Library for", title);
    }

  } catch (err) {
    console.error("Error fetching book data:", err.stack);
  }

  try {
    const result = await db.query(
      "INSERT INTO book (name, rating, content, author, isbn, date_read) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, rating, review, author, isbn, date]
    );
    await checkBooks();
    res.redirect("/");
  } catch (err) {
    console.error("Database insert error:", err.stack);
    res.status(500).send("Database Error");
  }
});

app.get("/delete/:id", async (req,res)=>{
   const id =req.params.id;
   try{
     const result  = await db.query("delete from book where id=$1",[id]);
       await checkBooks();
       res.redirect("/");
   }catch(err){
     console.log( "Error in deleting the data query");
     res.status(500).send("Database Error");
   }
});


app.listen(port,(req,res)=>{
    console.log(`server running on port ${port}`);
});