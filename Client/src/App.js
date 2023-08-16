import React  , {useEffect , createContext , useReducer , useContext} from 'react'
import './App.css';
import {BrowserRouter , Routes , Route , useNavigate} from 'react-router-dom'
import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import {reducer,initialState} from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscriberUserPosts from './components/screens/SubscriberUserPosts';
export const UserContext = createContext()

const Routing = () =>{
    const nevigate = useNavigate()
    const {state , dispatch} = useContext(UserContext)

    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"))
      if(user){
        dispatch({type:"USER" , payload: user})
      }else{
        nevigate('/signin')
      }
    },[])

    return (
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/create" element={<CreatePost/>} />
      <Route path="/profile/:userid" element={<UserProfile/>} />
      <Route path="/myfollowingpost" element={<SubscriberUserPosts/>} />
      </Routes>
    )
}

function App() {
  const [state , dispatch] = useReducer(reducer , initialState)
  return (
    <UserContext.Provider  value = {{state , dispatch}}>
       <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
    
     

  );
}

export default App;
