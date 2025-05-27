
import image1 from "../assets/images/coffee-4862622_1280.jpg"
const Food=()=>{
    return(
        <div className="w-[500px] mt-4 -pt-2 h-[500px] overflow-hidden bg-gray-200 rounded-lg shadow-lg flex flex-col items-center bg-[#FFFAFA] justify-center">
            <img
                src={image1}
                alt="Food"
                className="w-full  h-[300px] object-cover   mb-4"/>
                <div className="flex w-full flex-col -px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Healthy Food</h2>
                    <p className="text-gray-600 font-sans text-xl ">Discover a variety of healthy and delicious meals.</p>
                    <p className ="text-gray-600 font-bold">Price $:<span className="text-pink-500 font-bold">5000</span> </p>
                    <p className ="text-gray-600">Discount $:<span className="">5000</span> </p>
                    <button className="mt-4 px-6 w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300">
        Order Now
      </button>
                </div>
                
           
        </div>
    )
}
export default Food