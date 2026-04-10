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
  <div className="recipe-page">

    <button className="back-btn" onClick={() => navigate(-1)}>
      ← Back
    </button>

    <h1 className="recipe-title">{meal.strMeal}</h1>

    <div className="recipe-image-container">
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="recipe-image"
      />
    </div>

    <div className="recipe-content">

      <section className="ingredients">
        <h2>Ingredients</h2>
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
      </section>

      <section className="instructions">
        <h2>Instructions</h2>

        {meal.strInstructions
          ?.split('. ')
          .map((step, index) => (
            <p key={index}>
              <strong>Step {index + 1}:</strong> {step.trim()}.
            </p>
          ))}
      </section>

    </div>
  </div>
  )
}

export default Details