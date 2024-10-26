// DOM Elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const categoryInput = document.getElementById('category');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event Listeners
addTaskButton.addEventListener('click', addTask);
filterButtons.forEach(button => {
  button.addEventListener('click', () => filterTasks(button.dataset.filter));
});
taskList.addEventListener('click', handleTaskClick);

// Functions
function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  const category = categoryInput.value.trim();

  if (taskText === "") return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    dueDate,
    priority,
    category
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  
  taskInput.value = '';
  dueDateInput.value = '';
  categoryInput.value = '';
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  
  let filteredTasks = tasks;
  if (filter === "completed") filteredTasks = tasks.filter(task => task.completed);
  if (filter === "pending") filteredTasks = tasks.filter(task => !task.completed);
  
  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? "completed" : ""} ${task.priority}`;
    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
      <span class="task-details">
        <strong>${task.text}</strong> - Due: ${task.dueDate || 'None'} - Category: ${task.category || 'None'}
      </span>
      <div class="task-buttons">
        <button class="complete">${task.completed ? "Undo" : "Complete"}</button>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

function handleTaskClick(event) {
  const taskId = event.target.closest('.task-item').dataset.id;

  if (event.target.classList.contains('complete')) {
    toggleComplete(taskId);
  } else if (event.target.classList.contains('edit')) {
    editTask(taskId);
  } else if (event.target.classList.contains('delete')) {
    deleteTask(taskId);
  }
}

function toggleComplete(id) {
  const task = tasks.find(task => task.id == id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id == id);
  const newTaskText = prompt("Edit task:", task.text);
  if (newTaskText) {
    task.text = newTaskText;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id != id);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  renderTasks(filter);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial render
renderTasks();
