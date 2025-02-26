# ReactCAD Technical Reference Guide

You are an expert in ReactCAD, a powerful library for creating 3D models using React components. This guide contains comprehensive information about the coordinate system, elements, operations, and capabilities of ReactCAD. Use this knowledge to assist users in creating and manipulating 3D models.

## Coordinate System Reference
ReactCAD uses a left-handed coordinate system where:
- z is up
- x is right 
- y points out of the screen

This arrangement facilitates easy creation of 2D shapes from SVGs.

## Core Concepts

### Operations
Operations are used to combine multiple 3D shapes into one 3D shape through:
- Union (adding volumes)
- Difference (subtracting volumes)
- Intersection (keeping common volumes)

### Transformations 
Transformations modify shapes through:
- Translation (moving)
- Rotation
- Scale
- Mirror
- Affine transformations

### Primitives
Basic 3D shapes available:
- Box
- Sphere
- Cylinder
- Cone
- Torus
- Wedge
- Polyhedron

### Constructions
Methods to create 3D shapes from 2D shapes:
- Prism
- Helix
- Revolution
- Pipe
- Evolution
- Loft
- Solid

## Detailed Element Reference

### Elements

#### Operations

Operation elements create boolean combinations of their children. union adds children, difference subtracts subsequent children from the first child, and intersection keeps those parts of space common to all children.

#### Union
The union element creates a shape that is the sum of its children. It takes no props.

Examples

Union of a cube and a sphere
<union>
  <box x={2} y={2} z={2} center />
  <sphere radius={Math.sqrt(2)} />
</union>
Copy

#### Difference
The difference element takes its first child and subtracts all the the other children from it. It takes no props.

Examples

Difference of a cube and a sphere
A sphere subtracted from a cube.

<difference>
  <box x={2} y={2} z={2} center />
  <sphere radius={Math.sqrt(2)} />
</difference>
Copy

#### Intersection
The intersection element creates a shape made up of the overlapping sections of its children. It takes no props.

Examples

Intersection of a cube and a sphere
<intersection>
  <box x={2} y={2} z={2} center />
  <sphere radius={Math.sqrt(2)} />
</intersection>

#### Transformations
Transformation elements perform transformations on their children. There are several specific transformations as well as a general affine matrix transformation.

Translation
Rotation
Scale
Mirror
Affine

#### Translation
The translation element translates its children along a vector. This can be defined by the vector prop, or by the x, y and z props.

Name  Description Default
x 
The x-component of the translation vector.
number
0
y 
The y-component of the translation vector.
number
0
z 
The z-component of the translation vector.
number
0
vector  
The translation vector.
[number, number, number]
[0, 0, 0]
Examples
Translation with a vector
A cube translated by a vector.

<translation vector={[3,-1,-2]}>
  <box x={5} y={5} z={5} />
</translation>
Copy

Rendering

Translation with x, y and z
A cube translated by x, y and z props.

<translation x={3} y={2} z={1}>
  <box x={5} y={5} z={5} />
</translation>
Copy
Rendering

Translation along a single axis
A cube translated by the x prop only.

<translation x={3} >
  <box x={5} y={5} z={5} />
</translation>
Copy

#### Rotation
The rotation element rotates its children. The rotation can be defined in one of three ways:

an axis vector and an angle in radians
Euler angles in radians around the x, y and z axes
a quaternion
Name  Description Default
axis  
The axis of the rotation.
[number, number, number]
-
angle 
The angle of the rotation.
number
-
x 
The angle around the x-axis.
number
0
y 
The angle around the y-axis.
number
0
z 
The angle around the z-axis.
number
0
quaternion  
A quaternion describing the rotation.
[number, number, number, number]
-
Examples
Rotation with axis and angle
A cube rotated around the z-axis.

<rotation axis={[0, 0, 1]} angle={Math.PI / 4}>
  <box x={5} y={5} z={5} />
</rotation>
Copy

Rendering

Rotation with Euler angles
A cube rotated around the x, y and z-axes.

<rotation x={Math.PI / 4} y={Math.PI / 4} z={Math.PI / 4}>
  <box x={5} y={5} z={5} />
</rotation>
Copy

Rotation with a quaternion
A cube rotated by a quaternion.

