import React , {useState , useEffect} from "react";
import { Link , useNavigate} from "react-router-dom";
import M from "materialize-css"
const Signup = ()=>{
    const nevigate = useNavigate()
    const [name , setName] = useState("")
    const [password , setPassword] = useState("")
    const [email , setEmail] = useState("")
    const [image , setImage] = useState("")
    const [url , setUrl] = useState(undefined)


    useEffect(()=>{
       if(url){
         uploadFields();
       }
    },[url])
    
    const uploadPic = ()=>{
       const data = new FormData()
       data.append("file" , image)
       data.append("upload_preset" , "Insta-clone")
       data.append("cloud_name" , "dhax11hsw")
       fetch("https://api.cloudinary.com/v1_1/dhax11hsw/image/upload" , {
        method: "post",
        body: data
       })
       .then(res=>res.json())
       .then(data=>{
         setUrl(data.url)
       })
       .catch(err=>console.log(err))
    }

    const uploadFields = ()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email" , classes: "#ef5350 red lighten-1"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error , classes: "#ef5350 red lighten-1"})
            }else{
                M.toast({html: data.message , classes:"#43a047 green darken-1"})
                nevigate('/signin')
            }
        })
        .catch(err=>console.log(err))
    }

    const PostData = ()=>{
        
        if(image){
            uploadPic();
        }else uploadFields();
       
    }


    return (
       <div className="mycard">
           <div className="card auth-card">
            <h2>Pixogram</h2>
            <input type="text"
             placeholder="name"
             value = {name}
             onChange={(e)=>setName(e.target.value)}
             />
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
            <div class="file-field input-field">
              <div class="btn">
                <span>Upload Pic</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
              </div>
              <div class="file-path-wrapper">
                <input class="file-path validate" type="text"/>
              </div>
           </div>
            <button className="btn waves-effect waves-light" onClick={()=>PostData()}>SignUP</button>
            <h6>
            <Link to="/Signin">Already have an account</Link>
            </h6>
           
           </div>
       </div>
    )
}

export default Signup