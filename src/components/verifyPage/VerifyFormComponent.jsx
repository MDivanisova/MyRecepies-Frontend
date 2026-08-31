import { useState, useRef, useEffect } from "react"
import { verify, resendCode } from "../../utils/UserEndpoints";
import { useNavigate } from "react-router-dom";
import Spiner from "../Spiner";
import "./verifyFormComponent.css"


const CODE_TTL_SECONDS = 60;



export default function VerifyFormComponent({email}){
    const d1 = useRef(null);
    const d2 = useRef(null);
    const d3 = useRef(null);
    const d4 = useRef(null);
    const d5 = useRef(null);
    const d6 = useRef(null);
    const verifyButton = useRef(null);
    const resendCodeButton = useRef(null);
    const errMessage = useRef(null);
    const [verifyMessage, setVerifyMessage] = useState(`Please enter the verification code we sent to ${email}`);
    const code = "";

    const [loadingResend, setLoadingResend] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);


    const [timer, setTimer] = useState(CODE_TTL_SECONDS);

    const navigate = useNavigate();

    function getRemainingSeconds(){
        const sentAt = localStorage.getItem("codeSentAt");
        if(!sentAt) return 0;

        const elapsed = (Date.now() - new Date(sentAt).getTime()) / 1000;
        return Math.max(0, Math.ceil(CODE_TTL_SECONDS - elapsed));
    }

    //on Mount
    useEffect(()=>{
        console.log(email);
        if(email === null){
            navigate('/pageNotFound');
        }
        resendCodeButton.current.disabled = true;
        verifyButton.current.disabled = true;

        if(!localStorage.getItem("codeSentAt")){
            localStorage.setItem("codeSentAt", new Date().toISOString());
        }

        setTimer(getRemainingSeconds());

    },[])

    //on Timer change
    useEffect(() => {
        if (timer <= 0) {
            resendCodeButton.current.disabled = false;
            return;
        }

        const interval = setInterval(() => {
            setTimer(getRemainingSeconds());
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);


    function digitHandler(e){
        
        if(d1.current.value != "" && d2.current.value != "" && d3.current.value != "" && d4.current.value != "" && d5.current.value != "" && d6.current.value != ""){
            verifyButton.current.disabled = false;
        }
        errMessage.current.textContent = "";

        const allowedKeys = ['Backspace', 'Tab', 'Delete'];
        if (allowedKeys.includes(e.key)) return;
        
        // block anything that isn't exactly one digit
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    }

    async function verifyClick(){
        const code = `${d1.current.value}${d2.current.value}${d3.current.value}${d4.current.value}${d5.current.value}${d6.current.value}`;
        
        verifyButton.current.disabled = true;
        
        if(code.length != 6){
            errMessage.current.textContent = "Please enter all 6 digits"
        }
        else {
            errMessage.current.textContent = "";

        setLoadingVerify(true);

        const data = await verify(email, code);

        setLoadingVerify(false);
        if(data === true){
            localStorage.removeItem("codeSentAt")
            navigate(`/login`);
        }

        if(data.status === 500){
                navigate('/internalServerError')
        }
            
            d1.current.value = "";
            d2.current.value = "";
            d3.current.value = "";
            d4.current.value = "";
            d5.current.value = "";
            d6.current.value = "";
            errMessage.current.textContent = data.msg;
        }

    }

    async function resendClick(){
        setLoadingResend(true);
        resendCodeButton.current.disabled = true;

        const data = await resendCode(email);

        setLoadingResend(false);
        if(data === true){
            d1.current.value = "";
            d2.current.value = "";
            d3.current.value = "";
            d4.current.value = "";
            d5.current.value = "";
            d6.current.value = "";
            setVerifyMessage(`A new verification code has been sent to ${email}`);
            
            localStorage.setItem("codeSentAt", new Date().toISOString());
            setTimer(CODE_TTL_SECONDS);
        }
        else{
            if(data.status === 500){
                navigate('/internalServerError')
            }
            localStorage.removeItem("codeSentAt");
            navigate('/register');
        }

    }

    function handleKeyUp1(e){
        if(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab')
            return
        d2.current.focus();
    }
    function handleKeyUp2(e){
        if(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab')
            return
        d3.current.focus();
    }
    function handleKeyUp3(e){
        if(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab')
            return
        d4.current.focus();
    }
    function handleKeyUp4(e){
        if(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab')
            return
        d5.current.focus();
    }
    function handleKeyUp5(e){
        if(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab')
            return
        d6.current.focus();
    }
    function handleKeyUp6(e){
        if(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab')
            return
        verifyButton.current.disabled = false;
        verifyButton.current.focus();
    }

    return(
        <div className="input-field">
            <div className="verify-header">
                <div className="verify-icon">✉</div>
                <h2>Verify your email</h2>
                <p>{verifyMessage}</p>
            </div>
            <div className="verification-code">
                <input ref={d1} type="text" maxLength={1} inputMode="numeric" onKeyDown={digitHandler} onKeyUp={handleKeyUp1}/>
                <input ref={d2} type="text" maxLength={1} inputMode="numeric" onKeyDown={digitHandler} onKeyUp={handleKeyUp2}/>
                <input ref={d3} type="text" maxLength={1} inputMode="numeric" onKeyDown={digitHandler} onKeyUp={handleKeyUp3}/>
                <input ref={d4} type="text" maxLength={1} inputMode="numeric" onKeyDown={digitHandler} onKeyUp={handleKeyUp4}/>
                <input ref={d5} type="text" maxLength={1} inputMode="numeric" onKeyDown={digitHandler} onKeyUp={handleKeyUp5}/>
                <input ref={d6} type="text" maxLength={1} inputMode="numeric" onKeyDown={digitHandler} onKeyUp={handleKeyUp6}/>
            </div>
            <div className="verify-actions">
                <button ref={verifyButton} onClick={verifyClick}>
                    {loadingVerify ? <Spiner w={20} h={20}/>: "Verify"}
                </button>
                <div className="verify-error" ref={errMessage}></div>
                <button className="resend-button" ref={resendCodeButton} onClick={resendClick} disabled={timer > 0}>
                    {loadingResend ? <Spiner w={20} h={20} />: "Resend code"}
                    {timer > 0 ? ` (${timer}s)` : ""}
                </button>
            </div>
        </div>
    )
}