// next time you get on you need to clean up your event listeners
// consolidate the scroll event listeners
// update the reference to the window height that you get in fadeBackground function and controlModalPlacement function.

class PageVisit {
  init() {
    const windowHeight = window.innerHeight;
    const firstContainer = document.querySelector('#intro-header');
    const secondContainer = document.querySelector('#container-modal-configuration');
    this.#sizeContainers([
      firstContainer,
      secondContainer
    ], windowHeight)
    this.#addWindowListener();
  }

  #addWindowListener() {
    window.addEventListener('resize', () => {
      const windowHeight = window.innerHeight;
      const firstContainer = document.querySelector('#intro-header');
      const secondContainer = document.querySelector('#container-modal-configuration');
      this.#sizeContainers([
        firstContainer,
        secondContainer
      ], windowHeight)
    });
    this.#fadeBackground();
  }

  #fadeBackground() {
    const windowHeight = window.innerHeight;
    document.addEventListener('scroll', () => {
      if (window.pageYOffset > 20) {
        const opac = (window.pageYOffset / windowHeight);
        document.body.style.background = "linear-gradient(rgba(245, 245, 245, " + opac + "), rgba(245, 245, 245, " + opac + ")), rgba(14, 115, 179, 1)";
      } else {
        document.body.style.background = "rgba(14, 115, 179, 1)";
      }
    });
    this.#controlModalPlacement();
  }

  #controlModalPlacement() {
    document.addEventListener('scroll', () => {
      const distance = window.scrollY;
      const modal = document.querySelector('#modal-configuration');
      modal.style.transform = `translateY(${distance * 0.3}px)`
    });
  }

  #sizeContainers(containers, height) {
    containers.forEach(element => {
      element.style.height = `${height}px`;
    });
  }
}

window.onload = () => new PageVisit().init();