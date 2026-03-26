import React, { useEffect, useState, useRef } from 'react'
import { IoSearch } from "react-icons/io5"
import { IoCloseOutline } from "react-icons/io5"
import { FaArrowLeft } from "react-icons/fa"
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useMobile from '../hooks/useMobile'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { valideURLConvert } from '../utils/valideURLConvert'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const Search = ({ isFullWidth = false, close }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isMobile] = useMobile()
    const inputRef = useRef(null)

    const params = new URLSearchParams(location.search)
    const searchText = params.get('q')
    const [inputValue, setInputValue] = useState(searchText || "")
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [animationDone, setAnimationDone] = useState(false)

    const isSearchPage = location.pathname === "/search"
    const isHomePage = location.pathname === "/"

    const categoryData = useSelector((state) => state.product.allCategory || [])

    // Auto focus input and handle animation delay
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
        
        const timer = setTimeout(() => {
            setAnimationDone(true)
        }, 800) // Clearer separation: 0.8s total delay before dropdown starts appearing

        return () => clearTimeout(timer)
    }, [])

    // If returning to search page with a query, fetch suggestions
    useEffect(() => {
        if (isSearchPage && searchText) {
            fetchSuggestions(searchText)
        }
    }, [location])

    const fetchSuggestions = async (value) => {
        if (!value || value.trim() === "") {
            setSuggestions([])
            return
        }
        setLoading(true)
        try {
            const response = await Axios({
                ...SummaryApi.searchProduct,
                data: { search: value, page: 1, limit: 8 }
            })
            if (response.data.success) {
                setSuggestions(response.data.data || [])
            }
        } catch (err) {
            console.error("Search error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const value = e.target.value
        setInputValue(value)
        fetchSuggestions(value)
        if (value) setIsOpen(true)
        else setIsOpen(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            navigate(`/all-products?q=${encodeURIComponent(inputValue)}`)
            setIsOpen(false)
            if (close) close()
        }
        if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    const handleSuggestionClick = (product) => {
        const url = `/product/${valideURLConvert(product.name)}-${product._id}`
        navigate(url)
        setIsOpen(false)
        if (close) close()
    }

    const handleSearchAll = () => {
        if (inputValue.trim()) {
            navigate(`/all-products?q=${encodeURIComponent(inputValue)}`)
            setIsOpen(false)
            if (close) close()
        }
    }

    const handleClear = () => {
        setInputValue("")
        setSuggestions([])
        setIsOpen(false)
        if (close) close()
        if (inputRef.current) inputRef.current.focus()
    }

    return (
        <div className={`relative w-full ${isFullWidth ? 'max-w-2xl mx-auto' : ''}`}>

            {/* Search Input Bar */}
            <div className={`flex items-center shadow-lg gap-2 bg-white border-2 rounded-full transition-all duration-200 animate-search-expand ${isOpen ? 'ring-2 ring-[#1d9963]' : 'border-gray-300'} ${isFullWidth ? 'h-14 px-5' : 'h-11 px-4'}`}>

                {/* Left icon */}
                <div className="flex-shrink-0 text-gray-400">
                    {isMobile && isSearchPage ? (
                        <button onClick={() => navigate(-1)}>
                            <FaArrowLeft size={18} className="text-gray-500" />
                        </button>
                    ) : (
                        <IoSearch size={20} />
                    )}
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (inputValue || categoryData.length) setIsOpen(true) }}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    placeholder="Search for products..."
                    className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 font-medium"
                />

                {/* Clear Button */}
                {(inputValue || close) && (
                    <button onClick={handleClear} className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0">
                        <IoCloseOutline size={22} />
                    </button>
                )}
            </div>

            {/* Dropdown - Only show after animation is done for a polished look */}
            {isOpen && animationDone && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[99] animate-in fade-in slide-in-from-top-2 duration-300">

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center p-6 gap-3">
                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-400">Searching...</span>
                        </div>
                    )}

                    {/* Product Suggestions */}
                    {!loading && suggestions.length > 0 && (
                        <div className="py-3">
                            <div className="px-4 pb-2 mb-2 border-b border-gray-50 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</p>
                                <span className="text-[10px] text-gray-300 font-medium">{suggestions.length} matches</span>
                            </div>
                            {suggestions.map((product, idx) => {
                                const price = product.attributes?.[0]?.options?.[0]?.price
                                const unit = product.attributes?.[0]?.options?.[0]?.name

                                return (
                                    <button
                                        key={product._id}
                                        onMouseDown={() => handleSuggestionClick(product)}
                                        className="flex items-center gap-4 w-full px-5 py-3 hover:bg-green-50/50 transition-all text-left group"
                                    >
                                        {/* Product Image */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <img
                                                src={product.image?.[0]}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-1"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors truncate">
                                                {product.name}
                                                {unit && <span className="text-gray-400 font-normal text-xs ml-1">({unit})</span>}
                                            </p>
                                            {price !== undefined && (
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-sm font-bold text-green-600">
                                                        {DisplayPriceInRupees(price)}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 font-medium px-1.5 py-0.5 bg-gray-50 rounded">In Stock</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}

                            {/* View All Results */}
                            <div className="px-3 pt-3 mt-2 border-t border-gray-50">
                                <button
                                    onMouseDown={handleSearchAll}
                                    className="w-full py-3 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-md shadow-green-100 active:scale-[0.98]"
                                >
                                    View all results for "{inputValue}"
                                </button>
                            </div>
                        </div>
                    ) || ""}

                    {/* No Results */}
                    {!loading && inputValue && suggestions.length === 0 && (
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-400">No products found for "<span className="text-gray-700 font-medium">{inputValue}</span>"</p>
                        </div>
                    )}

                    {/* Quick Category Filters (shown when empty) */}
                    {!loading && !inputValue && categoryData.length > 0 && (
                        <div className="py-4">
                            <div className="px-6 pb-2 mb-2 border-b border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Browse Categories</p>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 px-4">
                                {categoryData.slice(0, 12).map((cat, idx) => (
                                    <button
                                        key={cat._id}
                                        onMouseDown={() => {
                                            navigate(`/all-products?category=${cat._id}`)
                                            setIsOpen(false)
                                            if (close) close()
                                        }}
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                        className="flex flex-col items-center p-2 rounded-2xl hover:bg-green-50 transition-all group active:scale-95 animate-pop-in"
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white group-hover:shadow-sm transition-all mb-1.5 p-1 flex items-center justify-center">
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 truncate w-full group-hover:text-green-700">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search
