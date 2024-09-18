'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

function STLModel({ url }) {
  const [geometry, setGeometry] = useState(null)
  const [error, setError] = useState(null)
  const meshRef = useRef(null)
  const { scene } = useThree()

  useEffect(() => {
    const loader = new STLLoader()
    loader.load(
      url,
      (geometry) => {
        geometry.center()
        geometry.computeVertexNormals()
        setGeometry(geometry)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.error('An error occurred while loading the STL file:', error)
        setError('Failed to load STL file')
      }
    )
  }, [url])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  if (!geometry) {
    return null
  }

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

export default function STLViewer({ stlUrl }) {
  return (
    <div className="aspect-square w-full max-w-md">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <STLModel url={stlUrl} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}