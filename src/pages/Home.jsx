import { useState } from 'react'
import { useGetMealsQuery, useSearchMealsQuery } from '../redux/apiSlice'
import { Link } from 'react-router-dom'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  const { data: mealsData, isLoading } = useGetMealsQuery()
  const { data: searchData } = useSearchMealsQuery(searchTerm, {
    skip: searchTerm === '',
  })

  const data = searchTerm ? searchData : mealsData

  const itemsPerPage = 10

  if (isLoading) return <p>Loading...</p>

  const meals = data?.meals || []
  const totalPages = Math.ceil(meals.length / itemsPerPage)

  const paginatedMeals = meals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <div style={{ padding: '20px' }}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setPage(1)
        }}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '20px',
        }}
      />

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
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
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
                <h4 style={{ margin: 0 }}> {meal.strMeal}</h4>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Page buttons */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
        >
          Prev
        </button>

        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Home