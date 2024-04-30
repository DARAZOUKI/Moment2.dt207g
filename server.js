// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 9000;

// Use JSON middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Create MySQL connection
const connection = mysql.createConnection({
    host: '34.66.246.105',
    user: 'root',
    password: 'dania',
    database: 'cv'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Routes
// GET all work experiences
app.get('/workexperiences', (req, res) => {
  connection.query('SELECT * FROM workexperience', (error, results) => {
    if (error) {
      console.error('Error retrieving work experiences: ' + error);
      res.status(500).json({ error: 'An error occurred while retrieving work experiences' });
    } else {
      res.json(results);
    }
  });
});

// POST a new work experience

app.post('/workexperiences', (req, res) => {
  const newWorkExperience = req.body;

  // Check if companyname field is provided and not null
  if (!newWorkExperience.companyname) {
    return res.status(400).json({ error: 'companyname field is required' });
  }

  const { companyname, jobtitle, location, startdate, enddate, description } = newWorkExperience;
  const query = `INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [companyname, jobtitle, location, startdate, enddate, description];
  
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error adding new work experience: ' + error);
      res.status(500).json({ error: 'An error occurred while adding new work experience' });
    } else {
      res.status(201).json({ message: 'Work experience added successfully' });
    }
  });
});


// PUT (update) a work experience
app.put('/workexperiences/:id', (req, res) => {
  const id = req.params.id;
  const updatedWorkExperience = req.body;
  connection.query('UPDATE workexperience SET ? WHERE id = ?', [updatedWorkExperience, id], (error, results) => {
    if (error) {
      console.error('Error updating work experience: ' + error);
      res.status(500).json({ error: 'An error occurred while updating work experience' });
    } else {
      res.json({ message: 'Work experience updated successfully' });
    }
  });
});

// DELETE a work experience
app.delete('/workexperiences/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM workexperience WHERE id = ?', id, (error, results) => {
    if (error) {
      console.error('Error deleting work experience: ' + error);
      res.status(500).json({ error: 'An error occurred while deleting work experience' });
    } else {
      res.json({ message: 'Work experience deleted successfully' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
