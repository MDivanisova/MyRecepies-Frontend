import { useNavigate } from "react-router-dom";
import "./topGlobalRecipesStatisticComponent.css";
import { useState } from "react";

export default function TopGlobalRecipesStatisticComponent({ statisticType, period, statistics}) {

    const navigate = useNavigate();

    const [profileLoading, setProfileLoading] = useState(false);

    const periodText = period === 1 ? `Last ${period} month` : `Last ${period} months`;

    const statisticText = statisticType === "rating" ? "Rating" : "Bookmarks";


    // =========================================================
    // GLOBAL TOP RECIPES
    // =========================================================

    const globalRecipes = statisticType === "rating" ? statistics?.globalTopRecipes || [] : statistics?.globalTopBookmarked || [];


    // =========================================================
    // ALL USER TOP RECIPES
    // =========================================================

    const userRecipes = statisticType === "rating" ? statistics?.userTopRecipes || [] : statistics?.userTopBookmarked || [];


    // =========================================================
    // USER'S BEST RECIPE
    // =========================================================

    let userBestRecipe = null;

    if (statisticType === "rating") {
        userBestRecipe = statistics?.userTopRecipes?.[0] || null;

    } else {
        userBestRecipe = statistics?.userBestBookmarked || null;
    }


    // =========================================================
    // CHECK IF RECIPE BELONGS TO USER
    // =========================================================

    const isUserRecipe = (recipeId) => {

        if (!recipeId) {
            return false;
        }

        return userRecipes.some(item => {

            const userRecipeId = item.recipe?._id?.toString();

            return userRecipeId === recipeId.toString();
        });
    };


    // =========================================================
    // CHECK IF ANY USER RECIPE IS ALREADY IN GLOBAL TOP N
    // =========================================================

    const hasUserRecipeInGlobalTop =
        globalRecipes.some(item => {
            const recipeId = item.recipe?._id?.toString();

            return isUserRecipe(recipeId);
        });


    // =========================================================
    // USER BEST RECIPE OUTSIDE TOP N
    // =========================================================

    let userRecipeOutside = null;


    if (!hasUserRecipeInGlobalTop) {

        if (statisticType === "rating") {
            const outside = statistics?.userTopRecipeGlobalPosition;

            if (
                outside &&
                outside.position &&
                outside.recipe
            ) {
                userRecipeOutside = outside;
            }

        } else {
            const outside = statistics?.userBestBookmarked;

            if (
                outside &&
                outside.position &&
                outside.recipe
            ) {
                userRecipeOutside = outside;
            }
        }
    }


    // =========================================================
    // STATISTIC VALUE
    // =========================================================

    const getStatisticValue = (item) => {

        if (statisticType === "rating") {

            const rating =
                item.recipe?.rating?.$numberDecimal ??
                item.recipe?.rating ??
                0;

            return (
                <>
                    <i className="fa-solid fa-star"></i>

                    {Number(rating).toFixed(1)}
                </>
            );
        }

        return (
            <>
                <i className="fa-solid fa-bookmark"></i>

                {Number(
                    item.numberBookmarks || 0
                )}
            </>
        );
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="top-global-recipes-statistic">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="top-global-recipes-header">

                <div className="top-global-recipes-title">

                    <div className="top-global-recipes-title-icon">

                        <i className="fa-solid fa-globe"></i>

                    </div>

                    <div className="top-global-recipes-title-content">

                        <h3>
                            TOP GLOBAL RECIPES
                        </h3>

                        <span>
                            {periodText} · {statisticText}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                GLOBAL LIST
            ===================================================== */}

            <div className="top-global-recipes-list">

                {globalRecipes.length > 0 ? (

                    globalRecipes.map((item, index) => {
                        const recipe = item.recipe;
                        const creator = item.creator;
                        const recipeId = recipe?._id?.toString();

                        const userRecipe = isUserRecipe(recipeId);


                        return (

                            <div
                                className={`top-global-recipe-item ${
                                    userRecipe
                                        ? "user-recipe"
                                        : ""
                                }`}
                                key={recipe?._id || index}
                                onClick={(event)=>{
                                    event.stopPropagation();

                                        if (!recipe._id || profileLoading) {
                                            return;
                                        }

                                        setProfileLoading(true);
                                        navigate(`/recipe/details/${recipe._id}`);}
                                    }
                            >

                                {/* RANK */}

                                <div className="top-global-recipe-rank">

                                    #{item.position || index + 1}

                                </div>


                                {/* RECIPE INFO */}

                                <div className="top-global-recipe-info">

                                    <span className="top-global-recipe-name">

                                        {recipe?.name || "Unknown recipe" }

                                    </span>


                                    <span className="top-global-recipe-creator" onClick={(event)=>{
                                        event.stopPropagation();

                                        if (!creator || profileLoading) {
                                            return;
                                        }

                                        setProfileLoading(true);
                                        navigate(`/profile/${creator._id}`);}
                                        }>

                                        Creator:{" "}

                                        {creator?.name || recipe?.creator?.name || "Anonimus" }

                                    </span>

                                </div>


                                {/* STATISTIC */}

                                <div className="top-global-recipe-statistic">

                                    {getStatisticValue(item)}

                                </div>

                            </div>
                        );
                    })

                ) : (

                    <div className="top-global-recipes-empty">

                        <i className="fa-solid fa-globe"></i>

                        <span>
                            No global recipes found for this period.
                        </span>

                    </div>

                )}


                {/* =================================================
                    USER BEST RECIPE OUTSIDE TOP N
                ================================================= */}

                {userRecipeOutside && (

                    <>

                        <div className="top-global-recipe-dots">
                            ...
                        </div>


                        <div className="top-global-recipe-item user-recipe">

                            {/* POSITION */}

                            <div className="top-global-recipe-rank">

                                #{userRecipeOutside.position}

                            </div>


                            {/* RECIPE INFO */}

                            <div className="top-global-recipe-info">

                                <span className="top-global-recipe-name">

                                    {userRecipeOutside.recipe?.name ||
                                        "Unknown recipe"
                                    }

                                </span>


                                <span className="top-global-recipe-creator">

                                    Creator:{" "}

                                    {userRecipeOutside.creator?.name ||
                                        userRecipeOutside.recipe?.creator?.name ||
                                        "Unknown"
                                    }

                                </span>

                            </div>


                            {/* STATISTIC */}

                            <div className="top-global-recipe-statistic">

                                {getStatisticValue(
                                    userRecipeOutside
                                )}

                            </div>

                        </div>

                    </>

                )}

            </div>

        </div>
    );
}