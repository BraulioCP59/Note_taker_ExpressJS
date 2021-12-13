const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const {writeFile} = require('fs');
const { v4: uuidv4 } = require('uuid');


const PORT = process.env.PORT || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static pages and files
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
    console.log(`\n******************************\n${req.method} request received to add a note!\n******************************`);

    // Destructures request body for new vars containing note details
    const { title, text} = req.body;
  
    // Checks for truish note content from the request
    if (title && text) {
      // Builds new note post body and generates a unique id for the note
      const newNote = {
        title, 
        text,
        id: uuidv4(),
      };
      
      //will push the new note into the db array
      notes.push(newNote);

      // stringifies the updated notes array
      const dbNotesString = JSON.stringify(notes);
  
      // Over writes the db.json file with updated notes array
      writeFile(`./db/db.json`, dbNotesString, (err) => 
        err
          ? console.error(err)
          : console.log(
              `\n******************************\nNew note: ${JSON.stringify(newNote)} has been written to the notes JSON file\n******************************`
            )
      );
      
      // builds a response body
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(`\n******************************\nserver has responded with body: ${JSON.stringify(response)}\n******************************`);
      
      //responds with a status code (created 201) and response body with status and newly generated note
      res.status(201).json(response);
    } else {
      //otherwise sends a 500 and details about failing to post the new note
      res.status(500).json('Error in posting new note');
    }
  })

app.listen(PORT, () =>
  console.log(`\n******************************\nApp listening at http://localhost:${PORT}\n******************************`)
);
