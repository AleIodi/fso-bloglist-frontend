import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import NewNote from './components/NewNote'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [className, setClassName] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage('login successful')
      setClassName('success')
      setTimeout(() => {
        setErrorMessage(null)
        setClassName('')
      }, 5000)
    } catch (exception) {
      const serverErrorMessage = exception.response && exception.response.data && exception.response.data.error
        ? exception.response.data.error
        : 'Wrong credentials'
      setErrorMessage(serverErrorMessage)
      setClassName('error')
      setTimeout(() => {
        setErrorMessage(null)
        setClassName('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(blog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setClassName('success')
      setTimeout(() => {
        setErrorMessage(null)
        setClassName('')
      }, 5000)
    } catch (exception) {
      const serverErrorMessage = exception.response && exception.response.data && exception.response.data.error
        ? exception.response.data.error
        : 'Failed to create new blog'
      setErrorMessage(serverErrorMessage)
      setClassName('error')
      setTimeout(() => {
        setErrorMessage(null)
        setClassName('')
      }, 5000)
    }
  }

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'Blogs'}</h2>

      <Notification message={errorMessage} className={className} />

      {!user ? (
        <Login
          onSubmit={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          <h2>Create New</h2>
          <NewNote
            onSubmit={handleNewBlog}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App