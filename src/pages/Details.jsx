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
      <h3>Instructions</h3>

      {meal.strInstructions
        .split('. ')
        .map((step, index) => (
          <p key={index}>
            <strong>Step {index + 1}:</strong> {step.trim()}.
          </p>
        ))}
    </div>

  </div>
)