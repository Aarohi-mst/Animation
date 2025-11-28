import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import moonImg from "./assets/moon.jpg";
import spaceImg from "./assets/space.jpg";
import jeffImg from "./assets/jeff.png";
import normalImg from "./assets/normal.jpg";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.setZ(30);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ----- TORUS -----
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6347,
      roughness: 0.4,
      metalness: 0.3,
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.z = -20;
    scene.add(torus);

    // ----- LIGHTS -----
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(20, 20, 20);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(pointLight, ambientLight);

    // ----- CONTROLS -----
    const controls = new OrbitControls(camera, renderer.domElement);

    // ----- STARS -----
    function addStar() {
      const geometry = new THREE.SphereGeometry(0.25, 24, 24);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);
      const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));
      star.position.set(x, y, z);
      scene.add(star);
    }
    Array.from({ length: 200 }).forEach(addStar);

    // ----- BACKGROUND -----
    const spaceTexture = new THREE.TextureLoader().load(spaceImg);
    scene.background = spaceTexture;

    // ----- JEFF -----
    const jeffTexture = new THREE.TextureLoader().load(jeffImg);
    const jeffBox = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshStandardMaterial({ map: jeffTexture })
    );
    jeffBox.position.set(2, 0, -5);
    scene.add(jeffBox);

    // ----- MOON -----
    const moonTexture = new THREE.TextureLoader().load(moonImg);
    const normalTexture = new THREE.TextureLoader().load(normalImg);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture,
      })
    );
    moon.position.set(-10, 0, 30);
    scene.add(moon);

    // ----- SCROLL ANIMATION -----
    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;

      moon.rotation.x += 0.05;
      moon.rotation.y += 0.075;
      moon.rotation.z += 0.05;

      jeffBox.rotation.y += 0.01;
      jeffBox.rotation.z += 0.01;

      camera.position.z = 30 + t * -0.01;
    }

    document.body.onscroll = moveCamera;

    // ----- ANIMATE LOOP -----
    function animate() {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return (
    <div className="w-screen min-h-screen overflow-x-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none"
      ></canvas>

      <main className="relative z-50 w-full min-h-screen p-20 text-white">
        <div className="bg-black/70 text-green-400 p-10 rounded-xl shadow-2xl border border-green-500 backdrop-blur">
          <h1 className="text-6xl font-bold">CONTENT IS VISIBLE NOW</h1>
          <p className="text-2xl mt-6">
            If you can see this bright green box, the content is finally
            working!
          </p>
        </div>

        <div className="h-[200vh]"></div>
      </main>
    </div>
  );
}

export default App;

//For multiple rings

// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// function App() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.setZ(40);

//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       antialias: true,
//     });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.outputColorSpace = THREE.SRGBColorSpace;

//     // Multiple ring settings
//     const ringsConfig = [
//       { radius: 10, tube: 3, color: 0xff6347, speed: 0.01 },
//       { radius: 14, tube: 2.5, color: 0x00ffff, speed: 0.008 },
//       { radius: 18, tube: 2, color: 0x00ff00, speed: 0.006 },
//       { radius: 22, tube: 1.8, color: 0xffff00, speed: 0.004 },
//     ];

//     const rings = [];

//     // Create multiple rings in a loop
//     ringsConfig.forEach((cfg) => {
//       const geometry = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
//       const material = new THREE.MeshStandardMaterial({ color: cfg.color });
//       const ring = new THREE.Mesh(geometry, material);

//       ring.userData.speed = cfg.speed; // attach speed to the ring
//       scene.add(ring);
//       rings.push(ring);
//     });

//     // Lights
//     scene.add(new THREE.AmbientLight(0xffffff, 0.6));

//     const pointLight = new THREE.PointLight(0xffffff);
//     pointLight.position.set(15, 15, 15);
//     scene.add(pointLight);

//     // Animation Loop
//     function animate() {
//       requestAnimationFrame(animate);

//       rings.forEach((ring) => {
//         ring.rotation.x += ring.userData.speed;
//         ring.rotation.y += ring.userData.speed * 0.6;
//       });

//       renderer.render(scene, camera);
//     }

//     animate();
//   }, []);

//   return (
//     <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen" />
//   );
// }

// export default App;
