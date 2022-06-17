// next time you get on:
// when the whole configuration container is in view, stop translating modal. but you need to resume translation if they resume that scroll up again.

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
    const modalHeading = document.querySelector('#modal-configuration-header')
    const modal = document.querySelector('#modal-configuration');
    const bounding = modalContainer.getBoundingClientRect();
    const scrollTopDistance = window.pageYOffset || document.documentElement.scrollTop;
    if (bounding.top >= 0) {
      modal.style.transform = `translateY(${distance * 0.3}px)`;
    } else {
      modal.style.transform = modal.style.transform;
    }
    if (bounding.top <= 400 &&
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
      if (scrollTopDistance > this.#lastScrollTop) {
        modalHeading.style.display = 'block';
        new Promise(resolve => {
          setTimeout(resolve, 300);
        }).then(() => {
          modalHeading.style.opacity = '1';
          modalContainer.style.background = 'rgb(169, 169, 169)';
        });
        modalContainer.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      } else {
        modalHeading.style.opacity = '0';
        modalContainer.style.background = 'none';
        new Promise(resolve => {
          setTimeout(resolve, 300);
        }).then(() => {
          modalHeading.style.display = 'none';
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
}

window.onload = () => new PageVisit().init();