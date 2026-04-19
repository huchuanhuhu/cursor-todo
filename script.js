const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const todoCount = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const getVisibleTodos = () => {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
};

const updateStats = () => {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `${activeCount} 项任务待完成`;
};

const renderTodos = () => {
  const visibleTodos = getVisibleTodos();
  todoList.innerHTML = '';
  emptyState.style.display = visibleTodos.length ? 'none' : 'block';

  visibleTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="todo-content">
        <input class="todo-toggle" type="checkbox" ${todo.completed ? 'checked' : ''} aria-label="标记待办完成">
        <span class="todo-text"></span>
      </div>
      <button class="delete-btn" type="button">删除</button>
    `;

    li.querySelector('.todo-text').textContent = todo.text;

    li.querySelector('.todo-toggle').addEventListener('change', () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    todoList.appendChild(li);
  });

  updateStats();
};

const setActiveFilter = (filter) => {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderTodos();
};

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  todoInput.value = '';
  saveTodos();
  renderTodos();
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveFilter(button.dataset.filter));
});

renderTodos();
