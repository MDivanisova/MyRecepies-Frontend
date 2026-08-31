import { useEffect, useRef, useState } from "react";
import { CUISINES } from "../../../utils/enum";

export default function CuisineComponent({
    recipeData,
    setRecipeData
}) {

    const [customCuisine, setCustomCuisine] = useState("");
    const [addingCuisine, setAddingCuisine] = useState(false);
    const [cuisineOpen, setCuisineOpen] = useState(false);
    const cuisineSelectRef = useRef(null);


     // CLOSE WHEN CLICKING OUTSIDE OR PRESSING ESC

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                cuisineSelectRef.current &&
                !cuisineSelectRef.current.contains(event.target)
            ) {
                setCuisineOpen(false);
            }
        }


        function handleEscape(event) {

            if (event.key === "Escape") {
                setCuisineOpen(false);
            }
        }


        document.addEventListener("mousedown",handleClickOutside);
        document.addEventListener("keydown",handleEscape);


        return () => {

            document.removeEventListener("mousedown",handleClickOutside);
            document.removeEventListener("keydown",handleEscape);

        };

    }, []);


    function addCuisine(cuisine) {

        if (!cuisine) return;

        if (recipeData.cuisines.includes(cuisine)) {
            return;
        }

        setRecipeData(prev => ({
            ...prev,
            cuisines: [
                ...prev.cuisines,
                cuisine
            ]
        }));

        setCuisineOpen(false);
    }


    function removeCuisine(cuisine) {

        setRecipeData(prev => ({
            ...prev,
            cuisines: prev.cuisines.filter(
                item => item !== cuisine
            )
        }));
    }


    function saveCustomCuisine() {

        const value = customCuisine.trim();

        if (!value) return;

        if (!recipeData.cuisines.includes(value)) {

            setRecipeData(prev => ({
                ...prev,
                cuisines: [
                    ...prev.cuisines,
                    value
                ]
            }));
        }

        setCustomCuisine("");
        setAddingCuisine(false);
    }


    const availableCuisines = CUISINES.filter(
        cuisine =>
            !recipeData.cuisines.includes(cuisine)
    );


    return (
        <div className="tag-selection-section">

            <div className="tag-section-header">

                <div>
                    <label>Cuisine</label>

                    <p>
                        Choose one or more cuisines
                    </p>
                </div>

                {!addingCuisine && (
                    <button
                        type="button"
                        className="custom-tag-button"
                        onClick={() =>
                            setAddingCuisine(true)
                        }
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add your own
                    </button>
                )}

            </div>


            <div className="tag-box">

                {recipeData.cuisines.map(cuisine => (

                    <div
                        className="recipe-tag"
                        key={cuisine}
                    >

                        <span>{cuisine}</span>

                        <button
                            type="button"
                            onClick={() =>
                                removeCuisine(cuisine)
                            }
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>

                ))}

            </div>


            {!addingCuisine ? (

                <div className="cuisine-select" ref={cuisineSelectRef}>

                    <button
                        type="button"
                        className="cuisine-select-button"
                        onClick={() =>
                            setCuisineOpen(prev => !prev)
                        }
                    >
                        <span>
                            Select a cuisine
                        </span>

                        <i
                            className={`fa-solid fa-chevron-up ${
                                cuisineOpen ? "rotate" : ""
                            }`}
                        ></i>
                    </button>


                    {cuisineOpen && (

                        <div className="cuisine-select-options">

                            {availableCuisines.map(cuisine => (

                                <button
                                    type="button"
                                    key={cuisine}
                                    className="cuisine-select-option"
                                    onClick={() =>
                                        addCuisine(cuisine)
                                    }
                                >
                                    {cuisine}
                                </button>

                            ))}

                        </div>

                    )}

                </div>

            ) : (

                <div className="custom-tag-input">

                    <input
                        type="text"
                        value={customCuisine}
                        onChange={(e) =>
                            setCustomCuisine(e.target.value)
                        }
                        className={hasFieldError("cuisine") ? "input-error" : ""}
                        placeholder="Enter your cuisine"
                        autoFocus
                    />

                    <button
                        type="button"
                        onClick={saveCustomCuisine}
                    >
                        <i className="fa-solid fa-check"></i>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setCustomCuisine("");
                            setAddingCuisine(false);
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                </div>

            )}

        </div>
    );
}

