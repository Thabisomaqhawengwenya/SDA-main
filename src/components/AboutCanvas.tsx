import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

export default function AboutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 6)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dir = new THREE.DirectionalLight(0xd4edda, 1.0)
    dir.position.set(5, 5, 5)
    scene.add(dir)
    const rim = new THREE.DirectionalLight(0xb8973a, 0.5)
    rim.position.set(-4, -3, 2)
    scene.add(rim)

    // Wireframe icosahedron (spiritual / geometric feel)
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1)
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x4a6741,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    scene.add(ico)

    // Solid inner sphere
    const sphereGeo = new THREE.SphereGeometry(0.9, 48, 48)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x4a6741,
      metalness: 0.15,
      roughness: 0.7,
      transparent: true,
      opacity: 0.22,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // Orbit ring
    const ringGeo = new THREE.TorusGeometry(2.2, 0.012, 12, 120)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xb8973a,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.5,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.5
    scene.add(ring)

    // Particles
    const count = 120
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.4 + Math.random() * 1.2
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    const partGeo = new THREE.BufferGeometry()
    partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const partMat = new THREE.PointsMaterial({
      color: 0x4a6741,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(partGeo, partMat)
    scene.add(particles)

    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)

    let frameId: number
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate)
      const t = time * 0.001

      ico.rotation.y = t * 0.18
      ico.rotation.x = t * 0.09
      sphere.rotation.y = -t * 0.12
      ring.rotation.z = t * 0.15
      particles.rotation.y = t * 0.06

      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      ro.disconnect()
      renderer.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      sphereGeo.dispose()
      sphereMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      partGeo.dispose()
      partMat.dispose()
    }
  }, [])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