<rotation quaternion={[1, 0, 5, 2]}>
  <box x={5} y={5} z={5} />
</rotation>
Copy

Rendering

#### Scale
The scale element scales its children. They can be scaled by a uniform factor, or by separate factors in the x, y and z directions. By default the scale centers on the origin but it can optionally center on a center point.

Name  Description Default
factor  
The uniform scale factor.
number
-
x 
The scale factor in the x-direction.
number
1
y 
The scale factor in the y-direction.
number
1
z 
The scale factor in the z-direction.
number
1
center  
The origin of the scale operation.
[number, number, number]
[0, 0, 0]
Examples
Uniform scale
A cube scaled by a uniform factor.

<scale factor={5}>
  <box x={1} y={1} z={1} />
</scale>
Copy

Rendering

Separate scale factors in each axis
A sphere scaled by different factors in x and y, and not scaled in z.

<scale x={3} y={2}>
  <sphere radius={1} />
</scale>
Copy
Scale with a custom origin
A cube scaled by a uniform factor centered on the center of the cube.

<scale factor={2} center={[1, 1, 1]}>
  <box x={2} y={2} z={2} />
</scale>
Copy

#### Mirror
The mirror element reflects its children in a plane. The plane is defined by a point and a vector normal. By default the children are reflected in the yz plane.

Note that the children are trasnformed, not duplicated, so you are left with only the mirrored copy.

Name  Description Default
point 
A point on the reflection plane
[number, number, number]
[0, 0, 0]
normal  
The normal of the refrlection plane.
[number, number, number]
[1, 0, 0]
Examples
Mirror in the yz plane
A cube mirrored in the yz plane.

<mirror>
  <box x={5} y={5} z={5} />
</mirror>
Copy

Rendering

Mirror in a diagonal plane
A cube mirrored in a diagonal plane away from the origin.

<mirror point={[0, 5, 5]} normal={[0, 1, 2]}>
  <box x={5} y={5} z={5} />
</mirror>
Copy

#### Affine
The affine element performs an affine transformation on its children. The transformation is defined by a 4x4 matrix. As an affine transformation the last row of the matrix must equal [0, 0, 0, 1].

Name  Description Default
matrix* 
A 4x4 matrix describing the transformation.
number[][]
-
Examples
Identity transformation
A cube transform by an identity matrix (having no effect).

<affine matrix={[
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]}>
  <box x={5} y={5} z={5} />
</affine>
Copy

Rendering

Shear transformation
A cube transform by a shear matrix.

<affine matrix={[
  [  1, 0, 0, 0],
  [0.5, 1, 0, 0],
  [0.5, 0, 1, 0],
  [  0, 0, 0, 1],
]}>
  <box x={5} y={5} z={5} />
</affine>
Copy

### Primitives
ReactCAD provides various simple solids which are used to build up complex models. There is also a polyhedron type so you can define an arbitrary shape from points and polygonal faces.

#### Box
The box element creates an axis-aligned cuboid at the origin. Width, length and height are controlled by the x, y and z props. By default the box has one corner at the origin and extends in the positive x-, y- and z-directions, but it can optionally be centered on the origin with the center prop.

Name  Description Default
x*  
The size of the box along the x-axis
number
-
y*  
The size of the box along the y-axis
number
-
z*  
The size of the box along the z-axis
number
-
center  
Whether to center the box on the origin
boolean
false
Examples
Cube
A cube with side length 5.

<box x={5} y={5} z={5} />
Copy

Rendering

Box
A cuboid 3 units wide, 5 long and 2 deep.

<box x={3} y={5} z={2} />
Copy
Centered box
A cube centered on the origin.

<box center x={5} y={5} z={5} />
Copy

#### Sphere
The sphere element creates a sphere centered on the origin. It has a radius. An optional angle prop limits the shape to the portion of the sphere within that angle around the z-axis. A spherical segment can be produced with the optional segmentAngle1 and segmentAngle2 props.

Name  Description Default
radius* 
The radius of the sphere.
number
-
angle 
The angle around the z-axis to limit the sphere to
number
2π
segmentAngle1 
The angle above the xy plane where the top of the sphere is cut off to form a spherical segment
number
π
segmentAngle2 
The angle above the xy plane where the bottom of the sphere is cut off to form a spherical segment. Must be less than segmentAngle1
number
-π
Examples
Sphere
A sphere of radius 1.

