const addtask = document.getElementById("addbtnid");
const taskInput = document.getElementById("entertaskid");
const taskContainer = document.getElementById("taskContainer");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Escape HTML to prevent injection
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Create task wrapper (card + delete)
function createTaskWrapper(task, index, animate = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "taskwrapper";

  const card = document.createElement("div");
  card.className =
    "taskcard w-80 p-6 rounded-xl bg-zinc-900/70 backdrop-blur-md border border-zinc-700/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-shadow duration-300";

  if (task.completed) card.classList.add("completed");

  card.innerHTML = `
    <h2 class="text-xl font-semibold text-zinc-100 mb-2">${escapeHtml(task.text)}</h2>
    <button class="togglebtn ${task.completed ? "active" : ""}" data-index="${index}"></button>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deletebtn";
  deleteBtn.setAttribute("data-index", index);
  deleteBtn.title = "Delete Task";

  wrapper.appendChild(card);
  wrapper.appendChild(deleteBtn);
  taskContainer.appendChild(wrapper);

  // Animation
  if (animate) {
    requestAnimationFrame(() => card.classList.add("show"));
  } else {
    card.classList.add("show");
  }

  return wrapper;
}

// Render all tasks
function renderTasks() {
  taskContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    createTaskWrapper(task, index, false);
  });
}

// Add new task
addtask.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = { text, completed: false };
  tasks.push(newTask);
  saveTasks();

  createTaskWrapper(newTask, tasks.length - 1, true);
  taskInput.value = "";
});

// Handle toggle and delete using event delegation
taskContainer.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest(".togglebtn");
  const deleteBtn = e.target.closest(".deletebtn");

  // ✅ Toggle completion
  if (toggleBtn) {
    const index = toggleBtn.dataset.index;
    tasks[index].completed = !tasks[index].completed;
    saveTasks();

    toggleBtn.classList.toggle("active");
    toggleBtn.closest(".taskcard").classList.toggle("completed");
  }

  // 🗑️ Delete task (fade-out)
  if (deleteBtn) {
    const index = deleteBtn.dataset.index;
    const wrapper = deleteBtn.closest(".taskwrapper");
    const card = wrapper.querySelector(".taskcard");

    card.classList.add("fade-out");
    wrapper.classList.add("fade-out");

    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }, 300);
  }
});

// Load tasks on page start
renderTasks();
