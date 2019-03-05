const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

function renderCaffee(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');
  let edit = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().location;
  cross.textContent = 'x';
  edit.textContent = 'edit';
  edit.className = 'edit';

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  li.appendChild(edit);
  cafeList.appendChild(li);

  //Delete Caffe
  cross.addEventListener('click', e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('caffee')
      .doc(id)
      .delete();
  });
}

// //Getting Data
// db.collection('caffee')
//   .orderBy('name')
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCaffee(doc);
//     });
//   });

//Saving Data
form.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('caffee').add({
    name: form.name.value,
    location: form.location.value
  });
  form.name.value = '';
  form.location.value = '';
});

//Getting Real Time Data
db.collection('caffee')
  .orderBy('location')
  .onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      if (change.type == 'added') {
        renderCaffee(change.doc);
      } else if (change.type == 'removed') {
        let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
        cafeList.removeChild(li);
      }
    });
  });
