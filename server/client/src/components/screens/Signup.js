import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

function Signup() {
    const history = useHistory();
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const data = new FormData();
    const [img, setimg] = useState("");
    const [url, seturl] = useState(undefined)

    const uploadpic = () => {

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

    useEffect(()=>{
        if(url){
            uploadField()
        }
    },[url])

    const uploadField = () =>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {
                name:name,
                password:password,
                email:email,
                profilepic:url
                }
            )
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#d32f2f red darken-2"})
            }else{
                M.toast({html:data.message,classes:"#fdd835 yellow darken-1"});
                history.push('/signin');
               
            }
        }).catch(err=>{console.log(err)})
    }

    const PostData = ()=>{
        if(img){
            uploadpic()
        }else{
            uploadField()
        }
        
    }
    

    return (
        
        <div className="card size middle ">
            <div className="card-content">
                <span className="card-title">Sign up</span>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="name" type="text" className="validate" value={name} onChange={(e)=>{setname(e.target.value)}} />
                        <label htmlFor="name">Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="email" type="email" className="validate" value={email} onChange={(e)=>{setemail(e.target.value)}} />
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="password" type="password" className="validate" value={password} onChange={(e)=>{setpassword(e.target.value)}} />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
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
                <button className="waves-effect waves-light btn" onClick={()=>{PostData()}}>Sign Up <i className="material-icons right">send</i> </button>
                <h6><Link to="/signin" >Already have an account?</Link></h6>
            </div>
        </div>
    )
}

export default Signup
