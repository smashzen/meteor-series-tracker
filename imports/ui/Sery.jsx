import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { SeriesList } from '../api/seriesList.js'; 
import SeryEach from './SeryEach.jsx';

export default class Sery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleInput: '',
      yearInput: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const addTitle = this.state.titleInput;
    const addYear = this.state.yearInput;
    SeriesList.update(
      {_id: this.props.onDisplay},
      {$addToSet: 
        {volumes: 
          {
            _id: new Meteor.Collection.ObjectID(),
            title: addTitle,
            year: addYear,
            haveRead: false
          }
        }
      }
    );
    this.setState({titleInput: '', yearInput: ''})
  }

  renderBooks() {
    if (this.props.onDisplay === "front") {
      return <li></li>;
    } else {
      let seriesLive = this.props.seriesList.find(x => x._id === this.props.onDisplay);
      let volumes = seriesLive['volumes'].sort((x,y) => x.year - y.year);
      return volumes.map((book) => (
        <SeryEach key={book.title} book={book} onDisplay={this.props.onDisplay} />
      ));
    }
  }

  renderSeryTitle() {
    if (this.props.onDisplay === "front") {
      return `Series Tracker App`;
    } else {
      let seriesLive = this.props.seriesList.find(x => x._id === this.props.onDisplay);
      return `${seriesLive.seriesTitle} by ${seriesLive.author}`;
    }
  }
 
  render() {
    return (
      <div className="sery">

        <h1 className="seryTitle">{this.renderSeryTitle()}</h1>

        <ul>
          {this.renderBooks()}
        </ul>

        { this.props.currentUser ?
          <form className="new-book" onSubmit={this.handleSubmit} >
            <label>Title:</label>
            <input
              type="text"
              name="titleInput"
              value={this.state.titleInput}
              onChange={this.handleInputChange}
            />
            <label>Year:</label>
            <input
              type="text"
              name="yearInput"
              value={this.state.yearInput}
              onChange={this.handleInputChange}
            />
            <input
              type="submit"
              value="Submit"
            />
          </form> : ''
        }
      </div>
    );
  }
}

Sery.propTypes = {
  seriesList: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};