'use client';
import { useEffect, useContext, useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import Parallax from 'parallax-js';
import { AnimateContext } from '../app/context/context';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github } from 'lucide-react';
import HeroSections from './components/a';


export default function Home() {
  const { animate } = useContext(AnimateContext);
  const [isAnimating, setIsAnimating] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const scene = document.getElementById("scene");
    let parallaxInstance = null;

    if (scene && scene.children?.length) {
      parallaxInstance = new Parallax(scene);
    }

    if (animate) {
      const timeline = gsap.timeline({
        delay: 0.5,
        onComplete: () => setIsAnimating(false),
      });

      timeline
        .to(scene, {
          duration: 1,
          opacity: 1,
          onComplete: () => parallaxInstance?.enable(),
        })
        .from(".title", { duration: 1, opacity: 0, y: 20, ease: "expo.out" })
        .to(".title", { opacity: 1, duration: 0.2 })
        .from(".tagline", { duration: 0.8, opacity: 0, y: 20, ease: "expo.out" }, "-=0.6")
        .to(".tagline", { opacity: 1, duration: 0.2 })
        .from(".pages", { duration: 0.8, opacity: 0, y: 20, ease: "expo.out" }, "-=0.6")
        .to(".pages", { opacity: 1, duration: 0.2 })
        .from(".search", { duration: 0.8, opacity: 0, y: 20, ease: "expo.out" }, "-=0.6")
        .to(".search", { opacity: 1, duration: 0.2 })
        .from(".desc", { duration: 0.8, opacity: 0, y: 20, ease: "expo.out" }, "-=0.6")
        .to(".desc", { opacity: 1, duration: 0.2 })
        .from(".juice", { duration: 1, opacity: 0, y: -800, ease: "expo.out" }, "-=0.6")
        .to(".juice", { opacity: 1, duration: 0.2 })
        .from(
          ".leaves .layer",
          {
            duration: 1,
            opacity: 0,
            y: -800,
            ease: "expo.out",
            stagger: 0.1,
            onStart: () => parallaxInstance?.disable(),
            onComplete: () => parallaxInstance?.enable(),
          },
          "-=0.6"
        );
    }

    return () => {
      parallaxInstance?.destroy();
    };
  }, [animate, router.asPath, mounted]);

// Inside your Home component
const handleTriggerEmergency = async () => {
  try {
    const storedUser = localStorage.getItem("user"); // assuming user info is stored in localStorage
    if (!storedUser) return alert("User not logged in");

    const { _id: userId } = JSON.parse(storedUser);

    // Get user's current location
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const { data } = await axios.post("http://localhost:3001/api/emergency/create", {
          userId,
          latitude,
          longitude,
        });

        alert(`Emergency triggered! Nearest hospital: ${data.hospital.name}`);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Something went wrong");
      }
    });
  } catch (error) {
    console.error(error);
    alert("Failed to trigger emergency");
  }
};


  return (
    <>
      <div className="relative flex w-full justify-around pb-20 pt-2">
        <div className="h-[70vh] flex flex-col justify-center">
          <div className="flex justify-between">
            <div className="pt-20 px-14 text-gray-400 text-3xl title">Find your hospital</div>
            <div className="pages flex-0 text-[#999] tracking-[5px] py-10 px-14">
              <span className="text-[55px] text-black font-semibold">1</span>/6
            </div>
          </div>
          <button className="text-[12rem] text-black text-center justify-center px-10 tagline tracking-tight">
            EMERGENCY
          </button>
          <div className="flex items-center w-full">
            <div className="w-[70%] pb-10 pl-16 z-10">
              <Link
  href="#"
  onClick={(e) => {
    e.preventDefault();
    handleTriggerEmergency();
  }}
  className="bg-black text-white rounded-lg px-10 py-2 text-xl search shadow-lg cursor-pointer"
>
  Trigger Emergency
</Link>
            </div>
            <div className="flex flex-col text-sm w-[30%] pr-12 z-10">
              <div className="text-3xl mb-2 leading-9 break-words desc">
                Your <span className="text-orange-500">healthy</span> life starts with us
              </div>
              <div className="leading-7 break-words desc">
                Discover a wide network of hospitals that prioritize your well-being. Start your
                journey to a healthier future today!
              </div>
            </div>
          </div>
        </div>
        <div className="juice absolute top-1/2 left-1/2 z-10">
          <Image src="/file.png" alt="Juice Floating" height={700} width={476} className="animate-float max-h-[700px]" />
        </div>
        <div className="leaves absolute inset-0 z-0">
          <ul id="scene" className="relative">
            <li className="layer" data-depth="0.1">
              <Image src="/m2.png" alt="Layer 1" width={100} height={92.53} className="w-[100px] h-[92.53px]" />
            </li>
            <li className="layer" data-depth="0.3">
              <Image src="/m5.png" alt="Layer 2" width={120} height={120} className="w-[120px] h-[120px]" />
            </li>
            <li className="layer" data-depth="-0.3">
              <Image src="/m1.webp" alt="Layer 3" width={100} height={100} className="w-[100px] h-[100px]" />
            </li>
            <li className="layer" data-depth="-0.5">
              <Image src="/m4.png" alt="Layer 4" width={220} height={165} className="w-[220px] h-[165px]" />
            </li>
            <li className="layer" data-depth="-0.7">
              <Image src="/m3.png" alt="Layer 5" width={140} height={140} className="w-[140px] h-[140px]" />
            </li>
          </ul>
        </div>
      </div>
      <HeroSections />
      <footer className=" border-gray-200 text-white bg-black pt-12 pb-5 flex justify-center px-28">
        <div className="">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold">PATIENT BRIDGE</h3>
              <p className="text-sm text-gray-600">
                Connecting patients with quality healthcare services.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-orange-500">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>contact@patientbridge.com</li>
                <li>+1 (888) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-orange-500">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-orange-500">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-orange-500">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12  border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} Patient Bridge. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

    </>
  );
}