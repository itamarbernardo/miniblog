import styles from './Login.module.css'

import {useState, useEffect} from 'react'

import { useAuthentication } from '../../hooks/useAuthentication'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const { login, error: errorAuth, loading } = useAuthentication()
  const handleSubmit = async (event) => {
    event.preventDefault() //Pra não enviar o formulário
  
    setError("") 
    const user = {
      email,
      password
     }

     const res = await login(user)

     console.log(res)
  }

  useEffect(() => {
    setError(errorAuth)
  }, [errorAuth]) //Sempre que o auth error mudar, o useEffect detecta e dá o setError
  
  return (
    <div className={styles.login}>
        <h1>Entrar</h1>
        <p>Faça login e compartilhe suas histórias</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>E-mail:</span>
            <input type="email" name="displayEmail" required placeholder='Digite seu email... ' value={email} onChange={(event) => setEmail(event.target.value)}/>
          </label>
          <label>
            <span>Senha:</span>
            <input type="password" name="password" required placeholder='Digite sua senha... ' value={password} onChange={(event) => setPassword(event.target.value)}/>
          </label>
          {/* Abaixo colocamos o className sem o {style.btn} porque estamos puxando essa classe do index.css => é uma config global */}
          {!loading && <button className="btn">Entrar</button>}
          {loading && <button disabled className="btn">Aguarde...</button>}
          {error && <p className='error'>{error}</p>}
        </form>
    </div>
  )
}

export default Login