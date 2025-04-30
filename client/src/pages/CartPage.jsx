import React from 'react'
import { useSelector } from 'react-redux'
import { getComparisonPrices, getDeliveryAndHandlingCharges } from '../utils/getComparisonPrices'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const CartPage = () => {
    const cartItem = useSelector(state => state.cartItem.cart)

    // Calculate totals for each cart
    const calculateCartTotals = (cart) => {
        let blinkitTotal = 0
        let zeptoTotal = 0
        let instamartTotal = 0

        cart.forEach(item => {
            const { blinkit, zepto, instamart } = getComparisonPrices(item?.productId?.price)
            const blinkitCharges = getDeliveryAndHandlingCharges("blinkit")
            const zeptoCharges = getDeliveryAndHandlingCharges("zepto")
            const instamartCharges = getDeliveryAndHandlingCharges("instamart")

            blinkitTotal += blinkit + blinkitCharges.delivery + blinkitCharges.handling
            zeptoTotal += zepto + zeptoCharges.delivery + zeptoCharges.handling
            instamartTotal += instamart + instamartCharges.delivery + instamartCharges.handling
        })

        return { blinkitTotal, zeptoTotal, instamartTotal }
    }

    const { blinkitTotal, zeptoTotal, instamartTotal } = calculateCartTotals(cartItem)

    // Store URLs
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
                        {cartItem.map((item, index) => {
                            const { blinkit } = getComparisonPrices(item?.productId?.price)
                            const blinkitCharges = getDeliveryAndHandlingCharges("blinkit", index)
                            return (
                                <div key={item?._id + "blinkitCart"} className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{item?.productId?.name}</p>
                                    <p className="font-semibold">{DisplayPriceInRupees(blinkit)}</p>
                                </div>
                            )
                        })}
                    </div>
                    <p className="mt-4 font-semibold text-right">
                        Total Price (Including Shipping and Platform Charges): {DisplayPriceInRupees(blinkitTotal)}
                    </p>
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
                        {cartItem.map((item, index) => {
                            const { zepto } = getComparisonPrices(item?.productId?.price)
                            const zeptoCharges = getDeliveryAndHandlingCharges("zepto", index)
                            return (
                                <div key={item?._id + "zeptoCart"} className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{item?.productId?.name}</p>
                                    <p className="font-semibold">{DisplayPriceInRupees(zepto)}</p>
                                </div>
                            )
                        })}
                    </div>
                    <p className="mt-4 font-semibold text-right">
                        Total Price (Including Shipping and Platform Charges): {DisplayPriceInRupees(zeptoTotal)}
                    </p>
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
                        {cartItem.map((item, index) => {
                            const { instamart } = getComparisonPrices(item?.productId?.price)
                            const instamartCharges = getDeliveryAndHandlingCharges("instamart", index)
                            return (
                                <div key={item?._id + "instamartCart"} className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{item?.productId?.name}</p>
                                    <p className="font-semibold">{DisplayPriceInRupees(instamart)}</p>
                                </div>
                            )
                        })}
                    </div>
                    <p className="mt-4 font-semibold text-right">
                        Total Price (Including Shipping and Platform Charges): {DisplayPriceInRupees(instamartTotal)}
                    </p>
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