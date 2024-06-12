export default function Step({recipe,steps}) {
    for (let i = 1; i <= 20; i++) { 
        const manualKey = `MANUAL${i.toString().padStart(2, '0')}`; 
        if (recipe.hasOwnProperty(manualKey) && recipe[manualKey]) { 
            steps.push(recipe[manualKey]); 
        } else {
            break; 
        }
    }
    
    return (
        <div className="mt-5">
            <p className="font-semibold mb-3 text-2xl sm:text-lg">조리순서</p>
            <ul className="grid gap-y-3">
                {steps.map((step,index)=>(
                    <li key={index} className="border border-solid rounded p-3">
                        <span className="text-xl sm:text-lg">{step}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}