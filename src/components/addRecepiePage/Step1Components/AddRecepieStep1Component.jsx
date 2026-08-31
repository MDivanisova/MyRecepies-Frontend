import { useMemo, useState } from "react";
import CategoryComponent from "./CategoryCompinent";
import CuisineComponent from "./CuisineComponent";
import "./addRecepieStep1Component.css"

export default function AddRecepieStep1Component({handleChange, recipeData, setRecipeData}){

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

                </div>


                {/* CATEGORY */}

                <CategoryComponent recipeData={recipeData} setRecipeData={setRecipeData}  />

                {/* CUISINE */}

                <CuisineComponent recipeData={recipeData} setRecipeData={setRecipeData} />
            </div>
        </div>

    </>
)
}