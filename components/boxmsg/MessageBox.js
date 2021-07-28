import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import axios from 'axios';
//import './style.css';

export default class MessageBox extends React.Component {
  constructor() {
    super();

    this.state = {
      showBox: false,
      shownToggle: true,
      data: [
        { id: "1", name: "Tony" },
        { id: "2", name: "Mark" },
        { id: "3", name: "Joy" }
      ],
      currentRec: undefined,
    };

    this.showBox = this.showBox.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  showBox = (i, pid, name) => {
    this.setState({ currentRec: i });
    console.log(`Selected record index: ${i}`);

    alert(pid);
    alert(name);

    this.setState({ showBox: true }, () => {
      document.addEventListener('click', this.closeBox);
    });
  }

  closeBox(event) {
    if (this.dropdownBox.contains(event.target)) {
      this.setState({ showBox: false }, () => {
        document.removeEventListener('click', this.closeBox);
      });
    }
  }

  toggle() {
    this.setState({
      shownToggle: !this.state.shownToggle
    });
  }

  render() {
    var hidden = {
      display: this.state.shownToggle ? "block" : "none"
    }

    return (
      <div>
        <ul style={{ float: "right" }}>
          {this.state.data.map((person, i) => (
            <div className="chat-sidebar" key={i}>
              <button onClick={() => this.showBox(i, person.id, person.name)}>Chat with {person.name}</button>
              {this.state.showBox ? (
                <div className="msg_box" style={{ right: '270px' }}>
                  <div onClick={this.toggle.bind(this)} class="msg_head">
                    (<b style={{ color: 'orange' }}>
                      {this.state.currentRec !== undefined &&
                        <div className="modal-body">
                          {this.state.data[this.state.currentRec].name}
                          ({this.state.data[this.state.currentRec].id})
                        </div>
                      }
                    </b>)
                    Minimize
                    <div className="close" ref={(element) => { this.dropdownBox = element; }} style={{ color: 'white' }}>Close</div>
                  </div>
                  <div style={hidden} className="msg_wrap"><div className="msg_body">Message will appear here</div></div>
              </div>) : (null)}
            </div>
          ))}
        </ul>
      </div>
    );
  }
}