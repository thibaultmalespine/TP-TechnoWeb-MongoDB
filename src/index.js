const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// URL de MongoDB sur le port 27017, le protocole est mongodb:// l'hôte est localhost utilisez les information de configuration de docker comme référence.
const mongoUrl = 'mongodb://localhost:27017';
 
// Utilisez bodyParser pour parser les requêtes JSON
app.use(bodyParser.json());
 
// Utilisez express.static pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));
 
// Route pour envoyer des données à l'API
app.post('/addData', async (req, res) => {
  const id = req.body.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
 
  try {
    // Établir une connexion avec la base de données
    const client = new MongoClient(mongoUrl);
    await client.connect();
 
    
    // Sélectionne la base de données et la collection 
    const collection = client.db().collection('etudiants');

    // Insérer une nouvelle donnée dans la collection
    await collection.insertOne({ 
        id: id, 
        firstname : firstname,
        lastname : lastname
    });
    
    // Fermer la connexion
    await client.close();
    
    res.json({ message: 'Data added successfully' });
    
    
    } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// Route pour récupérer des données depuis l'API
app.get("/list", async (req, res) => {
  try {
    // Établir une connexion avec la base de données
    const client = new MongoClient(mongoUrl);
    await client.connect();
 
    // Sélectionner la collection
    const collection = client.db("test").collection("etudiants");
 
    // Récupérer les données de la collection et les formatter en tableau JSON
    const list = await collection.find().toArray();
 
    // Fermer la connexion
    await client.close();
 
    // Renvoyer le tableau JSON à l'utilisateur
    res.json({ list });
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
 
// Route pour récupérer un document depuis l'API
app.get("/get/:id", async (req, res) => {
    // Récupérer l'id
    const { id } = req.params;
    try {

        // Établir une connexion avec la base de données
        const client = new MongoClient(mongoUrl);   
        await client.connect();

        // Sélectionner la collection
        const collection = client.db("test").collection("etudiants");

        // Récupérer le document associer à l'id et le converti en json 
        const document = await collection.find({id : id}).toArray();

        // Fermer la connexion
        await client.close();
       
        // Renvoyer le document à l'utilisateur
        res.json(document[0]);

    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
 
// Route pour modifier un document depuis l'API
app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {

    // Établir une connexion avec la base de données
    const client = new MongoClient(mongoUrl);   
    await client.connect();

    // Sélectionner la collection
    const collection = client.db("test").collection("etudiants");

    // Récupérer le document associer à l'id et le converti en json 
    const document = await collection.updateOne({ "id": id }, { $set:  body });

    // Fermer la connexion
    await client.close();
   
    // Renvoyer le document à l'utilisateur
    res.json({ message: 'Data modified successfully' });


    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});
 
// Route pour supprimer un document depuis l'API
app.post("/delete/:id", async (req, res) =>{
    const id = req.params.id; 
}) 

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})