import { useEffect, useState } from "react"
import { openDB } from 'idb';
import { Link } from "react-router-dom"
import Header from "../Header";

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
            const db = await initDB();
            const tx = db.transaction('liked', 'readonly');
            const store = tx.objectStore('liked');
            const allLikes = await store.getAll();
            await tx.done;
            setLiked(allLikes)
            console.log("loading")
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
            upgrade(db, oldVersion, newVersion, transaction) {
                if (!db.objectStoreNames.contains('liked')) {
                    db.createObjectStore('liked', { keyPath: 'id' });
                }
            },
        });
    
        return db;  
    }

    useEffect(()=>{
        fetchLiked()
    },[])

    const likedListStyle = {
        width:'70rem',
    }
    const likedStyle = {
        width:'50rem',
    }

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
                                    <Link to={`/user_recipe/${item.id}`} className="justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 me-2 text-xl sm:text-lg">보기</Link>
                                    <button className="justify-self-center self-center border rounded hover:bg-slate-100 px-2 py-1 text-xl sm:text-lg" onClick={()=> deleteLiked(item.id)}>삭제</button>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}
