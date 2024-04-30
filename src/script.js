const apiUrl = 'http://localhost:2000/workexperiences';

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
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    console.error('Error adding work experience:', error);
  }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', fetchWorkExperiences);

const addWorkForm = document.getElementById('add-work-form');
if (addWorkForm) {
  addWorkForm.addEventListener('submit', addWorkExperience);
}