<sphere radius={1} />
Copy

Rendering

Sphere limited by an angle
A sphere of radius 1, limited to 3 quarters of a turn.

<sphere radius={1} angle={3 * Math.PI / 2} />
Copy
Spherical segment
A spherical segmend of radius 1, limited to 1 radian above the xy plane and 0.1 radians below it.

<sphere radius={1} segmentAngle1={1} segmentAngle2={-0.1} />
Copy

#### Cylinder
The cylinder element creates a cylinder centered on the z-axis. It has a height and a radius. An optional angle prop limits the shape to the portion of the cylinder within that angle around the z-axis. The cylinder can optionally be centered on the origin.

Name  Description Default
height* 
The height of the cylinder in the z-axis
number
-
radius* 
The radius of the cylinder.
number
-
angle 
The angle around the z-axis to limit the cylinder to
number
2π
center  
Whether to center the cylinder on the origin
boolean
false
Examples
Cylinder
A cylinder of height 5 and radius 2.

<cylinder height={5} radius={2} />
Copy

Rendering

Cylinder limited by an angle
A cylinder of height 5 and radius 2, limited to 3 quarters of a turn.

<cylinder height={5} radius={2} angle={3 * Math.PI / 2} />
Copy
Centered cylinder
A cylinder centered at the origin.

<cylinder height={5} radius={2} center />
Copy

#### Cone
The cone element creates a truncated cone centered on the z-axis. It has a height, a radius at z = 0 of radius1 and a radius at z = height of radius2. An optional angle prop limits the shape to the portion of the cone within that angle around the z-axis. The cone can optionally be centered on the origin.

Name  Description Default
height* 
The height of the cone in the z-axis
number
-
radius1*  
The radius of the cone at its base. This can be zero to form a full cone.
number
-
radius2*  
The radius of the cone at z = height. This can be zero to form a full cone, but it must not be equal to radius1 (use a cylinder instead).
number
-
angle 
The angle around the z-axis to limit the cone to
number
2π
center  
Whether to center the cone on the origin
boolean
false
Examples
Sharp cone
A full cone 5 units high with a base radius of 2.

<cone height={5} radius1={2} radius2={0} />
Copy

Rendering

Truncated cone
A truncated cone 5 units high with a base radius of 3 and a top radius of 2.

<cone height={5} radius1={3} radius2={2} />
Copy
Cone limited by an angle
A full cone 5 units high with a base radius of 2, limited to 3 quarters of a turn.

<cone height={5} radius1={2} radius2={0} angle={3 * Math.PI / 2} />
Copy
Centered cone
A cone centered on the origin (according to the center of its bounding box, not its center of mass).

<cone height={5} radius1={2} radius2={0} center />
Copy

#### Torus
The torus element creates a torus centered on the origin. It has a radius from the origin to the center of the tube radius1 and a radius of the tube radius2. An optional angle prop limits the shape to the portion of the torus within that angle around the z-axis.

Name  Description Default
radius1*  
The radius from the origin to the center of the tube. This must be greater than zero (for a degenerate torus use a sphere instead).
number
-
radius2*  
The radius of the tube.
number
-
angle 
The angle around the z-axis to limit the torus to
number
2π
Examples
Torus
A torus with a radius of 3 and a tube radius of 1.

<torus radius1={3} radius2={1} />
Copy

Rendering

Torus limited by an angle
A torus with a radius of 3 and a tube radius of 1, limited to 3 quarters of a turn.

<torus radius1={3} radius2={1} angle={3 * Math.PI / 2} />
Copy
Horn torus
A torus where the axis is a tangent to the cross section of the tube.

<torus radius1={2} radius2={2} />
Copy
Spindle torus
A torus where the axis passes through the cross section of the tube twice.

<torus radius1={2} radius2={3} />
Copy

#### Wedge
The wedge element creates a slanted box, i.e. a box with angles. Width, length and height are controlled by the x, y and z props.

There are two ways to define the shape of the wedge:

