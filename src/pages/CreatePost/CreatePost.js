import styles from './CreatePost.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthValue } from '../../context/AuthContext'
import { useInsertDocument } from '../../hooks/useInsertDocument'

const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState("")

  const {user} = useAuthValue() //Usuario Autenticado
  const {insertDocument, response} = useInsertDocument('posts') //Passa o nome da collection que eu quero criar/utilizar no banco
  
  const navigate = useNavigate()
  
  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError("")

    //Validar Imagem URL
    try {
      new URL(image)
    } catch (error) {
      setFormError('A imagem precisa ser uma URL.')
    }

    //Criar o array de tags
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase() )

    //Checar todos os valores
    if(!title || !image || !tags || !body){
      setFormError('Por favor, preencha todos os campos.')
    }

    if(formError){
      return //Se tiver algum erro na validação ele já retorna, não insere
    }
    //Inserir o post
    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    })

    //Redirect to Home page
    navigate('/')
  }

  return (
    <div className={styles.create_post}>
        <h2>Criar Post</h2>
        <p>Escreva sobre o que quiser, e compartilhe experiências</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título:</span>
            <input type="text" name="titulo" required placeholder='Pense em um bom título...' onChange={(event) => setTitle(event.target.value)} value={title}/>
          </label>
          <label>
            <span>URL da Imagem:</span>
            <input type="text" name="image" required placeholder='Insira a URL da Imagem do Post' onChange={(event) => setImage(event.target.value)} value={image}/>
          </label>
          <label>
            <span>Conteúdo:</span>
            <textarea name="body" required placeholder='Descreva sua experiência abaixo...' onChange={(event) => setBody(event.target.value)} value={body}></textarea>
          </label>
          <label>
            <span>Tags:</span>
            <input name="tags" required placeholder='Insira as tags separadas por vírgula...' onChange={(event) => setTags(event.target.value)} value={tags} />
          </label>

          {/* Abaixo colocamos o className sem o {style.btn} porque estamos puxando essa classe do index.css => é uma config global */}
          {!response.loading && <button className="btn">Cadastrar</button>}
          {response.loading && <button disabled className="btn">Aguarde...</button>}
          {response.error && <p className='error'>{response.error}</p>}      
          {formError && <p className='error'>{formError}</p>}        
        </form>
    </div>
  )
}

export default CreatePost