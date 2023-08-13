import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, orderBy, where, query } from "firebase/firestore/lite";
import { onSnapshot  } from 'firebase/firestore'

export const useFetchDocuments = (docCollection, search = null, uid = null) => {

    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    //Deal with memory leak -> lidar com vazamento de memória
    const [canceled, setCancelled] = useState(false)

    useEffect(() => {
        async function loadData(){
            if(canceled) return //Se for só uma linha, não precisa de abre e fecha chaves

            setLoading(true)

            const collectionRef = await collection(db, docCollection) //Serve pra buscar outros documentos, não só posts

            try {
                let q

                //Busca
                if(search){
                      
                      q = await getDocs(query(collectionRef, 
                        where("tagsArray", "array-contains", search), 
                        orderBy("createdAt", "desc")));
                }else if(uid){
                      
                    q = await getDocs(query(collectionRef, 
                        where("uid", "==", uid), 
                        orderBy("createdAt", "desc")));
                
                }
                else{
                    q = await getDocs(
                        collectionRef, orderBy("createdAt", "desc")

                        ) //Faz a busca mais simples, trazendo tudo
                }
                //Dashboard
                
                // onSnapshot(q, (querySnapshot) => {
                //     setDocuments(
                //       querySnapshot.docs.map((doc) => ({
                //         id: doc.id,
                //         ...doc.data(),
                //       }))
                //     );
                //   });
                setDocuments( q.docs.map((doc) => ({
                    ...doc.data(),
                    id:doc.id,
                })))
                

                setLoading(false)
            } catch (error) {
                console.log(error)
                setError(error)
                setLoading(false)
            }

        }
        loadData() //Só vai ser executada quando algum dos dados monitorados forem alterados
    }, [docCollection, search, uid, canceled])

    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {documents, loading, error}
}