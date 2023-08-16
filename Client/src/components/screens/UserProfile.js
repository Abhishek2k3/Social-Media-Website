import React , {useEffect , useState , useContext} from "react";
import {UserContext} from '../../App'
import { useParams } from "react-router-dom";


const UserProfile = ()=>{
    const {state , dispatch} = useContext(UserContext)
    const [userProfile , setProfile]  = useState(null)
    const {userid} = useParams()
    const [showFollow , setshowFollow] = useState(state?!state.following.includes(userid) : true)
    
    useEffect(()=>{
        fetch(`/user/:${userid}` , {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
    },[])

    const followUser = ()=>{
        fetch('/follow' , {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId: userid
            })
        }).then(res=>res.json())
        .then(data=>{
           console.log(data)
           dispatch({type:"UPDATE" , payload:{following:data.following , followers: data.followers}})
           localStorage.setItem("user" , JSON.stringify(data))
           setProfile({
            ...userProfile,
            user:{
                ...userProfile.user,
                followers:[...userProfile.user.followers , data._id]
            }
           })
           setshowFollow(false)
        })
    }

    const UnfollowUser = ()=>{
        fetch('/unfollow' , {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId: userid
            })
        }).then(res=>res.json())
        .then(data=>{
           console.log(data)
           dispatch({type:"UPDATE" , payload:{following:data.following , followers: data.followers}})
           localStorage.setItem("user" , JSON.stringify(data))

           setProfile((prevState)=>{
            const newFollowers = prevState.user.followers.filter(item=>item !== data._id)
            return{
            ...prevState,
            user:{
                ...prevState.user,
                followers:newFollowers
            }
           }})
           setshowFollow(true)
        })
    }

    return (
        <>
        {!userProfile ? <h2>...Loading</h2> :
        
        <div style={{maxWidth:"550px" , margin:"0px auto"}}> 
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px" , height:"160px" , borderRadius:"80px"}}
                    alt="" src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex", justifyContent:"space-between" , width:"108%"}}>
                        <h5>{userProfile.posts.length} Posts</h5>
                        <h5>{userProfile.user.followers.length} Followers</h5>
                        <h5>{userProfile.user.following.length} following</h5>
                    </div>
                    {showFollow === true ? 
                    <button style={{margin:"10px"}} className="btn waves-effect waves-light"
                     onClick={()=>followUser()}>Follow</button>
                     :
                    <button style={{margin:"10px"}} className="btn waves-effect waves-light"
                     onClick={()=>UnfollowUser()}>Unfollow</button>
                    }
                </div>
            </div>

            <div className="gallery">
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img className="item" key={item._id} alt="" src={item.photo}/>
                        )
                    })
                }
                
            </div>
        </div>
       } 
        </>
    )
}

export default UserProfile