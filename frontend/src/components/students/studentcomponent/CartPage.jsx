// src/components/CartPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart } from '../../../store/cartSlice';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
const CartPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.cart);
  const { user,loading,usererror } = useSelector((state) => state.auth);
  const navigate=useNavigate();
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);


  const totals = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.course.price;
      const offerPrice = price * (1 - item.course.offer_percentage / 100);
      
      acc.totalPrice += price;
      acc.totalOfferPrice += offerPrice;
      return acc;
    }, { totalPrice: 0, totalOfferPrice: 0 });
  }, [items]);

  const totalOfferPercentage = useMemo(() => {
    if (totals.totalPrice === 0) return 0;
    return ((totals.totalPrice - totals.totalOfferPrice) / totals.totalPrice * 100).toFixed(2);
  }, [totals]);


  const handleRemoveItem = (cartItemId) => {
    console.log(cartItemId,"this is our cart item id")
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(cartItemId)).then(() => {
          dispatch(fetchCart());  // Fetch the updated cart after removal
          Swal.fire(
            'Removed!',
            'The course has been removed from your cart.',
            'success'
          );
        });
      }
    });
  };
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (

    <div className="container mx-auto px-4 py-8">
      <Navbar user={user}/>
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-wrap -mx-4">
        
          {items.length>0 ?(<> <div className="w-full lg:w-2/3 px-4">  {items.map((item) => (
            <div key={item.id} className="flex items-center mb-6 bg-white p-4 rounded-lg shadow">
              <img src={item.course.thumbnail} alt={item.course.name} className="w-24 h-24 object-cover rounded mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl text-black font-semibold">{item.course.name}</h2>
                <p className="text-gray-600">by {item.course.creator}</p>
                <div className="mt-2">
                  {item.course.offer_percentage > 0 ? (
                    <>
                      <span className="font-bold text-lg text-black">₹{(item.course.price * (1 - item.course.offer_percentage / 100)).toFixed(2)}</span>
                      <span className="text-gray-500 line-through ml-2">₹{item.course.price}</span>
                    </>
                  ) : (
                    <span className="font-bold text-lg">₹{item.course.price}</span>
                  )}
                </div>
              </div>
              <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 font-bold text-xl">X</button>
            </div>
          ))}</div>
         
        
         <div className="w-full lg:w-1/3 px-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-blue-900">Cart Summary</h2>
                 {/* <div className="mb-4">
                  <h1 className="text-lg font-semibold">TOTAL</h1>
                  {items.map(item => (
                    <p key={item.id} className="text-gray-600">{item.course.name}</p>
                  ))}
                </div>  */}
                <div className="mb-4">
                <h1 className="font-semibold text-3xl text-black">₹{totals.totalPrice.toFixed(2)}</h1>
                  <h2 className="font-semibold text-lg  text-gray-400">₹{totals.totalOfferPrice.toFixed(2)}</h2>
                  <h3 className="font-semibold text-xl text-gray-600">{totalOfferPercentage}%</h3>
                  {/* <p className="font-semibold text-black">Total Price: <span className="text-gray-600">₹{totals.totalPrice.toFixed(2)}</span></p>
                  <p className="font-semibold text-black">Total Offer Price: <span className="text-green-600">₹{totals.totalOfferPrice.toFixed(2)}</span></p>
                  <p className="font-semibold text-black">Total Savings: <span className="text-red-600">₹{(totals.totalPrice - totals.totalOfferPrice).toFixed(2)}</span></p> */}
                </div>
                {/* <div className="mb-4">
                  <p className="font-bold text-lg text-black">Total Offer Percentage: <span className="text-green-600">{totalOfferPercentage}%</span></p>
                </div> */}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
                onClick={()=> navigate('/checkout')}
                type="button">
                  Proceed to Payment
                </button>
              </div>
            </div>
          </>
        ) :(
        <div className="w-full h-[70vh] flex justify-center items-center">
        <div className="w-[30%] md:w-[40%] max-w-[300px]">
          <img 
            src="/emptycart.png" 
            alt="This cart is empty" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
        )
        }
      </div>
    </div>
  );
};

export default CartPage;