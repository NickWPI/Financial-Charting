import React from "react";

const styles = {
  chip: {
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "5px",
    display: "inline-block",
    padding: "0 10px",
    height: "30px",
    fontSize: "14px",
    lineHeight: "30px",
    borderRadius: "10px",
    backgroundColor: "#f1f1f1",
    //"border": "1px solid green"
  },

  text: {
    display: "inline-block",
    paddingLeft: "5px",
    paddingRight: "5px",
  },

  closeButton: {
    paddingLeft: "10px",
    color: "#888",
    fontWeight: "bold",
    float: "right",
    fontSize: "20px",
    cursor: "pointer",
    /*"&:hover": {
      color: "#000"
    }*/
  }
};

export default class PriceChip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.chip}>
        <span style={styles.text}>{this.props.label}</span>
        <span style={styles.text}>{this.props.priceLabel}</span>
        <span style={styles.closeButton} onClick={this.props.onClose}>
          &times;
        </span>
      </div>
    );
  }
}