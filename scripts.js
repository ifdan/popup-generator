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
    const firstContainer = document.querySelector('#intro-header');
    const secondContainer = document.querySelector('#container-modal-configuration');
    document.addEventListener('scroll', () => {
      if (window.pageYOffset > 20) {
        const opac = (window.pageYOffset / windowHeight);
        document.body.style.background = "linear-gradient(rgba(245, 245, 245, " + opac + "), rgba(245, 245, 245, " + opac + ")), rgba(14, 115, 179, 1)";
      } else {
        document.body.style.background = "rgba(14, 115, 179, 1)";
      }
      this.#forceScroll([
        firstContainer, 
        secondContainer
      ]);
    });
  }

  #forceScroll(containers) {
    containers.forEach(element => {
      if (element.getBoundingClientRect().y < 700) {
        element.scrollIntoView({behavior: 'smooth', block: 'end'});
      }
    });
  }

  #sizeContainers(containers, height) {
    containers.forEach(element => {
      element.style.height = `${height}px`;
    });
  }
}

window.onload = () => new PageVisit().init();

// still need to
// stop modal at specific point when scrolling
// Create a smooth scroll animation when you click the get started down arrow