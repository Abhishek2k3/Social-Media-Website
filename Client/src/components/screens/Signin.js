
import React , {useState , useContext} from "react";
import { Link  , useNavigate} from "react-router-dom";
import M from "materialize-css"
import {UserContext} from '../../App'

const Signin = ()=>{
    const {state , dispatch} = useContext(UserContext)
    const nevigate = useNavigate()
    const [password , setPassword] = useState("")
    const [email , setEmail] = useState("")

    const PostData = ()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email" , classes: "#ef5350 red lighten-1"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            
            if(data.error){
                M.toast({html: data.error , classes: "#ef5350 red lighten-1"})
            }else{
                localStorage.setItem("jwt" , data.token)
                localStorage.setItem("user" , JSON.stringify(data.user))
                dispatch({type:"USER" , payload: data.user})
                M.toast({html: "Signedin successfully" , classes:"#43a047 green darken-1"})
                nevigate('/')
            }
        })
        .catch(err=>console.log(err))
    }

    return (
       <div className="mycard">
           <div className="card auth-card">
            <h2>Pixogram</h2>
            <input type="text" 
            placeholder="email" 
            value = {email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input type="password" 
            placeholder="password" 
            value = {password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button className="btn waves-effect waves-light" onClick={()=>PostData()}> Login </button>
            <h6>
            <Link to="/Signup">Don't have an account</Link>
            </h6>
           </div>
       </div>
    )
}

export default Signin