import { useNavigate } from "react-router-dom";
import "./topRecipesStatisticComponent.css";
import { useState } from "react";

export default function TopRecipesStatisticComponent({ statisticType, period, recipes = []}) {


    const navigate = useNavigate();
    const [profileLoading, setProfileLoading] = useState(false);

    const periodText =
        period === 1
            ? `Last ${period} month`
            : `Last ${period} months`;


    const statisticText =
        statisticType === "rating"
            ? "Rating"
            : "Bookmarks";


    /* =========================================================
       STATISTIC VALUE
    ========================================================= */

    const getStatisticValue = (item) => {

        if (statisticType === "rating") {

            return (
                <>
                    <i className="fa-solid fa-star"></i>

                    {
                        item.recipe?.rating.$numberDecimal
                    }
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


    return (

        <div className="top-recipes-statistic">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="top-recipes-header">

                <div className="top-recipes-title">


                    {/* ICON */}

                    <div className="top-recipes-title-icon">

                        <i
                            className={
                                statisticType === "rating"
                                    ? "fa-solid fa-trophy"
                                    : "fa-solid fa-bookmark"
                            }
                        ></i>

                    </div>


                    {/* TITLE */}

                    <div className="top-recipes-title-content">

                        <h3>
                            YOUR TOP RECIPES
                        </h3>

                        <span>
                            {periodText} · {statisticText}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                RECIPES LIST
            ===================================================== */}

            <div className="top-recipes-list">


                {recipes.length > 0 ? (

                    recipes.map((item, index) => {

                        const recipe =
                            item.recipe;


                        const creator =
                            item.creator;


                        return (

                            <div
                                className="top-recipe-item"
                                key={
                                    recipe?._id ||
                                    item.recipeId ||
                                    index
                                }
                                onClick={(event)=>{
                                    event.stopPropagation();

                                        if (!recipe._id || profileLoading) {
                                            return;
                                        }

                                        setProfileLoading(true);
                                    navigate(`/recipe/details/${recipe._id}`);
                                }}
                                
                            >


                                {/* =================================
                                    POSITION
                                ================================= */}

                                <div className="top-recipe-rank">

                                    #{item.position || index + 1}

                                </div>


                                {/* =================================
                                    RECIPE INFORMATION
                                ================================= */}

                                <div className="top-recipe-info">

                                    <span className="top-recipe-name">

                                        {recipe?.name ||
                                            "Unknown recipe"
                                        }

                                    </span>


                                    <span className="top-recipe-creator" onClick={(event)=>{
                                        event.stopPropagation();

                                        if (!creator || profileLoading) {
                                            return;
                                        }

                                        setProfileLoading(true);
                                        
                                        navigate(`/profile/${creator._id}`);}

                                        }>

                                        Creator:{" "}

                                        {creator?.name ||
                                            "Anonimus"
                                        }

                                    </span>

                                </div>


                                {/* =================================
                                    RATING / BOOKMARKS
                                ================================= */}

                                <div className="top-recipe-statistic">

                                    {getStatisticValue(item)}

                                </div>

                            </div>

                        );

                    })

                ) : (

                    /* =============================================
                       EMPTY STATE
                    ============================================= */

                    <div className="top-recipes-empty">

                        <i className="fa-solid fa-utensils"></i>

                        <span>
                            No recipes found for this period.
                        </span>

                    </div>

                )}

            </div>

        </div>

    );

}