import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function ModelGLTF(file) {
  const group = useRef();
  const { nodes, materials } = useGLTF(file);
  return (
    <group ref={group} {...file} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve007_1.geometry}
        material={materials["Material.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve007_2.geometry}
        material={materials["Material.002"]}
      />
    </group>
  );
}
