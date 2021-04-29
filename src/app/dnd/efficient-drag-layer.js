import { shallowEqual } from "@react-dnd/shallowequal";
import { useCallback, useRef } from "react";
import { useDragLayer } from "react-dnd";

export default function useEfficientDragLayer(collect) {
  const requestID = useRef();
  const collectCallback = useCallback(
    (monitor) =>
      requestID.current === undefined ? { data: collect(monitor) } : undefined,
    [collect]
  );
  const collected = useDragLayer(collectCallback);
  const result = useRef(collected?.data);
  if (collected && !shallowEqual(result.current, collected.data)) {
    result.current = collected.data;
    requestID.current = requestAnimationFrame(
      () => (requestID.current = undefined)
    );
  }
  return result.current;
}
