import * as React from 'react'
import * as THREE from 'three'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier'

export interface CurveModifierProps {
  children: React.ReactElement<JSX.IntrinsicElements['mesh']>
  curve?: THREE.Curve<any>
}

export type CurveModifierRef = Pick<Flow, 'moveAlongCurve'>

export const EditableCurveModifier = React.forwardRef(({ children, curve }, ref) => {
  const line = React.useMemo(() => {
    if (curve) {
      return new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)),
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      )
    } else {
      return null
    }
  }, [curve])

  console.log(curve.getPoints(50))

  return (
    <group>
      <CurveModifier ref={ref} curve={curve}>
        {children}
      </CurveModifier>
      <primitive object={line} />
    </group>
  )
})

export const CurveModifier = React.forwardRef<CurveModifierRef | undefined, CurveModifierProps>(
  ({ children, curve }, ref) => {
    const [object3D, setObj] = React.useState()
    const original = React.useRef<THREE.Mesh>()
    const modifier = React.useRef<Flow>()

    React.useImperativeHandle(ref, () => ({
      moveAlongCurve: (val) => {
        modifier.current?.moveAlongCurve(val)
      },
    }))

    React.useEffect(() => {
      if (!modifier.current && original.current && ref) {
        modifier.current = new Flow(original.current)
        setObj(modifier.current.object3D)
      }
    }, [children, ref])

    React.useEffect(() => {
      if (original.current && curve) {
        modifier.current?.updateCurve(0, curve)
      }
    }, [curve])

    return object3D ? (
      <primitive object={object3D} />
    ) : (
      React.cloneElement(React.Children.only(children), {
        ref: original,
      })
    )
  }
)
