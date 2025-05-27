const Header = ()=>{
return(
    <header className="flex flex-row w-full 
    justify-between items-center p-4 bg-gray-800 text-white">
<div className="flex ">
    <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
    <h3 className="text-xl font-bold text-pink-400">Miami Hospital</h3>
</div>
<nav className="flex space-x-4">
    <a href="/" className="text-gray-300 hover:text-white hover:translate hover:scale-105">Home</a>
    <a href="/about" className="text-gray-300 hover:text-white hover:translate hover:scale-105">About</a>
    <a href="/services" className="text-gray-300 hover:text-white">Services</a>
    <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
</nav>
<div className="flex space-x-4">
    <a href="/login" className="text-pink-300 p-3 rounded-md hover:text-white">Login</a>
    <a href="/signup" className="text-pink-300 p-3 rounded-md hover:text-white">Sign Up</a>
</div>
    </header>
)
}
export default Header