ltx defines the width in the x-direction at y. The wedge has a constant height in the z-direction. See example.
xmin,zmin and xmax,zmax define the corners of the wedge at y. See example.
The two methods are mutually exclusive, so the ltx prop must not be set if you are using the other method.

Name  Description Default
x*  
The width of the wedge in the x-axis
number
-
y*  
The length of the wedge in the y-axis
number
-
z*  
The height of the wedge in the z-axis
number
-
ltx 
The width in the x-axis of the wedge at y. Can not be used alongside xmin, zmin, xmax and zmax
number
-
xmin  
The x-coordinate of the bottom-left corner of the wedge at y. Can not be used alongside ltx
number
-
zmin  
The z-coordinate of the bottom-left corner of the wedge at y. Can not be used alongside ltx
number
-
xmax  
The x-coordinate of the top-right corner of the wedge at y. Can not be used alongside ltx
number
-
zmax  
The z-coordinate of the top-right corner of the wedge at y. Can not be used alongside ltx
number
-
Examples
Wedge defined using ltx
A 5x5x3 wedge tapering to 1 unit wide at y = 5.

<wedge x={5} y={5} z={3} ltx={1} />
Copy
Wedge defined using xmin, zmin, xmax and zmax
A 5x5x3 wedge tapering to a square with corners at (1,5,2) and (3,5,4).

<wedge x={5} y={5} z={5} xmin={1} zmin={2} xmax={3} zmax={4} />
Copy

#### Polyhedron
The polyhedron element creates an arbitrary polyhedron. It takes an array of points and an array of faces. Each point is a 3 element array of x-, y- and z-coordinates. Each face is an array of indices into the points array, describing a polygon with vertices at those points. The faces must be planar and combine to fully enclose a part of 3d space.

Name  Description Default
points* 
An array of points in 3d space
[number, number, number]
-
faces*  
An array of faces, each of which is an array of indices into the points array, so as to describe a polygon with vertices at those points. Faces must be planar and fully enclose a part of 3d space.
number[][]
-
Examples
Polyhedron
A simple irregular tetrahedron.

<polyhedron
    points={[
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [1, 1, 1],
    ]}
    faces={[
      [0, 1, 2],
      [0, 1, 3],
      [0, 2, 3],
      [1, 2, 3],
    ]}
  />
Copy

Rendering

### Constructions
ReactCAD provides various elements to construct 3-dimensional shapes from 2-dimensional shapes.

Prisms, pipes, revolutions and helices take a 2d shape as a profile and sweep it along a path. Evolutions take a 2d shape as a spine, and sweep a path along it. Lofts construct a 3d shape from 2d cross-sections. Solids construct 3d shapes from 2d faces.

#### Prism
The prism element extrudes a 2-dimensional shape along a vector. The vector is defined either by the x, y and z props or by the vector prop. The children of the prism form the 2d shape (see Surfaces & SVGs).

Name  Description Default
x 
The distance along the x-axis to extrude the profile
number
0
y 
The distance along the y-axis to extrude the profile
number
0
z 
The distance along the z-axis to extrude the profile
number
0
vector  
The translation vector.
[number, number, number]
[0, 0, 0]
Examples
Triangular prism
A prism of height 5 with a triangular profile.

<prism z={5}>
  <planeSurface>
    <svg>
      <polygon points="0,0 3,0 1.5,2" />
    </svg>
  </planeSurface>
</prism>
Copy

Rendering

Vector prism
A prism extending along the vector [-2,1,3] with an SVG circle profile drawn on a cylindrical surface.

<prism x={-2} y={1} z={3}>
  <cylindricalSurface>
    <svg>
      <circle r={1} />
    </svg>
  </cylindricalSurface>
</prism>
Copy
React icon prism
A prism with a more complex SVG shape drawn on a spherical surface.

import ReactIcon from './react-icon.svg';
<prism z={1}>
  <sphericalSurface radius={10}>
    <ReactIcon />
  </sphericalSurface>
</prism>
Copy

#### Revolution
The revolution element extrudes a 2-dimensional shape by rotating it around an axis. It is rotated by angle radians around an axis defined by a 3d vector. The 2d shape is passed to the profile prop, which can either be a list of points describing a planeSurface polygon, or a string containing an SVG image. The profile must not intersect the axis.

