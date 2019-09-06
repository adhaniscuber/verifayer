import React, { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { LOGIN_QUERY } from '../graphQL/auth'
// eslint-disable-next-line import/default
import Loading from '../components/atoms/Loading'
import Notification from '../components/molecules/Notification';

const Login = () => {
  const [initialInput, setInitialInput] = useState({
    email: '',
    password: ''
  })

  const client = useApolloClient()
  const [handleLogin, { loading, error }] = useMutation(LOGIN_QUERY, {
    onCompleted({ login }) {
      localStorage.setItem('token', login)
      client.writeData({ data: { isLoggedIn: true } })
    }
  })

  function handleChange(event) {
    const { value } = event.target
    setInitialInput({
      ...initialInput,
      [event.target.name]: value
    })
  }

  if (loading) return <Loading />

  return (
    <div>
      <Notification message={error} />
      <form
        onSubmit={e => {
          e.preventDefault()
          handleLogin({ variables: { input: initialInput } })
        }}>
        <input name='email' type='text' value={initialInput.email} onChange={handleChange} />
        <input name='password' type='password' value={initialInput.password} onChange={handleChange} />
        <button type='submit'>test</button>
        <Loading />
      </form>
    </div>
  )
}
export default Login
