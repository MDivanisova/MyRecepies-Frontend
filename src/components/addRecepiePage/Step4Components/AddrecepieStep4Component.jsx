import { useEffect, useRef } from "react";

import "./addRecepieStep4Component.css";

export default function AddRecepieStep4Component({handleChange,recipeData,setRecipeData})
{

    const instructionsListRef = useRef(null);


    // Make sure there are initially at least 4 instruction rows

    useEffect(() => {

        if (recipeData.instructions.length < 5) {

            setRecipeData(prev => ({

                ...prev,

                instructions: [

                    ...prev.instructions,

                ]

            }));

        }

    }, []);


    function addInstruction() {

        setRecipeData(prev => ({

            ...prev,

            instructions: [

                ...prev.instructions,

                ""

            ]

        }));


        setTimeout(() => {

            instructionsListRef.current?.scrollTo({

                top:
                    instructionsListRef.current.scrollHeight,

                behavior: "smooth"

            });

        }, 0);

    }


    function updateInstruction(index, value) {

        setRecipeData(prev => {

            const instructions = [
                ...prev.instructions
            ];

            instructions[index] = value;

            return {

                ...prev,

                instructions

            };

        });

    }


    function removeInstruction(index) {

        setRecipeData(prev => {

            // Always keep at least one instruction

            if (prev.instructions.length <= 1) {

                return prev;

            }

            return {

                ...prev,

                instructions:
                    prev.instructions.filter(
                        (_, i) => i !== index
                    )

            };

        });

    }


    return (

        <div className="recipe-step-content">

            <div className="step-heading">

                <span>STEP 4 OF 6</span>

                <h2>Instructions</h2>

                <p>
                    Guide others through your recipe step by step.
                </p>

            </div>


            <div className="instructions-section">

                <div
                    className="instructions-table"
                >

                    {/* INSTRUCTIONS */}

                    <div
                        className="instructions-list"
                        ref={instructionsListRef}
                    >

                        {recipeData.instructions.map(
                            (instruction, index) => (

                            <div
                                className="instruction-row"
                                key={index}
                            >

                                {/* STEP NUMBER */}

                                <div className="instruction-number">

                                    {index + 1}

                                </div>


                                {/* INSTRUCTION */}

                                <textarea
                                    value={instruction}
                                    placeholder="Describe this step..."
                                    onChange={(e) =>
                                        updateInstruction(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />


                                {/* DELETE */}

                                <button
                                    type="button"
                                    className="remove-instruction-button"
                                    onClick={() =>
                                        removeInstruction(index)
                                    }
                                    title="Remove instruction"
                                >

                                    <i className="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        ))}

                    </div>

                </div>


                {/* ADD INSTRUCTION */}

                <button
                    type="button"
                    className="add-item-button add-instruction-button"
                    onClick={addInstruction}
                >

                    <i className="fa-solid fa-plus"></i>

                    Add instruction

                </button>

            </div>

        </div>

    );

}