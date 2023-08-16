import React , {useContext} from "react";
import { Link  , useNavigate} from "react-router-dom";
import {UserContext} from '../App'

const NavBar = ()=>{
   const nevigate = useNavigate()
   const {state , dispatch} = useContext(UserContext)
   const renderList = () =>{
      if(state){
         return (<>
         [
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/create">CreatePost</Link></li>
          <li><Link to="/myfollowingpost">Following Posts</Link></li>
          <li><button className="btn #d32f2f red darken-2" 
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            nevigate('/signin')
          }}> Logout </button> </li>
         ]
         </>)
      }else{
        return (<>
          [
            <li><Link to="/signin">Signin</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          ]
          </>)
      }
   }

    return (
   <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Pixogram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
    )
}

export default NavBar