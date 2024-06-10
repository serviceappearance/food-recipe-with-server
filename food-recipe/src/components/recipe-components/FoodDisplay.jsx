export default function FoodDisplay(props) {
    const recipe = props.recipe
    const imgSource = recipe.ATT_FILE_NO_MAIN
    const name = recipe.RCP_NM
    return  (
        <div className="flex justify-center mb-8">
            <div className="grid gap-y-3">
                <img src={imgSource} alt="음식 이미지" className="w-[20rem] sm:w-[30rem]"/>
                <p className="text-center font-semibold text-2xl">{name}</p>
            </div>
        </div>
    )
}