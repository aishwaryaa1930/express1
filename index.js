const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;

const dbUrl = 'mongodb+srv://demoproject1:demoproject1@cluster0.pj2dg.mongodb.net/'
const dbName = 'kle1';

app.use(express.json());

let client;

//Initialize MongoDB Connection Once
async function connectDB() {
    if (!client) {
        try {
            client = await MongoClient.connect(dbUrl);
            console.log('Connected to MongoDB');
        }
        catch (error) {
            console.log('Error connecting to MongoDB:', error);
            throw error
        }
    }
    return client.db(dbName);
}

//Get All Users
app.get('/',async(req,res) => {
    try {
        const db = await connectDB();
        const users = await db.collection('usersDetails').find().toArray();
        res.json({message:'Displaying all records',users});
}
catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal Server Error'});
}
});

//Insert New Record 
app.post('/',async(req,res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('userDetails').insertOne(req.body);
        res.json({message:'Record Inserted', insertedld:result.insertedld});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal Server Error'});
    }
});

//Fetch User by ID
app.get('/fetch/:id',async(req,res) => {
    try {
        const db = await connectDB();
        const id =parseInt(req.params.id);
        const user = await db.collection('usersDetails').findOne({id});

        if (user) {
            res.json({message:'Record Found',user});
        }
        else {
            res.status(404).json({message:'Record Not Found'});
            }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({message:'Internal Server Error'});
                }
                });
        
// Update User by Name
app.put('/update/:name',async(req,res) => {
    try {
        const db = await connectDB();
        const name = req.params.name;
        const updateData ={$set: req.body};
        const result = await db.collection('usersDetails').updateOne({name},updateData);

        if(result.modifiedCount > 0) {
            res.json({message:'Record Updated'});
            }
            else {
                res.status(404).json({message:'Record Not Found or No Change Made'});
                }
                }
                catch (error) {
                    console.error(error);
                    res.status(500).json({message:'Internal Server Error'});
                    }
                    });

    // Delete User by Name
    app.delete('/delete/:name',async(req,res) => {
        try {
            const db = await connectDB();
            const name = req.params.name;
            const result = await db.collection('usersDetails').deleteOne({name});
      
            if(result.deletedCount > 0) {
                res.json({message:'Record Deleted'});
                }
                else {
                    res.status(404).json({message:'Record Not Found'});
                    }
                    }
                    catch (error) {
                        console.error(error);
                        res.status(500).json({message:'Internal Server Error'});
                        }
                        });
 app.listen(8001,() => console.log('Server is running on port 8001'));