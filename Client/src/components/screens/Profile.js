import React , {useEffect , useState , useContext} from "react";
import {UserContext} from '../../App'
import { json } from "react-router-dom";


const Profile = ()=>{
    const {state , dispatch} = useContext(UserContext)
    const [mypics , setPics]  = useState([])
    
    //console.log(state)
    useEffect(()=>{
        fetch('/mypost' , {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])

    const SaveData = (data)=>{
        fetch('/updatepic' , {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({pic:data.url})
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            dispatch({type:"UPDATEPIC" , payload:{pic: result.pic}})
            localStorage.setItem("user" , JSON.stringify(result))
        })
    }
        

    const UploadPhoto = (file)=>{
        const data = new FormData()
        data.append("file" , file)
        data.append("upload_preset" , "Insta-clone")
        data.append("cloud_name" , "dhax11hsw")
        fetch("https://api.cloudinary.com/v1_1/dhax11hsw/image/upload" , {
         method: "post",
         body: data
        })
        .then(res=>res.json())
        .then(data=>{
          //console.log(data)
          SaveData(data)
        })
        .catch(err=>console.log(err))
    }

    return (
        <div style={{maxWidth:"550px" , margin:"0px auto"}}> 
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px" , height:"160px" , borderRadius:"100px"}}
                    alt="" src={state?state.pic:"loading"}/>
                    <div class="file-field input-field">
                       <div class="btn">
                        <span>Update Pic</span>
                        <input type="file" onChange={(e)=>UploadPhoto(e.target.files[0])}/>
                       </div>
                       <div class="file-path-wrapper">
                       <input class="file-path validate" type="text"/>
                       </div>
                    </div>
                    {/* <button style={{margin:"0px 10px 10px 28px"}} className="btn waves-effect waves-light">Update Pic</button> */}
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{display:"flex", justifyContent:"space-between" , width:"108%"}}>
                        <h5>{mypics.length} posts</h5>
                        <h5>{state?state.followers.length:"0"} followers</h5>
                        <h5>{state?state.following.length:"0"} following</h5>
                    </div>
                </div>
               
            </div>

            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img className="item" key={item._id} alt="" src={item.photo}/>
                        )
                    })
                }
                
            </div>
        </div>
    )
}

export default Profile