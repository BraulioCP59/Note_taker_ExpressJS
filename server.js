const express = require('express');
const path = require('path');
const api = require('./routes/index.js');
const notes = require('./db/db.json');
const {writeFile} = require('fs');


const PORT = 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//Get Route for retrieving note data
app.get('/api/notes', (req, res) => {
  console.log(`\n******************************\n${req.method} request received to get all notes!\n******************************`);
  res.status(200).json(notes);
})

//Post Route for saving new notes into db
app.post('/api/notes', (req, res) => {
    // 
    console.log(`\n******************************\n${req.method} request received to add a note!\n******************************`);

    // 
    const { title, text} = req.body;
  
    // 
    if (title && text) {
      // 
      const newNote = {
        title, 
        text,
      };

      //
      notes.push(newNote);

      // 
      const dbNotesString = JSON.stringify(notes);
  
      // 
      writeFile(`./db/db.json`, dbNotesString, (err) => 
        err
          ? console.error(err)
          : console.log(
              `\n******************************\nNew note: ${JSON.stringify(newNote)} has been written to the notes JSON file\n******************************`
            )
      );
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(`\n******************************\nserver has responded with body: ${JSON.stringify(response)}\n******************************`);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting new note');
    }
  })

app.listen(PORT, () =>
  console.log(`\n******************************\nApp listening at http://localhost:${PORT}\n******************************`)
);
