import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { getComparisonPrices } from '../utils/getComparisonPrices'
import { useState } from 'react'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading, setLoading] = useState(false)

    // Calculate prices for Blinkit, Zepto, and Instamart
    const { blinkit, zepto, instamart } = getComparisonPrices(data.price)
    const prices = [blinkit, zepto, instamart]
    const lowest = Math.min(...prices)

    return (
        <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white'>
            <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
                <img
                    src={data.image[0]}
                    className='w-full h-full object-scale-down lg:scale-125'
                />
            </div>
            <div className='flex items-center gap-1'>
                <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
                    10 min
                </div>
            </div>
            <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
                {data.name}
            </div>
            <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
                {data.unit}
            </div>

            <div className='px-2 lg:px-0 flex flex-col items-start gap-1 text-sm lg:text-base'>
                {/* Best Price Bubble */}
                <span className='bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-[2px] rounded-full shadow-md'>
                    Best Price
                </span>
                {/* Price */}
                <div className='font-semibold text-lg'>
                    ₹{lowest}
                </div>
                <div>
                    {
                        data.stock === 0 ? (
                            <p className='text-red-500 text-sm text-center'>Out of stock</p>
                        ) : (
                            <AddToCartButton data={data} />
                        )
                    }
                </div>
            </div>
        </Link>
    )
}

export default CardProduct
