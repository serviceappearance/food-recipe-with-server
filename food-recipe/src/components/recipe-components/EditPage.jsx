import { useEffect, useState,useRef } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import { openDB } from 'idb';
import Header from "../Header";
import FoodDisplay from "../recipe-components/FoodDisplay"

export default function EditRecipe(){
    const [recipeDB,setRecipeDB] = useState([])
    const [isloading,setIsloading] = useState(true)
    const [ingredients, setIngredients] = useState([])
    const [steps, setSteps] = useState([])
    const location = useLocation();
    const recipeId = location.state?.recipeId;
    
    
    const fetchLiked = async () => {
        try {
            const db = await initDB();
            const tx = db.transaction('liked', 'readonly');
            const store = tx.objectStore('liked');
            const allLikes = await store.getAll();
            const selectedRecipe = await store.get(recipeId);
            setRecipeDB(selectedRecipe);
            setIngredients(selectedRecipe.RCP_PARTS_DTLS || []); 
            setSteps(selectedRecipe.steps || []);
            await tx.done;
            return allLikes;
        }
        catch(error) {
            console.log(error)
        }
        finally {
            setIsloading(false)
        }
    }
    
    async function initDB() {
        const dbName = 'myDatabase';  
        const version = 2;            
    
        const db = await openDB(dbName, version, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('liked')) {
                    db.createObjectStore('liked', { keyPath: 'id' });
                }
            }
        });
        
        return db;  
    }
    
    useEffect(()=>{ 
        fetchLiked()
    },[])


    return (
        <div className="grid place-items-center bg-slate-100">
            <Header/>
            {isloading ? ( 
                <> isloading... </>
            ) : (
                    <div className="grid place-items-center bg-white shadow" >
                        <header>
                            <FoodDisplay recipe={recipeDB}/>
                        </header>
                        <main className="mt-8 px-8">
                            <FoodGradients recipe={recipeDB} ingredients={ingredients} setIngredients={setIngredients}/>
                            <Step recipe={recipeDB} steps={steps} setSteps={setSteps}/>
                            <UpdateBtn recipe={recipeDB} ingredients={ingredients} steps={steps}/>
                        </main>
                    </div>
                )
            }
        </div>
    )
}

const UpdateBtn = (props) => {
    const navigate = useNavigate();
    const recipeId = props.recipe.id
    const recipeName = props.recipe.RCP_NM
    const recipeImg = props.recipe.ATT_FILE_NO_MAIN
    const ingredients = props.ingredients
    const steps = props.steps
    
    const handleUpdate = async () => {
        const newData = {
            id: recipeId,
            RCP_NM:recipeName,
            ATT_FILE_NO_MAIN: recipeImg,
            RCP_PARTS_DTLS: ingredients,
            steps: steps
        };
        await EditedlikeSave(newData)
        navigate(`/user_recipe/${recipeId}`);
    }
    const updateBtnStyle = {
        margin:'3rem 0 0 0'
    }
    return (
        <div className="w-full flex justify-end" style={updateBtnStyle}>
            <button onClick={handleUpdate} className="border rounded px-2 py-1 hover:bg-slate-100 text-2xl sm:text-lg">수정완료</button>
        </div>
    )
}

const EditedlikeSave = async (data) => {
    const db = await openDB('myDatabase', 2);
    const jsonData = {
        id: data.id,
        RCP_NM:data.RCP_NM,
        ATT_FILE_NO_MAIN: data.ATT_FILE_NO_MAIN,
        RCP_PARTS_DTLS: data.RCP_PARTS_DTLS,
        steps: data.steps
    };

    const tx = db.transaction('liked', 'readwrite');
    const store = tx.objectStore('liked');
    await store.put(jsonData); 
    await tx.done;
};


const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
};

