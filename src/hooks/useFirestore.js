import { useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase'

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get all documents from collection
  const getAll = async (conditions = [], orderByField = null) => {
    try {
      setLoading(true)
      const collectionRef = collection(db, collectionName)
      
      let q = collectionRef
      
      // Add where conditions
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value))
        })
      }
      
      // Add ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'))
      }
      
      const snapshot = await getDocs(q)
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setData(documents)
      return documents
    } catch (err) {
      setError(err.message)
      console.error(`Error getting ${collectionName}:`, err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Get single document by ID
  const getById = async (id) => {
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Document not found')
      }
    } catch (err) {
      setError(err.message)
      console.error(`Error getting ${collectionName} by ID:`, err)
      return null
    }
  }

  // Add new document
  const add = async (data) => {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, collectionName), docData)
      return docRef.id
    } catch (err) {
      setError(err.message)
      console.error(`Error adding ${collectionName}:`, err)
      throw err
    }
  }

  // Update document
  const update = async (id, data) => {
    try {
      const docRef = doc(db, collectionName, id)
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(docRef, updateData)
      return true
    } catch (err) {
      setError(err.message)
      console.error(`Error updating ${collectionName}:`, err)
      throw err
    }
  }

  // Delete document
  const remove = async (id) => {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
      return true
    } catch (err) {
      setError(err.message)
      console.error(`Error deleting ${collectionName}:`, err)
      throw err
    }
  }

  // Real-time listener
  const subscribe = (conditions = [], orderByField = null, callback = null) => {
    try {
      const collectionRef = collection(db, collectionName)
      
      let q = collectionRef
      
      // Add where conditions
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value))
        })
      }
      
      // Add ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'))
      }
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setData(documents)
        if (callback) callback(documents)
      }, (err) => {
        setError(err.message)
        console.error(`Error in ${collectionName} subscription:`, err)
      })
      
      return unsubscribe
    } catch (err) {
      setError(err.message)
      console.error(`Error setting up ${collectionName} subscription:`, err)
      return () => {}
    }
  }

  return {
    data,
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    subscribe,
    setData,
    setLoading,
    setError
  }
}

