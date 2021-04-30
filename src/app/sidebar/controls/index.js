import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import ItemTypes from "@app/dnd/item-types";
import { createContainerControl, createFieldControl } from "./control-factory";
import { getEmptyImage } from "react-dnd-html5-backend";

const ContainerDiv = styled.ul``;

function Container({ printObject }) {
  // many can be dragged
  let { relationType } = printObject;

  if (relationType === "MANY") {
    return <ManyContainer printObject={printObject} />;
  }

  return <OneContainer printObject={printObject} />;
}

function OneContainer({ printObject }) {
  let { children, fields, label } = printObject;

  return (
    <ContainerDiv className="container">
      <div>{label}</div>
      {fields?.map((field) => (
        <li key={field.name}>
          <Field field={field}></Field>
        </li>
      ))}
      {children?.map((child) => (
        <li className="control-wrapper" key={child.name}>
          <Container printObject={child} />
        </li>
      ))}
    </ContainerDiv>
  );
}

function ManyContainer({ printObject }) {
  let { children, fields, label } = printObject;

  const [{}, drag, preview] = useDrag(
    {
      type: ItemTypes.CONTROL,
      item: () => createContainerControl(printObject),
      options: {
        dropEffect: "copy",
      },
      end: (result, monitor) => {
        // use result to update template here
        console.log("end drag");
      },
    },
    [printObject]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <ContainerDiv className="container">
      <div className="draggable" ref={drag}>
        {label}
      </div>
      {fields?.map((field) => (
        <li key={field.name}>
          <Field field={field}></Field>
        </li>
      ))}
      {children?.map((child) => (
        <li className="control-wrapper" key={child.name}>
          <Container printObject={child} />
        </li>
      ))}
    </ContainerDiv>
  );
}
const FieldDiv = styled.div``;

function Field({ field }) {
  let { label } = field;

  const [{}, drag, preview] = useDrag(
    {
      type: ItemTypes.CONTROL,
      item: () => createFieldControl(field),
      options: {
        dropEffect: "copy",
      },
      end: (result, monitor) => {
        // use result to update template here
        console.log("end drag");
      },
    },
    [field]
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <FieldDiv className="draggable" ref={drag}>
      {label}
    </FieldDiv>
  );
}

export default Container;
