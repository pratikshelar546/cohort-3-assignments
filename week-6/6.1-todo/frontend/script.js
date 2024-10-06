const API_URL = 'http://localhost:3000/todos';


// Fetch existing todos when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    fetchTodos();


});

// Fetch todos from backend
async function fetchTodos() {
    const todo = await fetch(API_URL)


    console.log(todo);
}

// Add a new todo to the DOM
function addTodoToDOM(todo) {
    //  write here
}

// Add a new todo
document.getElementById('add-todo-btn').addEventListener('click', () => {


});

// Toggle todo completion
function toggleTodo(id, completed) {
    //    write here
}

// Delete a todo
function deleteTodo(id) {
    // write here  
}
