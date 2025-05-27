import { useState } from "react"

const Navigate =()=>{
    const [input ,setInput]= useState("")
    const FinalObj = {
        option1 :"",
        option2:"",
        your_response:""
    }
    const Options= {
        page1:["i choose you", "Ichose "],
        page2:["i chose her", "ichoose them"]
    }
    const handleChange=(e)=>{
        setInput(e.target.value)

    }
   const  handleNext=()=>{
    
   }
    return(
        <div className="">
            <div className="">
                {Options[page1].map((option,i)=>(
                    <div key={i} className="">
                        {option}
                    </div>
                ))}
                <button onClick={()=>{handleNext()}} className="">Next</button>
            </div>
            <div className="">
                {Options[page2].map((option,i)=>(
                    <div key={i} className="">
                        {option}
                    </div>
                ))}
                <button onClick={()=>{handleNext()}} className="">Next</button>

            </div>
            <div className="">
                <input
                 type="text"
                onChange={handleChange}
                name="response"
                value="final_response"
                className=""

                
                
                />
                <button onClick={()=>{handleSubmit()}} className="">submit</button>

            </div>
        </div>
    )
}
export default Navigate