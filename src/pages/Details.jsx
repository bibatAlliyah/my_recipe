import { useParams, useNavigate } from 'react-router-dom'
import { useGetMealByIdQuery } from '../redux/apiSlice'

function Details() {
  const { id } = useParams()
  const navigate = useNavigate()

  //get meal data
  const { data, isLoading, error } = useGetMealByIdQuery(id)
  const meal = data?.meals?.[0]

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>
  Loading meals...
</p>
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>
  Error fetching data
</p>
  if (!meal) return <p>No meal found</p>

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'left' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            marginBottom: '20px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          ← Home
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1>{meal.strMeal}</h1>

        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          style={{
            width: '300px',
            borderRadius: '10px'
          }}
        />
      </div>

      <div style={{ marginTop: '20px', lineHeight: '1.8', textAlign: 'left' }}>
        <h3>Ingredients</h3>
        <ul>
          {[...Array(20)].map((_, i) => {
            const ingredient = meal[`strIngredient${i + 1}`]
            const measure = meal[`strMeasure${i + 1}`]

            if (!ingredient) return null

            return (
              <li key={i}>
                {ingredient} - {measure}
              </li>
            )
          })}
        </ul>

        <h3>Instructions</h3>

        {meal.strInstructions
          ?.split('. ')
          .map((step, index) => (
            <p key={index}>
              <strong>Step {index + 1}:</strong> {step.trim()}.
            </p>
          ))}
      </div>
    </div>
  )
}

export default Details