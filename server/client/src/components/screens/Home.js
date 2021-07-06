import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import { Link, useHistory } from 'react-router-dom'


function Home() {
    const [data, setdata] = useState([]);
    const {state,dispatch} = useContext(UserContext);

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization": localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{console.log(result);setdata(result)})
    },[])

    const likepost =(id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result =>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setdata(newData)
        }).catch(err=>{console.log(err)})
    }
    const unlikepost =(id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result =>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setdata(newData)
        }).catch(err=>{console.log(err)})
    }

    const makecomment = (text,postId) => {
        fetch('/coment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,text
            })
        }).then(res=>res.json())
        .then(result =>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
                
            })
            setdata(newData)
        }).catch(err=>{console.log(err)})
    }
    const deletePost = (postId) =>{

        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:
            {
                "Authorization":localStorage.getItem("jwt")
            },
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result.id
            })
            
            setdata(newData)
            window.location.reload();
        })
    }
    return (
        <>
       
        <div className="home">
            {   
                data.map(item=>{
                return( 
                    <div className="card home-card" key={item._id}>
                        <h5 style={{ padding: "10px" ,cursor: "pointer"}}><Link to={"/profile/"+item.postedby._id}>{item.postedby.name}</Link>
                        <span className="material-icons right" style={{ cursor: "pointer"}} onClick={()=>deletePost(item._id)} >delete</span></h5>
                        <div className="card-image">
                            <img alt="" style={{ padding: "10px" }}  src={item.photo} />
                        </div>
                        <div className="card-content">
                        {item.likes.includes(state._id)?<a><span className="material-icons" style={{ cursor: "pointer"}} onClick={()=>unlikepost(item._id)} >favorite_border</span></a>: <a><span className="material-icons"  style={{ color: "red",cursor: "pointer"}} onClick={()=>likepost(item._id)}>favorite</span></a>
                            }
                           
                            <p>{item.likes.length} likes</p>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.coments.map(record=>{
                                    return(
                                        <h6 key={record._id}><span style={{fontWeight:"600"}}>{record.postedby.name } </span>{record.text}</h6>
                                    )
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makecomment(e.target[0].value,item._id)
                            }}>
                                <input typr="text" placeholder="add a comment"  />
                            </form>
                            
                        </div>
                    </div>)
                })
            }
        </div> 
        </>  
    )
}

export default Home
