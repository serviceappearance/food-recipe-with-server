import { useEffect, useState } from "react"
import {useLocation} from "react-router-dom"
import { openDB } from 'idb';
import FoodDisplay from "./recipe-components/FoodDisplay";
import FoodGradients from "./recipe-components/FoodGradients";
import Step from "./recipe-components/Step";
import Header from "./Header"

export default function Recipe(){
    const [recipe,setRecipe] = useState({})
    const [isloading,setIsloading] = useState(true)
    let location = useLocation();
    let {recipeData} = location.state || {}

    const getRecipe = async() => {
        try {
            setRecipe(recipeData)
        } catch (error) {
            console.log(error)
        } finally {
            setIsloading(false)
        }
    }
    
    useEffect(()=>{ 
        getRecipe()
    },[recipeData])


    return (
        <div className="grid place-items-center bg-slate-100">
            <Header/>
            {isloading ? ( 
                <> isloading... </>
            ) : (
                <div className="grid place-items-center bg-white shadow py-[4rem]">
                        <header>
                            <FoodDisplay recipe={recipe}/>
                        </header>
                        <main className="mt-8 px-8">
                            <FoodGradients gradients={recipe.RCP_PARTS_DTLS.split(",")}/>
                            <Step recipe={recipe} steps={[]}/>
                            <Like recipe={recipe}/>
                        </main>
                    </div>
                )
            }
        </div>
    )
}


const Like = (props) => {
    const recipe= props.recipe
    return (
        <div className="w-full flex justify-end mt-2">
            <button className="border rounded px-2 py-1 hover:bg-slate-100 text-2xl sm:text-lg" onClick={()=>likeSave(recipe)}>좋아요</button>
        </div>
    )
}

const likeSave = async (data) => {
    const dbName = 'myDatabase';
    const currentVersion = 2;

    const db = await openDB(dbName, currentVersion, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('liked')) {
                db.createObjectStore('liked', { keyPath: 'id' });
            }
        },
    });

    let steps = [];
    for (let i = 1; i <= 20; i++) { 
        const manualKey = `MANUAL${i.toString().padStart(2, '0')}`; 
        if (data.hasOwnProperty(manualKey) && data[manualKey]) { 
            steps.push(data[manualKey]); 
        } else {
            break; 
        }
    }

    const jsonData = [
        {
            id: data.RCP_SEQ,
            RCP_NM:data.RCP_NM,
            ATT_FILE_NO_MAIN: data.ATT_FILE_NO_MAIN,
            RCP_PARTS_DTLS: data.RCP_PARTS_DTLS.split(","),
            steps: steps
        },
    ];
    
    const tx = db.transaction('liked', 'readwrite');
    const store = tx.objectStore('liked');
    for (const item of jsonData) {
        await store.put(item); 
    }
    await tx.done;

    const allLiked = await db.getAll('liked');
    console.log(allLiked);
};