The children of the revolution form the 2d profile (see Surfaces & SVGs).

Name  Description Default
axis* 
The axis to rotate the profile around
[number, number, number]
-
angle*  
The angle in radians to rotate the profile through
number
-
Examples
Triangular revolution
A triangular profile rotated in a full circle around the y-axis.

<revolution axis={[0,1,0]} angle={2 * Math.PI}>
  <planeSurface>
    <svg>
      <polygon points="1,0 3,0 2,-2" />
    </svg>
  </planeSurface>
</revolution>
Copy

Rendering

Partial elliptical revolution
An elliptical profile rotated 3 quarters of a turn around a diagonal axis.

<revolution axis={[1,0,1]} angle={3 * Math.PI / 2}>
  <planeSurface>
    <svg>
      <ellipse rx="2" ry="3" cx={2} cy={3} />
    </svg>
  </planeSurface>
</revolution>
Copy

Rendering

React icon revolution
An complex shape rotated 1 eighth turn around the x-axis. The translation element is used to move the shape away from the axis of rotation.

import ReactIcon from './ReactIcon';
    
<revolution axis={[-1,0,0]} angle={Math.PI / 4}>
  <translation y={-24}>
    <planeSurface>
      <ReactIcon />
    </planeSurface>
  </translation>
</revolution>
Copy

#### Pipe
The pipe element extrudes a 2-dimensional shape along an arbitrary 2-dimensional path. The path is passed to spine as a string of SVG path commands (the same format used for the d attribute of an SVG path element). The path will be traced in the xz plane, with SVG y-values mapped to the z-axis.

The children of the pipe form the 2d profile (see Surfaces & SVGs).

Name  Description Default
path* 
The path along which to extruded the profile.
string
-
Examples
Triangular pipe
A triangular profile extruded along a series of straight lines. We extend the path in the negative y-direction, as this will equate to the positive z-direction.

Extruding a pipe along straight line doesn't affect the normal of the shape - it remains flat whichever direction the line goes.

<pipe spine="M 0 0 L 0 5 L 5 10">
  <planeSurface>
    <svg>
      <rect width={1} height={1} />
    </svg>
  </planeSurface>
</pipe>
Copy

Rendering

Smooth pipe
To make a smooth pipe use curve path commands to round out corners, and the profile will follow the curve.

<pipe spine="M 0 0 L 0 3 C 0 5 1 6 2 7 L 5 10"  />
  <planeSurface>
    <svg>
      <rect width={1} height={1} />
    </svg>
  </planeSurface>
</pipe>
Copy
React icon pipe
A complex SVG pipe.

import ReactIcon from './ReactIcon';
  
<pipe spine="M 0 0 C 0 10 10 10 10 20">
  <planeSurface>
    <ReactIcon />
  </planeSurface>
</pipe>
Copy

#### Helix
The helix element extrudes a 2-dimensional shape while rotating it around the z-axis. It has a height in the z-direction and a pitch, which is the height of one complete turn. By default the helix is right-handed, but can be made left-handed with the leftHanded prop.

The children of the helix form the 2d profile (see Surfaces & SVGs).

Name  Description Default
height* 
The height of the helix on the z-axis
number
-
leftHanded  
Whether the helix is leftHanded.
boolean
-
Examples
Square helix
A helix of height 5 and pitch 5 with a square profile. Note that pitch refers to one full rotation; since the square has four points it is creates a multistart screw with a thread pitch smaller than 5!

<helix height={5} pitch={5}>
  <planeSurface>
    <svg>
      <rect x={-1} y={-1} width={2} height={2} />
    </svg>
  </planeSurface>
</helix>
Copy

Rendering

Spring
A spring created using a vertical profile which does not intersect with the origin.

<helix height={9} pitch={3}>
  <translation y={2}>
    <rotation y={-Math.PI / 2}>
      <planeSurface>
        <svg>
          <circle r={1} />
        </svg>
      </planeSurface>
    </rotation>
  </translation>
</helix>
Copy
React icon helix
A partial turn of a helix with a complex SVG shape.

import ReactIcon from './ReactIcon';
<helix height={5} pitch={50}>
  <planeSurface>
    <ReactIcon />
  </planeSurface>
</helix>
Copy

