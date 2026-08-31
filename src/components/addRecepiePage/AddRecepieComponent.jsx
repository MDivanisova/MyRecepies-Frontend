import { useEffect, useRef, useState } from "react";

import "./addRecepieComponent.css";

import AddRecepieStep1Component from "./Step1Components/AddRecepieStep1Component";
import AddRecepieStep2Component from "./Step2Components/AddRecepieStep2Component";
import AddRecepieStep3Component from "./Step3Components/AddRecepieStep3Component";
import AddRecepieStep4Component from "./Step4Components/AddrecepieStep4Component";
import AddRecepieStep5Component from "./Step5Components/AddRecepieStep5Component";
import AddRecepieStep6Component from "./Step6Components/AddRecepieStep6Component";
import AddRecepieStep7Component from "./Step7Components/AddRecepieStep7Component";

import { createRecepie } from "../../utils/RecepieEndpoint";
import { useAuth } from "../../context/useAuth";
import { useNavigate} from "react-router-dom";


export default function AddRecepieComponent() {

    const [currentStep, setCurrentStep] = useState(1);

    const {token, logout} = useAuth();
    
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState([]);

    const recepieId = useRef("");


    const [recipeData, setRecipeData] = useState({

        recipeName: "",

        categories: [],

        cuisines: [],


        preparationTime: "",

        cookingTime: "",

        cookingMethods: [],

        tools: [],


        ingredients: [

            {
                ingredient: "",
                quantity: "",
                unit: "",
                misc: ""
            }

        ],


        instructions: [""],


        nutrition: {

            calories: "",
            protein: "",
            carbohydrates: "",
            fat: "",
            saturatedFat: "",
            unsaturatedFat: "",
            fiber: "",
            sugar: "",
            cholesterol: "",
            sodium: ""

        },


        imageUrl: "",

        visibility: "private"

    });


    function resetForm() {

    setCurrentStep(1);

    setErrors([]);

    recepieId.current = "";

    setRecipeData({
        recipeName: "",
        categories: [],
        cuisines: [],
        preparationTime: "",
        cookingTime: "",
        cookingMethods: [],
        tools: [],
        ingredients: [
            { ingredient: "", quantity: "", unit: "", misc: "" }
        ],
        instructions: [""],
        nutrition: {
            calories: "",
            protein: "",
            carbohydrates: "",
            fat: "",
            saturatedFat: "",
            unsaturatedFat: "",
            fiber: "",
            sugar: "",
            cholesterol: "",
            sodium: ""
        },
        imageUrl: "",
        visibility: "private"
    });

}



    /* =========================
       HANDLE CHANGE
    ========================= */

    function handleChange(e) {

        const { name, value } = e.target;

        setRecipeData(prev => ({

            ...prev,

            [name]: value

        }));

    }


    function transformFieldName(fieldName){
        const parts = fieldName.toUpperCase().split(".");
        
        if(parts.length === 2){
            return <span style={{ color: "red" }}>
                    {parts[1]}
                </span>
        }
        else if(parts.length === 3){
            return (
            <>
                In row {Number(parts[1]) + 1}{" "}
                <span style={{ color: "red" }}>
                    {parts[2]}
                </span>
            </>
        )
        }
        return <><span style={{ color: "red" }}>
                    {fieldName.toUpperCase()}
                </span></>
    }

    /* =========================
       NEXT STEP
    ========================= */

    function nextStep() {

        if (currentStep < 7) {

            setCurrentStep(prev => prev + 1);

        }

    }



    /* =========================
       PREVIOUS STEP
    ========================= */

    function previousStep() {

        if (currentStep > 1) {

            setCurrentStep(prev => prev - 1);

        }

    }



    /* =========================
       FINISH
    ========================= */

    async function finishRecipe() {


            setLoading(true);

            setErrors([]);


            const data = await createRecepie(token, recipeData);


            if (data.succ === true) {

                recepieId.current = data.id;

                nextStep();
            }


            else if (data.status === 400) {
                setErrors(data.error);

            }


            else if (data.status === 401) {
                logout();
                alert("Your token has expired please login again.")
                navigate('/login')  
            }


            else if (data.status === 500) {
                navigate('/internalServerError')
            }

        setLoading(false);

    }



    /* =========================
       PROGRESS
    ========================= */

    const progress =
        Math.round(((currentStep - 1) / 6) * 100);



    return (

        <div className="add-recepie-component">


            {/* =========================
                HEADER
            ========================= */}

            <div className="add-recepie-header">

                <div className="add-recepie-title">

                    <i className="fa-solid fa-utensils"></i>

                    <span></span>

                    <h1>ADD NEW RECIPE</h1>

                    <span></span>

                    <i className="fa-solid fa-utensils"></i>

                </div>


                <p>
                    Let's make something delicious
                </p>

            </div>



            {/* =========================
                COMPLETENESS
            ========================= */}

            <div className="recipe-completeness">


                <div className="completeness-top">


                    <div className="completeness-left">

                        <h2>
                            Recipe Completeness
                        </h2>

                        <p>
                            Complete the information below to create your recipe
                        </p>

                    </div>



                    <div className="completeness-progress">

                        <span>
                            {progress}%
                        </span>

                        <p>
                            Recipe Progress
                        </p>

                    </div>


                </div>



                {/* =========================
                    PROGRESS BAR
                ========================= */}

                <div className="progress-bar">

                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progress}%`
                        }}
                    ></div>

                </div>



                {/* =========================
                    STEPS
                ========================= */}

                <div className="recipe-steps">


                    <div
                        className={`recipe-step ${
                            currentStep >= 1
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Basic Information
                        </span>

                    </div>



                    <div
                        className={`recipe-step ${
                            currentStep >= 2
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Cooking Details
                        </span>

                    </div>



                    <div
                        className={`recipe-step ${
                            currentStep >= 3
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Ingredients
                        </span>

                    </div>



                    <div
                        className={`recipe-step ${
                            currentStep >= 4
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Instructions
                        </span>

                    </div>



                    <div
                        className={`recipe-step ${
                            currentStep >= 5
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Nutrition
                        </span>

                    </div>



                    <div
                        className={`recipe-step ${
                            currentStep >= 6
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Final Details
                        </span>

                    </div>



                    <div
                        className={`recipe-step ${
                            currentStep >= 7
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-circle"></span>

                        <span>
                            Finish
                        </span>

                    </div>


                </div>

            </div>



            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div
                className={`recipe-form-sections ${
                    errors.length > 0
                        ? "has-errors"
                        : "no-errors"
                }`}
            >


                {/* =========================
                    LEFT SIDE - FORM
                ========================= */}

                <div className="recipe-form-card-left">


                    {/* =========================
                        STEP 1
                    ========================= */}

                    {currentStep === 1 && (

                        <AddRecepieStep1Component

                            recipeData={recipeData}

                            handleChange={handleChange}

                            setRecipeData={setRecipeData}

                        />

                    )}



                    {/* =========================
                        STEP 2
                    ========================= */}

                    {currentStep === 2 && (

                        <AddRecepieStep2Component

                            recipeData={recipeData}

                            handleChange={handleChange}

                            setRecipeData={setRecipeData}

                        />

                    )}



                    {/* =========================
                        STEP 3
                    ========================= */}

                    {currentStep === 3 && (

                        <AddRecepieStep3Component

                            recipeData={recipeData}

                            handleChange={handleChange}

                            setRecipeData={setRecipeData}

                        />

                    )}



                    {/* =========================
                        STEP 4
                    ========================= */}

                    {currentStep === 4 && (

                        <AddRecepieStep4Component

                            recipeData={recipeData}

                            handleChange={handleChange}

                            setRecipeData={setRecipeData}

                        />

                    )}



                    {/* =========================
                        STEP 5
                    ========================= */}

                    {currentStep === 5 && (

                        <AddRecepieStep5Component

                            recipeData={recipeData}

                            handleChange={handleChange}

                            setRecipeData={setRecipeData}

                        />

                    )}



                    {/* =========================
                        STEP 6
                    ========================= */}

                    {currentStep === 6 && (

                        <AddRecepieStep6Component

                            recipeData={recipeData}

                            handleChange={handleChange}

                            setRecipeData={setRecipeData}


                        />

                    )}



                    {/* =========================
                        STEP 7
                    ========================= */}

                    {currentStep === 7 && (

                        <AddRecepieStep7Component recepieId={recepieId} resetForm={resetForm} />

                    )}



                    {/* =========================
                        NAVIGATION
                    ========================= */}

                    <div className="step-navigation">


                        {/* BACK */}

                        {currentStep > 1 && currentStep < 7 && (

                            <button
                                type="button"
                                className="back-button"
                                onClick={previousStep}
                            >

                                <i className="fa-solid fa-arrow-left"></i>

                                Back

                            </button>

                        )}



                        {/* CONTINUE */}

                        {currentStep < 6 && (

                            <button
                                type="button"
                                className="continue-button"
                                onClick={nextStep}
                            >

                                Continue

                                <i className="fa-solid fa-arrow-right"></i>

                            </button>

                        )}



                        {/* FINISH */}

                        {currentStep === 6 && (

                            <button
                                type="button"
                                className="finish-button"
                                onClick={finishRecipe}
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : "Finish"
                                }

                                {!loading && (
                                    <i className="fa-solid fa-check"></i>
                                )}

                            </button>

                        )}


                    </div>


                </div>



                {/* =========================
                    RIGHT SIDE - ERRORS
                ========================= */}

                {errors.length > 0 && (

                    <div className="recipe-form-card-right">

                        <div className="recipe-errors">

                            <div className="recipe-errors-header">

                                <i className="fa-solid fa-circle-exclamation"></i>

                                <h2>
                                    Please fix the following
                                </h2>

                            </div>


                            <div className="recipe-errors-list">

                                {errors.map((error, index) => (

                                    <div
                                        className="recipe-error"
                                        key={index}
                                    >

                                        <i className="fa-solid fa-xmark"></i>

                                        <span>
                                            <span>Field: <strong>{transformFieldName(error.field)}</strong></span> <i className="fa-solid fa-arrow-right-long"></i> {error.message}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                )}


            </div>


        </div>

    );

}