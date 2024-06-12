import { useEffect, useState } from "react"
import {useLocation} from "react-router-dom"
import FoodDisplay from "./recipe-components/FoodDisplay";
import FoodGradients from "./recipe-components/FoodGradients";
import Step from "./recipe-components/Step";
import Header from "./Header"
import axios from "axios";

export default function Recipe(){
    const [recipe,setRecipe] = useState({})
    const [isloading,setIsloading] = useState(true)
    const location = useLocation();
    const {recipeData} = location.state || {}

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



const Like = ({recipe}) => {
    const stepList = []

    for (const key in recipe) {
        if (key.startsWith('MANUAL') && !key.includes('IMG') && recipe[key] !== "") {
            stepList.push(recipe[key])
        }
    }

    stepList.sort((a, b) => {
        const regex = /^\d+/;
        const numA = parseInt(a.match(regex)[0]);
        const numB = parseInt(b.match(regex)[0]);
        return numA - numB;
    })
    console.log(stepList)
    async function likeRecipe(){
        try {
            const response = await axios.post("http://localhost:8080/api/user-recipe",{
                "recipeId":recipe.RCP_SEQ,
                "recipeTitle":recipe.RCP_NM,
                "recipeImageLink":recipe.ATT_FILE_NO_MAIN,
                "recipeIngredients":recipe.RCP_PARTS_DTLS.split(","),
                "recipeSteps":stepList
            })
            
        } catch(error){
            console.log(error)
        }
    }
    console.log(recipe)
    return (
        <div className="w-full flex justify-end mt-2">
            <button className="border rounded px-2 py-1 hover:bg-slate-100 text-2xl sm:text-lg" onClick={()=>likeRecipe()}>좋아요</button>
        </div>
    )
}
