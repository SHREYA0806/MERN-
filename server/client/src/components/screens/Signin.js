import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App';


function Signin() {
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const PostData = ()=>{
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {
                password:password,
                email:email,
                }
            )
        }).then(res=>res.json())
        .then(data=>{

            if(data.error){
               M.toast({html:data.error,classes:"#d32f2f red darken-2"})
            }else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"Sign in successfull",classes:"#fdd835 yellow darken-1"});
                history.push('/');
               
            }
        }).catch(err=>{console.log(err)})
    }
    return (
        <div className="card size middle #fafafa grey lighten-5">
            <div className="card-content">
                <span className="card-title">The Social Network</span>
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
                <button className="waves-effect waves-light btn" onClick={()=>{PostData()}}>Sign In <i className="material-icons right">send</i> </button>
                <h6><Link to="/signup">Don't have an account?</Link></h6>
            </div>
        </div>
    )
}

export default Signin
