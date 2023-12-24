import "./App.css";
import { useReducer, useState } from "react";

const initialState = {
  // Define your initial state properties here
  menu: [
    {
      menu: "Dosa",
      price: 40,
      quantity: 0,
    },
    {
      menu: "Idli",
      price: 20,
      quantity: 0,
    },
    {
      menu: "Vada",
      price: 10,
      quantity: 0,
    },
    {
      menu: "Chapathi",
      price: 30,
      quantity: 0,
    },
    {
      menu: "Rava Upma",
      price: 40,
      quantity: 0,
    },
  ],
  totalbill: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    // Handle different actions based on their types
    case "INCREMENT":
      return {
        ...state,
        menu: state.menu.map((item) =>
          item.menu === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREMENT":
      return {
        ...state,
        menu: state.menu.map((item) =>
          item.menu === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };

    case "update":
      return {
        ...state,
        menu: [...state.menu, action.payload],
      };

    case "delete":
      return {
        ...state,
        menu: state.menu.filter((item) => item.menu !== action.payload),
      };

    case "updatePrice":
      return {
        ...state,
        menu: state.menu.map((item) =>
          item.menu === action.menu ? { ...item, price: action.payload } : item
        ),
      };

    case "totalbill":
      return {
        ...state,
        totalbill: state.menu.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0),
      };

    case "reset":
      return initialState;

    default:
      throw new Error("Invalid Action");
  }
};

function App() {
  const [{ menu, totalbill }, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App p-10 flex flex-col  mt-10 items-center">
      <MenuItems menu={menu}>
        {menu.map((item, index) => (
          <Item item={item} dispatch={dispatch} key={index} index={index} />
        ))}
      </MenuItems>
      <Results totalbill={totalbill} dispatch={dispatch} />
      <ChangeItems menu={menu} dispatch={dispatch} />
    </div>
  );
}

export default App;

//MenuItems
function MenuItems({ children, menu }) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      {children}
    </div>
  );
}

function Item({ item, dispatch, index }) {
  return (
    <div className="flex flex-col bg-slate-200 justify-center gap-4 items-start p-5 rounded-lg  ">
      <h2 className=" text-2xl font-medium">{item.menu}</h2>
      <h3 className="text-xl">Price: {item.price} INR</h3>
      <div className="flex gap-3 items-center">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => dispatch({ type: "DECREMENT", payload: item.menu })}
        >
          -
        </button>
        <h2 className="text-xl"> {item.quantity}</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => dispatch({ type: "INCREMENT", payload: item.menu })}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Results({ totalbill, dispatch }) {
  // const totalbill = menu.reduce((acc, item) => {
  //   return acc + item.price * item.quantity;
  // }, 0);
  return (
    <div className="mt-8 flex flex-col items-start gap-3">
      <div className="flex gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => dispatch({ type: "totalbill" })}
        >
          Calculate Bill
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset
        </button>
      </div>
      <h2 className="text-2xl font-medium"> Total bill: {totalbill} INR</h2>
    </div>
  );
}

function ChangeItems({ menu, dispatch }) {
  const [newitem, setnewitem] = useState("");
  const [newprice, setnewprice] = useState("Dosa");

  const [updateprice, setupdateprice] = useState("");

  const [selectedvalue, setSelect] = useState();
  const [selectedvalue1, setSelect1] = useState();

  function handleUpdate(e) {
    if (!newitem || !newprice) return;
    if (menu.find((item) => item.menu === newitem)) return;
    e.preventDefault();
    dispatch({
      type: "update",
      payload: { menu: newitem, price: newprice, quantity: 0 },
    });
    setnewitem("");
    setnewprice("");
  }

  const handleMenuChange = (event) => {
    setSelect(event.target.value);
  };

  function handlePriceChange() {
    if (!updateprice) return;
    dispatch({
      type: "updatePrice",
      payload: updateprice,
      menu: selectedvalue1,
    });

    setupdateprice("");
  }

  return (
    <div className="mt-16 flex flex-col md:flex-row gap-16 items-start">
      <div className="flex flex-col items-start gap-4">
        <p className="text-2xl">Add Menu</p>

        <form className=" bg-white rounded shadow-md" onSubmit={handleUpdate}>
          <div className="mb-4">
            <label
              htmlFor="text"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Menu:
            </label>
            <input
              type="text"
              id="textInput"
              className="w-full p-2 border rounded-md"
              placeholder="Enter Menu"
              value={newitem}
              onChange={(e) => setnewitem(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="number"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price:
            </label>
            <input
              type="number"
              id="numberInput"
              className="w-full p-2 border rounded-md"
              placeholder="Price"
              value={newprice}
              onChange={(e) => setnewprice(Number(e.target.value))}
            />
          </div>

          <button
            type="Add"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-800"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="flex flex-col items-start gap-4">
        <p className="text-2xl">Price Change</p>
        <div className="flex flex-col gap-6">
          <select
            className="border border-grey-800 rounded-lg bg-slate-300"
            value={selectedvalue1}
            onChange={(e) => setSelect1(e.target.value)}
          >
            {menu.map((item) => (
              <option
                key={item.menu}
                className="border bg-slate-100"
                value={item.menu}
              >
                {item.menu}
              </option>
            ))}
          </select>

          <input
            type="number"
            id="numberInput"
            className="w-full p-2 border rounded-md"
            placeholder="Set New Price"
            value={updateprice}
            onChange={(e) => setupdateprice(Number(e.target.value))}
          />

          <button
            className="
          bg-blue-500
          hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded"
            onClick={() => handlePriceChange()}
          >
            price
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        <p className="text-2xl">Delete Items</p>
        <div className="flex gap-6">
          <select
            className="border border-grey-800 rounded-lg bg-slate-300"
            value={selectedvalue}
            onChange={handleMenuChange}
          >
            {menu.map((item) => (
              <option
                key={item.menu}
                className="border bg-slate-100"
                value={item.menu}
              >
                {item.menu}
              </option>
            ))}
          </select>
          <button
            className="
          bg-red-500
          hover:bg-red-700
          text-white
          font-bold
          py-2
          px-4
          rounded"
            onClick={() => dispatch({ type: "delete", payload: selectedvalue })}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
