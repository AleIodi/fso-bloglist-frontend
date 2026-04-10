import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import NewNote from './components/NewNote'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [className, setClassName] = useState('')
  const blogFormRef = useRef()

  const notify = (message, type = 'success') => {
    setErrorMessage(message)
    setClassName(type)
    setTimeout(() => {
      setErrorMessage(null)
      setClassName('')
    }, 5000)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (exception) {
        notify('Failed to fetch blogs', 'error')
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userToLogin) => {
    try {
      const user = await loginService.login(userToLogin)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      setUser(user)

      notify('login successful')
    } catch (exception) {
      const serverErrorMessage = exception.response && exception.response.data && exception.response.data.error
        ? exception.response.data.error
        : 'Wrong credentials'

      notify(serverErrorMessage, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleNewBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))

      notify(`a new blog ${blog.title} by ${blog.author} added`)

      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      const serverErrorMessage = exception.response && exception.response.data && exception.response.data.error
        ? exception.response.data.error
        : 'Failed to create new blog'

      notify(serverErrorMessage, 'error')
    }
  }

  const handleLike = async (id, blogToLike) => {
    try {
      const response = await blogService.update(id, blogToLike)
      setBlogs(blogs.map(b => b.id === id ? response : b))
    } catch (exception) {
      const serverErrorMessage = exception.response && exception.response.data && exception.response.data.error
        ? exception.response.data.error
        : 'Failed to like the blog'

      notify(serverErrorMessage, 'error')
    }
  }

  const handleDelete = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(id)
        
        setBlogs(blogs.filter(b => b.id !== id))

        notify('Blog deleted')
      } catch (exception) {
        const serverErrorMessage = exception.response && exception.response.data && exception.response.data.error
          ? exception.response.data.error
          : 'Failed to delete the blog'

        notify(serverErrorMessage, 'error')
      }
    }
  }

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'Blogs'}</h2>

      <Notification message={errorMessage} className={className} />

      {!user ? (
        <Login
          onSubmit={handleLogin}
        />
      ) : (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          <Toggable ref={blogFormRef}>
            <NewNote
              onSubmit={handleNewBlog}
            />
          </Toggable>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} likeBlog={handleLike} deleteBlog={handleDelete} user={user} />
            )}
        </div>
      )}
    </div>
  )
}

export default App