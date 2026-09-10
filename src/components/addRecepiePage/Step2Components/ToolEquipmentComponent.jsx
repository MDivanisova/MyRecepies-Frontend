import { useEffect, useRef, useState } from "react";
import { TOOLS } from "../../../utils/enum";


export default function ToolEquipmentComponent({recipeData, setRecipeData, setErrMessageTools}) 
{

    const [customTool, setCustomTool] = useState("");
    const [addingTool, setAddingTool] = useState(false);
    const [toolOpen, setToolOpen] = useState(false);

    const toolSelectRef = useRef(null);


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                toolSelectRef.current &&
                !toolSelectRef.current.contains(event.target)
            ) {
                setToolOpen(false);
            }
        }


        function handleEscape(event) {

            if (event.key === "Escape") {
                setToolOpen(false);
            }
        }


        document.addEventListener("mousedown",handleClickOutside);
        document.addEventListener("keydown",handleEscape);


        return () => {

            document.removeEventListener("mousedown",handleClickOutside);
            document.removeEventListener("keydown",handleEscape);

        };

    }, []);



    function addTool(tool) {

        if (!tool) return;

        if (recipeData.tools.includes(tool)) {
            return;
        }

        setRecipeData(prev => ({
            ...prev,

            tools: [
                ...prev.tools,
                tool
            ]
        }));

        setErrMessageTools("");
        setToolOpen(false);
    }


    function removeTool(tool) {

        setRecipeData(prev => ({
            ...prev,

            tools: prev.tools.filter(
                item => item !== tool
            )
        }));
         if (recipeData.tools.length === 1) {
            setErrMessageTools("tools are required");
        }
    }


    function saveCustomTool() {

        const value = customTool.trim();

        if (!value) return;

        if (!recipeData.tools.includes(value)) {

            setRecipeData(prev => ({
                ...prev,

                tools: [
                    ...prev.tools,
                    value
                ]
            }));

            setErrMessageTools("");
        }

        setCustomTool("");
        setAddingTool(false);
    }


    const availableTools = TOOLS.filter(
        tool =>
            !recipeData.tools.includes(tool)
    );


    return (
        <div className="tag-selection-section">

            <div className="tag-section-header">

                <div>

                    <label>
                        Tools & equipment
                    </label>

                    <p>
                        Choose one or more tools
                    </p>

                </div>


                {!addingTool && (

                    <button
                        type="button"
                        className="custom-tag-button"
                        onClick={() =>
                            setAddingTool(true)
                        }
                    >

                        <i className="fa-solid fa-plus"></i>

                        Add your own

                    </button>

                )}

            </div>


            <div className="tag-box">

                {recipeData.tools.map(tool => (

                    <div
                        className="recipe-tag"
                        key={tool}
                    >

                        <span>
                            {tool}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                removeTool(tool)
                            }
                        >

                            <i className="fa-solid fa-xmark"></i>

                        </button>

                    </div>

                ))}

            </div>


            {!addingTool ? (

                <div className="tool-select" ref={toolSelectRef}>

                    <button
                        type="button"
                        className="tool-select-button"
                        onClick={() =>
                            setToolOpen(prev => !prev)
                        }
                    >

                        <span>
                            Select a tool
                        </span>


                        <i
                            className={`fa-solid fa-chevron-down ${
                                toolOpen ? "rotate" : ""
                            }`}
                        ></i>

                    </button>


                    {toolOpen && (

                        <div className="tool-select-options">

                            {availableTools.map(tool => (

                                <button
                                    type="button"
                                    key={tool}
                                    className="tool-select-option"
                                    onClick={() =>
                                        addTool(tool)
                                    }
                                >

                                    {tool}

                                </button>

                            ))}

                        </div>

                    )}

                </div>

            ) : (

                <div className="custom-tag-input">

                    <input
                        type="text"
                        value={customTool}
                        onChange={e =>
                            setCustomTool(e.target.value)
                        }
                        placeholder="Enter your tool"
                        autoFocus
                    />


                    <button
                        type="button"
                        onClick={saveCustomTool}
                    >

                        <i className="fa-solid fa-check"></i>

                    </button>


                    <button
                        type="button"
                        onClick={() => {

                            setCustomTool("");
                            setAddingTool(false);

                        }}
                    >

                        <i className="fa-solid fa-xmark"></i>

                    </button>

                </div>

            )}

        </div>
    );
}