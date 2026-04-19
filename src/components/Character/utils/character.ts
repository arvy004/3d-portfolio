import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

function createLogoTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Fill with Beige background (to blend with hat)
  ctx.fillStyle = "#d2b48c";
  ctx.fillRect(0, 0, 512, 512);

  // Draw Black Circle (Logo Container)
  ctx.beginPath();
  ctx.arc(256, 380, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();

  // Draw Purple Text "RV"
  ctx.fillStyle = "#A855F7"; // Purple
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RV", 256, 382);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const logoTexture = createLogoTexture();

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc?v=2",
          "MyCharacter12"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;

                // Change materials to match Arnav's appearance and site theme
                if (mesh.material) {
                  const meshName = mesh.name.toLowerCase();
                  const newMat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;

                  // Skin Tone (Brown/Tan)
                  if (meshName.includes("skin") || meshName.includes("body") || meshName.includes("head")) {
                    newMat.color = new THREE.Color("#8d5524"); // Rich brown skin tone
                    mesh.material = newMat;
                  }
                  // Hair Color (Black)
                  else if (meshName.includes("hair")) {
                    newMat.color = new THREE.Color("#050505");
                    mesh.material = newMat;
                  }
                  // Cap/Hat Restore & Branding
                  else if (
                    meshName.includes("cap") ||
                    meshName.includes("hat") ||
                    meshName.includes("brim") ||
                    meshName.includes("visor") ||
                    meshName.includes("snapback")
                  ) {
                    newMat.color = new THREE.Color("#d2b48c"); // Premium Beige
                    newMat.roughness = 0.8;
                    
                    // Apply RV Logo to the front panel (CAP001)
                    if (meshName.includes("cap001") && logoTexture) {
                      newMat.map = logoTexture;
                    }
                    
                    mesh.material = newMat;
                    mesh.visible = true;
                  }
                  // Hide Mustache/Facial Hair
                  else if (
                    meshName.includes("mustache") || 
                    meshName.includes("moustache") || 
                    meshName.includes("facialhair")
                  ) {
                    mesh.visible = false;
                  }
                  // Clothing: Suit (Black)
                  else if (meshName.includes("suit") || meshName.includes("pant") || meshName.includes("blazer")) {
                    newMat.color = new THREE.Color("#000000");
                    mesh.material = newMat;
                  }
                  // Clothing: Shirt (Purple Accent)
                  else if (meshName.includes("shirt")) {
                    newMat.color = new THREE.Color("#6b21a8"); // Purple shirt/accent
                    mesh.material = newMat;
                  }
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;

            // Procedural Gold Chain
            const chestBone = character!.getObjectByName("spine005") || character!.getObjectByName("spine006");
            if (chestBone) {
              const chainGroup = new THREE.Group();
              const numLinks = 32;
              const radiusX = 1.4;
              const radiusZFront = 2.2;
              const radiusZBack = 1.2;

              for (let i = 0; i < numLinks; i++) {
                const linkGeo = new THREE.TorusGeometry(0.18, 0.08, 8, 16);
                const linkMat = new THREE.MeshStandardMaterial({
                  color: 0xffd700,
                  metalness: 1.0,
                  roughness: 0.15,
                });
                const link = new THREE.Mesh(linkGeo, linkMat);
                link.castShadow = true;
                link.receiveShadow = true;

                const angle = (i / numLinks) * Math.PI * 2;
                const isFront = Math.sin(angle) > 0;
                const radiusZ = isFront ? radiusZFront : radiusZBack;
                
                link.position.x = Math.cos(angle) * radiusX;
                link.position.z = Math.sin(angle) * radiusZ;
                
                // Tilt links to droop down in the front
                if (isFront) {
                  link.position.y = -Math.sin(angle) * 1.0; 
                }

                link.rotation.y = -angle;
                if (i % 2 === 0) {
                  link.rotation.x = Math.PI / 2;
                }

                chainGroup.add(link);
              }

              // Adjust the overall chain position relative to the local bone
              chainGroup.position.set(0, 0, 0);
              
              // Angle the necklace so it lays on the chest
              chainGroup.rotation.x = Math.PI / 10;
              
              chestBone.add(chainGroup);
            }

            // Monitor scale is handled by GsapScroll.ts animations

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
