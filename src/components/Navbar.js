import styles from './Navbar.module.css'

import { NavLink } from 'react-router-dom'

//Pegando usuario logado
import { useAuthentication } from '../hooks/useAuthentication'
import { useAuthValue } from '../context/AuthContext'

const Navbar = () => {

    const { user } = useAuthValue()

    const { logout } = useAuthentication()

  return (
    <nav className={styles.navbar}>
        <NavLink className={styles.brand} to="/">Mini <span>Blog</span></NavLink> {/* Como se fosse a Logo */}
        <ul className={styles.links_list}>
            <li>
                <NavLink to="/" className={({isActive}) => (isActive ? styles.active : "")}>Home</NavLink>
            </li>
            {!user && 
                <>
                    <li>
                        <NavLink to="/login" className={({isActive}) => (isActive ? styles.active : "")}>Entrar</NavLink>
                    </li>
                    <li>
                        <NavLink to="/register" className={({isActive}) => (isActive ? styles.active : "")}>Cadastre-se</NavLink>
                    </li>
                </>
            }
            {user && 
                <>
                    <li>
                        <NavLink to="/posts/create" className={({isActive}) => (isActive ? styles.active : "")}>Criar Post</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({isActive}) => (isActive ? styles.active : "")}>Dashboard</NavLink>
                    </li>
                </>
            }
            <li>
                <NavLink to="/about" className={({isActive}) => (isActive ? styles.active : "")}>Sobre</NavLink>
            </li>
            {user && (
                <li>
                    <button onClick={logout}>Sair</button>
                </li>
            )}
        </ul>
    </nav>
  )
}

export default Navbar