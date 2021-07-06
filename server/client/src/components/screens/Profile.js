import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';

function Profile() {
    const [mypics, setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        const abortController = new AbortController()
        const signal = abortController.signal
        fetch('/mypost',{
            headers:{
                "Authorization": localStorage.getItem("jwt")
            },
            signal:signal
        }).then(res=>res.json())
        .then(result =>{console.log(result);setPics(result.mypost)})

        return function cleanup(){
            abortController.abort()
        }
    },[])
    console.log(state);
    return (
        <div style={{ maxWidth: "580px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "25px 0px", borderBottom: "solid 1px gray", }}>
                <div>
                    <img alt="" style={{ width: "140px", height: "140px", borderRadius: "50px" }} src={state? state.profilepic: "loading.."}/>
                </div>
                <div>
                    <h5>{state?state.name:"loading..."}</h5>
                    <div style={{ display: "flex", justifyContent: "space-around", width: "118%", }}>
                        <p>{mypics.length} post</p>
                        <p>{state?state.followers.length:"loading..."} follower</p> 
                        <p>{state?state.following.length:"loading..."} following</p>
                    </div>
                    
                </div>
            </div>
            <div className="gallary">
                  {
                    mypics.map(item=>{
                      return<img key={item._id} className="item" alt="" src={item.photo} />
              
                    })
                }
            </div>
        </div>
    )
}

export default Profile
