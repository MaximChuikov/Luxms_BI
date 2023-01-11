import React, { useEffect } from 'react'
import TodoList from "./src/Todo/TodoList";
import Context from "./src/context";
// import AddTodo from "./Todo/AddTodo";
import Loader from "./src/Loader";
import Modal from "./src/Modal/Modal"
import './src/index.css';
import AddTodo from './src/Todo/AddTodo'

// const AddTodo = React.lazy(() => new Promise(resolve => {
//     setTimeout(() => {
//         resolve(import('./src/Todo/AddTodo'))
//     }, 2000)
// }))

function App() {
    const [todos, setTodos] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
            .then(response => response.json())
            .then(todos => {
                setTimeout(() => {
                    setTodos(todos)
                    setLoading(false)
                }, 2000)

            })
    }, [])

    function toggleTodo (id) {
        setTodos(
            todos.map(todo => {
            if (todo.id === id) {
                todo.completed = !todo.completed
            }
            return todo
            })
        )
    }

    function removeTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id))
    }
    function addTodo(title) {
        setTodos(
            todos.concat([
                {
                    title: title,
                    id: Date.now(),
                    completed: false
                }
            ])
        )
    }

    return (
        <Context.Provider value={{ removeTodo }}>
            <div className="wrapper">
                <h1>React Tutorial</h1>
                <React.Suspense fallback={<p>Loading...</p>}>
                    <Modal/>
                    <AddTodo onCreate={addTodo} />
                </React.Suspense>

                {loading && <Loader />}
                {todos.length ? (
                    <TodoList todos={todos} onToggle={toggleTodo} />
                ): (
                    loading ? null : <p>No todos!</p>
                )}

            </div>
        </Context.Provider>
    );
}

export default App;
