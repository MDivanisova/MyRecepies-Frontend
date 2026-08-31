import { useEffect, useRef, useState } from "react";
import { COOKING_METHODS } from "../../../utils/enum";


export default function CookingMethodComponent({recipeData,setRecipeData}) {

    const [customMethod, setCustomMethod] = useState("");
    const [addingMethod, setAddingMethod] = useState(false);
    const [methodOpen, setMethodOpen] = useState(false);

    const methodSelectRef = useRef(null);


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                methodSelectRef.current &&
                !methodSelectRef.current.contains(event.target)
            ) {
                setMethodOpen(false);
            }
        }


        function handleEscape(event) {

            if (event.key === "Escape") {
                setMethodOpen(false);
            }
        }


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    function addMethod(method) {

        if (!method) return;

        if (recipeData.cookingMethods.includes(method)) {
            return;
        }

        setRecipeData(prev => ({
            ...prev,

            cookingMethods: [
                ...prev.cookingMethods,
                method
            ]
        }));

        setMethodOpen(false);
    }


    function removeMethod(method) {

        setRecipeData(prev => ({
            ...prev,

            cookingMethods: prev.cookingMethods.filter(
                item => item !== method
            )
        }));
    }


    function saveCustomMethod() {

        const value = customMethod.trim();

        if (!value) return;

        if (!recipeData.cookingMethods.includes(value)) {

            setRecipeData(prev => ({
                ...prev,

                cookingMethods: [
                    ...prev.cookingMethods,
                    value
                ]
            }));
        }

        setCustomMethod("");
        setAddingMethod(false);
    }


    const availableMethods = COOKING_METHODS.filter(
        method =>
            !recipeData.cookingMethods.includes(method)
    );


    return (
        <div className="tag-selection-section">

            <div className="tag-section-header">

                <div>

                    <label>
                        Cooking methods
                    </label>

                    <p>
                        Choose one or more cooking methods
                    </p>

                </div>


                {!addingMethod && (

                    <button
                        type="button"
                        className="custom-tag-button"
                        onClick={() =>
                            setAddingMethod(true)
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add your own

                    </button>

                )}

            </div>


            <div className="tag-box">

                {recipeData.cookingMethods.map(method => (

                    <div
                        className="recipe-tag"
                        key={method}
                    >

                        <span>
                            {method}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                removeMethod(method)
                            }
                        >

                            <i className="fa-solid fa-xmark"></i>

                        </button>

                    </div>

                ))}

            </div>


            {!addingMethod ? (

                <div className="cooking-method-select"  ref={methodSelectRef}>

                    <button
                        type="button"
                        className="cooking-method-select-button"
                        onClick={() =>
                            setMethodOpen(prev => !prev)
                        }
                    >

                        <span>
                            Select a cooking method
                        </span>


                        <i
                            className={`fa-solid fa-chevron-down ${
                                methodOpen ? "rotate" : ""
                            }`}
                        ></i>

                    </button>


                    {methodOpen && (

                        <div className="cooking-method-select-options">

                            {availableMethods.map(method => (

                                <button
                                    type="button"
                                    key={method}
                                    className="cooking-method-select-option"
                                    onClick={() =>
                                        addMethod(method)
                                    }
                                >

                                    {method}

                                </button>

                            ))}

                        </div>

                    )}

                </div>

            ) : (

                <div className="custom-tag-input">

                    <input
                        type="text"
                        value={customMethod}
                        onChange={e =>
                            setCustomMethod(e.target.value)
                        }
                        placeholder="Enter your cooking method"
                        autoFocus
                    />


                    <button
                        type="button"
                        onClick={saveCustomMethod}
                    >

                        <i className="fa-solid fa-check"></i>

                    </button>


                    <button
                        type="button"
                        onClick={() => {

                            setCustomMethod("");
                            setAddingMethod(false);

                        }}
                    >

                        <i className="fa-solid fa-xmark"></i>

                    </button>

                </div>

            )}

        </div>
    );
}