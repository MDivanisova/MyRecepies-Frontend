import "./addRecepieStep2Component.css";
import CookingMethodComponent from "./CookingMethodComponent";
import ToolEquipmentComponent from "./ToolEquipmentComponent";



export default function AddRecepieStep2Component({handleChange,recipeData,setRecipeData})
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
                                onChange={handleChange}
                                onKeyDown={handleNumberKeyDown}
                                placeholder="10"
                                min="0"
                            />

                            <span>min</span>

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
                                onChange={handleChange}
                                onKeyDown={handleNumberKeyDown}
                                placeholder="30"
                                min="0"
                            />

                            <span>min</span>

                        </div>

                    </div>

                </div>


                {/* COOKING METHODS */}

                <CookingMethodComponent
                    recipeData={recipeData}
                    setRecipeData={setRecipeData}
                />


                {/* TOOLS & EQUIPMENT */}

                <ToolEquipmentComponent
                    recipeData={recipeData}
                    setRecipeData={setRecipeData}
                />

            </div>

        </div>
    );
}