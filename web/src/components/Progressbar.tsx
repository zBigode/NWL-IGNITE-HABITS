interface ProgressbarProps{
    progress:number
}

export function Progressbar (props:ProgressbarProps){
 
    return(
        <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
        
        <div 
        role="progressbar"
        aria-label="Progresso de hábitos commpletados nesse dia"
        aria-valuenow={props.progress}
        className="h-3 rounded-xl bg-violet-600 transition-all duration-500"
        style={{width: `${props.progress}%`}}
        >
        </div>
       </div>
    )
}