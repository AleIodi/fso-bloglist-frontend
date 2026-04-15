import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsLoading(true)
    onSubmit({ username, password })
    setIsLoading(false)
    setUsername('')
    setPassword('')
    navigate('/')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
						username
            <input
              type="text"
              disabled={isLoading}
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              name="Username"
            />
          </label>
        </div>
        <div>
          <label>
						password
            <input
              type="password"
              disabled={isLoading}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              name="Password"
            />
          </label>
        </div>
        <button disabled={isLoading || !username || !password} type="submit">login</button>
      </form>
    </div>
  )
}

export default Login