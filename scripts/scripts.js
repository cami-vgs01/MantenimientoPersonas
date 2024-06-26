document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('person-form');
    const cancelButton = document.getElementById('cancel-button');
    const submitButton = document.getElementById('submit-button');
    const personListLocal = document.getElementById('person-list-local');
    const personListSession = document.getElementById('person-list-session');
    let editIndex = null;
    let isEditing = false;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('id').value;
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const person = { id, name, age };

        if (isEditing) {
            updatePersonInLocalStorage(editIndex, person);
            updatePersonInSessionStorage(editIndex, person);
            loadPersonsFromLocalStorage();
            loadPersonsFromSessionStorage();
            isEditing = false;
            document.getElementById('id').disabled = false;
            cancelButton.style.display = 'none';
            submitButton.textContent = 'Agregar Persona';
        } else {
            if (!isIDUnique(id)) {
                alert("El ID debe ser único. Por favor, ingrese un ID diferente.");
                return;
            }
            savePersonToLocal(person);
            savePersonToSession(person);
            loadPersonsFromLocalStorage();
            loadPersonsFromSessionStorage();
        }

        form.reset();
    });

    cancelButton.addEventListener('click', () => {
        form.reset();
        document.getElementById('id').disabled = false;
        cancelButton.style.display = 'none';
        submitButton.textContent = 'Agregar Persona';
        isEditing = false;
    });

    function isIDUnique(id) {
        const personsLocal = JSON.parse(localStorage.getItem('persons')) || [];
        const personsSession = JSON.parse(sessionStorage.getItem('persons')) || [];
        return !personsLocal.some(person => person.id === id) && !personsSession.some(person => person.id === id);
    }

    function savePersonToLocal(person) {
        let persons = JSON.parse(localStorage.getItem('persons')) || [];
        persons.push(person);
        localStorage.setItem('persons', JSON.stringify(persons));
    }

    function savePersonToSession(person) {
        let persons = JSON.parse(sessionStorage.getItem('persons')) || [];
        persons.push(person);
        sessionStorage.setItem('persons', JSON.stringify(persons));
    }

    function updatePersonInLocalStorage(index, person) {
        let persons = JSON.parse(localStorage.getItem('persons')) || [];
        persons[index] = person;
        localStorage.setItem('persons', JSON.stringify(persons));
    }

    function updatePersonInSessionStorage(index, person) {
        let persons = JSON.parse(sessionStorage.getItem('persons')) || [];
        persons[index] = person;
        sessionStorage.setItem('persons', JSON.stringify(persons));
    }

    function deletePersonFromLocalStorage(index) {
        let persons = JSON.parse(localStorage.getItem('persons')) || [];
        persons.splice(index, 1);
        localStorage.setItem('persons', JSON.stringify(persons));
    }

    function deletePersonFromSessionStorage(index) {
        let persons = JSON.parse(sessionStorage.getItem('persons')) || [];
        persons.splice(index, 1);
        sessionStorage.setItem('persons', JSON.stringify(persons));
    }

    function addPersonToDOM(person, list, index) {
        let table = list.querySelector('table');
        if (!table) {
            table = document.createElement('table');
            table.innerHTML = `<thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>`;
            list.appendChild(table);
        }
        let tbody = table.querySelector('tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person.id}</td>
            <td>${person.name}</td>
            <td>${person.age}</td>
            <td>
                <button class="edit" data-index="${index}">Editar</button>
                <button class="delete" data-index="${index}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);

        row.querySelector('.edit').addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            editPersonFromLocalStorage(idx);
            editPersonFromSessionStorage(idx);
            isEditing = true;
            editIndex = idx;
            document.getElementById('id').disabled = true;
            cancelButton.style.display = 'inline-block';
            submitButton.textContent = 'Actualizar Persona';
        });

        row.querySelector('.delete').addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            deletePersonFromLocalStorage(idx);
            deletePersonFromSessionStorage(idx);
            loadPersonsFromLocalStorage();
            loadPersonsFromSessionStorage();
        });
    }

    function editPersonFromLocalStorage(index) {
        let persons = JSON.parse(localStorage.getItem('persons')) || [];
        const person = persons[index];
        document.getElementById('id').value = person.id;
        document.getElementById('name').value = person.name;
        document.getElementById('age').value = person.age;
    }

    function editPersonFromSessionStorage(index) {
        let persons = JSON.parse(sessionStorage.getItem('persons')) || [];
        const person = persons[index];
        document.getElementById('id').value = person.id;
        document.getElementById('name').value = person.name;
        document.getElementById('age').value = person.age;
    }

    function loadPersonsFromLocalStorage() {
        personListLocal.innerHTML = '';
        let persons = JSON.parse(localStorage.getItem('persons')) || [];
        persons.forEach((person, index) => addPersonToDOM(person, personListLocal, index));
    }

    function loadPersonsFromSessionStorage() {
        personListSession.innerHTML = '';
        let persons = JSON.parse(sessionStorage.getItem('persons')) || [];
        persons.forEach((person, index) => addPersonToDOM(person, personListSession, index));
    }

    loadPersonsFromLocalStorage();
    loadPersonsFromSessionStorage();
});
