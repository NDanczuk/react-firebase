import { useState, useEffect } from "react"
import { db } from "./firebaseConnection"
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

function App() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [idPost, setIdPost] = useState('')
  
  const [posts, setPosts] = useState([])

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
    .catch(() => {
      console.log(error)
    })
  }

  async function removePost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("Post deleted!")
    })
    .catch(() => {
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

  return (
    <div>
      <h1>ReactJS</h1>

      <div className="container">

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
