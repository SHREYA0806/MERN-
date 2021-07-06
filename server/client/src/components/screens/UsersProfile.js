import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';


function UsersProfile() {
    const [userprofile, setuserprofile] = useState({});
    const [prof, setprof] = useState([])
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams()
    const [userpics, setuserpics] = useState([]);
    const [showfollow,setShowfollow] =useState(true)
  
    useEffect(()=>{
        const abortController = new AbortController()
        const signal = abortController.signal
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization": localStorage.getItem("jwt")
            },
            signal:signal
        }).then(res=>res.json())
        .then(result =>{console.log(result);setuserprofile(result.user);setuserpics(result.posts);setprof(result)})
        
        
        return function cleanup(){
            abortController.abort()
        }
    },[])
   
    const followUser = () =>{

        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setprof((prevState)=>{
                return {
                    user: {
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                   
                }
            })
            
        })
        setShowfollow(false)
    }

    const unfollowUser = () =>{

        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setprof((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!=data._id)

                return {
                    user: {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                        
                    }
                   
                }
            })
            window.location.reload();
            setShowfollow(true)
        })

    }
    return (
        <div style={{ maxWidth: "580px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "25px 0px", borderBottom: "solid 1px gray", }}>
                <div>
                    <img alt="" style={{ width: "140px", height: "140px", borderRadius: "50px" }} src={prof.user == undefined ? "loading.." : prof.user.profilepic} />
                </div>
                <div>
                    <div style={{width:"118%"}}>
                    <h5>{userprofile.name}
                    
                    { showfollow ? <button className="waves-effect waves-light btn right" onClick={()=>{followUser()}}>Follow</button>: <button className="waves-effect waves-light btn right" onClick={()=>{unfollowUser()}}>UnFollow</button> }
                    
                    
                    </h5>
                    <h6>{userprofile.email}</h6>
                   
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", width: "118%", }}>
                        <p>{userpics.length} post</p>
                        <p>{prof.user == undefined ? "loading..": prof.user.followers == undefined? "loading.." : prof.user.followers.length} follower</p>
                        <p>{prof.user == undefined ? "loading..": prof.user.following == undefined? "loading.." : prof.user.following.length} following</p>
                    </div>
                    <div style={{width:"118%"}}>
                    
                   
                    <br /><br />
                    </div>
                    
                </div>
            </div>
            <div className="gallary">
                  {
                    userpics.map(item=>{
                      return ( <img key={item._id} className="item" alt="" src={item.photo} /> )
              
                    })
                }
            </div>
        </div>
    )
}


export default UsersProfile