#### Evolution
The evolution element sweeps a 2-dimensional "profile" path around the edges of a 2-dimensional "spine" shape and fills the enclosed shape. The path is passed to profile as a string of SVG path commands (the same format used for the d attribute of an SVG path element). The path will be traced in the xz plane, with SVG y-values mapped to the z-axis.

The children of the evolution form the 2d spine (see Surfaces & SVGs).

Name  Description Default
profile*  
The path to sweep.
string
-
Examples
Evolution of a curve around a square
A bezier curve profile swept along the edges of a square.

<evolution profile="M 0 0 C 0 1 1 1 1 2">
  <planeSurface>
    <svg>
      <polygon points="0,0 5,0 5,5 0,5" />
    </svg>
  </planeSurface>
</evolution>
Copy

Rendering

Bowl
A convex profile swept along the edge of a circle to form a bowl.

<evolution profile="M 0 0 C -2 0 -3 2 -3 5 S -1 10 -1 9 S -2 8 -2 5 S 0 1 0 1">
  <planeSurface>
    <svg>
      <circle r="3" />
    </svg>
  </planeSurface>
</evolution>
Copy
Fillet
A circular arc used to create a fillet on a triangular spine.

<evolution profile="M 0 0 A 1 1 0 0 0 1 1">
  <planeSurface>
    <svg>
      <polygon points={`0,0 10,0, 5,${(10 * Math.sqrt(3)) / 2}`} />
    </svg>
  </planeSurface>
</evolution>
Copy
Chamfer
A diagonal profile used to create a chamfer on an SVG.

<evolution profile="M 0 0 L 1 1">
    <planeSurface>
      <svg>
        <path
          fill-rule="evenodd"
          d={`M 0 0 h 10 v 10 h -10 Z M 3.5 3 l 0 4 l ${2 * Math.sqrt(3)} -2 Z`}
        />
      </svg>
    </planeSurface>
  </evolution>
Copy

#### Loft
The loft element creates a 3d shape from a series of cross sections. By default the loft forms a smooth shape, but this can be disabled with the smooth prop. Use the exact prop if you want to join the shapes vertex by vertex and you can guarantee each shape has the same number of vertices.

The children of the loft form the 2d cross sections (see Surfaces & SVGs).

Name  Description Default
smooth  
Whether to smooth out the shape.
boolean
-
exact 
Whether to join vertices exactly. If true, each cross section must have the same number of vertices.
boolean
-
Examples
Loft
A loft between a square, a circle and a triangle. On the left with smooth false, in the middle with smooth true, and on the right the 2d shapes are shown.

<union>
  <loft>
    <planeSurface>
      <svg>
        <polygon points="5,0 10,5 5,10, 0,5" />
      </svg>
    </planeSurface>
    <planeSurface origin={[0, 0, 10]}>
      <svg>
        <circle cx={5} cy={5} r="5" />
      </svg>
    </planeSurface>
    <planeSurface origin={[0, 0, 20]}>
      <svg>
        <polygon points="5,0 10,5 5,10" />
      </svg>
    </planeSurface>
  </loft>
  <translation x={-15}>
    <loft smooth={false}>
      <planeSurface>
        <svg>
          <polygon points="5,0 10,5 5,10, 0,5" />
        </svg>
      </planeSurface>
      <planeSurface origin={[0, 0, 10]}>
        <svg>
          <circle cx={5} cy={5} r="5" />
        </svg>
      </planeSurface>
      <planeSurface origin={[0, 0, 20]}>
        <svg>
          <polygon points="5,0 10,5 5,10" />
        </svg>
      </planeSurface>
    </loft>
  </translation>
</union>
Copy

Rendering

Boat
A boat created from cross sections. On the left is the loft, and on the right the 2d shapes are shown.

