const randomInteger = (min, max) => {
  const inclusiveMin = min + 1;
  return Math.floor(Math.random() * (max - inclusiveMin) + inclusiveMin);
};

const randomHex = () => {
  let hex = '#';

  [...Array(3)].map(() => (hex += Number(randomInteger(1, 255)).toString(16)));

  return hex;
};

const keep = (element) => {
  element.classList.toggle('box--keep');
  navigator.clipboard.writeText(element.innerHTML);
};

const spinColorWheel = () => {
  const boxes = document.querySelectorAll('.box:not(.box--keep)');

    boxes.forEach((box) => {
    const hex = randomHex();
    box.style.backgroundColor = hex;
    box.innerHTML = hex;
  });
};

const enableDarkMode = () => {
  document.body.classList.add('dark-mode');
  localStorage.setItem('darkmode-enabled', true);
};

const disableDarkMode = () => {
  document.body.classList.remove('dark-mode');
  localStorage.setItem('darkmode-enabled', false);
};

const toggleDarkMode = () => {
  const enabled = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkmode-enabled', enabled);
};

const isDarkModeEnabled = () => {
  return document.body.classList.contains('dark-mode');
};

const showPopup = () => {
  document.querySelector('.popup').classList.add('popup--active');
};

const initKeepListeners = () => {
  document
    .querySelectorAll('.box')
    .forEach((element) =>
      element.addEventListener('click', () => keep(element))
    );
};

const initDarkMode = () => {
  if (localStorage.getItem('darkmode-enabled') === 'true') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
};

const initPopup = () => {
  if (!localStorage.getItem('first-use')) {
    showPopup();
  }
  const numberOfBoxes = localStorage.getItem('number-of-boxes');
  if (numberOfBoxes) {
    document.querySelector('#js-number-of-boxes').value =
      Number(numberOfBoxes);
  }
};

const initInteractiveKeyEvents = () => {
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case ' ':
        spinColorWheel();
        break;

      case 'r':
        document
          .querySelectorAll('.box')
          .forEach((element) => element.classList.remove('box--keep'));
        break;
      case 'Escape':
        document.querySelector('.popup').classList.toggle('popup--active');
        localStorage.setItem('first-use', false);
        break;
      case 'l':
        toggleDarkMode();
        break;
      default:
        break;
    }
  });
};

const dragstart_handler = (ev) => {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.dropEffect = 'move';
}

const dragover_handler = (ev) => {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

const drop_handler = (ev) => {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text/plain");
  const droppedElement = document.getElementById(data);
  const boxes = document.querySelectorAll('.box');
  const newIndex = Array.from(boxes).indexOf(ev.target);
  
  document.querySelector('.page').insertBefore(droppedElement, boxes[newIndex]);

}

const initBoxes = () => {
  let page = document.querySelector('.page');
  page.addEventListener('drop', drop_handler);
  page.addEventListener('dragover', dragover_handler);

  // resets boxes
  page.innerHTML = '';

  // default
  let numberOfBoxes = 5;
  if (localStorage.getItem('number-of-boxes')) {
    numberOfBoxes = Number(localStorage.getItem('number-of-boxes'));
  }

  [...Array(numberOfBoxes)].map(() => {
    const box = document.createElement('div');
    box.classList.add('box');
    box.id = 'box-' + randomInteger(1000, 9999);
    box.setAttribute('draggable', true);
    box.addEventListener('dragstart', dragstart_handler);
    page.appendChild(box);
  });

  spinColorWheel();
  initKeepListeners();
};

const initNumberOfBoxesListener = () => {
  document
    .querySelector('#js-number-of-boxes')
    .addEventListener('change', (e) => {
      localStorage.setItem('number-of-boxes', e.target.value);
      initBoxes();
    });
};

// automatically executed on start
(function () {
  initBoxes();
  initNumberOfBoxesListener();
  initInteractiveKeyEvents();
  initPopup();
  initDarkMode();

  document.querySelector('#js-mobile-spin').addEventListener('click', () => {
    spinColorWheel();
  });
})();
