//script.js

const apiUrl = 'http://localhost:8000/workexperiences';

// Function to fetch and display all work experiences
async function fetchWorkExperiences() {
  try {
    const response = await fetch(apiUrl);
    const workExperiences = await response.json();

    const workExperienceList = document.getElementById('work-experience-list');
    workExperienceList.innerHTML = '';

    workExperiences.forEach(experience => {
      const listItem = document.createElement('li');
      listItem.textContent = `${experience.companyname} - ${experience.jobtitle} (${experience.location})`;
      workExperienceList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching work experiences:', error);
  }
}

// Function to handle form submission for adding a new work experience
async function addWorkExperience(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const companyname = formData.get('companyname');
  const jobtitle = formData.get('jobtitle');

  if (!companyname || !jobtitle) {
    alert('Companyname and Jobtitle are required fields.');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
      alert('Work experience added successfully');
      form.reset();
      fetchWorkExperiences(); 
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    console.error('Error adding work experience:', error);
  }
}

// Function to delete a work experience
async function deleteWorkExperience(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Are you sure');
      fetchWorkExperiences(); // Refresh the list of work experiences
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    console.error('Error deleting work experience:', error);
  }
}

// Function to fetch and display all work experiences
async function fetchWorkExperiences() {
  try {
    const response = await fetch(apiUrl);
    const workExperiences = await response.json();

    const workExperienceList = document.getElementById('work-experience-list');
    workExperienceList.innerHTML = '';

    workExperiences.forEach(experience => {
      const listItem = document.createElement('li');
      
      // Create a container for the work experience details
      const detailsContainer = document.createElement('div');
      
      // Display work experience details
      detailsContainer.textContent = `${experience.companyname} - ${experience.jobtitle} (${experience.location})`;
      
      // Create a delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteWorkExperience(experience.id));
      
  
      detailsContainer.appendChild(deleteButton);
      
      listItem.appendChild(detailsContainer);
      
      workExperienceList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching work experiences:', error);
  }
}
// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchWorkExperiences(); // Fetch work experiences when the page loads
});

const addWorkForm = document.getElementById('add-work-form');
if (addWorkForm) {
  addWorkForm.addEventListener('submit', addWorkExperience);
}
