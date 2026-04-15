import { useNavigate } from 'react-router-dom'

const BlogDetails = ({ blog, likeBlog, deleteBlog, user }) => {
  const navigate = useNavigate()

  const handleLike = async () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    likeBlog(blog.id, newBlog)
  }

  return (
    <div className="blog">
      {blog && (
        <div>
          <h2>{blog.title} {blog.author}</h2>

          <p>{blog.url}</p>

          <p>likes {blog.likes}{user && (<button onClick={handleLike}>like</button>)}</p>
          <p>{blog.user?.name}</p>
          {user && user.username === blog.user.username && (
            <p><button onClick={() => {
              deleteBlog(blog.id)
              navigate('/')
            }}>delete</button></p>
          )}
        </div>

      )}
    </div>
  )
}

export default BlogDetails