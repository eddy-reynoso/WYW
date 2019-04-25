// NEW: added the import for react.
import React from 'react';

class ReviewMessage extends React.Component {
  render() {
    return <div>Let us know how you feel about Watch Your Weight!</div>;
  }
}

const ReviewRow = (props) => (
  <tr>
    <td>{props.issue.name}</td>
    <td>{props.issue.rating}</td>
    <td>{props.issue.comment}</td>
  </tr>
);

function ReviewTable(props) {
  const reviewRows = props.reviewInfo.map(issue => (
    <ReviewRow key={issue.id} issue={issue} />
  ));
  return (
    <table className="table table-light">
      <thead className="thead-light">
        <tr>
          <th>Name</th>
          <th>Rating</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>{reviewRows}</tbody>
    </table>
  );
}

class ReviewAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let form = document.forms.issueAdd;
    this.props.createReview({
      name: form.name.value,
      rating: form.rating.value,
      comment: form.comment.value
    });

    // Clear the form for the next input.
    form.name.value = '';
    form.rating.value = '';
    form.comment.value = '';
  }

  handleSelectChange(e){
      this.setState({reviewType: e.target.value});
    }

  render() {
    return (
      <div>
        <form style={{fontFamily: 'Bookman Old Style'}} name="issueAdd" onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="rating" placeholder="Rating (1-5)" />
          <br></br>
          <textarea rows={5} cols= {50} name="comment" placeholder="Comment" />
          <br></br><br></br>
          <button>Add</button>
        </form>
      </div>
    );
  }
}

export default class Review extends React.Component {
  constructor() {
    super();
    this.state = { reviewInfo: [] };

    this.add = this.add.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    // setTimeout(() => {
    //   this.setState({
    //     issues: issues
    //   });
    // }, 500);
    fetch('/api/reviews').then(response => {
      if (response.ok) {      
        response.json().then(data => { 
          this.setState({ reviewInfo: data.records }); 
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

  add(newReview) {
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    })
      .then(res => {
        if (res.ok) {
          res.json()
            .then(fixedReview => {
              const newReviews = this.state.reviewInfo.concat(fixedReview);
              newReviews.id = 1;
              this.setState({ reviewInfo: newReviews });
              //this.setState({ totalCalories: Number(this.state.totalCalories) + Number(newReview.calories)});
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

  // createIssue(newIssue) {
  //   const newIssues = this.state.issues.slice();
  //   newIssue.id = this.state.issues.length + 1;
  //   newIssues.push(newIssue);
  //   this.setState({ issues: newIssues });
  // }

  render() {
    return (
      <div style = {{textAlign: "center"}}>
        <h1 style={{fontStyle: 'bold', fontSize: '100', fontFamily: 'Bookman Old Style', paddingBottom: '20px'}}>Review</h1>
        <ReviewMessage />
        <hr />
        <ReviewAdd createReview={this.add} />
        <hr />
        <ReviewTable reviewInfo={this.state.reviewInfo} />
      </div>
    );
  }
}
