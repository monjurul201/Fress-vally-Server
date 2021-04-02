const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;

const ObjectId=require('mongodb').ObjectID;
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()
const port = process.env.PORT||5055

app.use(cors());
app.use(express.json());


//console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ca1km.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('conection err',err);
const Productcollection = client.db("FressVally").collection("events");
const OrderCollection = client.db("OrderItem").collection("orders");

console.log('database connection successfully');

//Upload data UI from database 
app.get('/events',(req,res)=>{
  Productcollection.find()
  .toArray((err,items) =>{
    res.send(items)
    console.log('from database',items);
  })
})




app.post('/addProduct',(req,res) =>{
    const event=req.body;
    //console.log('adding new product',event);
    Productcollection.insertOne(event)
    .then(result =>{
      //console.log('inserted Count',result.insertedCount)
        res.send(result.insertedCount >0)
    })
})
  // client.close();


//delete product from database
app.delete('/deleteProduct/:id', (req, res) => {
  const id = ObjectId(req.params.id);
 Productcollection.deleteOne({ _id: id })
     .then((result) => {
       console.log(result);
         res.send(result.deletedCount > 0)
     })
})
  
//order send to data base
app.post('/addOrder',(req,res) =>{
  const event=req.body;
  //console.log('adding new product',event);
  OrderCollection.insertOne(event)
  .then(result =>{
    //console.log('inserted Count',result.insertedCount)
      res.send(result.insertedCount >0)
  })
})

//Show Order UI
app.get('/orders',(req,res)=>{
  const qEmail = req.query.email;
  OrderCollection.find({ email: qEmail })
  .toArray((err,documents) =>{
    res.send(documents)
    console.log('from database',documents);
  })
})


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})