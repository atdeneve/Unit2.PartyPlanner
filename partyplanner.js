// A user enters the website and finds a list of the names, dates,
// times, locations, and descriptions of all the parties that are 
//happening. Next to each party in the list is a delete button. 
//The user clicks the delete button for one of the parties. 
//That party is then removed from the list.
// There is also a form that allows the user to enter information 
//about a new party that they want to schedule. After filling out 
//the form and submitting it, the user observes their party added 
//to the list of parties.

// partyplanner.js
const url = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-fsa-et-web-pt-sf-b-alex/events';
const tableElement = document.querySelector('#data-table')

async function getAPI(url) {
  const response = await fetch(url);
  // if(!response.ok) {
  //   throw new Error(response.status); //404
  // }
  const data = await response.json();
  console.log(data);
  return data; 
}

getAPI(url);

async function dataAsTable(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  let placeholder = document.querySelector('#data-output');
  let out = ''
  
  for (let party of data.data) {
    out += `
      <tr data-party-id="${party.id}">
        <td>${party.name}</td>
        <td>${party.date}</td>
        <td>${party.location}</td>
        <td>${party.description}</td>
        <td><button class='delete'>Delete</button></td>
      </tr>
    `;
  }
  placeholder.innerHTML = out;
}

dataAsTable(url);

const formElement = document.querySelector('#form')

async function postPartyData(formData) {
  try {
    const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.get('name'),
            date: new Date(formData.get('date')).toISOString(),
            description: formData.get('description'),
            location: formData.get('location'),
        }),
      });
      if (!response.ok) {
        throw new Error('HTTP error! Status: ${response.status}');
      }
      const responseData = await response.json()
      console.log(responseData);
      await dataAsTable(url);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

async function deletePartyById(partyId) {
  try {
    const deleteData = `${url}/${partyId}`
    const response = await fetch(deleteData, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const responseData = await response.json();
  if (!response.ok) {
    const responseData = await response.text();
    console.error('HTTP error! Status:', response.status, 'Response', responseData);
    return;
  }
  console.log('Party deleted successfully');
  await dataAsTable(url);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

formElement.addEventListener('submit', async event => {
  event.preventDefault(); //prevents the page from doing that automatic refresh 
  //when it tries to submit the information
  const formData = new FormData(formElement);
  await postPartyData(formData);
});

// tableElement.addEventListener('click', async event => {
//   if (!event.target.classList.contains('delete')) {
//     const row = event.target.closest('tr');
//     const partyId = row.dataset.partyId;
//     if(partyId) {
//       await deletePartyById(partyId);
//     }
//   }
//   // const btn = event.target;
//   // btn.closest('tr').remove();
// });

tableElement.addEventListener('click', async event => {
  if (event.target.classList.contains('delete')) {
    const row = event.target.closest('tr');
    const partyId = row.dataset.partyId;
    if (partyId) {
      await deletePartyById(partyId);
    }
  }
});
