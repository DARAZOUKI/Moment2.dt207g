// Import necessary modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 9000;

// Use JSON middleware
app.use(express.json());
app.use(express.static('src'));

// Enable CORS
app.use(cors());

// PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Routes

// GET all work experiences
app.get('/workexperiences', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workexperience');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving work experiences:', error);
    res.status(500).json({ error: 'An error occurred while retrieving work experiences' });
  }
});

// POST a new work experience
app.post('/workexperiences', async (req, res) => {
  const newWorkExperience = req.body;

  if (!newWorkExperience.companyname || !newWorkExperience.jobtitle) {
    return res.status(400).json({ error: 'companyname and jobtitle fields are required' });
  }

  const { companyname, jobtitle, location, startdate, enddate, description } = newWorkExperience;
  const query = `
    INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
  `;
  const values = [companyname, jobtitle, location, startdate, enddate, description];

  try {
    const result = await pool.query(query, values);
    const newId = result.rows[0].id;
    res.status(201).json({ message: 'Work experience added successfully', id: newId });
  } catch (error) {
    console.error('Error adding new work experience:', error);
    res.status(500).json({ error: 'An error occurred while adding new work experience' });
  }
});
// PUT (update) a work experience
app.put('/workexperiences/:id', async (req, res) => {
  const id = req.params.id;
  const updatedWorkExperience = req.body;

  const query = `
    UPDATE workexperience 
    SET companyname = $1, jobtitle = $2, location = $3, startdate = $4, enddate = $5, description = $6 
    WHERE id = $7
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

  try {
    await pool.query(query, values);
    res.json({ message: 'Work experience updated successfully' });
  } catch (error) {
    console.error('Error updating work experience:', error);
    res.status(500).json({ error: 'An error occurred while updating work experience' });
  }
});

// DELETE a work experience
app.delete('/workexperiences/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert the id to an integer

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const query = 'DELETE FROM workexperience WHERE id = $1';
  const values = [id];

  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Work experience not found' });
    } else {
      res.json({ message: 'Work experience deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(500).json({ error: 'An error occurred while deleting work experience' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
