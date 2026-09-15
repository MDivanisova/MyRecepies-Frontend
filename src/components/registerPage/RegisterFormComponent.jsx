import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/UserEndpoints.js"
import Spinner from "../Spiner.jsx";
import "./registerFormComponent.css"

export default function RegisterFormComponent(){

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("Not disclosed");


    const [errMessageName, setErrMessageName] = useState("");
    const [errMessageSurname, setErrMessageSurname] = useState("");
    const [errMessageEmail, setErrMessageEmail] = useState("");
    const [errMessagePassword, setErrMessagePassword] = useState("");
    const [errMessageGender, setErrMessageGender] = useState("");
    const [errMessageConfirmPassword, setErrMessageConfirmPassword] = useState("");

    const [errMessage, setErrMessage] = useState("");
    const [disabled, setDisabled] = useState(true);

    const [loading, setLoading] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);
    const genderRef = useRef(null);

    const navigate = useNavigate();


    function validateName(value){
        const trimmedValue = value.trim();
        if(trimmedValue.length === 0){
            return "name is required";
        }
        if(trimmedValue.length < 3){
            return "name must be at least 3 characters";
        }
        if(trimmedValue.length > 50){
            return "name can't be more than 50 characters";
        }
        return "";
    }

    function validateSurname(value){
        const trimmedValue = value.trim();
        if(trimmedValue.length === 0){
            return "surname is required";
        }
        if(trimmedValue.length < 3){
            return "surname must be at least 3 characters";
        }
        if(trimmedValue.length > 50){
            return "surname can't be more than 50 characters";
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
        const allFilled = !errMessageEmail && !errMessageName && !errMessageSurname  && !errMessagePassword && !errMessageConfirmPassword && !errMessageGender &&
                            name.trim().length > 0 && surname.trim().length > 0 && email.trim().length > 0 && password.length > 0 && confirmPassword.length > 0;

        setDisabled(!allFilled);
    },[name, surname, email, password, gender, confirmPassword])


    useEffect(()=>{
        setDisabled(true)
    },[])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (genderRef.current && !genderRef.current.contains(e.target)) {
                setGenderOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    function handleNameChange(e) {
        const value = e.target.value;
        setName(value);
        setErrMessageName(validateName(value));
    }

    function handleSurnameChange(e) {
        const value = e.target.value;
        setSurname(value);
        setErrMessageSurname(validateSurname(value));
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

    async function handleClick() {
        setDisabled(true);
        setErrMessage("");

        setLoading(true);


        const fullName = `${name.trim()} ${surname.trim()}`;

        let data;
         if(gender === "Not disclosed"){
            data = await register(
                fullName,
                email,
                password
            );
        } else{
            data = await register(
                fullName,
                email,
                password,
                gender
            );
        }

        setLoading(false);
        if(data === true){
            localStorage.setItem("codeSentAt", new Date().toISOString());
            navigate(`/verify?email=${email}`);
        }

        if(data.status === 500){
            navigate('/internalServerError')
        }

        if(data.error !== undefined){
            setErrMessage(data.error[0].message)
        }
        else{
            setErrMessage(data.msg);
        }
    } 


    return(
        <div className="register-form">
            <div>SIGN UP</div>
            <div className="name-field-register">
                {/* <input value={name} onChange={handleNameChange} placeholder="Full Name" />
                <div>{errMessageName}</div> */}
                <div className="form-field-register">
                    <input value={name} onChange={handleNameChange} placeholder="Name" />
                    <div>{errMessageName}</div>
                </div>
                <div className="form-field-register">
                    <input value={surname} onChange={handleSurnameChange} placeholder="Surname"
                    />
                    <div>{errMessageSurname}</div>
                </div>
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
            <div className="custom-gender-select-wrapper">
                <div
                    className={`custom-gender-select ${
                        genderOpen
                            ? "open"
                            : ""
                    }`}
                    onClick={() =>
                        setGenderOpen(
                            prev => !prev
                        )
                    }
                >

                    <span>

                        {
                            gender === "female" ? "Female" : (gender === "male" ? "Male": "Not disclosed")
                        }

                    </span>

                    <i className="fa-solid fa-chevron-down"></i>

                </div>


                {
                    genderOpen && (

                        <div className="custom-gender-select-options">

                            <div
                                className={`custom-gender-option ${
                                    gender === "male"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {

                                    setGender("male");

                                    setGenderOpen(false);

                                }}
                            >

                                <span>
                                    Male
                                </span>

                                {
                                    gender === "male" && (
                                        <i className="fa-solid fa-check"></i>
                                    )
                                }

                            </div>


                            <div
                                className={`custom-gender-option ${
                                    gender === "female"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {

                                    setGender("female");

                                    setGenderOpen(false);

                                }}
                            >

                                <span>
                                    Female
                                </span>

                                {
                                    gender === "female" && (
                                        <i className="fa-solid fa-check"></i>
                                    )
                                }

                            </div>
                            
                            <div
                                className={`custom-gender-option ${
                                    gender === "Not disclosed"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {

                                    setGender("Not disclosed");

                                    setGenderOpen(false);

                                }}
                            >

                                <span>
                                    Not disclosed
                                </span>

                                {
                                    gender === "Not disclosed" && (
                                        <i className="fa-solid fa-check"></i>
                                    )
                                }

                            </div>

                        </div>

                    )
                }
                <div>{errMessageGender}</div>
            </div>
            <div className="form-field-button-register">
                <button disabled={disabled} onClick={handleClick}>
                    {loading ? <Spinner w={10} h={10}/>: "Register"}</button>
                <div>{errMessage}</div>
            </div>
            <div>
                <Link to="/login">Click here if you have an account</Link>
            </div>
        </div>
    )

}