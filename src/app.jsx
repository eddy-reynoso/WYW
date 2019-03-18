const contentNode = document.getElementById('contents');

class BodyStats extends React.Component {
    render() {
        const borderedStyle = {border: "1px solid black", padding: 6};
        return (
          <table style={{borderCollapse: "collapse"}}>
            <thead>
              <tr>
                <th style={borderedStyle}>Height</th>
                <th style={borderedStyle}>Weight</th>
                <th style={borderedStyle}>Age</th>
                <th style={borderedStyle}>Biological Gender</th>
              </tr>
            </thead>
            <tbody>
              <BodyRow body_weight=" "
              body_height = " " 
              body_age = " "
              body_gender = " "/>
            </tbody>
          </table>
        )
      }
}

class BodyRow extends React.Component {
    render() {
      const borderedStyle = {border: "1px solid black", padding: 4};
      return (
        <tr>
            <td style={borderedStyle}>{this.props.body_height}</td>
            <td style={borderedStyle}>{this.props.body_weight}</td>
            <td style={borderedStyle}>{this.props.body_age}</td>
            <td style={borderedStyle}>{this.props.body_gender}</td>
        </tr>
      )
    }
  }

class NutritionStats extends React.Component {
  render() {
    return (
      <div>This is a placeholder for ingested calories and meals.</div>
    )
  }
}

class AddBodyInfo extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.updateBodyStat;
        this.props.createIssue({
          height: form.height.value,
          weight: form.weight.value,
        });
        // clear the form for the next input
        form.height.value = ""; form.weight.value = "";
      }
    
      render() {
        return (
          <div>
            <form name="updateBodyStat" onSubmit={this.handleSubmit}>
              <input type="text" name="height" placeholder="Height" />
              <input type="text" name="weight" placeholder="Weight" />
              <button>Update</button>
            </form>
          </div>
        )
      }
}

class FitnessTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Fitness Tracker</h1>
        <BodyStats />
        <hr />
        <AddBodyInfo />
        <hr />
        <NutritionStats />
      </div>
    );
  }
}

ReactDOM.render(<FitnessTracker />, contentNode);  // Render the component inside the content Node