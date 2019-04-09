
  
  var contentNode = document.getElementById("mealcontent");
  
  class MealSummary extends React.Component {
    render() {
      return (<div>
        <h4>Enter food name and information</h4>
        </div>

      );
    }
  }
  
  /*
        <h4>Total Calories: {this.props.totalCalories}</h4>

  */
  
  const FoodTableRow = (props) => (
    <tr>
      <td>{props.food.foodName}</td>
      <td>{props.food.numberOfServings}</td>
      <td>{props.food.mealType}</td>
      <td>{props.food.calories}</td>
      <td>{props.food.fat}</td>
      <td>{props.food.carbohydrates}</td>
    </tr>
  );
  
  
  function MealTable(props) {
    const FoodTableRows = props.foods.map(food => (
      <FoodTableRow key={food.id} food={food} />
    ));
    return (
      <table className="bordered-table">
        <thead>
          <tr>
            <th>Food Name</th>
            <th>Servings</th>
            <th>Meal Type</th>
            <th>Calories</th>
            <th>Fat</th>
            <th>Carbohydrates</th>
          </tr>
        </thead>
        <tbody>{FoodTableRows}</tbody>
      </table>
    );
  }
  
  class AddMeal extends React.Component {
    constructor() {
      super();
      this.state = {
        mealType: 'Breakfast',
    }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleSelectChange = this.handleSelectChange.bind(this);
    }
  
    handleSubmit(e) {
      e.preventDefault();
      let form = document.forms.addMeal;
      this.props.createFood({
        foodName: form.foodName.value,
        calories: form.calories.value,
        mealType: this.state.mealType,
        fat: form.fat.value,
        carbohydrates: form.carbohydrates.value,
        numberOfServings: form.numberOfServings.value,
      });
 
      // Clear the form for the next input.
      form.foodName.value = '';
      form.calories.value = '';
    }

    handleSelectChange(e){
        this.setState({mealType: e.target.value});
      }
  
    render() {
      return (
        <div>
          <form name="addMeal" onSubmit={this.handleSubmit}>
            <input type="text" name="foodName" placeholder="Food Name" />
            <input type="text" name="calories" placeholder="Calories" />
            <input type="text" name="fat" placeholder="Fat" />
            <input type="text" name="carbohydrates" placeholder="Carbohydrates"/>
            <input type="number" name="numberOfServings" placeholder="Number of Servings"/>

            <select 
                                defaultValue= 'Breakfast'
                                value={this.state.mealType} 
                                onChange={this.handleSelectChange}
   >
    <option value="Breakfast">Breakfast</option>
    <option value="Lunch">Lunch</option>
    <option value="Dinner">Dinner</option>
    <option value="Snack">Snack</option>
        </select>
            <button>Add</button>
          </form>
        </div>
      );
    }
  }
  
  class MealList extends React.Component {
    constructor() {
      super();
      this.state = { foods: [],
      totalCalories: 0 };
    
      this.addMeal = this.addMeal.bind(this);
    }
  
    componentDidMount() {
      this.loadData();
    }
  
    loadData() {
  
      fetch('/api/meals').then(response => {
        if (response.ok) {
          response.json().then(data => {
            data.records.forEach(meal => {
              meal.created = new Date(meal.created);
              if (meal.completionDate)
                meal.completionDate = new Date(meal.completionDate);
            });
            this.setState({ foods: data.records });
            this.setState({totalCalories: 0});
          });
        } else {
          response.json().then(error => {
            alert("Failed to fetch issues:" + error.message)
          });
        }
      }).catch(err => {
        alert("Error in fetching data from server:", err);
      });
   
}

/*
     this.setState({
          foods: foods,
        });
        this.calculateCalories();
*/

  
    addMeal(newMeal) {
      fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeal),
      })
        .then(res => {
          if (res.ok) {
            res.json()
              .then(updatedMeal => {
                const newMeals = this.state.foods.concat(updatedMeal);
                this.setState({ foods: newMeals });
                  this.setState({totalCalories: newMeals.reduce((total, amount) => total.calories + amount.calories)});
              });
          }
          else {
            res.json()
              .then(error => {
                alert('Failed to add issue: ' + error.message);
              });
          }
        });
      
      
  }

  /*
const newMeals = this.state.foods.slice();
      newMeal.id = this.state.foods.length + 1;
      newMeals.push(newMeal);
      this.setState({ foods: newMeals,
        totalCalories: Number(this.state.totalCalories) + Number(newMeal.calories)
    });
  */
  
    render() {
      return (
        <div>
          <h1>Meal Tracker</h1>
          <MealSummary totalCalories = {this.state.totalCalories} />
          <hr />
          <MealTable foods={this.state.foods} />
          <hr />
          <AddMeal createFood={this.addMeal} />
        </div>
      );
    }
  }
  
  // This renders the JSX component inside the content node:
  ReactDOM.render(<MealList />, contentNode);