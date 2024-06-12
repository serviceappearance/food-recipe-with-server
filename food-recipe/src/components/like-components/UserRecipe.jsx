import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../Header";
import FoodDisplay from "../recipe-components/FoodDisplay";
import Step from "../recipe-components/Step";
import FoodGradients from "../recipe-components/FoodGradients";
import axios from "axios";

export default function UserRecipe(){
    const [recipeDB,setRecipeDB] = useState({})
    const [isloading,setIsloading] = useState(true)
    const { recipeId } = useParams();

    const fetchLiked = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/user-recipe/"+recipeId)
            setRecipeDB(response.data)
        }
        catch(error) {
            console.log(error)
        }
        finally {
            setIsloading(false)
        }
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
                            <FoodGradients recipe={recipeDB} gradients={recipeDB.ingredients}/>
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

