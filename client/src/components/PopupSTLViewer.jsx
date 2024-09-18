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

function Scene({ SceneUrl }) {
    console.log("Scene", SceneUrl)
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <STLModel url={SceneUrl} scale={0.1} />
      <Grid infiniteGrid />
      <OrbitControls makeDefault />
      <Environment preset="city" />
    </>
  )
}

export default function PopupSTLViewer({ popupUrl, className }) {
  console.log("PopupSTLViewer", popupUrl)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>View Model</Button>
      </DialogTrigger>
      <DialogContent className={`max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] `}>
        <DialogHeader>
          <DialogTitle>STL Model Viewer</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full relative">
          <Canvas>
            <Scene SceneUrl={popupUrl} />
          </Canvas>
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded-lg text-white flex items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm">Drag to rotate model</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}