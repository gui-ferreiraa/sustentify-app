import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger);

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  from(element: HTMLElement | HTMLElement[], fromVars: gsap.TweenVars) {
    gsap.from(element,fromVars)
  }

  fromTo(element: HTMLElement | HTMLElement[], fromVars: gsap.TweenVars, toVars: gsap.TweenVars) {
    gsap.fromTo(element, fromVars, toVars);
  }

  refresh() {
    ScrollTrigger.refresh();
  }

  upToBottom(element: HTMLElement | HTMLElement[], duration = 1) {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top center",
        toggleActions: 'none none none none',
      },
      y: -50,
      opacity: 0,
      duration,
      ease: 'power2.out'
    })
  }

  fadeIn(element: HTMLElement | HTMLElement[], duration = 0.5) {
    gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration })
  }

  slideInFromLeft(element: HTMLElement | HTMLElement[], duration = 0.5, delay = 0) {
    gsap.fromTo(element, {
      scrollTrigger: {
        trigger: element,
        markers: true,
        start: "top center",
        toggleActions: 'none none none none',
      },
      x: -100, opacity: 0,
      duration, delay
    }, {
      opacity: 100
    })
  }

  slideInFromRight(element: HTMLElement | HTMLElement[], duration = 1, delay = 0) {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top center",
        toggleActions: 'none none none none',
      },
      x: -100,
      opacity: 0,
      stagger: 0.2,
      duration,
      delay,
      ease: 'power2.out'
    })
  }

  slideInFromBottom(element: HTMLElement | HTMLElement[], duration = 1, delay = 0) {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top center",
        toggleActions: 'none none none none',
      },
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration,
      delay,
      ease: 'power2.out'
    })
  }

  slideFromRightAndLeft(element: HTMLElement | HTMLElement[], duration = 0.5, delay = 0) {
    const tl = gsap.timeline();

    tl.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top center",
        toggleActions: 'none none none none',
      },
      opacity: 0,
      x: -100,
      duration,
      delay,
    })
    .to(element, {
      opacity: 100,
      x: 50,
      duration,
    })
    .to(element, {
      opacity: 100,
      x: 0,
      duration: duration + 1,
    })
  }
}
