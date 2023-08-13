import styles from './Register.module.css'

import {useState, useEffect} from 'react'

import { useAuthentication } from '../../hooks/useAuthentication'

const Register = () => {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  
  const { createUser, error: errorAuth, loading } = useAuthentication()
  const handleSubmit = async (event) => {
    event.preventDefault() //Pra não enviar o formulário
  
    setError("") 
    const user = {
      displayName,
      email,
      password
     }

     if(password != confirmPassword){
      setError("As senhas precisam ser iguais!")
      return
     }

     const res = await createUser(user)

     console.log(res)
  }

  useEffect(() => {
    setError(errorAuth)
  }, [errorAuth]) //Sempre que o auth error mudar, o useEffect detecta e dá o setError
  
  return (
    <div className={styles.register}>
        <h1>Cadastre-se para postar</h1>
        <p>Crie sua conta e compartilhe suas histórias</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nome:</span>
            <input type="text" name="displayName" required placeholder='Digite seu nome... ' value={displayName} onChange={(event) => setDisplayName(event.target.value)}/>
          </label>
          <label>
            <span>E-mail:</span>
            <input type="email" name="displayEmail" required placeholder='Digite seu email... ' value={email} onChange={(event) => setEmail(event.target.value)}/>
          </label>
          <label>
            <span>Senha:</span>
            <input type="password" name="password" required placeholder='Digite sua senha... ' value={password} onChange={(event) => setPassword(event.target.value)}/>
          </label>
          <label>
            <span>Confirmação de Senha:</span>
            <input type="password" name="confirmPassword" required placeholder='Digite sua senha novamente... ' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
          </label>
          {/* Abaixo colocamos o className sem o {style.btn} porque estamos puxando essa classe do index.css => é uma config global */}
          {!loading && <button className="btn">Cadastrar</button>}
          {loading && <button disabled className="btn">Aguarde...</button>}
          {error && <p className='error'>{error}</p>}
        </form>
    </div>
  )
}

export default Register