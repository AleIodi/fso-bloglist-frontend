import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <ul>
      {
        blogs.sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link></li>
          )
      }
    </ul>
  )
}

export default BlogList