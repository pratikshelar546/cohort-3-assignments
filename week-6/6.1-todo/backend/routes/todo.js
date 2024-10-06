let todos = []; // in memory space

export async function getAllTodo(req, res, next) {
    res.status(200).json({ todos })
}

export async function createTodo(req, res, next) {
    try {
        const { title, done, deadline } = req.body;
        const randomId = Math.floor(Math.random() * (99 - 1 + 1)) + 1;

        todos.push({
            id: randomId,
            title,
            done,
            deadline
        })

        res.status(200).json({ message: "Todo added" })
    } catch (error) {
        res.status(400).json({ message: "Something went wrong" })
    }
}

export async function updateTodo(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    const todo = todos.find(todo => todo.id == id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    Object.assign(todo, data);


    res.status(200).json({ message: "todo Updated" });


}

export async function deleteTodo(req, res, next) {
    todos = [];

    res.status(200).json({ message: "All todo deleted" })
}

export async function deleteTodoById(req, res, next) {
    const { id } = req.params;
    const todo = todos.find(todo => todo.id == id)
    if (!todo) return res.json({ message: "todo not found" });


    const newTodo = todos.filter(todo => todo.id != id)
    todos = newTodo
    res.json({ message: "todo deleted" })

}