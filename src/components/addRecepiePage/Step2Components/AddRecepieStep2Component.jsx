import "./addRecepieStep2Component.css";
import CookingMethodComponent from "./CookingMethodComponent";
import ToolEquipmentComponent from "./ToolEquipmentComponent";



export default function AddRecepieStep2Component({
    handleChange, 
    recipeData, 
    setRecipeData, 
    errMessagePreparationTime,
    setErrMessagePreparationTime,
    errMessageCookingTime,
    setErrMessageCookingTime,
    errMessageCookingMethod,
    setErrMessageCookingMethod,
    errMessageTools,
    setErrMessageTools})
{

    function handleNumberKeyDown(e) {

        const allowedKeys = [
            "Backspace",
            "Delete",
            "Tab",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End"
        ];

        if (
            !/^[0-9]$/.test(e.key) &&
            !allowedKeys.includes(e.key)
        ) {
            e.preventDefault();
        }
    }

    function validatePrepTime(value) {

        if(value === "" || Number(value) < 0){
            return "Prep time is required";
        }

        return "";
    }
    function validateCookTime(value) {

        if(value === "" || Number(value) < 0){
            return "Cook time is required";
        }

        return "";
    }
    // function validateCookingMethod(value) {

    //     if(value.length === 0){
    //         return "Cooking method is required";
    //     }

    //     return "";
    // }

    // function validateTools(value) {

    //     if(value.length === 0){
    //         return "Tools are required";
    //     }

    //     return "";
    // }

    function handleTimeChange(e) {

        handleChange(e);

        const { name, value } = e.target;

        if(name === "preparationTime"){
            setErrMessagePreparationTime(validatePrepTime(value));
        }

        if(name === "cookingTime"){
            setErrMessageCookingTime(validateCookTime(value));
        }
    }

    return (
        <div className="recipe-step-content">

            <div className="step-heading">

                <span>STEP 2 OF 6</span>

                <h2>Time & Cooking Details</h2>

                <p>
                    Tell us how this recipe is prepared.
                </p>

            </div>


            <div className="step2-form">

                {/* PREPARATION + COOKING TIME */}

                <div className="time-fields">

                    <div className="form-field">

                        <label>
                            Preparation time
                        </label>

                        <div className="input-with-unit">

                            <input
                                type="number"
                                name="preparationTime"
                                value={recipeData.preparationTime}
                                onChange={handleTimeChange}
                                onKeyDown={handleNumberKeyDown}
                                placeholder="10"
                                min="0"
                            />

                            <span>min</span>

                        </div>
                        <div className="form-error">
                            {errMessagePreparationTime}
                        </div>

                    </div>


                    <div className="form-field">

                        <label>
                            Cooking time
                        </label>

                        <div className="input-with-unit">

                            <input
                                type="number"
                                name="cookingTime"
                                value={recipeData.cookingTime}
                                onChange={handleTimeChange}
                                onKeyDown={handleNumberKeyDown}
                                placeholder="30"
                                min="0"
                            />

                            <span>min</span>

                        </div>
                        <div className="form-error">
                            {errMessageCookingTime}
                        </div>

                    </div>

                </div>


                {/* COOKING METHODS */}

                <CookingMethodComponent
                    recipeData={recipeData}
                    setRecipeData={setRecipeData}
                    setErrMessageCookingMethod={setErrMessageCookingMethod}
                />
                <div className="form-error">
                    {errMessageCookingMethod}
                </div>


                {/* TOOLS & EQUIPMENT */}

                <ToolEquipmentComponent
                    recipeData={recipeData}
                    setRecipeData={setRecipeData}
                    setErrMessageTools={setErrMessageTools}
                />
                <div className="form-error">
                    {errMessageTools}
                </div>

            </div>

        </div>
    );
}