<union>
  <translation z={1}>
    <rotation x={-Math.PI / 2}>
      <loft>
        <planeSurface origin={[1.75, 0, 0]}>
          <svg>
            <polygon points="0,0 0.5,0 0.5,0.5, 0,0.5" />
          </svg>
        </planeSurface>
        <planeSurface origin={[0, 0, 5]}>
          <svg>
            <path d="M 0 0 L 4 0 L 4 1 C 3 3 1 3 0 1 Z" />
          </svg>
        </planeSurface>
        <planeSurface origin={[0, 0, 8]}>
          <svg>
            <path d="M 0 0 L 4 0 L 4 1 C 3 3 1 3 0 1 Z" />
          </svg>
        </planeSurface>
        <planeSurface origin={[1.75, 0, 12]}>
          <svg>
            <polygon points="0,0 0.5,0 0.5,0.5, 0,0.5" />
          </svg>
        </planeSurface>
      </loft>
    </rotation>
  </translation>
</union>
Copy
Bottle screw thread
A screw thread created from a loft between two ellipses on different cylindrical surfaces. This is a part of the OpenCascade Tutorial ported to ReactCAD.

const ScrewThread: React.FC<{ neckRadius: number; neckHeight: number }> = ({
  neckRadius,
  neckHeight,
}) => {
  const major = 2 * Math.PI * neckRadius;
  const minor = neckHeight / 10;
  const angle1 =
    (Math.atan((major * 0.99) / (neckHeight / 4)) * 180) / Math.PI;
  const angle2 =
    (Math.atan((major * 1.05) / (neckHeight / 4)) * 180) / Math.PI;
  return (
    <rotation y={Math.PI / 2}>
      <loft>
        <cylindricalSurface radius={neckRadius * 0.99}>
          <svg>
            <g transform={`rotate(${angle1})`}>
              <ellipse
                cx={0}
                cy={neckHeight / 2}
                rx={major * 0.99}
                ry={minor}
              />
            </g>
          </svg>
        </cylindricalSurface>
        <cylindricalSurface radius={neckRadius * 1.05}>
          <svg>
            <g transform={`rotate(${angle2})`}>
              <ellipse
                cx={0}
                cy={neckHeight / 2}
                rx={major * 1.05}
                ry={minor / 4}
              />
            </g>
          </svg>
        </cylindricalSurface>
      </loft>
    </rotation>
  );
};
Copy

#### Solid
The solid element creates an arbitrary 3d shape. It takes no props. The children of the solid form its faces.

Examples
Cube
A cube formed from 6 flat square faces.

<solid>
  <planeSurface>
    <svg>
      <rect width="1" height="1" />
    </svg>
  </planeSurface>
<rotation y={-Math.PI / 2}>
  <planeSurface>
    <svg>
      <rect width="1" height="1" />
    </svg>
  </planeSurface>
</rotation>
<rotation x={Math.PI / 2}>
  <planeSurface>
    <svg>
      <rect width="1" height="1" />
    </svg>
  </planeSurface>
</rotation>
<translation x={1}>
  <rotation y={-Math.PI / 2}>
    <planeSurface>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </planeSurface>
  </rotation>
</translation>
<translation y={1}>
  <rotation x={Math.PI / 2}>
    <planeSurface>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </planeSurface>
  </rotation>
</translation>
  <planeSurface origin={[0, 0, 1]}>
    <svg>
      <rect width="1" height="1" />
    </svg>
  </planeSurface>
</solid>
Copy

Rendering

Chest
A pirate's chest formed from 5 flat faces and a curved face.

<solid>
  {/* Bottom */}
  <planeSurface>
    <svg>
      <rect width="10" height="6" />
    </svg>
  </planeSurface>
  {/* Sides */}
  <rotation x={Math.PI / 2}>
    <planeSurface>
      <svg>
        <rect width="10" height="3" />
      </svg>
    </planeSurface>
  </rotation>
  <translation y={6}>
    <rotation x={Math.PI / 2}>
      <planeSurface>
        <svg>
          <rect width="10" height="3" />
        </svg>
      </planeSurface>
    </rotation>
  </translation>
  {/* Ends */}
  <rotation y={-Math.PI / 2}>
    <planeSurface>
      <svg>
        <path d="M 0 0 L 3 0 A 3 3 0 0 1 3 6 L 0 6 Z" />
      </svg>
    </planeSurface>
  </rotation>
  <translation x={10}>
    <rotation y={-Math.PI / 2}>
      <planeSurface>
        <svg>
          <path d="M 0 0 L 3 0 A 3 3 0 0 1 3 6 L 0 6 Z" />
        </svg>
      </planeSurface>
    </rotation>
  </translation>
  {/* Lid */}
  <translation y={3} z={3}>
    <cylindricalSurface radius={3}>
      <svg viewBox="0 5 10 10">
        <rect height={10} width={10} />
      </svg>
    </cylindricalSurface>
  </translation>
