import "./addRecepieStep6Component.css";

export default function AddRecepieStep6Component({handleChange, recipeData, setRecipeData, errMessageImageUrl,setErrMessageImageUrl})
{

    function handleImageUrlChange(e) {

        const { value } = e.target;

        handleChange(e);

        if (value.trim() === "") {
            setErrMessageImageUrl("image URL is required");
            return;
        }

        setErrMessageImageUrl("");
    }


    return (
        <div className="recipe-step-content">

            <div className="step-heading">

                <span>STEP 6 OF 6</span>

                <h2>Final Details</h2>

                <p>
                    Add the final details and choose how your recipe will be shared.
                </p>

            </div>


            <div className="step6-section">

                {/* IMAGE */}

                <div className="step6-image-card">

                    <div className="step6-card-title">

                        <i className="fa-solid fa-image"></i>

                        <span>Recipe Image</span>

                    </div>

                    <p className="step6-card-description">
                        Add the URL of an image that represents your recipe.
                    </p>


                    <div className="step6-form-field">

                        <label>Recipe image URL</label>

                        <input
                            type="url"
                            name="imageUrl"
                            value={recipeData.imageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="https://example.com/recipe-image.jpg"
                        />
                    </div>
                    <div className="form-error">
                        {errMessageImageUrl}
                    </div>

                </div>


                {/* VISIBILITY */}

                <div className="step6-visibility-card">

                    <div className="step6-card-title">

                        <i className="fa-solid fa-eye"></i>

                        <span>Recipe Visibility</span>

                    </div>

                    <p className="step6-card-description">
                        Choose who can see your recipe.
                    </p>


                    <div className="step6-visibility-options">

                        <label
                            className={`step6-visibility-option ${
                                recipeData.visibility === "public"
                                    ? "selected"
                                    : ""
                            }`}
                        >

                            <input
                                type="radio"
                                name="visibility"
                                value="public"
                                checked={
                                    recipeData.visibility === "public"
                                }
                                onChange={handleChange}
                            />

                            <div className="step6-visibility-icon">
                                <i className="fa-solid fa-earth-americas"></i>
                            </div>

                            <div className="step6-visibility-text">

                                <strong>Public</strong>

                                <span>
                                    Anyone can see this recipe.
                                </span>

                            </div>

                            <div className="step6-radio">
                                <span></span>
                            </div>

                        </label>


                        <label
                            className={`step6-visibility-option ${
                                recipeData.visibility === "private"
                                    ? "selected"
                                    : ""
                            }`}
                        >

                            <input
                                type="radio"
                                name="visibility"
                                value="private"
                                checked={
                                    recipeData.visibility === "private"
                                }
                                onChange={handleChange}
                            />

                            <div className="step6-visibility-icon">
                                <i className="fa-solid fa-lock"></i>
                            </div>

                            <div className="step6-visibility-text">

                                <strong>Private</strong>

                                <span>
                                    Only you can see this recipe.
                                </span>

                            </div>

                            <div className="step6-radio">
                                <span></span>
                            </div>

                        </label>

                    </div>

                </div>

            </div>

        </div>
    );
}