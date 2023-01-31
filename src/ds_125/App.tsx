import React, { useEffect } from 'react'
import TodoList from "./src/Todo/TodoList";
import Context from "./src/context";
// import AddTodo from "./Todo/AddTodo";
import Loader from "./src/Loader";
import Modal from "./src/Modal/Modal"
import './src/index.css';
import AddTodo from './src/Todo/AddTodo'


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
    const clickHandler = () => {
      const HEADERS_FOR_FETCH = {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9,ru;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
        'x-requested-with': 'XMLHttpRequest'
      }
      const body = {
        lookupId: 1,
        user_ip: '',
        product: '',
        user_ident: 'adm;bi',
        orderBy: '',
        orderDirection: 'asc',
        from: '9999-01-01',
        to: '9999-01-01'
      }

      const b2 = {
        from: "9999-01-01",
        lookupId: 1,
        orderBy: "login",
        orderDirection: "asc",
        product: "",
        to: "9999-01-01",
        user_ident: "",
        user_ip: ""
      }

      // eslint-disable-next-line no-undef
      try {
        fetch(`../../../api/lookup/ds_125/1`, {
          credentials: 'include',
          headers: HEADERS_FOR_FETCH,
          body: JSON.stringify(b2),
          method: 'POST',
          mode: 'cors'
        })
        .then(response => response.json())
        .then(response => {
          console.log(response)
        })
      } catch (error) {
        console.error('error', error)
      }
    }

    return (
        <Context.Provider value={{ removeTodo }}>
            <div className="wrapper">
              <button
                onClick={() => {clickHandler()}}
              >Нажми меня</button>
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
