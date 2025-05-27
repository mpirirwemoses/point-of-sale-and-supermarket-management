import React, { useState } from "react";

const Cal = () => {
  const [input, setInput] = useState(""); // Input state for the calculator
  const [result, setResult] = useState(""); // Result state for displaying the output

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        // Evaluate the input using MDAS rules
        setResult(evalMDAS(input));
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      // Clear the input and result
      setInput("");
      setResult("");
    } else {
      // Append the clicked value to the input
      setInput((prev) => prev + value);
    }
  };

  // Function to evaluate input based on MDAS rules
  const evalMDAS = (expression) => {
    try {
      // Replace ÷ with / and × with * for consistency
      expression = expression.replace(/÷/g, "/").replace(/×/g, "*");

      // Split the expression into numbers and operators
      const tokens = expression.match(/(\d+\.?\d*)|[\+\-\*/]/g);

      // Perform multiplication and division first
      let stack = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === "*" || token === "/") {
          const operator = token;
          const prev = parseFloat(stack.pop());
          const next = parseFloat(tokens[++i]);
          stack.push(operator === "*" ? prev * next : prev / next);
        } else {
          stack.push(token);
        }
      }

      // Perform addition and subtraction
      let total = parseFloat(stack[0]);
      for (let i = 1; i < stack.length; i += 2) {
        const operator = stack[i];
        const next = parseFloat(stack[i + 1]);
        total = operator === "+" ? total + next : total - next;
      }

      return total;
    } catch (error) {
      return "Error";
    }
  };

  return (
    <div className="cal flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Calculator</h1>
      <div className="w-full max-w-sm">
        {/* Display Input */}
        <input
          type="text"
          value={input}
          readOnly
          className="border border-gray-300 rounded-md p-2 w-full text-right mb-2"
        />
        {/* Display Result */}
        <input
          type="text"
          value={result}
          readOnly
          className="border border-gray-300 rounded-md p-2 w-full text-right mb-4 bg-gray-200"
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {/* Number Buttons */}
        {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", ".", 0, "=", "+"].map(
          (button, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(button)}
              className={`border border-gray-300 rounded-md p-2 ${
                ["+", "-", "*", "/", "="].includes(button)
                  ? "bg-pink-500 text-white"
                  : "bg-white"
              }`}
            >
              {button}
            </button>
          )
        )}

        {/* Clear Button */}
        <button
          onClick={() => handleButtonClick("C")}
          className="border border-gray-300 rounded-md p-2 bg-red-500 text-white col-span-4"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Cal;