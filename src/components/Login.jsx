const Login = ({ onSubmit, username, setUsername, password, setPassword }) => {
	return (
		<div>
			<form onSubmit={onSubmit}>
				<div>
					<label>
						username
						<input
							type="text"
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
							value={password}
							onChange={({ target }) => setPassword(target.value)}
							name="Password"
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default Login