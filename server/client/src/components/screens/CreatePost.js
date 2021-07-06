import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import M from 'materialize-css'

function CreatePost() {
    const history = useHistory();
    const [title, settitle] = useState("");
    const [body, setbody] = useState("");
    const [img, setimg] = useState("");
    const [url, seturl] = useState("")
    const data = new FormData();
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body:JSON.stringify(
                    {
                    title:title,
                    body:body,
                    pic:url
                    }
                ),
                signal:signal
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"#d32f2f red darken-2"})
                }else{
                   
                   
                    M.toast({html:"Created post sucessfully",classes:"#fdd835 yellow darken-1"});
                    history.push('/');
                }
            }).catch(err=>{console.log(err)})
            
        }
        return function cleanup(){
            abortController.abort()
        }
    }, [url])

    const postDetails =()=>{
        
        data.append("file",img);
        data.append("upload_preset","socialnetwork");
        data.append("cloud_name","shreyacloud");

        fetch("https://api.cloudinary.com/v1_1/shreyacloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{seturl(data.url)})
        .catch(err=>{console.log(err)})

    } 
    

    return (
        <div className="card input-filed" style={{margin:"30px auto",maxWidth:"500px",padding:"20px",textAlign:"center"}}>
            <div className="card-content">
                <span className="card-title">Create Post</span>
                <input type="text" placeholder="title" value={title} onChange={(e)=>{settitle(e.target.value)}} />
                <input type="text" placeholder="description" value={body} onChange={(e)=>{setbody(e.target.value)}} />
                <form action="#">
                    <div className="file-field input-field">
                        <div className="btn">
                            <span><i className="material-icons center">add_a_photo</i></span>
                            <input type="file" onChange={(e)=>{setimg(e.target.files[0])}}  />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </form>
                <button className="waves-effect waves-light btn" onClick={()=>postDetails()} >Upload Post<i className="material-icons right">upload</i> </button>
            </div>
        </div>
    )
}

export default CreatePost
