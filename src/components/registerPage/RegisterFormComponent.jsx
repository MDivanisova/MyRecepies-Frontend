import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/UserEndpoints.js"
import "./registerFormComponent.css"

export default function RegisterFormComponent(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("male");

    const [errMessageName, setErrMessageName] = useState("");
    const [errMessageEmail, setErrMessageEmail] = useState("");
    const [errMessagePassword, setErrMessagePassword] = useState("");
    const [errMessageGender, setErrMessageGender] = useState("");
    const [errMessageConfirmPassword, setErrMessageConfirmPassword] = useState("");

    const [errMessage, setErrMessage] = useState("");
    const [disabled, setDisabled] = useState(true);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    function validateName(value){
        if(value.length < 3){
            return "name must be at least 3 characters";
        }
        if(value.length > 50){
            return "name can't be more than 50 characters";
        }
        return "";
    }

    function validateEmail(value){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(value)){
            return "invalid email";
        }
        return "";
    }

    function validatePassword(value){
        if(value.length < 7){
            return "password must be at least 7 characters";
        }
        return "";
    }

    function validateGender(value){
        if(value !== "male" && value !== "female"){
            return "invalid gender";
        }
        return "";
    }

    function validateConfirmPassword(p1, p2){
        if(p1 !== p2){
            setErrMessageConfirmPassword("The confirm password must match the first password");
        }
        else{
            setErrMessageConfirmPassword("");
        }
    }

    useEffect(()=>{
        setErrMessage("");
        const allFilled = !errMessageEmail && !errMessageName && !errMessagePassword && !errMessageConfirmPassword && !errMessageGender;

        setDisabled(!allFilled);
    },[name, email, password, gender, confirmPassword])


    useEffect(()=>{
        setDisabled(true)
    },[])


    function handleNameChange(e) {
        const value = e.target.value;
        setName(value);
        setErrMessageName(validateName(value));
    }

    function handleEmailChange(e) {
        const value = e.target.value;
        setEmail(value);
        setErrMessageEmail(validateEmail(value));
    }

    function handlePasswordChange(e) {
        const value = e.target.value;
        setPassword(value);
        setErrMessagePassword(validatePassword(value));

        validateConfirmPassword(value, confirmPassword);
    }

    function handleConfirmPasswordChange(e) {
        const value = e.target.value;
        setConfirmPassword(value);
        
        validateConfirmPassword(value, password);

    }

    function handleGenderChange(e) {
        const value = e.target.value;
        setGender(value);

        setErrMessageGender(validateGender(value));
    }


    async function handleClick() {
        setDisabled(true);
        setErrMessage("");

        setLoading(true);

        const data = await register(name, email, password, gender);

        setLoading(false);
        if(data === true){
            localStorage.setItem("codeSentAt", new Date().toISOString());
            navigate(`/verify?email=${email}`); //treba da nose kon verifyPage
        }

        if(data.status === 500){
                navigate('/internalServerError')
        }

        if(data.msg === undefined){
            setErrMessage(data.error[0].message)
        }
        
        else{
            setErrMessage(data.msg);
        }
    } 


    return(
        <div className="register-form">
            <div>SIGN UP</div>
            <div className="form-field-register">
                <input value={name} onChange={handleNameChange} placeholder="Full Name" />
                <div>{errMessageName}</div>
            </div>
            <div className="form-field-register">  
                <input value={email} onChange={handleEmailChange} placeholder="Email" />
                <div>{errMessageEmail}</div>  
            </div>
            <div className="form-field-register">
                <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                <div>{errMessagePassword}</div>
            </div>
            <div className="form-field-register">
                <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirmation Password" />
                <div>{errMessageConfirmPassword}</div>
            </div>
            <div className="form-field-register">
                <select value={gender} onChange={handleGenderChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <div>{errMessageGender}</div>
            </div>
            <div className="form-field-button-register">
                <button disabled={disabled} onClick={handleClick}>
                    {loading ? <Spiner w={10} h={10}/>: "Register"}</button>
                <div>{errMessage}</div>
            </div>
            <div>
                <Link to="/login">Click here if you have an account</Link>
            </div>
        </div>
    )

}