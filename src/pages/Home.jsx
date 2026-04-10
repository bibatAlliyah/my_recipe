import { useState, useEffect, useRef } from 'react'
import { useGetMealsQuery, useSearchMealsQuery } from '../redux/apiSlice'
import { Link, useNavigate } from 'react-router-dom'

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

      if (
        key.toLowerCase() === konami[keyIndex.current].toLowerCase()
      ) {
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

  // input sanitizer
  const cleanInput = (input) => {
    return input.replace(/[^a-zA-Z0-9 ]/g, '')
  }

  if (isLoading || searchLoading)
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading meals...</p>

  if (error || searchError)
    return <p style={{ textAlign: 'center', color: 'red' }}>Error fetching data</p>

  if (!data?.meals)
    return <p>No results found</p>

  // 🔥 APPLY FILTERING HERE
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
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>コナミコマンド</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => {
          const value = cleanInput(e.target.value)
          setSearchTerm(value)
          setPage(1)
        }}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '10px',
        }}
      />

      {/* 🔽 FILTER DROPDOWN */}
      <select
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value)
          setPage(1)
        }}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        {filterOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Card Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        {paginatedMeals.map((meal) => (
          <Link
            to={`/meal/${meal.idMeal}`}
            key={meal.idMeal}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ff8686'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff'
              }}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '10px', flex: 1 }}>
                <h4 style={{ margin: 0 }}>{meal.strMeal}</h4>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Page buttons */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
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
              style={{
                margin: '0 5px',
                fontWeight: page === pageNum ? 'bold' : 'normal',
                textDecoration: page === pageNum ? 'underline' : 'none',
              }}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Home