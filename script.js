document.getElementById('contactForm').addEventListener('submit', contactForm);

let editIndex = -1;
let students = [];

async function contactForm(event) {
    event.preventDefault();
    const userDetails = {
        name: event.target.name.value,
        mobile: event.target.mobile.value,
        address: event.target.address.value,
    };

    if (editIndex >= 0) {
        await updateStudent(editIndex, userDetails);
        editIndex = -1;
    } else {
        await addStudent(userDetails);
    }

    event.target.reset();
    await fetchStudents();
}

async function fetchStudents() {
    const response = await fetch('https://crudcrud.com/api/98afffce22714e018cf1e15efee2571d/students');
    students = await response.json();
    displayUsersOnScreen();
    updateStudentCount();
}

async function addStudent(user) {
    await fetch('https://crudcrud.com/api/98afffce22714e018cf1e15efee2571d/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

async function updateStudent(index, user) {
    const id = students[index]._id;
    await fetch(`https://crudcrud.com/api/98afffce22714e018cf1e15efee2571d/students/${id}`, {
        method: 'DELETE'
    });
    await fetch('https://crudcrud.com/api/98afffce22714e018cf1e15efee2571d/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

async function deleteStudent(index) {
    const id = students[index]._id;
    await fetch(`https://crudcrud.com/api/98afffce22714e018cf1e15efee2571d/students/${id}`, {
        method: 'DELETE'
    });
    await fetchStudents();
}

function displayUsersOnScreen() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Clear the list first

    students.forEach((user, index) => {
        const studentItem = document.createElement('li');
        studentItem.textContent = `${user.name} ${user.mobile} ${user.address} `;

        const deleteBtn = document.createElement("button");
        deleteBtn.appendChild(document.createTextNode("Delete"));
        studentItem.appendChild(deleteBtn);

        const editBtn = document.createElement("button");
        editBtn.appendChild(document.createTextNode("Edit"));
        studentItem.appendChild(editBtn);

        studentList.appendChild(studentItem);

        deleteBtn.addEventListener("click", async function() {
            await deleteStudent(index);
        });

        editBtn.addEventListener("click", function() {
            editUser(index);
        });
    });
    updateStudentCount();
}

function editUser(index) {
    const user = students[index];
    document.getElementById('name').value = user.name;
    document.getElementById('mobile').value = user.mobile;
    document.getElementById('address').value = user.address;
    editIndex = index;
}

function updateStudentCount() {
    const studentCount = document.getElementById('studentCount');
    studentCount.textContent = `Total Students: ${students.length}`;
}

// Initial fetch
fetchStudents();


