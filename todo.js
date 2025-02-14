const input = document.getElementById("inp");
const list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");

let gmail;
const tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", "/getEmail", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      gmail = xhr.responseText;
      document.getElementById("user-email").textContent = `Current User Id : ${gmail}`;

      let xhrTasks = new XMLHttpRequest();
      xhrTasks.open("GET", `/getUserTasks?email=${encodeURIComponent(gmail)}`, true);
      xhrTasks.onload = function () {
        if (xhrTasks.status === 200) {
          const data = JSON.parse(xhrTasks.responseText);
          if (data.tasks) {
            tasks.push(...data.tasks);
            renderTasks();    
          }
        } else {
          console.error("Error fetching tasks:", xhrTasks.statusText);
        }
      };
      xhrTasks.send();
    } else {
      console.error("Error fetching email:", xhr.statusText);
    }
  };
  xhr.send();
});

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("list-item");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.classList.toggle("completed", task.completed);

    const btns = document.createElement("span");
    btns.className = "btns-box";

    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit edit-btn";
    editIcon.addEventListener("click", () => editTask(index));

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash delete-btn";
    deleteIcon.addEventListener("click", () => deleteTask(index));

    const markIcon = document.createElement("i");
    markIcon.className = task.completed
      ? "fas fa-undo mark-btn"
      : "fas fa-check mark-btn";
    markIcon.addEventListener("click", () => toggleComplete(index));

    btns.appendChild(editIcon);
    btns.appendChild(deleteIcon);
    btns.appendChild(markIcon);

    li.appendChild(taskText);
    li.appendChild(btns);

    list.appendChild(li);
  });
}

function addTask() {
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    input.value = "";
    renderTasks();
    saveTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

function editTask(index) {
  const newText = prompt("Edit your Task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    renderTasks();
    saveTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
  saveTasks();
}

function saveTasks() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/saveTasks", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error("Error saving tasks:", xhr.statusText);
    }
  };

  xhr.send(JSON.stringify({
    action: "saveTasks",
    gmail,
    tasks,
  }));
}

addBtn.addEventListener("click", addTask);
