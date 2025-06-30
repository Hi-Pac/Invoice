import { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role || 'Employee',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'active'
      })

      return user
    } catch (error) {
      throw error
    }
  }

  // Sign in function
  const signin = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      
      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true })

      return user
    } catch (error) {
      throw error
    }
  }

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth)
      setUserProfile(null)
    } catch (error) {
      throw error
    }
  }

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Get user profile from Firestore
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } else {
        setCurrentUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    logout,
    getUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

