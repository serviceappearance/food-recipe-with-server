export default function FoodGradients({recipe,gradients}) {
    const halfOfGradient = Math.ceil(gradients.length/2)
    return (
        <div className="border border-solid rounded p-3">   
            <p className="font-semibold text-2xl sm:text-lg">재료</p>
            <div className="flex justify-center w-full">
                <div className="flex flex-col sm:flex-row justify-between w-full">
                    <ul className="w-full sm:w-1/2">
                        {gradients.slice(0, halfOfGradient).map((gradient, index) => (
                            <li key={index} className="flex justify-between p-3">
                                <span className="text-xl sm:text-lg">{gradient}</span>
                            </li>
                        ))}
                    </ul>
                    <ul className="w-full sm:w-1/2">
                        {gradients.slice(halfOfGradient).map((gradient, index) => (
                            <li key={index + halfOfGradient} className="flex justify-between p-3">
                                <span className="text-xl sm:text-lg">{gradient}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}