import { useState } from "react";
import "./liveRecepieCard.css";

export default function LiveRecepieCard({
    recipeData,
    currentStep
}) {

    const [isFlipped, setIsFlipped] = useState(false);


    function flipCard() {
        setIsFlipped(prev => !prev);
    }


    function hasValue(value) {

        return (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        );

    }


    function hasArrayValues(array) {

        if (!Array.isArray(array)) {
            return false;
        }

        return array.some(item => {

            if (typeof item === "string") {

                return item.trim() !== "";

            }


            if (item && typeof item === "object") {

                return Object.values(item).some(value =>
                    hasValue(value)
                );

            }


            return false;

        });

    }


    function getArrayValue(item) {

        if (typeof item === "string") {

            return item;

        }


        if (item?.name) {

            return item.name;

        }


        if (item?.value) {

            return item.value;

        }


        return "";

    }


    function getValidArrayItems(array) {

        if (!Array.isArray(array)) {

            return [];

        }


        return array.filter(item =>
            hasValue(getArrayValue(item))
        );

    }


    function renderBubbles(array) {

        const validItems =
            getValidArrayItems(array);


        if (validItems.length === 0) {

            return null;

        }


        return (

            <div className="live-bubbles">

                {validItems.map((item, index) => (

                    <span
                        className="live-bubble"
                        key={index}
                    >

                        {getArrayValue(item)}

                    </span>

                ))}

            </div>

        );

    }


    function renderInfo(label, content) {

        if (!content) {

            return null;

        }


        return (

            <div className="live-info-item">

                <span className="live-label">

                    {label}

                </span>


                {content}

            </div>

        );

    }


    function renderNutrition(label, value, unit) {

        if (!hasValue(value)) {

            return null;

        }


        return (

            <div className="live-nutrition-item">

                <span className="live-nutrition-name">

                    {label}

                </span>


                <span className="live-nutrition-value">

                    {value} {unit}

                </span>

            </div>

        );

    }


    const ingredients =
        Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients.filter(item =>
                hasValue(item.ingredient) ||
                hasValue(item.quantity) ||
                hasValue(item.unit) ||
                hasValue(item.misc)
            )
            : [];


    const instructions =
        Array.isArray(recipeData.instructions)
            ? recipeData.instructions.filter(
                instruction => hasValue(instruction)
            )
            : [];


    const nutrition =
        recipeData.nutrition || {};


    const nutritionItems = [

        renderNutrition(
            "Calories",
            nutrition.calories,
            "kcal"
        ),

        renderNutrition(
            "Protein",
            nutrition.protein,
            "g"
        ),

        renderNutrition(
            "Carbohydrates",
            nutrition.carbohydrates,
            "g"
        ),

        renderNutrition(
            "Fat",
            nutrition.fat,
            "g"
        ),

        renderNutrition(
            "Saturated fat",
            nutrition.saturatedFat,
            "g"
        ),

        renderNutrition(
            "Unsaturated fat",
            nutrition.unsaturatedFat,
            "g"
        ),

        renderNutrition(
            "Fiber",
            nutrition.fiber,
            "g"
        ),

        renderNutrition(
            "Sugar",
            nutrition.sugar,
            "g"
        ),

        renderNutrition(
            "Cholesterol",
            nutrition.cholesterol,
            "mg"
        ),

        renderNutrition(
            "Sodium",
            nutrition.sodium,
            "mg"
        )

    ].filter(Boolean);


    const hasNutrition =
        nutritionItems.length > 0;


    const hasFrontContent =
        hasValue(recipeData.imageUrl) ||
        hasValue(recipeData.recipeName) ||
        hasArrayValues(recipeData.categories) ||
        hasArrayValues(recipeData.cuisines) ||
        hasValue(recipeData.preparationTime) ||
        hasValue(recipeData.cookingTime) ||
        hasArrayValues(recipeData.cookingMethods) ||
        hasArrayValues(recipeData.tools) ||
        hasNutrition;


    const hasBackContent =
        ingredients.length > 0 ||
        instructions.length > 0;


    return (

        <div className="live-card-wrapper">

            <div
                className={`live-recipe-card ${
                    isFlipped ? "flipped" : ""
                }`}
                onClick={flipCard}
            >


                {/* =========================================
                    FRONT
                   ========================================= */}

                <div className="live-card-face live-card-front">


                    {!hasFrontContent ? (

                        <div className="live-empty-state">

                            <div className="live-empty-border">

                                <i className="fa-solid fa-utensils"></i>

                                <span>
                                    Your recipe will be live created here
                                </span>

                            </div>

                        </div>

                    ) : (

                        <>


                            {/* =================================
                                IMAGE + VISIBILITY
                               ================================= */}

                            {hasValue(recipeData.imageUrl) && (

                                <div className="live-image-section">

                                    <img
                                        src={recipeData.imageUrl}
                                        alt={
                                            recipeData.recipeName ||
                                            "Recipe"
                                        }
                                        className="live-recipe-image"
                                    />


                                    {/* PUBLIC / PRIVATE */}

                                    <div className="live-visibility-overlay">

                                        <div
                                            className={`live-visibility ${
                                                recipeData.visibility === "public"
                                                    ? "public"
                                                    : "private"
                                            }`}
                                        >

                                            <i
                                                className={
                                                    recipeData.visibility === "public"
                                                        ? "fa-solid fa-globe"
                                                        : "fa-solid fa-lock"
                                                }
                                            ></i>


                                            {recipeData.visibility}

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================
                                NAME
                               ================================= */}

                            {hasValue(recipeData.recipeName) && (

                                <div className="live-recipe-name">

                                    {recipeData.recipeName}

                                </div>

                            )}


                            {/* =================================
                                INFORMATION
                               ================================= */}

                            <div className="live-info-grid">


                                {/* CATEGORY */}

                                {hasArrayValues(
                                    recipeData.categories
                                ) &&

                                    renderInfo(
                                        "Category",
                                        renderBubbles(
                                            recipeData.categories
                                        )
                                    )

                                }


                                {/* CUISINE */}

                                {hasArrayValues(
                                    recipeData.cuisines
                                ) &&

                                    renderInfo(
                                        "Cuisine",
                                        renderBubbles(
                                            recipeData.cuisines
                                        )
                                    )

                                }


                                {/* PREPARATION TIME */}

                                {hasValue(
                                    recipeData.preparationTime
                                ) &&

                                    renderInfo(
                                        "Preparation time",
                                        <span className="live-value">

                                            {recipeData.preparationTime} min

                                        </span>
                                    )

                                }


                                {/* COOKING TIME */}

                                {hasValue(
                                    recipeData.cookingTime
                                ) &&

                                    renderInfo(
                                        "Cook time",
                                        <span className="live-value">

                                            {recipeData.cookingTime} min

                                        </span>
                                    )

                                }


                                {/* COOKING METHODS */}

                                {hasArrayValues(
                                    recipeData.cookingMethods
                                ) &&

                                    renderInfo(
                                        "Cooking methods",
                                        renderBubbles(
                                            recipeData.cookingMethods
                                        )
                                    )

                                }


                                {/* TOOLS */}

                                {hasArrayValues(
                                    recipeData.tools
                                ) &&

                                    renderInfo(
                                        "Tools",
                                        renderBubbles(
                                            recipeData.tools
                                        )
                                    )

                                }


                            </div>


                            {/* =================================
                                NUTRITION
                               ================================= */}

                            {hasNutrition && (

                                <div className="live-nutrition">

                                    <div className="live-section-title">

                                        Nutrition

                                    </div>


                                    <div className="live-nutrition-grid">

                                        {nutritionItems}

                                    </div>

                                </div>

                            )}

                        </>

                    )}


                    {/* FLIP */}

                    <div className="live-flip-hint">

                        <i className="fa-solid fa-rotate"></i>

                        Click to flip

                    </div>

                </div>



                {/* =========================================
                    BACK
                   ========================================= */}

                <div className="live-card-face live-card-back">


                    {!hasBackContent ? (

                        <div className="live-empty-state">

                            <div className="live-empty-border">

                                <i className="fa-solid fa-utensils"></i>

                                <span>
                                    Your ingredients and instructions will appear here
                                </span>

                            </div>

                        </div>

                    ) : (

                        <div className="live-back-content">


                            {/* =================================
                                INGREDIENTS
                               ================================= */}

                            {ingredients.length > 0 && (

                                <div className="live-back-section">

                                    <div className="live-section-title">

                                        Ingredients

                                    </div>


                                    <div className="live-table">

                                        <div className="live-table-header">

                                            <span>
                                                Ingredient
                                            </span>

                                            <span>
                                                Quantity
                                            </span>

                                            <span>
                                                Unit
                                            </span>

                                            <span>
                                                Misc
                                            </span>

                                        </div>


                                        <div className="live-table-body">

                                            {ingredients.map(
                                                (ingredient, index) => (

                                                    <div
                                                        className="live-table-row"
                                                        key={index}
                                                    >

                                                        <span>

                                                            {
                                                                ingredient.ingredient
                                                            }

                                                        </span>


                                                        <span>

                                                            {
                                                                ingredient.quantity
                                                            }

                                                        </span>


                                                        <span>

                                                            {
                                                                ingredient.unit
                                                            }

                                                        </span>


                                                        <span>

                                                            {
                                                                ingredient.misc
                                                            }

                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}



                            {/* =================================
                                INSTRUCTIONS
                               ================================= */}

                            {instructions.length > 0 && (

                                <div className="live-back-section">

                                    <div className="live-section-title">

                                        Instructions

                                    </div>


                                    <div className="live-instructions-table">

                                        {instructions.map(
                                            (instruction, index) => (

                                                <div
                                                    className="live-instruction-row"
                                                    key={index}
                                                >

                                                    <div className="live-instruction-number">

                                                        {index + 1}

                                                    </div>


                                                    <div className="live-instruction-text">

                                                        {instruction}

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* FLIP */}

                    <div className="live-flip-hint">

                        <i className="fa-solid fa-rotate"></i>

                        Click to flip

                    </div>

                </div>

            </div>

        </div>

    );
}