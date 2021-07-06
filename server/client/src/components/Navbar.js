import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'


function Navbar() {
    const {state, dispatch }= useContext(UserContext);
    const history =  useHistory();
    const renderList =()=>{

        if(state){
           return [
            <>
                <li><Link  to={state?"/":"/signin"} ><i className="material-icons right">home</i></Link></li> 
                <li><Link to="/createpost"><i className="material-icons right">add_box</i></Link></li>  
                <li><Link to="/profile"><i className="material-icons right">account_circle</i></Link></li>
                {/* <li><Link to="/myfollowerpost"><i className="material-icons right">timeline</i></Link></li> */}
                <li><button className="waves-effect waves-light btn" onClick={()=>{localStorage.clear();dispatch({type:'CLEAR'});history.push("/signin")}}>Log Out </button></li>
            </>  
            ]  
        }else {
           return [
                <>
                    <li><Link to="/signin">Sign In</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </>
                ]
        }
    }
    
    return (
        <div>
           
            <nav>
                <div className="nav-wrapper c" >
                    <a href="/" className="brand-logo p">! FOMO</a>
                    <ul id="nav-mobile" className="right">
                    
                        {renderList() }
                        
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
