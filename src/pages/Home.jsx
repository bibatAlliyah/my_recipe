import { useState, useEffect, useRef } from 'react'
import { useGetMealsQuery, useSearchMealsQuery } from '../redux/apiSlice'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png';

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [filterType, setFilterType] = useState('All')

  const navigate = useNavigate()
  const keyIndex = useRef(0)

  const konami = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'
  ]

  useEffect(() => {
    const handler = (e) => {
      const key = e.key

      if (key.toLowerCase() === konami[keyIndex.current].toLowerCase()) {
        keyIndex.current += 1

        if (keyIndex.current === konami.length) {
          keyIndex.current = 0
          sessionStorage.setItem('konami_unlocked', 'true')
          navigate('/flag')
        }
      } else {
        keyIndex.current = 0
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  const { data: mealsData, isLoading, error } = useGetMealsQuery()
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError
  } = useSearchMealsQuery(searchTerm, {
    skip: searchTerm === '',
  })

  const data = searchTerm ? searchData : mealsData

  const cleanInput = (input) => {
    return input.replace(/[^a-zA-Z0-9 ]/g, '')
  }

  if (isLoading || searchLoading)
  return (
    <div className="loading-screen">
      <div className="loading-wrapper">

        <div className="loading-wave">🍤</div>

        <p className="loading-text">
          Cooking something delicious...
        </p>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </div>
  )

  if (error || searchError)
    return <p className="status-text error">Error fetching data</p>

  if (!data?.meals)
  return (
    <div className="empty-screen">
      <div className="empty-card">

        <div className="empty-icon">🍤</div>

        <h2>No meals found</h2>

        <p>
          Try adjusting your search or filter — the kitchen is a bit empty right now.
        </p>

      </div>
    </div>
  )

  let meals = data.meals

  if (filterType !== 'All') {
    meals = meals.filter((meal) =>
      meal.strMeal.toLowerCase().includes(filterType.toLowerCase())
    )
  }

  const itemsPerPage = 10
  const totalPages = Math.ceil(meals.length / itemsPerPage)

  const paginatedMeals = meals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const filterOptions = [
    'All',
    'Salmon',
    'Shrimp',
    'Prawn',
    'Fish',
    'Tuna',
    'Squid'
  ]

  return (
    <div className="home-container">
      <div class="wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,64 C240,120 480,0 720,64 C960,120 1200,0 1440,64 L1440,0 L0,0 Z" 
            fill="#7dd3fc">
          </path>
        </svg>
      </div>
      <img src={logo} alt="Logo" className="logo" />

      <h1 class="home-title">Catch something good today.</h1>
      <p class="home-subtitle">
         A curated collection of seafood recipes made for everyday cooking—fresh, simple, and always worth a try.
      </p>

      <p class="subtle-note">for your コナミコマンド</p>
      <div className="controls">
        <input
          type="text"
          placeholder="🔎 Search meals..."
          value={searchTerm}
          onChange={(e) => {
            const value = cleanInput(e.target.value)
            setSearchTerm(value)
            setPage(1)
          }}
          className="search-input"
        />

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value)
            setPage(1)
          }}
          className="filter-dropdown"
        >
          {filterOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="meal-grid">
        {paginatedMeals.map((meal) => (
          <Link
            to={`/meal/${meal.idMeal}`}
            key={meal.idMeal}
            className="meal-link"
          >
            <div className="meal-card">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="meal-image"
              />
              <div className="meal-content">
                <h4 className="meal-title">{meal.strMeal}</h4>

                <button
                  className="cook-btn"
                  onClick={() => navigate(`/meal/${meal.idMeal}`)}
                >
                  Start Cooking!
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`page-btn ${page === pageNum ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      <div class="wave-container">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,64 C240,120 480,0 720,64 C960,120 1200,0 1440,64 L1440,120 L0,120 Z" 
            fill="#7dd3fc">
          </path>
        </svg>
      </div>
    </div>
  )
}

export default Home