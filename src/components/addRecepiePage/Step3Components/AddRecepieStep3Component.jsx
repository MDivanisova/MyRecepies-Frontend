import { useEffect, useRef } from "react";
import "./addRecepieStep3Component.css";

export default function AddRecepieStep3Component({handleChange,recipeData,setRecipeData}) 
{

    const ingredientsListRef = useRef(null);

    // Make sure there are initially at least 3 ingredient rows
    useEffect(() => {

        if (recipeData.ingredients.length < 6) {

            setRecipeData(prev => ({
                ...prev,

                ingredients: [
                    ...prev.ingredients,
                ]
            }));

        }

    }, []);


    function addIngredient() {

        setRecipeData(prev => ({
            ...prev,

            ingredients: [
                ...prev.ingredients,
                {
                    ingredient: "",
                    quantity: "",
                    unit: "",
                    misc: ""
                }
            ]
        }));

        setTimeout(() => {

            ingredientsListRef.current?.scrollTo({
                top: ingredientsListRef.current.scrollHeight,
                behavior: "smooth"
            });

        }, 0);
    }


    function updateIngredient(index, field, value) {

        setRecipeData(prev => {

            const ingredients = [...prev.ingredients];

            ingredients[index] = {
                ...ingredients[index],
                [field]: value
            };

            return {
                ...prev,
                ingredients
            };

        });

    }


    function removeIngredient(index) {

        setRecipeData(prev => {

            // Always keep at least one row
            if (prev.ingredients.length <= 1) {
                return prev;
            }

            return {
                ...prev,

                ingredients: prev.ingredients.filter(
                    (_, i) => i !== index
                )
            };

        });

    }


    function handleQuantityChange(index, value) {

        // Dozvoli prazno pole dodeka se vnesuva
        if (value === "") {
            updateIngredient(index, "quantity", value);
            return;
        }

        // Mora da ima brojka pred i posle tockata
        if (!/^\d+(\.\d+)?$/.test(value)) {
            return;
        }

        updateIngredient(
            index,
            "quantity",
            value
        );
    }


    function handleTextChange(index, field, value) {

        // Do not allow numbers in text fields
        if (/\d/.test(value)) {
            return;
        }

        updateIngredient(
            index,
            field,
            value
        );

    }


    return (

        <div className="recipe-step-content">

            <div className="step-heading">

                <span>STEP 3 OF 6</span>

                <h2>Ingredients</h2>

                <p>
                    Add everything needed to prepare your recipe.
                </p>

            </div>


            <div className="ingredients-section">

                <div className="ingredients-table">

                    {/* HEADER */}

                    <div className="ingredient-row ingredient-header">

                        <span>Ingredient</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span>Misc</span>
                        <span></span>

                    </div>


                    {/* INGREDIENTS */}

                    <div className="ingredients-list" ref={ingredientsListRef}>

                        {recipeData.ingredients.map(
                            (item, index) => (

                            <div
                                className="ingredient-row"
                                key={index}
                            >

                                {/* INGREDIENT */}

                                <input
                                    type="text"
                                    value={item.ingredient}
                                    placeholder="Ingredient"
                                    onChange={(e) =>
                                        handleTextChange(
                                            index,
                                            "ingredient",
                                            e.target.value
                                        )
                                    }
                                />


                                {/* QUANTITY */}

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={item.quantity}
                                    placeholder="Quantity"
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />


                                {/* UNIT */}

                                <input
                                    type="text"
                                    value={item.unit}
                                    placeholder="Unit"
                                    onChange={(e) =>
                                        handleTextChange(
                                            index,
                                            "unit",
                                            e.target.value
                                        )
                                    }
                                />


                                {/* MISC */}

                                <input
                                    type="text"
                                    value={item.misc}
                                    placeholder="Misc"
                                    onChange={(e) =>
                                        handleTextChange(
                                            index,
                                            "misc",
                                            e.target.value
                                        )
                                    }
                                />


                                {/* DELETE */}

                                <button
                                    type="button"
                                    className="remove-ingredient-button"
                                    onClick={() =>
                                        removeIngredient(index)
                                    }
                                    title="Remove ingredient"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ADD INGREDIENT */}

                <button
                    type="button"
                    className="add-item-button add-ingredient-button"
                    onClick={addIngredient}
                >
                    <i className="fa-solid fa-plus"></i>
                    Add ingredient
                </button>

            </div>

        </div>

    );

}