import {getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth'

import { useState, useEffect } from 'react'

import { db } from '../firebase/config'

export const useAuthentication = () => {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    //Cleanup - lidar com vazamento de memória
    //Deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    const auth = getAuth()

    function checkIfIsCancelled(){
        if(cancelled){
            return
        }
    }

    //REGISTER
    const createUser = async (data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError("")

        try {
            const {user} = await createUserWithEmailAndPassword(auth, data.email, data.password)

            //No Firebase, se quisermos usar a estrutura própria de autenticacao deles sem mexer muit
            //temos que criar o Usuario só com email e senha e depois atualizamos o usuario pra colocar nome e/ou foto 
            await updateProfile(user, {displayName: data.displayName})
            
            setLoading(false)
            return user
        } catch (error) {
            console.log(error.message)
            console.log(typeof error.message)

            let systemErrorMessage

            if(error.message.includes('Password')){
                systemErrorMessage = "A senha precisa ter pelo menos 6 caracteres."
            }else if(error.message.includes('email.already')){
                systemErrorMessage = "E-mail já cadastrado."
            }else{
                systemErrorMessage = "Ocorreu um erro. Tente novamente mais tarde."
            }

            setLoading(false)
            setError(systemErrorMessage)
        }


    }

    //LOGOUT - SIGN OUT
    const logout = () => {

        checkIfIsCancelled()
        signOut(auth)

    }

    //LOGIN - SIGN IN
    const login = async (data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError("")

        try {
            
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)

        } catch (error) {
            let systemErrorMessage

            if(error.message.includes('user-not-found')){
                systemErrorMessage = 'Usuário não encontrado.'
            
            }else if(error.message.includes('wrong-password')){
                systemErrorMessage = 'Senha incorreta.'
            }else{
                systemErrorMessage = 'Ocorreu um erro. Tente novamente mais tarde.'
            }

            setError(systemErrorMessage)
            setLoading(false)
        }
    }    

    //Vai ser executado apenas uma vez e vai colocar o canceled como true se sairmos dessa pagina
    useEffect(() => {
        return () => setCancelled(true)
    }, []) 

    return {auth, createUser, error, loading, logout, login}
}