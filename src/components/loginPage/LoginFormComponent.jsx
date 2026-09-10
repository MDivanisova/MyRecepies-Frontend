import { useState, useRef, useEffect } from "react"
import { logIn, resendCode } from "../../utils/UserEndpoints";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Spiner from "../Spiner";
import "./loginFormComponent.css"

import { getRecommendations } from "../../utils/RecommendationEndpoint";

export default function LoginFormComponent (){
    
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const errMessgae = useRef(null);
    const navigate = useNavigate();
    const button = useRef(null);
    const {login} = useAuth();

    const [loading, setLoading] = useState(false);
    
    
    async function handleClikc(){

        button.current.disabled = true;


        errMessgae.current.textContent = "Wating....";

        const email = emailInput.current.value;
        const pass = passInput.current.value;

        setLoading(true);
        const data = await logIn(email, pass);

        setLoading(false);
        if(data.succ === true){
            login(data.token, data.user);

             getRecommendations(data.token)
                .then(data => {

                    if (data.recommendations) {

                        const recommendations =
                            data.recommendations.map(
                                item => item.recipe ?? item
                            );

                        localStorage.setItem(
                            "recommendations",
                            JSON.stringify(recommendations)
                        );

                        window.dispatchEvent(
                            new Event("recommendationsUpdated")
                        );
                    }
                })
                .catch(error => {
                    console.error("Recommendation error:", error);
                });
            navigate("/profile/me")
        }
        else{
            if(data.status === 500){
                navigate('/internalServerError')
            }
            if(data.email !== undefined){
                await resendCode(data.email);
                localStorage.setItem("codeSentAt", new Date().toISOString());
                navigate(`/verify?email=${data.email}`);                
            }
           errMessgae.current.textContent = "Invalid Credentials";
           emailInput.current.value = "";
           passInput.current.value = "";

           button.current.disabled = false;
        }

    }    
    
    return (
        <div className="login-form">
            <div>SIGN IN</div>
            <div className="form-field-login">
                <input ref={emailInput} placeholder="email" ></input>
            </div>
            <div className="form-field-login">
                <input type="password" ref={passInput} placeholder="password" ></input>
            </div>
            <div className="form-field-button-login">
                <button ref={button} onClick={async ()=>{await handleClikc()}}>
                    {loading ? <Spiner w={10} h={10}/>: "Login"}</button>
                <div className="login-error" ref={errMessgae}></div>
            </div>
            <Link to="/register">Click here if you don't have an account</Link>

        </div>
    )
}

