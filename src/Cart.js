import React, { useState } from "react";
import "./cart.css";
import { Medicines } from "./Medicines";
import Items from "./Items";
import { Scrollbars } from 'react-custom-scrollbars-2';


// const initialState = {
//   item: Medicines,
//   totalAmount: 0,
//   totalItem: 0,
// };

const Cart = () => {
  const [item, setItem] = useState(Medicines);
  //const [state, dispatch] = useReducer(reducer, initialState);

//   // to delete the indv. elements from an Item Cart
//   const removeItem = (id) => {
//     return dispatch({
//       type: "REMOVE_ITEM",
//       payload: id,
//     });
//   };

//   // clear the cart
//   const clearCart = () => {
//     return dispatch({ type: "CLEAR_CART" });
//   };

//   // increment the item
//   const increment = (id) => {
//     return dispatch({
//       type: "INCREMENT",
//       payload: id,
//     });
//   };

//   // decrement the item
//   const decrement = (id) => {
//     return dispatch({
//       type: "DECREMENT",
//       payload: id,
//     });
//   };

//   // we will use the useEffect to update the data
//   useEffect(() => {
//     dispatch({ type: "GET_TOTAL" });
//     // console.log("Awesome");
//   }, [state.item]);

  return (
    // <CartContext.Provider
    //   value={{ ...state, removeItem, clearCart, increment, decrement }}>
    //   <ContextCart />
    // </CartContext.Provider>

    <>
    <header>
        <div className="continue-shopping">
            <h3>Continue shopping</h3>
        </div>
    </header>

    <section className="main-cart-section">
        <h1>Shopping cart</h1>
        <p className="total-items">You have total 7 items</p>

        <div className="cart-items">
            <div className="cart-items-container">
                <Scrollbars>
                    {
                        item.map((curItem) => {

                            return <Items key={curItem.id} {...curItem} />
                        })
                    }
                    <Items />
                </Scrollbars>
            </div>
        </div>
    </section>
    </>
  );
};

export default Cart;