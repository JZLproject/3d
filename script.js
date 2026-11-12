// ==========================================
// KONFIGURASI UTAMA
// ==========================================
const CONFIG = {
    name: "Medina Ayu Prameswari",
    nickname: "my sweaties rollade",
    birthday: "26 November 2026",
    password: "12102x2087",
    canvaUrl: "PASTE_CANVA_LINK_HERE" // Ganti dengan link Canva kamu nanti
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nickname-text").forEach(el => {
        el.textContent = CONFIG.nickname;
    });

    // ==========================================
    // 1. FLOATING HEARTS GENERATOR
    // ==========================================
    const heartsContainer = document.getElementById("hearts-container");
    const heartSymbols = ["💗", "💖", "🤍", "❤️"];

    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (Math.random() * 12 + 12) + "px";
        heart.style.animationDuration = (Math.random() * 4 + 6) + "s";
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 10000);
    }
    setInterval(createHeart, 900);

    // ==========================================
    // 2. AUDIO / MUSIC CONTROLLER
    // ==========================================
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-toggle");
    let isPlaying = false;

    function playMusic() {
        bgMusic.volume = 0.4;
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.remove("hidden");
            musicBtn.classList.add("playing");
        }).catch(() => {
            musicBtn.classList.remove("hidden");
        });
    }

    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove("playing");
            isPlaying = false;
        } else {
            bgMusic.play();
            musicBtn.classList.add("playing");
            isPlaying = true;
        }
    });

    // ==========================================
    // 3. STAGE TRANSITIONS & 3D GIFT BOX (Three.js)
    // ==========================================
    const stageOpening = document.getElementById("stage-opening");
    const stageGift = document.getElementById("stage-gift");
    const stageJourney = document.getElementById("stage-journey");
    const stagePassword = document.getElementById("stage-password");

    document.getElementById("btn-open-gift").addEventListener("click", () => {
        playMusic();
        stageOpening.style.opacity = "0";
        setTimeout(() => {
            stageOpening.classList.add("hidden");
            stageGift.classList.remove("hidden");
            init3DBox(); // Inisialisasi Kotak 3D Interaktif
        }, 500);
    });

    // Inisialisasi Three.js untuk Kotak Kado 3D
    let giftScene, giftCamera, giftRenderer, giftBoxMesh, giftLidMesh;
    let contentsGroup;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let boxOpened = false;

    function init3DBox() {
        const container = document.getElementById("canvas-gift-container");
        if (!container || giftRenderer) return;

        giftScene = new THREE.Scene();
        giftCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        giftCamera.position.set(0, 3, 6);
        giftCamera.lookAt(0, 0, 0);

        giftRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        giftRenderer.setSize(container.clientWidth, container.clientHeight);
        giftRenderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(giftRenderer.domElement);

        // Pencahayaan
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        giftScene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1.2);
        pointLight.position.set(5, 8, 5);
        giftScene.add(pointLight);

        // Grup Kotak
        const boxGroup = new THREE.Group();
        giftScene.add(boxGroup);

        // Badan Kotak Pink
        const bodyGeo = new THREE.BoxGeometry(2, 1.6, 2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe63956, roughness: 0.3 });
        const boxBody = new THREE.Mesh(bodyGeo, bodyMat);
        boxGroup.add(boxBody);

        // Pita Putih Vertikal & Horizontal pada Badan
        const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const ribV = new THREE.Mesh(new THREE.BoxGeometry(2.02, 1.62, 0.4), ribbonMat);
        boxGroup.add(ribV);

        // Tutup Kotak (Lid)
        const lidGeo = new THREE.BoxGeometry(2.1, 0.4, 2.1);
        const lidMat = new THREE.MeshStandardMaterial({ color: 0xd9829b, roughness: 0.3 });
        giftLidMesh = new THREE.Mesh(lidGeo, lidMat);
        giftLidMesh.position.y = 1.0;
        boxGroup.add(giftLidMesh);

        // Kelompok Isi Kotak (Hacipupu Pink, Matcha, Cokelat)
        contentsGroup = new THREE.Group();
        contentsGroup.position.set(0, -0.2, 0);
        contentsGroup.visible = false; // Awalnya tersembunyi di dalam
        boxGroup.add(contentsGroup);

        // 1. Boneka Hacipupu Pink (Representasi 3D Silinder/Sphere)
        const haciBody = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffb3c6 }));
        haciBody.position.set(-0.5, 0.2, 0);
        contentsGroup.add(haciBody);

        // 2. Minuman Matcha (Silinder Hijau)
        const matcha = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0x99d98c }));
        matcha.position.set(0.5, 0.2, 0);
        contentsGroup.add(matcha);

        // 3. Cokelat (Kubus Cokelat)
        const choco = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.5), new THREE.MeshStandardMaterial({ color: 0x6f4e37 }));
        choco.position.set(0, 0.1, 0.5);
        contentsGroup.add(choco);

        // Kontrol Rotasi Mouse & Touch (Atas, Bawah, Kanan, Kiri)
        container.addEventListener("pointerdown", (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener("pointermove", (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            boxGroup.rotation.y += deltaX * 0.01;
            boxGroup.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener("pointerup", () => {
            isDragging = false;
        });

        // Klik untuk Membuka Kotak (Terbuka saat dilihat dari atas / diketuk)
        container.addEventListener("click", () => {
            if (boxOpened) return;
            boxOpened = true;

            // Animasi Tutup Terbuka & Memperlihatkan Isi
            let progress = 0;
            const openInterval = setInterval(() => {
                progress += 0.05;
                giftLidMesh.position.y += 0.08;
                giftLidMesh.rotation.z += 0.05;
                contentsGroup.visible = true;
                contentsGroup.position.y += 0.02;

                if (progress >= 1) clearInterval(openInterval);
            }, 30);

            confetti({
                particleCount: 100,
                spread: 75,
                origin: { y: 0.6 },
                colors: ["#ff758c", "#ff7eb3", "#ffffff", "#99d98c"]
            });

            document.getElementById("gift-hint").classList.add("hidden");
            document.getElementById("gift-reveal-text").classList.remove("hidden");

            setTimeout(() => {
                stageGift.style.opacity = "0";
                setTimeout(() => {
                    stageGift.classList.add("hidden");
                    stageJourney.classList.remove("hidden");
                    window.scrollTo(0, 0);
                    triggerScrollReveal();
                }, 600);
            }, 2600);
        });

        // Render Loop
        function animate() {
            requestAnimationFrame(animate);
            if (!isDragging && !boxOpened) {
                boxGroup.rotation.y += 0.005; // Rotasi halus otomatis jika tidak disentuh
            }
            giftRenderer.render(giftScene, giftCamera);
        }
        animate();
    }

    // ==========================================
    // 4. 3D ROTATABLE LOVE LETTER (Three.js Envelope)
    // ==========================================
    let envScene, envCamera, envRenderer, envelopeMesh;
    let envDragging = false;
    let envPrevMouse = { x: 0, y: 0 };
    let envelopeOpened = false;

    function init3DEnvelope() {
        const container = document.getElementById("canvas-envelope-container");
        if (!container || envRenderer) return;

        envScene = new THREE.Scene();
        envCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        envCamera.position.set(0, 0, 5);

        envRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        envRenderer.setSize(container.clientWidth, container.clientHeight);
        envRenderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(envRenderer.domElement);

        envScene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(2, 3, 4);
        envScene.add(light);

        // Buat Model Amplop 3D
        const envGroup = new THREE.Group();
        envScene.add(envGroup);

        const baseMat = new THREE.MeshStandardMaterial({ color: 0xf8ad9d, roughness: 0.4 });
        const envelopeBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 0.1), baseMat);
        envGroup.add(envelopeBody);

        // Tutup Amplop Segitiga (Flap)
        const flapGeo = new THREE.ConeGeometry(1.8, 0.9, 4);
        const flapMat = new THREE.MeshStandardMaterial({ color: 0xf4978e, roughness: 0.4 });
        const flap = new THREE.Mesh(flapGeo, flapMat);
        flap.rotation.z = Math.PI / 4;
        flap.position.set(0, 0.8, 0.06);
        envGroup.add(flap);

        // Event Putar Amplop 3D dengan Mouse/Touch
        container.addEventListener("pointerdown", (e) => {
            envDragging = true;
            envPrevMouse = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener("pointermove", (e) => {
            if (!envDragging) return;
            const deltaX = e.clientX - envPrevMouse.x;
            const deltaY = e.clientY - envPrevMouse.y;

            envGroup.rotation.y += deltaX * 0.01;
            envGroup.rotation.x += deltaY * 0.01;

            envPrevMouse = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener("pointerup", () => {
            envDragging = false;
        });

        // Klik Amplop untuk Membuka Surat
        container.addEventListener("click", () => {
            if (envelopeOpened) return;
            openLoveLetter();
        });

        function animateEnv() {
            requestAnimationFrame(animateEnv);
            if (!envDragging && !envelopeOpened) {
                envGroup.rotation.y += 0.008;
            }
            envRenderer.render(envScene, envCamera);
        }
        animateEnv();
    }

    // ==========================================
    // 5. LOVE LETTER REVEAL
    // ==========================================
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const letterPaper = document.getElementById("letter-paper");
    const btnOpenLetter = document.getElementById("btn-open-letter");

    function openLoveLetter() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        envelopeWrapper.style.opacity = "0";
        setTimeout(() => {
            envelopeWrapper.classList.add("hidden");
            letterPaper.classList.remove("hidden");

            const paragraphs = letterPaper.querySelectorAll("p");
            paragraphs.forEach((p, index) => {
                p.style.animationDelay = `${index * 0.25}s`;
            });
        }, 500);
    }

    btnOpenLetter.addEventListener("click", openLoveLetter);

    // ==========================================
    // 6. SCROLL REVEAL & PASSWORD GATE
    // ==========================================
    function triggerScrollReveal() {
        const reveals = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    if (entry.target.querySelector("#canvas-envelope-container") && !envRenderer) {
                        init3DEnvelope();
                    }
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => observer.observe(el));
    }

    document.getElementById("btn-to-password").addEventListener("click", () => {
        stageJourney.classList.add("hidden");
        stagePassword.classList.remove("hidden");
        window.scrollTo(0, 0);
    });

    const passwordInput = document.getElementById("password-input");
    const passwordError = document.getElementById("password-error");
    const passwordGate = document.getElementById("password-gate");
    const passwordSuccess = document.getElementById("password-success");
    const redirectState = document.getElementById("redirect-state");

    function checkPassword() {
        const userInput = passwordInput.value.trim();
        if (userInput === CONFIG.password) {
            passwordError.classList.add("hidden");
            passwordGate.classList.add("hidden");
            passwordSuccess.classList.remove("hidden");

            confetti({
                particleCount: 110,
                spread: 80,
                origin: { y: 0.6 }
            });
        } else {
            passwordError.classList.remove("hidden");
            passwordError.style.animation = "none";
            passwordError.offsetHeight;
            passwordError.style.animation = null;
        }
    }

    document.getElementById("btn-unlock").addEventListener("click", checkPassword);
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkPassword();
    });

    document.getElementById("btn-final-canva").addEventListener("click", () => {
        passwordSuccess.classList.add("hidden");
        redirectState.classList.remove("hidden");

        setTimeout(() => {
            if (CONFIG.canvaUrl && CONFIG.canvaUrl !== "PASTE_CANVA_LINK_HERE") {
                window.location.href = CONFIG.canvaUrl;
            } else {
                alert("Link Canva belum diisi di script.js (bagian CONFIG.canvaUrl) 😊");
            }
        }, 2200);
    });
});