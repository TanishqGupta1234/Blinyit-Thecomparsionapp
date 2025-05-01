import React from 'react'
import { useSelector } from 'react-redux'
import { getComparisonPrices, getDeliveryAndHandlingCharges } from '../utils/getComparisonPrices'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const CartPage = () => {
    const cartItem = useSelector(state => state.cartItem.cart)

    // Helper to sum item prices for a given store
    const getStoreSubtotal = (cart, store) =>
        cart.reduce((sum, item) => {
            const prices = getComparisonPrices(item?.productId?.price)
            return sum + prices[store]
        }, 0)

    // Get one set of charges per cart (randomized, but only once per cart)
    const blinkitCharges = getDeliveryAndHandlingCharges("blinkit", 0)
    const zeptoCharges = getDeliveryAndHandlingCharges("zepto", 1)
    const instamartCharges = getDeliveryAndHandlingCharges("instamart", 2)

    const blinkitSubtotal = getStoreSubtotal(cartItem, "blinkit")
    const zeptoSubtotal = getStoreSubtotal(cartItem, "zepto")
    const instamartSubtotal = getStoreSubtotal(cartItem, "instamart")

    const blinkitTotal = blinkitSubtotal + blinkitCharges.delivery + blinkitCharges.handling
    const zeptoTotal = zeptoSubtotal + zeptoCharges.delivery + zeptoCharges.handling
    const instamartTotal = instamartSubtotal + instamartCharges.delivery + instamartCharges.handling

    const storeUrls = {
        blinkit: 'https://blinkit.com',
        zepto: 'https://www.zeptonow.com',
        instamart: 'https://www.swiggy.com/instamart',
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-8">User Cart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Blinkit Cart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-yellow-600 mb-4">Blinkit Cart</h2>
                    <div className="space-y-4">
                        {cartItem.map((item) => {
                            const { blinkit } = getComparisonPrices(item?.productId?.price)
                            return (
                                <div key={item?._id + "blinkitCart"} className="border-b pb-2 mb-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{item?.productId?.name}</p>
                                        <p className="font-semibold">{DisplayPriceInRupees(blinkit)}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{DisplayPriceInRupees(blinkitSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{DisplayPriceInRupees(blinkitCharges.delivery)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Handling</span>
                            <span>{DisplayPriceInRupees(blinkitCharges.handling)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>{DisplayPriceInRupees(blinkitTotal)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.open(storeUrls.blinkit, '_blank')}
                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 w-full"
                    >
                        Go to Store
                    </button>
                </div>

                {/* Zepto Cart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-green-600 mb-4">Zepto Cart</h2>
                    <div className="space-y-4">
                        {cartItem.map((item) => {
                            const { zepto } = getComparisonPrices(item?.productId?.price)
                            return (
                                <div key={item?._id + "zeptoCart"} className="border-b pb-2 mb-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{item?.productId?.name}</p>
                                        <p className="font-semibold">{DisplayPriceInRupees(zepto)}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{DisplayPriceInRupees(zeptoSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{DisplayPriceInRupees(zeptoCharges.delivery)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Handling</span>
                            <span>{DisplayPriceInRupees(zeptoCharges.handling)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>{DisplayPriceInRupees(zeptoTotal)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.open(storeUrls.zepto, '_blank')}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 w-full"
                    >
                        Go to Store
                    </button>
                </div>

                {/* Instamart Cart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Instamart Cart</h2>
                    <div className="space-y-4">
                        {cartItem.map((item) => {
                            const { instamart } = getComparisonPrices(item?.productId?.price)
                            return (
                                <div key={item?._id + "instamartCart"} className="border-b pb-2 mb-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{item?.productId?.name}</p>
                                        <p className="font-semibold">{DisplayPriceInRupees(instamart)}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{DisplayPriceInRupees(instamartSubtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{DisplayPriceInRupees(instamartCharges.delivery)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Handling</span>
                            <span>{DisplayPriceInRupees(instamartCharges.handling)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>{DisplayPriceInRupees(instamartTotal)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.open(storeUrls.instamart, '_blank')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 w-full"
                    >
                        Go to Store
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartPage
