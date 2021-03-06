/**
 * title: shippingLabelMaker.jsx
 *
 * date: 11/4/2020
 *
 * author: javier olaya
 *
 * description: this component handles the shippingLabelmaker aspect of the application
 */

import React from "react";
import Wizard from "../../wizard/wizard";
import Steps from "./../../steps/steps-array";

/**
 *
 * @export
 * @class ShippingLabelMaker
 * @extends {React.component()}
 */
export default class ShippingLabelMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingInfo: {
        receiver: {
          name: "",
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        sender: {
          name: "",
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        weight: "0",
        shippingOption: null,
        shippingRate: 0.4, //shippingRate shippingCost
        shippingCost: 0, //added for convenience
        errorMessage: "",
        header: "Shipping Label Maker",
      },
    };
  }

  /**
   * description: gathers receiver's data from the step
   *
   * @param {object} evt
   * @memberof ShippingLabelMaker
   */
  handleReceiver = (evt) => {
    evt.preventDefault();
    const { value, name } = evt.target;
    const { shippingInfo } = this.state;
    const { receiver } = shippingInfo;
    const newReceiver = {
      ...receiver,
      [name]: value,
    };
    const newShippingInfo = { ...shippingInfo, receiver: newReceiver };
    this.setState({ shippingInfo: newShippingInfo });
  };

  /**
   * description: gathers sender's data from the step
   *
   * @param {object} evt
   * @memberof ShippingLabelMaker
   */
  handleSender = (evt) => {
    evt.preventDefault();
    const { value, name } = evt.target;
    const { shippingInfo } = this.state;
    const { sender } = shippingInfo;
    const newSender = {
      ...sender,
      [name]: value,
    };
    const newShippingInfo = { ...shippingInfo, sender: newSender };
    this.setState({ shippingInfo: newShippingInfo });
  };

  /**
   * description: gather the weight from the step
   *
   * @param {object} evt
   * @memberof ShippingLabelMaker
   */
  handleWeight = (evt) => {
    evt.preventDefault();
    const { value } = evt.target;
    const { shippingInfo } = this.state;
    const newShippingInfo = { ...shippingInfo, weight: value };
    this.setState({ shippingInfo: newShippingInfo });
  };

  /**
   * description: gathers shipping option data from step
   *
   * @param {object} evt
   * @memberof ShippingLabelMaker
   */
  handleShippingOption = (evt) => {
    const { shippingInfo } = this.state;
    const { weight, shippingRate } = shippingInfo;
    const { value } = evt.target;
    const newShippingInfo = {
      ...shippingInfo,
      shippingOption: value,
      shippingCost: this.calculateCost(weight, shippingRate, value),
    };
    const newOBj = { shippingInfo: newShippingInfo };
    this.setState(newOBj);
  };

  /**
   * description: calculates total cost of shipping
   *
   * @param {int} weight
   * @param {int} shippingRate
   * @param {string} shippingOption
   * @memberof ShippingLabelMaker
   * @return {int}
   */
  calculateCost = (weight, shippingRate, shippingOption) => {
    const num = weight * shippingRate * (shippingOption === "ground" ? 1 : 1.5);
    return num.toFixed(2);
  };

  /**
   * description: collects all the errors from the steps and returns an array of strings
   *
   * @memberof ShippingLabelMaker
   * @return {array}
   */
  isDataInputsValid = () => {
    const { shippingInfo } = this.state;
    const { receiver, sender, weight, shippingOption } = shippingInfo;
    const regexNumbers = /[0-9]/g;

    let isFormValid = [];
    // validate receiver
    const isReceiverPlaceValid = this.isPlaceValid(receiver);
    if (isReceiverPlaceValid)
      isFormValid = isFormValid.concat(isReceiverPlaceValid);

    //validate  sender
    const isSenderPlaceValid = this.isPlaceValid(sender);
    if (isSenderPlaceValid)
      isFormValid = isFormValid.concat(isSenderPlaceValid);

    //validate weight
    if (!weight.match(regexNumbers))
      isFormValid.push("weight is not a correct number");

    //validate option
    if (!(shippingOption === "1" || shippingOption === "2"))
      isFormValid.push("shipping option was not submitted");

    return isFormValid.length > 0 ? isFormValid : null;
  };

  /**
   * description: validates the receiver's and sender's input
   *
   * @param {obj} place
   * @memberof ShippingLabelMaker
   * @return {array}
   */
  isPlaceValid = (place) => {
    const { name, street, city, state, zip } = place;
    const regexLetters = /[A-Za-z]/g;
    const regexNumbers = /[0-9]/g;
    const placeErrors = [];

    //validate name
    if (!name.match(regexLetters))
      placeErrors.push("one of the names are not all letters");

    //validate street
    if (!street.match(regexLetters))
      placeErrors.push("one of the street names are not all letters");

    //validate city
    if (!city.match(regexLetters))
      placeErrors.push("one of the city names are not all letters");

    //validate state
    if (!state.match(regexLetters))
      placeErrors.push("one of the state names are not all letters");

    //validate zip
    if (!zip.match(regexNumbers))
      placeErrors.push("zip  is not a correct number");

    return placeErrors.length > 0 ? placeErrors : null;
  };

  /**
   * description: collects all the steps
   *
   * @memberof ShippingLabelMaker
   * return {array}
   */
  getAllSteps = () => {
    const allFunctions = [
      this.handleReceiver,
      this.handleSender,
      this.handleWeight,
      this.handleShippingOption,
    ];
    const gottenAllsteps = Steps.map((item, idx) => {
      return idx < 4
        ? React.cloneElement(item, {
            handler: allFunctions[idx],
            key: `all-steps-${idx}`,
          })
        : React.cloneElement(item, { key: `all-steps-${idx}` });
    });
    return gottenAllsteps;
  };

  /**
   * description: if the data on the form is validated
   * then the shipping label will be displayed on
   * completion
   *
   * @param {array} isFormValid
   * @memberof Wizard
   */
  onComplete = () => {
    const anyErrors = this.isDataInputsValid();
    if (!anyErrors) {
      // allow the wizard to render the final step
      return { buttonName: "submit", errorMessage: anyErrors };
    }
    // don't allow the wizard to render the final step  or go further
    return { buttonName: null, errorMessage: anyErrors };
  };

  header = () => {
    const { header } = this.state.shippingInfo;
    return header;
  };

  render() {
    const { shippingInfo, errorMessage } = this.state;
    const { getAllSteps, onComplete, header } = this;
    const allStepsFunctions = getAllSteps();
    return (
      <Wizard
        header={header}
        steps={allStepsFunctions}
        wizardContext={shippingInfo}
        onComplete={onComplete}
        errorMessage={errorMessage}
      />
    );
  }
}
