import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore/lite";

const initialState = {
    loading: null,
    error: null
}

const insertReducer = (state, action) => {
    switch(action.type){
        case "LOADING":
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

//Permite não só inserir um Post, mas inserir qualquer documento 
export const useInsertDocument = (docCollection) => {
    const [response, dispatch] = useReducer(insertReducer, initialState)

    //Deal with memory leak -> lidar com vazamento de memória

    const [canceled, setCancelled] = useState(false)

    const checkCancelBeforeDispatch = (action) => {
        if(!canceled){
            dispatch(action) //Só executa a ação se o canceled for false
        }
    }

    const insertDocument = async (document) => {
        checkCancelBeforeDispatch(
            {
                type: "LOADING",
            }
        )

        try {
            const newDocument = {...document, createdAt: Timestamp.now()}

            const insertedDocument = await addDoc(
                collection(db, docCollection),
                newDocument //Ele procura a coleção no db, se encontrar, ele insere
            )

            checkCancelBeforeDispatch(
                {
                    type: "INSERTED_DOC",
                    payload: insertedDocument
                }
            )
        } catch (error) {
            checkCancelBeforeDispatch(
                {
                    type: "ERROR",
                    payload: error.message
                }
            )
        }
    }

    useEffect(() => {
        return () => setCancelled(true)
    }, [])

    return {insertDocument, response}
}