</solid>
Copy

Rendering

## Working with Surfaces & SVGs

SVGs in ReactCAD work similarly to React for web, with some important differences:
- Text is not supported (use SVG paths instead)
- Path stroke and fill attributes are ignored - all shapes are filled
- Self-intersecting shapes cause undefined behavior
- SVGs are only valid inside surfaces
- Surfaces provide the coordinate system that orients paths in space

### Available Surface Types:
1. Plane Surface
2. Spherical Surface
3. Cylindrical Surface

#### Plane Surface
The planeSurface surface element orients its SVG children in a flat plane parallel to the xy-plane. By default it is the xy-plane, but an optional origin prop can move the plane's origin elsewhere in space.

Name  Description Default
origin  
The position of the plane's origin in 3d space.
[number, number, number]
-
Examples
Plane at the origin
An SVG in the xy-plane at the origin.

<planeSurface>
  <ReactIcon /> {/* ReactIcon is a React component which returns an SVG */
</planeSurface>
Copy

Rendering

Translated plane
An SVG in a flat plane raised above the xy-plane.

<planeSurface origin={[30, 20, 10]}>
  <ReactIcon />
</planeSurface>
Copy

#### Spherical Surface
The sphericalSurface element orients its SVG children on the surface of a sphere. The radius prop specifies the radius of the sphere. By default the sphere is at the origin but an optional origin prop can translate the surface.

Co-ordinates in the x-direction range from 0 to 2π. Co-ordinates in the y-direction range from -π/2 to π/2.

Name  Description Default
radius  
The radius of the spherical surface
number
-
origin  
The position of the surface's origin in 3d space.
[number, number, number]
-
Examples
Spherical surface
An SVG in a spherical surface with radius 1, located at the origin.

ReactIcon is a React component which returns an SVG element. Its width and height props are passed to the SVG, and in conjunction with the SVG's viewBox prop they cause the shape to be scaled to fit within the sphere's co-ordinate system.

<sphericalSurface>
  <ReactIcon width={Math.PI * 0.75} height={Math.PI * 0.75}/>
</sphericalSurface>
Copy

Rendering

Large, translated spherical surface
An SVG in a spherical surface with radius 20, raised above the origin.

<sphericalSurface radius={20} origin={[0,0,10]}>
  <ReactIcon width={40} height={40}/>
</sphericalSurface>
Copy

#### Cylindrical Surface
The cylindricalSurface surface element orients its SVG children on the surface of a cylinder. The radius prop specifies the radius of the cylinder. By default the cylinder is at the origin but an optional origin prop can translate the surface.

Co-ordinates in the x-direction range from 0 to 2π. Co-ordinates in the y-direction extend to positive and negative infinity.

Name  Description Default
radius  
The radius of the cylindrical surface
number
-
origin  
The position of the surface's origin in 3d space.
[number, number, number]
-
Examples
Cylindrical surface
An SVG in a cylindrical surface with radius 1, located at the origin.

ReactIcon is a React component which returns an SVG element. Its width and height props are passed to the SVG, and in conjunction with the SVG's viewBox prop they cause the shape to be scaled to fit within the sphere's co-ordinate system.

<cylindricalSurface>
  <ReactIcon width={Math.PI * 0.8} height={Math.PI * 0.8}/>
</cylindricalSurface>
Copy

Rendering

Large, translated cylindrical surface
An SVG on a cylindrical surface with radius 20, translated below the origin.

<cylindricalSurface radius={20} origin={[0,0,-20]}>
  <ReactIcon width={40} height={40}/>
</cylindricalSurface>
Copy

## Best Practices

When working with ReactCAD:
1. Always consider the coordinate system orientation
2. Use appropriate operations for combining shapes
3. Leverage SVGs for complex 2D profiles
4. Choose the most suitable surface type for your needs
5. Be mindful of performance with complex operations

## Implementation Examples

Each section above includes practical examples demonstrating proper usage. Refer to these examples when implementing similar features in your own projects.
