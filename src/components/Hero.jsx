import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Hero.css";

const imagePath = "/images/Hero/";

function HeroProduct({ file, className, alt, reflection, aspectRatio }) {
  return (
    <div
      className={`hero-product-slot ${className}`}
      style={{ aspectRatio }}
    >
      <img
        src={`${imagePath}${file}.webp`}
        className="hero-product"
        alt={reflection ? "" : alt}
        draggable="false"
        fetchPriority={!reflection && file === "Iphone" ? "high" : "auto"}
      />
    </div>
  );
}

// Both the scene and its floor reflection use the same arrangement.
function ProductArrangement({ reflection = false }) {
  return (
    <div className="hero-arrangement" aria-hidden={reflection || undefined}>
      <img
        src={`${imagePath}BaseGrande.webp`}
        className="scene-base scene-base-back"
        alt=""
        draggable="false"
      />
      <HeroProduct
        file="Iphone"
        className="product-iphone"
        alt="iPhone dourado"
        reflection={reflection}
        aspectRatio="907 / 1733"
      />
      <HeroProduct
        file="Victoria"
        className="product-victoria"
        alt="Perfume Victoria’s Secret Bombshell"
        reflection={reflection}
        aspectRatio="1169 / 1346"
      />
      <HeroProduct
        file="Sauvage"
        className="product-sauvage"
        alt="Perfume Dior Sauvage Elixir"
        reflection={reflection}
        aspectRatio="1057 / 1488"
      />
      <HeroProduct
        file="Relogio"
        className="product-rolex"
        alt="Relógio dourado"
        reflection={reflection}
        aspectRatio="1130 / 1392"
      />
      <img
        src={`${imagePath}BasePequena.webp`}
        className="scene-base scene-base-front"
        alt=""
        draggable="false"
      />
      <HeroProduct
        file="Fone"
        className="product-airpods"
        alt="Fones de ouvido sem fio com estojo branco"
        reflection={reflection}
        aspectRatio="1360 / 1157"
      />
    </div>
  );
}

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.from(".hero-content > *", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      // Introduce the complete display before individual hover interactions.
      gsap.from(".hero-display", {
        opacity: 0,
        y: 28,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, heroRef);

    const media = gsap.matchMedia();

    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const products = heroRef.current.querySelectorAll(
          ".hero-stage .hero-product"
        );
        const cleanups = Array.from(products, (product) => {
          const hoverArea = product.parentElement;
          const movements = [product].map((target) => ({
            x: gsap.quickTo(target, "x", { duration: 0.45, ease: "power3.out" }),
            y: gsap.quickTo(target, "y", { duration: 0.45, ease: "power3.out" }),
            rotation: gsap.quickTo(target, "rotation", {
              duration: 0.45,
              ease: "power3.out",
            }),
            scaleX: gsap.quickTo(target, "scaleX", {
              duration: 0.45,
              ease: "power3.out",
            }),
            scaleY: gsap.quickTo(target, "scaleY", {
              duration: 0.45,
              ease: "power3.out",
            }),
          }));

          let bounds;

          const reset = () => {
            bounds = undefined;
            movements.forEach((move) => {
              move.x(0);
              move.y(0);
              move.rotation(0);
              move.scaleX(1);
              move.scaleY(1);
            });
          };

          const enter = () => {
            bounds = hoverArea.getBoundingClientRect();
            movements.forEach((move) => {
              move.y(-12);
              move.scaleX(1.035);
              move.scaleY(1.035);
            });
          };

          const followPointer = (event) => {
            if (!bounds) return;

            // Use the initial bounds so animation never shifts the reference point.
            const x = gsap.utils.clamp(
              -1, 1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
            );
            const y = gsap.utils.clamp(
              -1, 1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
            );

            movements.forEach((move) => {
              move.x(x * 8);
              move.y(-12 + y * 5);
              move.rotation(x * 2.5);
            });
          };

          hoverArea.addEventListener("pointerenter", enter);
          hoverArea.addEventListener("pointermove", followPointer);
          hoverArea.addEventListener("pointerleave", reset);
          hoverArea.addEventListener("pointercancel", reset);

          return () => {
            hoverArea.removeEventListener("pointerenter", enter);
            hoverArea.removeEventListener("pointermove", followPointer);
            hoverArea.removeEventListener("pointerleave", reset);
            hoverArea.removeEventListener("pointercancel", reset);
          };
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      },
      heroRef
    );

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-label">PRODUTOS IMPORTADOS</span>

          <h1>
            <span className="hero-title-quality">Qualidade</span> <br />
            sem <span>fronteiras.</span>
          </h1>

          <p>
            Perfumes, eletrônicos, acessórios e muito mais.
            Produtos importados com qualidade e confiança.
          </p>

          <a href="#produtos" className="hero-button">
            VER PRODUTOS
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="hero-scene">
          <div className="hero-display">
            <div className="hero-stage">
              <ProductArrangement />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
