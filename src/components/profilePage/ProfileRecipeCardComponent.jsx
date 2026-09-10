import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeRecipe } from "../../utils/RecepieEndpoint";
import { useAuth } from "../../context/useAuth";
import Spinner from "../Spiner";


import "./profileRecipeCardComponent.css";

export default function ProfileRecipeCardComponent({ recipe, setRecipes, isMe}) {

    const { token } = useAuth();

    const navigate = useNavigate();

    const [profileLoading, setProfileLoading] = useState(false);

    const rating = Number(
        recipe.rating?.$numberDecimal ||
        recipe.rating ||
        0
    );

    const preparationTime = Number(
        recipe.preparationTime?.$numberDecimal ||
        recipe.preparationTime ||
        0
    );

    const cookingTime = Number(
        recipe.cookingTime?.$numberDecimal ||
        recipe.cookingTime ||
        0
    );

    const totalTime = preparationTime + cookingTime;

    const handleCardClick = (event) => {
        event.stopPropagation();

        if (!recipe._id || profileLoading) {
            return;
        }

        setProfileLoading(true);

        navigate(`/recipe/details/${recipe._id}`);
    };


    const handleDelete = async () => { 
        const result = await removeRecipe(token, recipe._id); 
        
        if (result.succ) { 
            setRecipes(prevRecipes => prevRecipes.filter( item => item._id !== recipe._id ) );
        } else { 
            console.error("Failed to delete recipe:", result); 
        } 
    };

    return (

        <div className="profile-recipe-card">
            {profileLoading && (
                <div className="profile-recipe-card-loading">
                    <Spinner
                        w={100}
                        h={100}
                    />
                </div>
            )}

            {/* IMAGE */}

            <div className="profile-recipe-card-image" onClick={handleCardClick}>

                <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    onError={(e) => {
                        e.currentTarget.src =
                            "https://imgs.search.brave.com/0LcoNeVoMi9UGquyOMvqqdzDA7k3gC0E2C49J7rD81g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yLzQwNC1wYWdl/LWZvdW5kLXNlYXJj/aC1lcnJvci13ZWIt/aWxsdXN0cmF0aW9u/XzU4NTAyNC00NTku/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MCZxPTgw";
                    }}
                />


                {/* CATEGORY */}

                <div className="profile-recipe-category">
                    {recipe.category?.[0]}
                </div>

            </div>


            {/* CONTENT */}

            <div className="profile-recipe-card-content" onClick={handleCardClick}>

                {/* NAME */}

                <div className="profile-recipe-name">
                    {recipe.name}
                </div>

 
                {/* CREATOR */} 
                <div className="profile-recipe-creator"> 
                    <i className="fa-solid fa-user"></i> 
                    <span> {isMe ? "Me" : recipe.creator?.name} </span> 
                </div>

                {/* RATING + TIME */}

                <div className="profile-recipe-details">

                    {/* RATING */}

                    <div className="profile-recipe-rating">

                        <div className="profile-recipe-stars">

                            {[1, 2, 3, 4, 5].map(star => {

                                const fillPercentage =
                                    Math.min(
                                        Math.max(
                                            rating - (star - 1),
                                            0
                                        ),
                                        1
                                    ) * 100;

                                return (

                                    <span
                                        className="profile-recipe-star"
                                        key={star}
                                    >

                                        <i className="fa-regular fa-star"></i>

                                        <span
                                            className="profile-recipe-star-fill"
                                            style={{
                                                width: `${fillPercentage}%`
                                            }}
                                        >
                                            <i className="fa-solid fa-star"></i>
                                        </span>

                                    </span>

                                );

                            })}

                        </div>

                        <span className="profile-recipe-rating-number">
                            {rating.toFixed(1)}
                        </span>

                    </div>


                    {/* TIME */}

                    <div className="profile-recipe-total-time">

                        <i className="fa-regular fa-clock"></i>

                        <span>
                            {totalTime} min
                        </span>

                    </div>

                </div>


            </div>

            {/* DELETE BUTTON */}

                <div className="profile-recipe-button-wrapper">

                    <button
                        type="button"
                        className="delete-profile-recipe-button"
                        onClick={handleDelete}
                    >

                        <i className="fa-solid fa-trash"></i>

                        <span>
                            Delete recipe
                        </span>

                    </button>

                </div>

        </div>
    );
}