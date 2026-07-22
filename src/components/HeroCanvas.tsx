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

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 5)

    // ── Lights ──────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xd4edda, 1.2)
    dirLight.position.set(4, 6, 4)
    scene.add(dirLight)

    const rimLight = new THREE.DirectionalLight(0xb8973a, 0.4)
    rimLight.position.set(-3, -2, 2)
    scene.add(rimLight)

    // ── Floating Cross ───────────────────────────────────────
    const crossMat = new THREE.MeshStandardMaterial({
      color: 0x4a6741,
      metalness: 0.3,
      roughness: 0.55,
    })

    const vBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 1.1, 0.18),
      crossMat
    )
    const hBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.18, 0.18),
      crossMat
    )
    hBar.position.y = 0.18

    const crossGroup = new THREE.Group()
    crossGroup.add(vBar)
    crossGroup.add(hBar)
    crossGroup.position.set(-1.8, 0.3, 0)
    crossGroup.rotation.z = 0.06
    scene.add(crossGroup)

    // ── Floating Particles ───────────────────────────────────
    const particleCount = 180
    const positions = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)
    const offsets = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
      speeds[i]  = 0.3 + Math.random() * 0.7
      offsets[i] = Math.random() * Math.PI * 2
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x4a6741,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Decorative Ring ──────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(1.1, 0.018, 16, 100)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xb8973a,
      metalness: 0.7,
      roughness: 0.3,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(1.9, -0.5, -0.5)
    ring.rotation.x = Math.PI / 4
    scene.add(ring)

    // ── Small Orb ────────────────────────────────────────────
    const orbGeo = new THREE.SphereGeometry(0.22, 32, 32)
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x6a9465,
      metalness: 0.2,
      roughness: 0.6,
      transparent: true,
      opacity: 0.85,
    })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    orb.position.set(2.4, 1.2, 0)
    scene.add(orb)

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas)

    // ── Mouse parallax ───────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animate ──────────────────────────────────────────────
    let frameId: number
    const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate)
      const t = time * 0.001

      // Floating cross
      crossGroup.rotation.y = Math.sin(t * 0.4) * 0.18
      crossGroup.rotation.x = Math.sin(t * 0.3) * 0.08
      crossGroup.position.y = 0.3 + Math.sin(t * 0.5) * 0.12

      // Ring spin
      ring.rotation.z = t * 0.22
      ring.rotation.y = t * 0.14
      ring.position.y = -0.5 + Math.sin(t * 0.35) * 0.2

      // Orb pulse
      const s = 1 + Math.sin(t * 1.1) * 0.08
      orb.scale.setScalar(s)
      orb.position.y = 1.2 + Math.sin(t * 0.6) * 0.15

      // Particle drift
      for (let i = 0; i < particleCount; i++) {
        const drift = Math.sin(t * speeds[i] * 0.5 + offsets[i]) * 0.004
        posAttr.setY(i, posAttr.getY(i) + drift)
        // Wrap vertically
        if (posAttr.getY(i) > 4.5) posAttr.setY(i, -4.5)
      }
      posAttr.needsUpdate = true

      // Camera parallax
      camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04
      camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      particleGeo.dispose()
      ringGeo.dispose()
      orbGeo.dispose()
      crossMat.dispose()
      particleMat.dispose()
      ringMat.dispose()
      orbMat.dispose()
    }
  }, [])

  return <Canvas ref={canvasRef} aria-hidden="true" />
}