const FoodGradients = (props) => {
    const ingredients = props.ingredients
    const halfOfGradient = Math.ceil(ingredients.length/2)
    const textAreaRefs = useRef([]);
    useEffect(() => {
        textAreaRefs.current.forEach(textArea => {
            if (textArea) {
                autoResize(textArea);
            }
        });
    }, [props.steps]);


    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = event.target.value;
        props.setIngredients(newIngredients);
        autoResize(textAreaRefs.current[index])
    };

    const addIngredient = () => {
        const newIngredients = [...ingredients, ''];
        props.setIngredients(newIngredients);
    };

    const removeIngredient = (index) => {
        props.setIngredients(prev => prev.filter((_, i) => i !== index));
        console.log(props)
    };

    return (
        <div className="border border-solid rounded p-3">   
            <div className="w-full flex px-2 mb-3">
                <p className="font-semibold text-2xl sm:text-lg">재료</p>
                <button onClick={addIngredient} className="border rounded hover:bg-slate-100 px-1 ms-3 text-2xl sm:text-lg">추가하기</button>
            </div>
            <div className="flex justify-center w-full">
                <div className="flex-col sm:flex-row justify-between w-full">
                    <ul className="w-1/2 sm:w-full">
                        {ingredients.slice(0, halfOfGradient).map((gradient, index) => (
                            <li key={`${gradient}-${index}`} className="flex justify-between px-1 py-2">
                                <textarea 
                                    ref={el => textAreaRefs.current[index] = el}
                                    className="w-5/6 rounded px-1 py-2 hover:bg-slate-100 text-2xl sm:text-lg resize-none overflow-hidden"
                                    rows="1"
                                    defaultValue={gradient} 
                                    onChange={(event) => handleIngredientChange(index, event)}
                                />
                                <button className="w-fit h-fit justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 text-2xl sm:text-lg" onClick={() => removeIngredient(index)}>삭제</button>
                            </li>
                        ))}
                    </ul>
                    <ul className="w-1/2 sm:w-full">
                        {ingredients.slice(halfOfGradient).map((gradient, index) => (
                            <li key={`${gradient+halfOfGradient}-${index}`} className="flex justify-between px-1 py-2">
                                <textarea
                                    ref={el => textAreaRefs.current[index+halfOfGradient] = el}
                                    className="w-5/6 rounded px-1 py-2 hover:bg-slate-100 text-2xl sm:text-lg resize-none overflow-hidden"
                                    rows="1"
                                    defaultValue={gradient}
                                    onChange={(event) => handleIngredientChange(index + halfOfGradient, event)}
                                />
                                <button className="w-fit h-fit justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 text-2xl sm:text-lg" onClick={() => removeIngredient(index + halfOfGradient)}>삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}


const Step = (props) => {
    const steps = props.steps
    const textAreaRefs = useRef([]);
    console.log(steps)
    useEffect(() => {
        textAreaRefs.current.forEach(textArea => {
            if (textArea) {
                autoResize(textArea);
            }
        });
    }, [props.steps]); 


    const handleStepChange = (index, event) => {
        const newSteps = [...steps];
        newSteps[index] = event.target.value;
        props.setSteps(newSteps);
        autoResize(textAreaRefs.current[index])
    };

    const addStep = () => {
        const newStep = [...steps, ''];
        props.setSteps(newStep);
    };

    const removeStep = (index) => {
        props.setSteps(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="w-full flex mb-5">
                <p className="font-semibold text-2xl sm:text-lg">조리순서</p>
                <button onClick={addStep} className="px-1 border rounded hover:bg-slate-100 ms-3 text-2xl sm:text-lg">추가하기</button>
            </div>
            <ul className="grid gap-y-3">
                {steps.map((step,index)=>(
                    <li key={`${step}-${index}`} className="grid grid-cols-12">
                        <textarea
                            ref={el => textAreaRefs.current[index] = el}
                            className="col-span-11 border rounded p-3 hover:bg-slate-100 text-2xl sm:text-lg resize-none overflow-hidden"
                            defaultValue={step}
                            rows="1"
                            onChange={(event)=>handleStepChange(index,event)}
                        />
                        <button className="w-fit h-fit justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 text-2xl sm:text-lg" onClick={() => removeStep(index)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    )   
}