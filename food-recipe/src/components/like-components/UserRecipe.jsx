import { useEffect, useState } from "react"
import { openDB } from 'idb';
import { Link, useParams } from "react-router-dom"
import Header from "../Header";
import FoodDisplay from "../recipe-components/FoodDisplay";
import Step from "../recipe-components/Step";
import FoodGradients from "../recipe-components/FoodGradients";

export default function UserRecipe(){
    const [recipeDB,setRecipeDB] = useState({})
    const [isloading,setIsloading] = useState(true)
    const { recipeId } = useParams();

    const fetchLiked = async (id) => {
        try {
            const db = await initDB();
            const tx = db.transaction('liked', 'readonly');
            const store = tx.objectStore('liked');
            const likedRecipe = await store.get(id);
            await tx.done;
            setRecipeDB(likedRecipe)
            console.log(likedRecipe)
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
            },
        });
    
        return db;  
    }

    useEffect(()=>{ 
        fetchLiked(recipeId)
    },[])

    console.log(recipeDB)
    return (
        <div className="grid place-items-center bg-slate-100">
            {isloading ? ( 
                <> isloading... </>
            ) : (
                    <div className="grid place-items-center bg-white shadow">
                        <Header/>
                        <header>
                            <FoodDisplay recipe={recipeDB}/>
                        </header>
                        <main className="mt-8 px-8">
                            <FoodGradients recipe={recipeDB} gradients={recipeDB.RCP_PARTS_DTLS}/>
                            <Step recipe={recipeDB} steps={recipeDB.steps}/>
                            <EditBtn recipeId={recipeDB.id}/>
                        </main>
                    </div>
                )
            }
        </div>
    )
}

const EditBtn = (props) => {
    const recipeId=props.recipeId
    return (
        <div className="w-full flex justify-end mt-2">
            <Link to='../edit_recipe' state={{ recipeId: recipeId }} className="border rounded px-2 py-1 hover:bg-slate-100 text-2xl sm:text-lg">수정하기</Link>
        </div>
    )
}

