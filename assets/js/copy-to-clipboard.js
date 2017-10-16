(function() {

  var clipboardTarget = document.querySelector('#clipboard-target'),
      clipboardContent = document.querySelector('#clipboard-content'),
      clipboardNotification = document.querySelector('#clipboard-notification');

  if (!clipboardTarget) return;

  clipboardTarget.addEventListener('click', handleClick)

  function handleClick(e) {
    try {
      clipboardContent.select();
      var result = document.execCommand('copy');
      if (result) confirmSuccess();
    } catch (err) {}
  };

  function confirmSuccess() {
    clipboardNotification.style.display = 'block';
    setTimeout(function() {
      clipboardNotification.style.display = 'none';
    }, 3000)
  }

})()