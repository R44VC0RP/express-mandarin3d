'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function STLModel({ url, scale }) {
  const [geometry, setGeometry] = useState(null)
  const [error, setError] = useState(null)
  const meshRef = useRef(null)

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

//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.01
//     }
//   })

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
    <mesh ref={meshRef} geometry={geometry} scale={scale || 1}>
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

function Scene({ url }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <STLModel url={url} scale={0.3} />
      <Grid infiniteGrid />
      <OrbitControls makeDefault />
      <Environment preset="city" />
    </>
  )
}

export default function PopupSTLViewer({ stlUrl }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Model</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]">
        <DialogHeader>
          <DialogTitle>STL Model Viewer</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full">
          <Canvas>
            <Scene url={stlUrl} />
          </Canvas>
        </div>
      </DialogContent>
    </Dialog>
  )
}