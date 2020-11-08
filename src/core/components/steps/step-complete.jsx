/**
 * title: step-complete.jsx
 *
 * date: 11/4/2020
 *
 * author: javier olaya
 *
 * description: this component is the final step with a label confirmation
 *
 */

import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ShippingLabel from "./../features/shipping-label-maker/shipping-label/shippingLabel";
import Paginator from "./../features/paginator/paginator";
/**
 * description: form with the comfirmation details
 *
 * @param {object, function, object, string} { wizardAction, onAction, currentStep, buttonResolved }
 * @return { element}
 */
const StepComplete = ({
  wizardContext,
  onAction,
  currentStep,
  buttonResolved,
}) => {
  const { weight, shippingOption, shippingCost } = wizardContext;
  const wizardAction = { prev: 5, next: 6, end: 6 };

  return (
    <Form.Group>
      <Form.Label>{"Congradulations this is your Confirmation"}</Form.Label>
      <Form.Group as={Row}>
        <Col sm={4}></Col>
        <Form.Label column sm={2}>
          {"Weight: "}
        </Form.Label>
        <Col sm={2}>{`${weight} lb`}</Col>
        <Col sm={4}></Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Col sm={4}></Col>
        <Form.Label column sm={2}>
          {"Option: "}
        </Form.Label>
        <Col sm={2}>
          {
            {
              "1": <div type="text">{"ground"}</div>,
              "2": <div type="text">{"priority"}</div>,
            }[shippingOption]
          }
        </Col>
        <Col sm={4}></Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Col sm={4}></Col>
        <Form.Label column sm={2}>
          {"Total:"}
        </Form.Label>
        <Col sm={2}>{`$ ${shippingCost}`}</Col>
        <Col sm={4}></Col>
      </Form.Group>
      <Paginator
        wizardAction={wizardAction}
        onAction={onAction}
        currentStep={currentStep}
        buttonResolved={buttonResolved}
      ></Paginator>
      <ShippingLabel wizardContext={wizardContext}></ShippingLabel>
    </Form.Group>
  );
};
export default StepComplete;
