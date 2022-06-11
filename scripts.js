// next time you get on:
// when the whole configuration container is in view, stop translating modal. but you need to resume translation if they resume that scroll up again.

class PageVisit {
  init() {
    const windowHeight = window.innerHeight;
    const containers = [document.querySelector('#intro-header'), document.querySelector('#container-modal-configuration')];
    this.#sizeContainers(containers, windowHeight)
    this.#addWindowListener(containers, windowHeight);
  }

  #addWindowListener(containers, windowHeight) {
    this.#fadeBackground(windowHeight);
    window.addEventListener('resize', () => {
      const windowHeight = window.innerHeight;
      this.#sizeContainers(containers, windowHeight)
      this.#fadeBackground(windowHeight);
    });
  }

  #fadeBackground(windowHeight) {
    document.addEventListener('scroll', () => {
      if (window.pageYOffset > 20) {
        const opacity = (window.pageYOffset / windowHeight).toString();
        document.body.style.background = `linear-gradient(rgba(245, 245, 245, ${opacity}), rgba(245, 245, 245, ${opacity})), rgba(14, 115, 179, 1)`;
      } else {
        document.body.style.background = `rgba(14, 115, 179, 1)`;
      }
      this.#controlModalPlacement();
    });
  }

  #controlModalPlacement() {
    const distance = window.scrollY;
    const modal = document.querySelector('#modal-configuration');
    modal.style.transform = `translateY(${distance * 0.3}px)`
  }

  #sizeContainers(containers, height) {
    containers.forEach(element => {
      element.style.height = `${height}px`;
    });
  }
}

window.onload = () => new PageVisit().init();