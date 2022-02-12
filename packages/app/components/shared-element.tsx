import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, View } from "react-native";

import {
  SharedElementTransition,
  nodeFromRef,
  SharedElement,
} from "react-native-shared-element";

export const SharedElementContext = createContext({} as any);

export const SharedElementProvider = ({ children }: any) => {
  const [node1, setNode1] = useState(null);
  const [node1Ancestor, setNode1Ancestor] = useState<any>(null);
  const [node2, setNode2] = useState(null);
  const [node2Ancestor, setNode2Ancestor] = useState<any>(null);
  const [inProgress, setInProgress] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const position = useRef(new Animated.Value(0)).current;

  const push = (node1: any) => {
    if (inProgress) return;
    setNode1(node1);
    setInProgress(true);
    setDetailVisible(true);
    Animated.timing(position, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setInProgress(false);
    });
  };

  const pop = () => {
    if (inProgress) return;
    setInProgress(true);
    Animated.timing(position, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setInProgress(false);
      setDetailVisible(false);
    });
  };

  const setNode1AncestorRef = useCallback((ref) => {
    setNode1Ancestor(nodeFromRef(ref));
  }, []);

  const setNode2AncestorRef = useCallback((ref) => {
    setNode2Ancestor(nodeFromRef(ref));
  }, []);

  return (
    <SharedElementContext.Provider
      value={{
        node1,
        setNode1,
        node2,
        setNode2,
        node1Ancestor,
        setNode1AncestorRef,
        inProgress,
        detailVisible,
        setNode2AncestorRef,
        setInProgress,
        setDetailVisible,
        push,
        pop,
      }}
    >
      {children}
      {inProgress ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SharedElementTransition
            start={{
              node: node1,
              ancestor: node1Ancestor,
            }}
            end={{
              node: node2,
              ancestor: node2Ancestor,
            }}
            position={position}
            animation="move"
            resize="auto"
            align="auto"
          />
        </View>
      ) : null}
    </SharedElementContext.Provider>
  );
};
