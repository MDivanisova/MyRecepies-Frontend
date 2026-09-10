import "./addRecepieStep5Component.css";

export default function AddRecepieStep5Component({handleChange, recipeData, setRecipeData, errMessageNutrition, setErrMessageNutrition})
{

    function handleNutritionChange(e) {

        const { name, value } = e.target;

        if (value !== "" && !/^\d+(\.\d+)?$/.test(value)) {
            return;
        }
        
        setRecipeData(prev => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                [name]: value
            }
        }));
        setErrMessageNutrition(prev => ({
            ...prev,
            [name]:
                value.trim() === ""
                    ? `${name} is required`
                    : ""
        }));
    }
    return (
        <div className="recipe-step-content">

            <div className="step-heading">

                <span>STEP 5 OF 6</span>

                <h2>Nutrition</h2>

                <p>
                    Add the nutritional information for your recipe.
                </p>

            </div>


            <div className="nutrition-section">

                <div className="nutrition-grid">


                    {/* CALORIES */}

                    <div className="nutrition-field">

                        <label>Calories</label>

                        <div className="nutrition-content">

                            <div className="nutrition-input">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="calories"
                                    value={recipeData.nutrition.calories}
                                    onChange={handleNutritionChange}
                                    placeholder="250"
                                />
                                <span>kcal</span>
                            </div>

                            <div className="form-error">
                                {errMessageNutrition.calories}
                            </div>

                        </div>

                    </div>


                    {/* PROTEIN */}
                    <div className="nutrition-field">

                        <label>Protein</label>

                        <div className="nutrition-content">

                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="protein"
                                    value={recipeData.nutrition.protein}
                                    onChange={handleNutritionChange}
                                    placeholder="12"
                                />

                                <span>g</span>

                            </div>

                            <div className="form-error">
                                {errMessageNutrition.protein}
                            </div>

                        </div>

                    </div>


                    {/* CARBOHYDRATES */}

                    <div className="nutrition-field">

                        <label>Carbohydrates</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="carbohydrates"
                                    value={recipeData.nutrition.carbohydrates}
                                    onChange={handleNutritionChange}
                                    placeholder="30"
                                />

                                <span>g</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.carbohydrates}
                            </div>
                        </div>

                    </div>


                    {/* FAT */}

                    <div className="nutrition-field">

                        <label>Fat</label>
                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="fat"
                                    value={recipeData.nutrition.fat}
                                    onChange={handleNutritionChange}
                                    placeholder="8"
                                />

                                <span>g</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.fat}
                            </div>
                        </div>

                    </div>


                    {/* SATURATED FAT */}

                    <div className="nutrition-field">

                        <label>Saturated fat</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="saturatedFat"
                                    value={recipeData.nutrition.saturatedFat}
                                    onChange={handleNutritionChange}
                                    placeholder="3"
                                />

                                <span>g</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.saturatedFat}
                            </div>
                        </div>

                    </div>


                    {/* UNSATURATED FAT */}

                    <div className="nutrition-field">

                        <label>Unsaturated fat</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="unsaturatedFat"
                                    value={recipeData.nutrition.unsaturatedFat}
                                    onChange={handleNutritionChange}
                                    placeholder="5"
                                />

                                <span>g</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.unsaturatedFat}
                            </div>
                        </div>

                    </div>


                    {/* FIBER */}

                    <div className="nutrition-field">

                        <label>Fiber</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="fiber"
                                    value={recipeData.nutrition.fiber}
                                    onChange={handleNutritionChange}
                                    placeholder="4"
                                />

                                <span>g</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.fiber}
                            </div>
                        </div>
                    </div>


                    {/* SUGAR */}

                    <div className="nutrition-field">

                        <label>Sugar</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="sugar"
                                    value={recipeData.nutrition.sugar}
                                    onChange={handleNutritionChange}
                                    placeholder="10"
                                />

                                <span>g</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.sugar}
                            </div>
                        </div>

                    </div>


                    {/* CHOLESTEROL */}

                    <div className="nutrition-field">

                        <label>Cholesterol</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="cholesterol"
                                    value={recipeData.nutrition.cholesterol}
                                    onChange={handleNutritionChange}
                                    placeholder="20"
                                />

                                <span>mg</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.cholesterol}
                            </div>
                        </div>

                    </div>


                    {/* SODIUM */}

                    <div className="nutrition-field">

                        <label>Sodium</label>

                        <div className="nutrition-content">
                            <div className="nutrition-input">

                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="sodium"
                                    value={recipeData.nutrition.sodium}
                                    onChange={handleNutritionChange}
                                    placeholder="200"
                                />

                                <span>mg</span>

                            </div>
                            <div className="form-error">
                                {errMessageNutrition.sodium}
                            </div>
                        </div>

                    </div>


                </div>

            </div>
        </div>
    );
}