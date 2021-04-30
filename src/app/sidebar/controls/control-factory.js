import { getRandomString } from "@/utils";
import { ControlTypes } from "@app/state";

function createLabel(label, x1, y1, x2, y2) {
  return {
    type: ControlTypes.LABEL,
    label,
    defKey: getRandomString(),
    properties: { x1, y1, x2, y2, backgroundColor: "#1fff1f" },
  };
}

function createField(label, fieldKey, x1, y1, x2, y2) {
  return {
    type: ControlTypes.FIELD,
    label: `$${label}`,
    defKey: getRandomString(),
    fieldKey,
    properties: { x1, y1, x2, y2, backgroundColor: "#cfcfcf" },
  };
}

function createContainer(objectKey, x1, y1, x2, y2, children) {
  return {
    type: ControlTypes.CONTAINER,
    defKey: getRandomString(),
    objectKey,
    properties: { x1, y1, x2, y2 },
    children,
  };
}

// field need to
export function createFieldControl(field) {
  let { label, fieldKey } = field;

  return {
    type: ControlTypes.DUMMY,
    properties: { x1: 1, y1: 1, x2: 2, y2: 1 },
    children: [
      createLabel(label, 1, 1, 1, 1),
      createField(label, fieldKey, 2, 1, 2, 1),
    ],
  };
}

export function createContainerControl(container) {
  container = flattern(container);

  function getHeader(current, x1) {
    let { children, fields } = current;
    // children.length <= 1
    let childControls = [];

    fields.forEach((field) => {
      childControls.push(
        createLabel(
          field.label,
          x1 + childControls.length,
          1,
          x1 + childControls.length,
          1
        )
      );
    });

    if (children.length) {
      let tmp = getHeader(children[0], x1 + childControls.length);
      tmp.forEach((x) => {
        childControls.push(x);
      });
    }

    return childControls;
  }

  function getBody(current, x1) {
    let { children, fields } = current;
    // children.length <= 1
    let childControls = [];

    fields.forEach((field) => {
      childControls.push(
        createField(
          field.label,
          field.fieldKey,
          x1 + childControls.length,
          2,
          x1 + childControls.length,
          2
        )
      );
    });

    if (children.length) {
      childControls.push(getBody(children[0], x1 + childControls.length));
    }

    let res = createContainer(
      current.objectKey,
      x1,
      2,
      x1 + childControls.length - 1,
      2,
      childControls
    );
    return res;
  }

  let header = getHeader(container, 1);
  let body = getBody(container, 1);

  return {
    type: ControlTypes.DUMMY,
    properties: { x1: 1, y1: 1, x2: header.length, y2: 2 },
    children: [...header, body],
  };
}

/**
 * 通过这个方法，将 一对一中的字段提升到父级，且每一级最多只有一个many子级
 * 处理过以后，每个container最多有一个child，多个fields
 * @param {*} container
 */
function flattern(container) {
  let { children, fields } = container;
  let newFields = (fields && [...fields]) || [];
  let newChildren = [];
  if (children) {
    let hasMany = false;
    for (let child of children) {
      let tmp = flattern(child);
      if (child.relationType === "one") {
        let { fields: childFields, children: grandChildren } = tmp;
        newFields = [...newFields, ...childFields];
        newChildren = [...newChildren, ...grandChildren];
      } else if (!hasMany) {
        newChildren.push(tmp);
        hasMany = true;
      }
    }
  }

  return Object.assign({}, container, {
    fields: newFields,
    children: newChildren,
  });
}
