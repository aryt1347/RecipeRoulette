import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import { Row, Col, Card, Spinner } from "react-bootstrap";
import ReactPlayer from 'react-player'

function Ingredients({ingredientsList}){

  return (
    <div>
      <ul>

      {ingredientsList.map((ingredient, index) => (
        ingredient.components.map((component, compIndex) => (
          <li key={`${index}-${compIndex}`}>{component.raw_text}</li>
        ))
      ))}


      </ul>

    
    </div>
  );

}



function App() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);


  const fetchRecipes = async () => {
    const url = `https://tasty.p.rapidapi.com/recipes/list?from=${offset}&size=3&q=${query}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "",
        "x-rapidapi-host": "tasty.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setRecipes(result.results);
      setLoading(false);
      setSelectedRecipe(null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };


    // useEffect(() => {
    // fetchRecipes();
    // }, []);

  function handleRegen() {

    // Offset the next 3 recipes
    setOffset(offset+3);
    fetchRecipes();

  }

  function handleRecipeClick(recipe) {
    setSelectedRecipe(recipe);
  }
  
  function handleInputChange(query) {

    setQuery(query.target.value);
  }

  function handleQuery(){
    setLoading(true);
    setOffset(0);
    setHasSearched(true);
    fetchRecipes();
  }

  return (
    <div>

      <h1>The Recipe Finder</h1>

       {/* Put this into a form */}

       <div className="d-flex justify-content-center mb-3">
        <input
          className="form-control"
          name="query_input"
          value={query}
          placeholder="Search for something tasty"
          onChange={handleInputChange}
        />
        <Button variant="primary" className="ms-3" onClick={handleQuery}>
          Search
        </Button>
      </div>

      {
        
          (recipes && !loading) ?  ( 

            <div>
                <Row
                xs={1}
                sm={2}
                md={3}
                lg={4}
                className="g-4 d-flex justify-content-center"
             >
          {recipes.map((recipe, index) => (
            <Col key={index}>
              <Card className="border-0" onClick={() => handleRecipeClick(recipe)}>
                <Card.Img
                  variant="bottom"
                  src={recipe.thumbnail_url}
                  style={{ height: "200px", width: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>Total Cook Time: {recipe.total_time_minutes} minutes</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="m-3">
        <Button onClick={handleRegen}>Regenerate</Button>
        <p>Not seeing anything you like? Try again!</p>
          </div>
     
        </div>
      
          )

          : (  <div>
            <Spinner animation="border" variant="primary" />
          </div>)

      }
    

      {
        (recipes.length == 0 && !loading && hasSearched) ? (
          <p className="m-3">No recipes to be found. Please search again.</p>
        ) : null

      }

      {(selectedRecipe && !loading) && (
          <>
            <div className="d-flex justify-content-center">

          <div className="text-start w-50">

            <h1>How to Make {selectedRecipe.name}</h1>

            <ReactPlayer url={selectedRecipe.original_video_url} controls/>

            <h4>Description</h4>

            <p>{selectedRecipe.description}</p>

            <h4>Ingredients</h4>

            <Ingredients ingredientsList={selectedRecipe.sections} />

            <h4>Instructions</h4>

            {selectedRecipe.instructions.map( (step, index) =>

              <p key={index}> <strong>Step {index+1}:</strong> {step.display_text}</p>

            )

            }

          </div>
          </div>

          </>
        )}

     
    </div>
  );
}

export default App;
