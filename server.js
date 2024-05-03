// Import necessary modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

// Create an Express application
const app = express();
const PORT = process.env.PORT || 8000;

// Use JSON middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// SQLite database connection
const dbPath = 'cv.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
        return;
    }
    console.log('Connected to SQLite database');
});

// Routes
// GET all work experiences
app.get('/workexperiences', (req, res) => {
  db.all('SELECT * FROM workexperience', (error, rows) => {
    if (error) {
      console.error('Error retrieving work experiences: ' + error);
      res.status(500).json({ error: 'An error occurred while retrieving work experiences' });
    } else {
      res.json(rows);
    }
  });
});

// POST a new work experience

app.post('/workexperiences', (req, res) => {
  const newWorkExperience = req.body;

  
  if (!newWorkExperience.companyname || !newWorkExperience.jobtitle) {
      return res.status(400).json({ error: 'companyname and jobtitle fields are required' });
  }

  const { companyname, jobtitle, location, startdate, enddate, description } = newWorkExperience;
  const query = `
      INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description) 
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [companyname, jobtitle, location, startdate, enddate, description];

  db.run(query, values, (error) => {
      if (error) {
          console.error('Error adding new work experience:', error);
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

  // Construct the SQL query string
  const query = `
      UPDATE workexperience 
      SET companyname = ?, jobtitle = ?, location = ?, startdate = ?, enddate = ?, description = ? 
      WHERE id = ?
  `;
  const values = [
    updatedWorkExperience.companyname,
    updatedWorkExperience.jobtitle,
    updatedWorkExperience.location,
    updatedWorkExperience.startdate,
    updatedWorkExperience.enddate,
    updatedWorkExperience.description,
    id
  ];

  // Execute the query
  db.run(query, values, (error) => {
      if (error) {
          console.error('Error updating work experience:', error);
          res.status(500).json({ error: 'An error occurred while updating work experience' });
      } else {
          res.json({ message: 'Work experience updated successfully' });
      }
  });
});

// DELETE a work experience
app.delete('/workexperiences/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM workexperience WHERE id = ?', id, (error) => {
      if (error) {
          console.error('Error deleting work experience:', error);
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
