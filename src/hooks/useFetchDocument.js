import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore/lite";

export const useFetchDocument = (docCollection, id) => {

    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    //Deal with memory leak -> lidar com vazamento de memória
    const [canceled, setCancelled] = useState(false)

    useEffect(() => {
        async function loadDocument(){
            if(canceled) return //Se for só uma linha, não precisa de abre e fecha chaves

            setLoading(true)

            try {
                
                const docRef = await doc(db, docCollection, id)
                const docSnap = await getDoc(docRef)

                setDocument(docSnap.data())

                setLoading(false)
            } catch (error) {
                console.log(error.message)
                setError(error.message)
                setLoading(false)
            }
            

        }
        loadDocument() //Só vai ser executada quando algum dos dados monitorados forem alterados
    }, [docCollection, canceled, id])

    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {document, loading, error}
}