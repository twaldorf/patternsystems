const localStorageElt = document.getElementById('local-storage');

const localStorageSpace = function () {
  let allStrings = '';
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      allStrings += window.localStorage[key];
    }
  }
  return allStrings ? `${3 + ((allStrings.length * 16) / (8 * 1024))} KB` : 'Empty (0 KB)';
};

try {
  localStorageSpace();
  localStorageElt.innerHTML = localStorageSpace();
} catch {
  localStorageElt.innerHTML = 'DISABLED BY BROWSER';
}

function updateShapeStatistics() {
  vertexcounter.innerHTML = form.shape.length;
  if (form.shape.length > 10) {
    vertexcounter.innerHTML = `${form.shape.length} (WARN) `;
    vertexcounter.classList.add('warn');
  }
  if (form.shape.length < 10) {
    vertexcounter.classList.remove('warn');
  }
  if (form.shape.length > 0) {
    formheight.innerHTML = round(getShapeHeight(form.shape));
    formwidth.innerHTML = round(getShapeWidth(form.shape));
  }
}

function updateTimePanel() {
  const tempdate = new Date();
  newHoursDate = tempdate.getHours();
  newMinutesDate = tempdate.getMinutes();
  newSecondsDate = tempdate.getSeconds();
  currenttime.innerHTML = `${newHoursDate}HR ${newMinutesDate}M ${newSecondsDate}S`;
}
