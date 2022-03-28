
export const Slider = ({value, onInputChange}) => { 
    return (
            <input 
                id="slideinput" 
                type="range" 
                min="0" max="5" 
                value={value} 
                onChange={(e) => onInputChange(e.target.value)}
                step="1"/>
        )
}
