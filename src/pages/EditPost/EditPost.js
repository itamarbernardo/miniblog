import styles from './EditPost.module.css'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthValue } from '../../context/AuthContext'
import { useFetchDocument } from '../../hooks/useFetchDocument'
import { useUpdateDocument } from '../../hooks/useUpdateDocument'

const EditPost = () => {
  
  const {id} = useParams()
  const {document: post} = useFetchDocument('posts', id)

  useEffect(() => {
    if(post){
        setTitle(post.title)
        setBody(post.body)
        setImage(post.image)

        const textTags = post.tagsArray.join(',')
        setTags(textTags)
    }
  }, [post])
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState("")

  const {user} = useAuthValue() //Usuario Autenticado
  const {updateDocument, response} = useUpdateDocument('posts') //Passa o nome da collection que eu quero criar/utilizar no banco
  
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
    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    }
    updateDocument(id, data)

    //Redirect to Home page
    navigate('/dashboard')
  }

  return (
    <div className={styles.edit_post}>
        {post && (
            <>
                <h2>Editando Post: {post.title}</h2>
                <p>Altere os dados do post como desejar</p>
                <form onSubmit={handleSubmit}>
                <label>
                    <span>Título:</span>
                    <input type="text" name="titulo" required placeholder='Pense em um bom título...' onChange={(event) => setTitle(event.target.value)} value={title}/>
                </label>
                <label>
                    <span>URL da Imagem:</span>
                    <input type="text" name="image" required placeholder='Insira a URL da Imagem do Post' onChange={(event) => setImage(event.target.value)} value={image}/>
                </label>
                <p className={styles.preview_title}>Preview da imagem atual:</p>
                <img className={styles.image_preview} src={post.image} alt={post.title} />
                <label>
                    <span>Conteúdo:</span>
                    <textarea name="body" required placeholder='Descreva sua experiência abaixo...' onChange={(event) => setBody(event.target.value)} value={body}></textarea>
                </label>
                <label>
                    <span>Tags:</span>
                    <input name="tags" required placeholder='Insira as tags separadas por vírgula...' onChange={(event) => setTags(event.target.value)} value={tags} />
                </label>

                {/* Abaixo colocamos o className sem o {style.btn} porque estamos puxando essa classe do index.css => é uma config global */}
                {!response.loading && <button className="btn">Alterar</button>}
                {response.loading && <button disabled className="btn">Aguarde...</button>}
                {response.error && <p className='error'>{response.error}</p>}      
                {formError && <p className='error'>{formError}</p>}        
                </form>
            </>
        )}
    </div>
  )
}

export default EditPost