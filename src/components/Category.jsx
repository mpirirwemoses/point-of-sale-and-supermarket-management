import { title } from "framer-motion/client"
import { useState } from "react"

const Category=()=>{
    const[category, setCategory] = useState("All")
    const[option,setOption] =useState("");
    const Category =["All","Men","women"]
    const categoriesObj= {
        All:{
            id:1,
            title:"all",
            content: "This all belongs to the All Category , wish the best Experience",
            products:["Men","work", "Experience"]
        }
        ,
        Men:{
            id:2,
            title:"all",
            content: "This all belongs to the All Category , wish the best Experience",
            products:["Men","work", "Experience"]
        }
    }

    const handleCategoryChange=(type)=>{
        setCategory(type);

    }
    const handleProductChange=()=>{
        setOption(e.target.value)
    }
    return(
        <div className="">
            <div className="">
                {
                    category.map((type, i)=>{
                        return(
                            <button key={i} onClick={()=>{setCategory(type),handleCategoryChange(type)}} className="">
{type}
                            </button>
                        )

                    })
                }
            </div>
            <div className=""
            >
                {category&&(
                    <div className="">
                    <div className="">
                        {categoriesObj[category].content}

                    </div>
                    <div className="">
                        {categoriesObj[category].products.map((type, index)=>{
                            return(
                                <div key={index} className="">
                                    <select name="product" >
                                        <option value="product"
                                        onChange={handleProductChange}
                                        >
                                            {type}
                                        </option>
                                    </select>
                                </div>
                            )
                        })}
                    </div>
                    </div>
                   
                )}
            </div>
            <div className=""></div>
        </div>
    )
}
export default Category