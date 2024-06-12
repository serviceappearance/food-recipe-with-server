import { useEffect, useState } from "react"
import { openDB } from 'idb';
import { Link } from "react-router-dom"
import Header from "../Header";
import axios from "axios";

export default function LikePage(){
    return (
        <>
            <Header/>
            <LikedFood/>
        </>
    )
}


const LikedFood = () => {
    const [liked, setLiked] = useState([])
    const [isloading,setIsloading] = useState(true)

    const fetchLiked = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/user-recipe")
            console.log(response.data[0])
            setLiked(response.data)
            console.log("loading")
        }
        catch(error) {
            console.log(error)
        }
        finally {
            setIsloading(false)
        }
    }

    useEffect(()=>{
        fetchLiked()
        },[])
        
    console.log(liked)
    const deleteLiked = async(id) => {
        const db = await openDB('myDatabase', 2);
        const tx = db.transaction('liked', 'readwrite');
        await tx.objectStore('liked').delete(id);
        await tx.done;
        setLiked(liked.filter((item)=>item.id!=id))
    }
    
    return (
        <div className="h-900px grid place-items-center bg-slate-100">
            <div className="h-screen grid place-items-center bg-white">
                <ul>
                    {liked.map((item,_)=>(
                        <div key={item.id}>
                            <li className="flex justify-between border border-solid p-3">
                                <span className="text-xl sm:text-lg">{item.RCP_NM}</span>
                                <div>
                                    <Link to={`/user_recipe/${item.recipe_id}`} className="justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 me-2 text-xl sm:text-lg">보기</Link>
                                    <button className="justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 text-xl sm:text-lg" onClick={()=> deleteLiked(item.recipe_id)}>삭제</button>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}
