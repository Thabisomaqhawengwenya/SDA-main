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
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5, 5, 5)
    scene.add(dir)

    // ── Wireframe icosahedron — white ────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1)
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    scene.add(ico)

    // ── Inner sphere — dark grey, barely visible ─────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(0.95, 48, 48)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.0,
      roughness: 1.0,
      transparent: true,
      opacity: 0.55,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // ── Gold orbit ring ──────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(2.2, 0.014, 12, 140)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.9,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.5
    scene.add(ring)

    // ── Star particles — spread across full screen ───────────────────────────
    const starCount = 280
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 20
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.055,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)

    // ── Animate ──────────────────────────────────────────────────────────────
    let frameId: number
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate)
      const t = time * 0.001

      ico.rotation.y = t * 0.16
      ico.rotation.x = t * 0.08
      sphere.rotation.y = -t * 0.10
      ring.rotation.z = t * 0.12
      stars.rotation.y = t * 0.018

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
      starGeo.dispose()
      starMat.dispose()
    }
  }, [])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
