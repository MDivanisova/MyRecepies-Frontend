import { useMemo, useState } from "react";
import CategoryComponent from "./CategoryCompinent";
import CuisineComponent from "./CuisineComponent";
import "./addRecepieStep1Component.css"

export default function AddRecepieStep1Component({handleChange, recipeData, setRecipeData, errMessageRecipeName, 
    setErrMessageRecipeName, errMessageCategory, setErrMessageCategory, errMessageCuisine, setErrMessageCuisine}){

    function handleChange(e) {

        const { name, value } = e.target;

        setRecipeData(prev => ({
            ...prev,
            [name]: value
        }));

        if(name === "recipeName"){
            setErrMessageRecipeName(validateRecipeName(value));
        }
    }

      function validateRecipeName(value) {

        const trimmedValue = value.trim();

        if(trimmedValue.length === 0){
            return "recipe name is required";
        }

        if(trimmedValue.length < 3){
            return "name must be at least 3 characters";
        }

        if(trimmedValue.length > 50){
            return "name can't be more than 50 characters";
        }

        return "";
    }


    // function validateCategory(value) {

    //     if(value.length === 0){
    //         return "category is required";
    //     }

    //     return "";
    // }

    // function validateCuisine(value) {

    //     if(value.length === 0){
    //         return "cuisine is required";
    //     }

    //     return "";
    // }


    return (
    <>
        <div className="recipe-step-content">

            <div className="step-heading">

                <span>STEP 1 OF 6</span>

                <h2>Basic Information</h2>

                <p>
                    Start with the basics of your recipe.
                </p>

            </div>


            <div className="basic-information-form">

                {/* RECIPE NAME */}

                <div className="form-field recipe-name-field">

                    <label>Recipe name</label>

                    <input
                        type="text"
                        name="recipeName"
                        value={recipeData.recipeName}
                        onChange={handleChange}
                        placeholder="Enter your recipe name"
                    />
                    <div className="form-error">{errMessageRecipeName}</div>

                </div>


                {/* CATEGORY */}

                <CategoryComponent recipeData={recipeData} setRecipeData={setRecipeData} setErrMessageCategory={setErrMessageCategory} />
                <div className="form-error">
                    {errMessageCategory}
                </div>

                {/* CUISINE */}

                <CuisineComponent recipeData={recipeData} setRecipeData={setRecipeData} setErrMessageCuisine={setErrMessageCuisine} />
                <div className="form-error">
                    {errMessageCuisine}
                </div>
            </div>
        </div>

    </>
)
}