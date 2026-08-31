import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../../../utils/enum";

export default function CategoryComponent({recipeData,setRecipeData}) 
{

    const [customCategory, setCustomCategory] = useState("");
    const [addingCategory, setAddingCategory] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const categorySelectRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                categorySelectRef.current &&
                !categorySelectRef.current.contains(event.target)
            ) {
                setCategoryOpen(false);
            }
        }

        function handleEscape(event) {

            if (event.key === "Escape") {
                setCategoryOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };

    }, []);


    function addCategory(category) {

        if (!category) return;

        if (recipeData.categories.includes(category)) {
            return;
        }

        setRecipeData(prev => ({
            ...prev,

            categories: [
                ...prev.categories,
                category
            ]
        }));

        setCategoryOpen(false);
    }


    function removeCategory(category) {

        setRecipeData(prev => ({
            ...prev,

            categories: prev.categories.filter(
                item => item !== category
            )
        }));
    }


    function saveCustomCategory() {

        const value = customCategory.trim();

        if (!value) return;

        if (!recipeData.categories.includes(value)) {

            setRecipeData(prev => ({
                ...prev,

                categories: [
                    ...prev.categories,
                    value
                ]
            }));
        }

        setCustomCategory("");
        setAddingCategory(false);
    }


    const availableCategories = CATEGORIES.filter(
        category =>
            !recipeData.categories.includes(category)
    );


    return (
        <div className="tag-selection-section">

            {/* HEADER */}

            <div className="tag-section-header">

                <div>

                    <label>
                        Category
                    </label>

                    <p>
                        Choose one or more categories
                    </p>

                </div>


                {!addingCategory && (

                    <button
                        type="button"
                        className="custom-tag-button"
                        onClick={() =>
                            setAddingCategory(true)
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add your own

                    </button>

                )}

            </div>


            {/* SELECTED CATEGORIES */}

            <div className="tag-box">

                {recipeData.categories.map(category => (

                    <div
                        className="recipe-tag"
                        key={category}
                    >

                        <span>
                            {category}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                removeCategory(category)
                            }
                        >

                            <i className="fa-solid fa-xmark"></i>

                        </button>

                    </div>

                ))}

            </div>


            {/* CATEGORY SELECT */}

            {!addingCategory ? (

                <div className="category-select" ref={categorySelectRef}>

                    <button
                        type="button"
                        className="category-select-button"
                        onClick={() =>
                            setCategoryOpen(prev => !prev)
                        }
                    >

                        <span>
                            Select a category
                        </span>


                        <i
                            className={`fa-solid fa-chevron-down ${
                                categoryOpen ? "rotate" : ""
                            }`}
                        ></i>

                    </button>


                    {categoryOpen && (

                        <div className="category-select-options">

                            {availableCategories.map(
                                category => (

                                    <button
                                        type="button"
                                        key={category}
                                        className="category-select-option"
                                        onClick={() =>
                                            addCategory(category)
                                        }
                                    >

                                        {category}

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            ) : (

                /* CUSTOM CATEGORY */

                <div className="custom-tag-input">

                    <input
                        type="text"
                        value={customCategory}
                        onChange={e =>
                            setCustomCategory(
                                e.target.value
                            )
                        }
                        placeholder="Enter your category"
                        autoFocus
                    />


                    <button
                        type="button"
                        onClick={saveCustomCategory}
                    >

                        <i className="fa-solid fa-check"></i>

                    </button>


                    <button
                        type="button"
                        onClick={() => {

                            setCustomCategory("");
                            setAddingCategory(false);

                        }}
                    >

                        <i className="fa-solid fa-xmark"></i>

                    </button>

                </div>

            )}

        </div>
    );
}