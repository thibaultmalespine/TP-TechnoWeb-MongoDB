function sendData() {
  const inputID = document.getElementById('id');
  const inputFisrtName = document.getElementById('firstname');
  const inputLastName = document.getElementById('lastname');
  const outputDiv = document.getElementById('output');
 
  const id = inputID.value;
  const firstname = inputFisrtName.value;
  const lastname = inputLastName.value;
 
  // Utilisez fetch pour envoyer des données au serveur
  fetch('/addData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      id : id, 
      firstname : firstname, 
      lastname : lastname 
    }),
  })
  .then(response => response.json())
  .then(result => {
    outputDiv.innerText = `Server Response: ${result.message}`;
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
  getList()
}

async function getList() {
  
  const list = document.querySelector('#list');
  list.innerHTML = "";

  const request = await fetch('/list');
  const data = await request.json();
  data.list.forEach(etudiant => {
    const div = document.createElement("div");
    div.classList.add("card");
  
    const id = document.createElement("p");
    id.innerText = "id : "+etudiant.id;
    
    const prenom = document.createElement("input");
    prenom.value = etudiant.firstname;
    
    const nom = document.createElement("input");
    nom.value = etudiant.lastname;
  
    const button = document.createElement("button");
    button.innerText = "modifier";
    button.onclick = () => changeValues(id.innerHTML, prenom.value, nom.value);
    
    div.appendChild(id)
    div.appendChild(prenom)
    div.appendChild(nom)
    div.appendChild(button)
  
    list.appendChild(div)
  });
}

getList();


function changeValues(id, prenom, nom) {

  const outputDiv = document.getElementById('output');

  fetch(`/edit/${id.split(':')[1].trim()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      firstname : prenom, 
      lastname : nom 
    }),
  })
  .then(response => response.json())
  .then(result => {
    outputDiv.innerText = `Server Response: ${result.message}`;
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
}