import { useState, useEffect } from "react"
import { db, auth } from "./firebaseConnection"
import { doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from "firebase/firestore"
import './app.css'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

function App() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [idPost, setIdPost] = useState('')
  
  const [posts, setPosts] = useState([])

  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let postList = []

        snapshot.forEach((doc) => {
          postList.push({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author
          })
        })

        setPosts(postList)
      })

    }

    loadPosts()
  }, [])

  useEffect( () => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log(user)
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false)
          setUserDetail({})
        }
      })
    }

    checkLogin()
  }, [])

  async function handleAdd(){
    // await setDoc(doc(db, "posts", "3"), {
    //   title: title,
    //   author: author
    // })
    // .then(() => {
    //   console.log("DATA ADDED")
    // })
    // .catch((error) => {
    //   console.log("ERROR" + error)
    // })

    await addDoc(collection(db, "posts"), {
      title: title,
      author: author
    })
    .then(() => {
      console.log("DATA ADDED")
      setAuthor('')
      setTitle('')
    })
    .catch((error) => {
      console.log("ERROR" + error)
    })
  }

  async function editPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      title: title,
      author: author
    })
    .then(() => {
      setIdPost('')
      setTitle('')
      setAuthor('')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function removePost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("Post deleted!")
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function searchPost(){
    // const postRef = doc(db, "posts", "1")
    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAuthor(snapshot.data().author)
    //   setTitle(snapshot.data().title)
    // })
    // .catch(() => {
    //   console.log("ERROR")
    // })

    const postRef = collection(db, "posts")
    await getDocs(postRef)
    .then((snapshot) => {
      let list = []

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          title: doc.data().title,
          author: doc.data().author,
        })
      })

      setPosts(list)

    })
    .catch((error) =>{
      console.log(error)
    })

  }

  async function newUser() {
    await createUserWithEmailAndPassword(auth, email, pwd)
    .then(() => {
        alert("User signed-up!")
        setEmail("")
        setPwd("")
    })
    .catch((e) => {
      console.log(e)
    })
  }

  async function logUser() {
    await signInWithEmailAndPassword(auth, email, pwd)
    .then((value) => {
      console.log("SUCCESS")
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true)

      setEmail("")
      setPwd("")
    })
    .catch((e) => {
      console.log(e)
    })
  }

  async function logOut(){
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div>
      <h1>ReactJS</h1>

      { user && (
        <div>
          <strong>Welcome!</strong> <br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span><br/>
          <button onClick={logOut}>Log-out</button>
        </div>
      ) }
      

      <div className="container">
        <h2>USERS</h2>
        <label>Email</label>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        /> <br/>

        <label label>Password</label>
        <input 
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Password..."
         /> <br/>

         <button onClick={newUser}>Sign-up</button>
         <button onClick={logUser}>Login</button>
      </div>

      <br/><br/>

      <hr/>

      <div className="container">
        
        <h2>POSTS</h2>

        <label>Post ID:</label>
        <input
          placeholder="Type in the post's id"
          value={idPost}
          onChange={ (e) => setIdPost(e.target.value) }
        /><br/>

        <label>Title:</label>
        <textarea
          type="text"
          placeholder="Input title"
          value={title}
          onChange={ (e) => setTitle(e.target.value)}
        />

        <label>Author: </label>
        <input 
          type="text" 
          placeholder="Post author"
          value={author}
          onChange={ (e) => setAuthor(e.target.value)}
        />

        <button onClick={handleAdd}>Add post</button> <br/>
        {/* <button onClick={searchPost}>Search post</button> <br/> <br/> */}
        <button onClick={editPost}>Edit post</button>

        <ul>
          {posts.map( (post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br/>
                <span>Title: {post.title} </span> <br/>
                <span>Author: {post.author}</span> <br/>
                <button onClick={() => removePost(post.id)}>Remove post</button> <br/> <br/>
              </li>
            )
          } )}
        </ul>
      </div>
    </div>
  )
}

export default App
