// next time, start building the interactive builder

class PageVisit {
  #lastScrollTop = 0;

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
    const modalContainer = document.querySelector('#container-modal-configuration');
    const modalHeading = document.querySelector('#modal-configuration-header');
    const subModalHeading = document.querySelector('#sub-modal-configuration-header');
    const modal = document.querySelector('#modal-configuration');
    const bounding = modalContainer.getBoundingClientRect();
    const scrollTopDistance = window.pageYOffset || document.documentElement.scrollTop;
    if (bounding.top >= 0) {
      modal.style.transform = `translateY(${distance * 0.3}px)`;
    } else {
      modal.style.transform = modal.style.transform;
    }
    if (bounding.top <= 450 &&
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
      if (scrollTopDistance > this.#lastScrollTop) {
        modalContainer.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        this.#changeDisplay([modalHeading, subModalHeading], 'block');
        new Promise(resolve => {
          setTimeout(resolve, 300);
        }).then(() => {
          this.#changeOpacity([modalHeading, subModalHeading], '1');
          this.#startBuildDemo(modal, modalContainer);
        });
      } else {
        this.#changeOpacity([modalHeading, subModalHeading], '0');
        this.#cancelBuildDemo(modal, modalContainer);
        new Promise(resolve => {
          setTimeout(resolve, 300);
        }).then(() => {
          this.#changeDisplay([modalHeading, subModalHeading], 'none');
        });
      }
      this.#lastScrollTop = scrollTopDistance <= 0 ? 0 : scrollTopDistance;
    }
  }

  #sizeContainers(containers, height) {
    containers.forEach(element => {
      element.style.height = `${height}px`;
    });
  }

  #changeOpacity(elements, opacity) {
    if (opacity === '1') {
      elements.forEach((element) => {
        element.style.opacity = '1';
      });
    } else {
      elements.forEach((element) => {
        element.style.opacity = '0';
      });
    }
  }

  #changeDisplay(elements, display) {
    if (display === 'block') {
      elements.forEach((element) => {
        element.style.display = 'block';
      });
    } else {
      elements.forEach((element) => {
        element.style.display = 'none';
      });
    }
  }

  #startBuildDemo(modal, modalContainer) {
    modalContainer.style.background = 'rgb(207, 207, 207)';
    modal.classList.add('special-hover');
    modal.style.width = '725px';
    modal.style.height = '412.5px';
  }

  #cancelBuildDemo(modal, modalContainer) {
    modalContainer.style.background = 'none';
    modal.classList.remove('special-hover');
    modal.style.width = '700px';
    modal.style.height = '400px';
  }
}

window.onload = () => new PageVisit().init();